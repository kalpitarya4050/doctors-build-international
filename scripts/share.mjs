#!/usr/bin/env node
/**
 * Puts the local site on a public HTTPS URL so a client can open it
 * from anywhere — no account, no deploy, no screen share.
 *
 *   npm run share
 *
 * Starts the production server on :3000 and opens a Cloudflare quick
 * tunnel in front of it. Prints the public link. Ctrl-C stops both.
 *
 * The link lives only while this command runs and this PC is awake.
 * For a URL that survives the laptop closing, deploy to Vercel —
 * see the "Going live" section of README.md.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS = path.join(ROOT, ".tools");
const PORT = process.env.PORT || "3000";

const IS_WIN = process.platform === "win32";
const BIN = path.join(TOOLS, IS_WIN ? "cloudflared.exe" : "cloudflared");

const DOWNLOADS = {
  win32: "cloudflared-windows-amd64.exe",
  darwin: process.arch === "arm64" ? "cloudflared-darwin-arm64.tgz" : "cloudflared-darwin-amd64.tgz",
  linux: process.arch === "arm64" ? "cloudflared-linux-arm64" : "cloudflared-linux-amd64",
};

const c = {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  gold: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

async function ensureCloudflared() {
  if (existsSync(BIN)) return;

  const asset = DOWNLOADS[process.platform];
  if (!asset) {
    console.error(c.red(`Unsupported platform: ${process.platform}`));
    process.exit(1);
  }
  if (asset.endsWith(".tgz")) {
    console.error(
      c.red("On macOS, install cloudflared first:\n  brew install cloudflared\nThen re-run."),
    );
    process.exit(1);
  }

  mkdirSync(TOOLS, { recursive: true });
  console.log(c.dim("  Downloading cloudflared (one time, ~50MB)…"));

  const url = `https://github.com/cloudflare/cloudflared/releases/latest/download/${asset}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    console.error(c.red(`  Download failed (${res.status}).`));
    process.exit(1);
  }
  const tmp = `${BIN}.partial`;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp));
  const { rename, chmod } = await import("node:fs/promises");
  await rename(tmp, BIN);
  if (!IS_WIN) await chmod(BIN, 0o755);
  console.log(c.dim("  Done."));
}

function waitForServer(timeoutMs = 90_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const r = await fetch(`http://localhost:${PORT}/`, { redirect: "manual" });
        if (r.status > 0) return resolve();
      } catch {
        /* not up yet */
      }
      if (Date.now() - started > timeoutMs) return reject(new Error("Server did not start"));
      setTimeout(poll, 700);
    };
    poll();
  });
}

const children = [];

/** `npm run start` is spawned through a shell, so killing the child
 *  kills the shell and orphans the actual Next server — which keeps
 *  holding the port and serving a stale build. Kill the whole tree. */
function killTree(pid) {
  if (!pid) return;
  try {
    if (IS_WIN) {
      spawn("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      process.kill(-pid, "SIGTERM");
    }
  } catch {
    /* already gone */
  }
}

function shutdown() {
  for (const child of children) {
    killTree(child.pid);
    try {
      child.kill();
    } catch {
      /* already gone */
    }
  }
}

/** Refuse to start on an occupied port rather than silently tunnelling
 *  to whatever is already there — that served a months-old build once
 *  and looked like the new one. */
async function portInUse() {
  try {
    const res = await fetch(`http://localhost:${PORT}/`, { redirect: "manual" });
    return res.status > 0;
  } catch {
    return false;
  }
}

process.on("SIGINT", () => {
  console.log(c.dim("\n  Stopping…\n"));
  shutdown();
  process.exit(0);
});
process.on("exit", shutdown);

async function main() {
  console.log(`\n${c.cyan("▸ Doctors Build International — public preview")}\n`);

  await ensureCloudflared();

  if (await portInUse()) {
    fail(
      `Port ${PORT} is already serving something.\n` +
        `  That is probably an old server from a previous run, and it will\n` +
        `  serve a STALE build. Stop it first:\n\n` +
        (IS_WIN
          ? `    Get-NetTCPConnection -LocalPort ${PORT} -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }\n`
          : `    lsof -ti:${PORT} | xargs kill -9\n`) +
        `\n  Then run npm run share again.`,
    );
  }

  // Always rebuild. Skipping when .next exists meant an edit made after
  // the last build was silently missing from the "live" preview.
  console.log(c.dim("  Building…"));
  await new Promise((resolve, reject) => {
    const b = spawn("npm", ["run", "build"], { cwd: ROOT, shell: true, stdio: "inherit" });
    children.push(b);
    b.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("Build failed"))));
  });

  console.log(c.dim(`  Starting server on :${PORT}…`));
  const server = spawn("npm", ["run", "start", "--", "-p", PORT], {
    cwd: ROOT,
    shell: true,
    stdio: "ignore",
  });
  children.push(server);

  await waitForServer();
  console.log(c.dim("  Server ready."));
  console.log(c.dim("  Opening public tunnel…"));

  const tunnel = spawn(BIN, ["tunnel", "--url", `http://localhost:${PORT}`, "--no-autoupdate"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(tunnel);

  let printed = false;
  const scan = (buf) => {
    const text = buf.toString();
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && !printed) {
      printed = true;
      const url = match[0];
      const pad = " ".repeat(Math.max(0, 58 - url.length));
      console.log(`
${c.green("  ┌────────────────────────────────────────────────────────────────┐")}
${c.green("  │")}  ${c.bold("Your site is live at:")}                                         ${c.green("│")}
${c.green("  │")}                                                                ${c.green("│")}
${c.green("  │")}  ${c.gold(url)}${pad}  ${c.green("│")}
${c.green("  │")}                                                                ${c.green("│")}
${c.green("  │")}  ${c.dim("Send that link to the client. Works on any device.")}            ${c.green("│")}
${c.green("  │")}  ${c.dim("Stays up while this window is open. Ctrl-C to stop.")}           ${c.green("│")}
${c.green("  └────────────────────────────────────────────────────────────────┘")}
`);
    }
  };

  tunnel.stdout.on("data", scan);
  tunnel.stderr.on("data", scan);

  tunnel.on("exit", (code) => {
    console.log(c.red(`\n  Tunnel closed (code ${code}).`));
    shutdown();
    process.exit(code ?? 0);
  });
}

main().catch(async (err) => {
  console.error(c.red(`\n  ${err.message}\n`));
  await rm(`${BIN}.partial`, { force: true }).catch(() => {});
  shutdown();
  process.exit(1);
});
