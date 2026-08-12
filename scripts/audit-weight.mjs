#!/usr/bin/env node
/**
 * Page weight on a phone.
 *
 *   npm run audit:weight
 *   npm run audit:weight -- --url=https://…
 *
 * A static host serves images exactly as they sit on disk — no WebP,
 * no per-breakpoint resizing. A 1600px JPEG dropped into a 190px card
 * on a phone is wasted bytes, and the audience here is largely on
 * Indian mobile data. This measures what a phone actually downloads
 * for a cold visit, broken down by resource type, and flags images
 * shipped far larger than the box they render into.
 */

import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const CHROME = [
  String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`,
  String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
  "/usr/bin/google-chrome",
].find((p) => existsSync(p));

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("--url=")) ?? "--url=http://localhost:3000").slice(6);

const ROUTES = [
  "/",
  "/destinations/georgia",
  "/universities/geomedi-university-georgia",
  "/fee-comparison",
  "/apply",
];

const c = {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const mb = (n) => `${(n / 1048576).toFixed(2)}MB`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

console.log(`\n${c.cyan("▸ Mobile page weight")}  ${c.dim(BASE)}\n`);

let worstOversize = [];

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.setCacheEnabled(false);

  const byType = {};
  const images = new Map();

  page.on("response", async (res) => {
    try {
      const type = res.request().resourceType();
      const len = Number(res.headers()["content-length"] ?? 0);
      const size = len || (await res.buffer().catch(() => Buffer.alloc(0))).length;
      byType[type] = (byType[type] ?? 0) + size;
      if (type === "image") images.set(res.url(), size);
    } catch {
      /* redirects and aborted requests have no body */
    }
  });

  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2", timeout: 60000 });
  // Scroll so lazy images below the fold are counted too — a visitor
  // reading the page will pay for them.
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, (y += 800));
        if (y < document.body.scrollHeight) setTimeout(step, 50);
        else setTimeout(res, 900);
      };
      step();
    });
  });

  // Which images are shipped much bigger than they render?
  const oversize = await page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((i) => i.naturalWidth && i.clientWidth)
      .map((i) => ({
        src: i.currentSrc || i.src,
        natural: i.naturalWidth,
        // CSS px * DPR is the most detail the screen can show.
        needed: Math.round(i.clientWidth * window.devicePixelRatio),
      }))
      .filter((i) => i.natural > i.needed * 1.35),
  );

  const total = Object.values(byType).reduce((a, b) => a + b, 0);
  const imgTotal = byType.image ?? 0;

  const flag = total > 3_000_000 ? c.red : total > 1_500_000 ? c.yellow : c.green;
  console.log(`  ${flag(mb(total).padStart(7))}  ${route}`);
  console.log(
    c.dim(
      `           images ${kb(imgTotal)} · js ${kb(byType.script ?? 0)} · css ${kb(byType.stylesheet ?? 0)} · fonts ${kb(byType.font ?? 0)} · ${images.size} image requests`,
    ),
  );

  if (oversize.length) {
    const sample = oversize
      .sort((a, b) => b.natural / b.needed - a.natural / a.needed)
      .slice(0, 3);
    for (const o of sample) {
      console.log(
        c.yellow(
          `           ↑ ${o.natural}px shipped for a ${o.needed}px slot  ${c.dim(o.src.split("/").pop())}`,
        ),
      );
    }
    worstOversize.push({ route, count: oversize.length });
  }

  await page.close();
}

await browser.close();

if (worstOversize.length) {
  const n = worstOversize.reduce((a, b) => a + b.count, 0);
  console.log(
    `\n${c.yellow("▸")} ${n} images shipped materially larger than they render.\n` +
      `  On a static host next/image cannot resize, so the fix is to emit\n` +
      `  width variants at build time and let the browser pick.\n`,
  );
} else {
  console.log(`\n${c.green("▸ No oversized images.")}\n`);
}
