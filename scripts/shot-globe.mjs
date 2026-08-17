#!/usr/bin/env node
/**
 * Hero-globe screenshots, with WebGL actually turned on.
 *
 *   node scripts/shot-globe.mjs --out=./shots --w=1440 --h=900
 *   node scripts/shot-globe.mjs --drag=260,90     # spin, then shoot
 *
 * The other capture scripts pass `--disable-gpu`, which in headless
 * Chrome takes WebGL down with it — the globe would photograph as its
 * fallback disc and every check would be meaningless. SwiftShader is
 * the software rasteriser Chrome ships for exactly this; it is slow
 * but pixel-accurate, and `--enable-unsafe-swiftshader` is what
 * re-permits it in headless since Chrome 128.
 */

import puppeteer from "puppeteer-core";
import { resolveBrowser } from "./browser.mjs";
import { mkdirSync } from "node:fs";
import path from "node:path";

const { executablePath: CHROME } = resolveBrowser();
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const BASE = flag("url", "http://localhost:3000");
const OUT = flag("out", "./shots");
const W = Number(flag("w", "1440"));
const H = Number(flag("h", "900"));
const HOLD = Number(flag("hold", "2600"));
const DRAG = flag("drag", null);
const TAG = flag("tag", "globe");

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: [
    "--no-sandbox",
    "--hide-scrollbars",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") problems.push(m.text());
});
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });

// The intro curtain gates every hero animation; give it room to lift.
await new Promise((r) => setTimeout(r, HOLD));

const state = await page.evaluate(() => {
  const stage = document.querySelector('[role="img"][aria-label*="globe" i]');
  const gl = stage?.querySelector("canvas");
  const probe = document.createElement("canvas").getContext("webgl");
  return {
    found: Boolean(stage),
    webgl: Boolean(probe),
    renderer: probe
      ? (() => {
          const d = probe.getExtension("WEBGL_debug_renderer_info");
          return d ? probe.getParameter(d.UNMASKED_RENDERER_WEBGL) : "unknown";
        })()
      : null,
    // Opacity 1 means the shader took over from the fallback disc.
    sphereLive: gl ? getComputedStyle(gl).opacity : null,
    box: stage ? stage.getBoundingClientRect().toJSON() : null,
  };
});
console.log(JSON.stringify(state, null, 2));

if (DRAG && state.box) {
  const [dx, dy] = DRAG.split(",").map(Number);
  const cx = state.box.x + state.box.width / 2;
  const cy = state.box.y + state.box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 24; i++) {
    await page.mouse.move(cx + (dx * i) / 24, cy + (dy * i) / 24);
    await new Promise((r) => setTimeout(r, 12));
  }
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 900));
}

await page.screenshot({ path: path.join(OUT, `${TAG}-${W}x${H}.png`) });

if (state.box) {
  // Tight crop on the globe, for judging the sphere itself.
  const b = state.box;
  await page.screenshot({
    path: path.join(OUT, `${TAG}-crop.png`),
    clip: {
      x: Math.max(0, b.x),
      y: Math.max(0, b.y),
      width: Math.min(W - Math.max(0, b.x), b.width),
      height: Math.min(H - Math.max(0, b.y), b.height),
    },
  });
}

if (problems.length) console.log("console:", problems.slice(0, 12));
await browser.close();
