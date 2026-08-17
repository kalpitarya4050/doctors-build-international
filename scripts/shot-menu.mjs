#!/usr/bin/env node
/**
 * Photographs the two mega menus, in both themes.
 *
 *   node scripts/shot-menu.mjs --out=./shots
 *   node scripts/shot-menu.mjs --country=russia
 *
 * The menus only exist while hovered, and only at lg and up, so they
 * cannot be caught by the ordinary page-shot scripts — which is
 * exactly why the Universities menu shipped in a state nobody had
 * looked at. This drives the real pointer, waits for the open
 * animation to settle, and crops to the panel.
 *
 * `--country` additionally hovers one country row so the expanded
 * university list can be checked, including that its logos loaded
 * rather than falling back to monograms.
 */

import puppeteer from "puppeteer-core";
import { resolveBrowser } from "./browser.mjs";
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};

const BASE = flag("url", "http://localhost:3000");
const OUT = flag("out", "./shots");
const COUNTRY = flag("country", "");
const W = Number(flag("w", "1440"));
const H = Number(flag("h", "900"));

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: resolveBrowser().executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=2"],
});

async function shoot(page, label, navText, theme) {
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });

  // next-themes reads localStorage, so set it and reload rather than
  // toggling through the UI — the toggle is one more thing to break.
  await page.evaluate((t) => localStorage.setItem("theme", t), theme);
  await page.reload({ waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1800));

  const link = await page.evaluateHandle(
    (t) => [...document.querySelectorAll("nav a")].find((a) => a.textContent.trim().startsWith(t)),
    navText,
  );
  const el = link.asElement();
  if (!el) throw new Error(`nav link "${navText}" not found`);
  await el.hover();
  await new Promise((r) => setTimeout(r, 500));

  if (COUNTRY && navText === "Universities") {
    // Scope to the header: the footer carries the same destination
    // links, and hovering one of those moved the pointer out of the
    // menu entirely — the shot came back showing whichever country
    // happened to be open last.
    const row = await page.evaluateHandle(
      (slug) => document.querySelector(`header a[href$="/destinations/${slug}"]`),
      COUNTRY,
    );
    const rowEl = row.asElement();
    if (rowEl) {
      await rowEl.hover();
      await new Promise((r) => setTimeout(r, 700));
    }
  }

  // Wait for lazy logos so the shot is not of empty tiles.
  await page
    .waitForFunction(
      () => [...document.images].filter((i) => i.src.includes("university-logos")).every((i) => i.complete),
      { timeout: 8000 },
    )
    .catch(() => {});

  const panel = await page.$('header [class*="material-chrome"][class*="rounded"]');
  const target = panel ?? page;
  const file = path.join(OUT, `menu-${label}-${theme}.png`);
  await target.screenshot({ path: file });
  console.log(`  ${file}`);
}

const page = await browser.newPage();
await page.setViewport({ width: W, height: H });

for (const theme of ["light", "dark"]) {
  await shoot(page, "destinations", "Destinations", theme);
  await shoot(page, "universities", "Universities", theme);
}

await browser.close();
