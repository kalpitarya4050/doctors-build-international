/**
 * Resolves a browser binary for the audit/screenshot scripts.
 *
 * WHY THIS EXISTS
 *
 * `chrome-headless-shell` is a genuinely UI-less binary: it cannot
 * create a window, so it never appears in Alt-Tab or the taskbar.
 *
 * The fallbacks can. Chrome honours `--headless=new` and stays out of
 * the way, but Microsoft Edge on Windows still registers real
 * top-level windows in headless mode — and `audit:mobile` opens 19
 * routes x 4 viewports, so falling back to Edge carpet-bombs the
 * task switcher with 76 windows while it runs. On a machine without
 * Chrome installed that is exactly what happened.
 *
 * Install the shell once (it lands in ./chrome-headless-shell, which
 * is gitignored):
 *
 *   npx @puppeteer/browsers install chrome-headless-shell@stable
 */

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Newest locally-installed chrome-headless-shell, if any. */
function headlessShell() {
  const base = path.join(ROOT, "chrome-headless-shell");
  if (!existsSync(base)) return null;
  const versions = readdirSync(base).sort().reverse();
  for (const v of versions) {
    const exe = path.join(base, v, "chrome-headless-shell-win64", "chrome-headless-shell.exe");
    if (existsSync(exe)) return exe;
    const nix = path.join(base, v, "chrome-headless-shell-linux64", "chrome-headless-shell");
    if (existsSync(nix)) return nix;
  }
  return null;
}

const FALLBACKS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

/** @returns {{ executablePath: string, windowless: boolean }} */
export function resolveBrowser() {
  const shell = headlessShell();
  if (shell) return { executablePath: shell, windowless: true };

  const found = FALLBACKS.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      "No browser found. Run: npx @puppeteer/browsers install chrome-headless-shell@stable",
    );
  }
  if (found.includes("msedge")) {
    console.warn(
      "  ! Falling back to Edge, which opens real windows in headless mode.\n" +
        "    To keep them out of Alt-Tab, run:\n" +
        "    npx @puppeteer/browsers install chrome-headless-shell@stable\n",
    );
  }
  return { executablePath: found, windowless: false };
}
