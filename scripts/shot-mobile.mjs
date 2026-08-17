#!/usr/bin/env node
/**
 * True mobile screenshots, using real viewport emulation.
 *
 *   node scripts/shot-mobile.mjs /  /apply  --out=./shots
 *
 * `chrome --headless --window-size=390,…` does NOT emulate a phone —
 * it sets a window, not a layout viewport, so the page lays out for a
 * desktop and the capture merely crops it. That looks like horizontal
 * overflow when there is none. Puppeteer's setViewport with
 * isMobile/hasTouch is the accurate way to see what a phone sees.
 */

import puppeteer from "puppeteer-core";
import { resolveBrowser } from "./browser.mjs";
import { mkdirSync } from "node:fs";
import path from "node:path";

const { executablePath: CHROME } = resolveBrowser();

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("--url=")) ?? "--url=http://localhost:3000").slice(6);
const OUT = (args.find((a) => a.startsWith("--out=")) ?? "--out=./shots").slice(6);
const W = Number((args.find((a) => a.startsWith("--w=")) ?? "--w=393").slice(4));
const FULL = args.includes("--full");
const routes = args.filter((a) => a.startsWith("/"));

if (routes.length === 0) routes.push("/");
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

for (const route of routes) {
  const page = await browser.newPage();
  await page.setViewport({
    width: W,
    height: 850,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2", timeout: 60000 });
  // Let scroll-triggered reveals fire before capturing.
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, (y += 700));
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else {
          window.scrollTo(0, 0);
          setTimeout(res, 500);
        }
      };
      step();
    });
  });
  await new Promise((r) => setTimeout(r, 700));

  const name = (route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "")) + `-${W}.png`;
  await page.screenshot({ path: path.join(OUT, name), fullPage: FULL });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  console.log(
    `  ${name.padEnd(40)} ${metrics.scrollWidth > metrics.clientWidth + 1 ? `OVERFLOW ${metrics.scrollWidth}>${metrics.clientWidth}` : "fits"}`,
  );
  await page.close();
}

await browser.close();
