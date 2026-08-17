#!/usr/bin/env node
/**
 * Mobile audit across every route.
 *
 *   npm run audit:mobile                  # against http://localhost:3000
 *   npm run audit:mobile -- --url=https://…
 *
 * Reports, per page and per breakpoint:
 *   · horizontal overflow, and WHICH elements cause it
 *   · tap targets below Apple's 44×44pt minimum
 *   · text smaller than 12px
 *   · images that overflow their container
 *
 * Eyeballing screenshots misses all of this — an element 8px too wide
 * looks fine in a thumbnail but clips real content on a phone.
 */

import puppeteer from "puppeteer-core";
import { resolveBrowser } from "./browser.mjs";

const { executablePath: CHROME } = resolveBrowser();

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("--url=")) ?? "--url=http://localhost:3000").slice(6);
const ONLY = args.find((a) => a.startsWith("--only="))?.slice(7);

/** One page of each shape, not all 46 — a university page with a
 *  published fee table lays out differently from one without, and a
 *  destination with manifest photography differently from one on
 *  country imagery. Those are the cases worth re-checking. */
const ROUTES = [
  "/",
  "/about",
  "/services",
  "/why-us",
  "/destinations",
  "/destinations/georgia",
  "/destinations/russia",
  "/destinations/kazakhstan",
  "/destinations/china",
  "/universities",
  // Published fees + full manifest photography
  "/universities/geomedi-university-georgia",
  // No published fees, no manifest photography, richest China facts
  "/universities/nanjing-medical-university",
  // No published fees, sparsest record in the lineup
  "/universities/kazakh-russian-medical-university",
  "/fee-comparison",
  "/faq",
  "/contact",
  "/apply",
  "/privacy-policy",
  "/terms",
];

const VIEWPORTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 15", width: 393, height: 852 },
  { name: "Android sm", width: 360, height: 800 },
  { name: "iPad mini", width: 768, height: 1024 },
];

const c = {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/** Runs in the page. Returns the specific offenders, not just a count. */
function audit() {
  const docWidth = document.documentElement.clientWidth;

  /* `scrollWidth > clientWidth` alone is not proof of a sideways
     scroll. `body { overflow-x: clip }` — which this site sets —
     stops the page scrolling but still reports the overflowing
     content box in scrollWidth, so decorative blooms and full-bleed
     bands showed up as failures on eight routes that a user can
     never actually scroll. Ask the page to scroll instead: if it
     will not move, there is nothing for a thumb to find either. */
  const beforeX = window.scrollX;
  window.scrollTo(200, window.scrollY);
  const canScrollX = window.scrollX > 0;
  window.scrollTo(beforeX, window.scrollY);

  const out = {
    docWidth,
    scrollWidth: document.documentElement.scrollWidth,
    canScrollX,
    overflow: [],
    smallTaps: [],
    tinyText: [],
  };

  const describe = (el) => {
    const cls = (el.className || "").toString().split(/\s+/).slice(0, 3).join(".");
    const id = el.id ? `#${el.id}` : "";
    const txt = (el.textContent || "").trim().slice(0, 28);
    return `${el.tagName.toLowerCase()}${id}${cls ? "." + cls : ""}${txt ? ` "${txt}"` : ""}`;
  };

  /** True when some ancestor clips horizontal overflow. A marquee
   *  track is 3000px wide by design — it is not a bug, because the
   *  band around it has overflow:hidden. Without this check the report
   *  is drowned in false positives. */
  const isClipped = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const s = getComputedStyle(p);
      if (/hidden|clip|auto|scroll/.test(s.overflowX)) return true;
      p = p.parentElement;
    }
    return false;
  };

  /** Visually-hidden until focused — reports a 1×1 box that is not a
   *  real tap target. */
  const isScreenReaderOnly = (el) => {
    const s = getComputedStyle(el);
    return (
      s.clipPath === "inset(50%)" ||
      s.clip === "rect(0px, 0px, 0px, 0px)" ||
      (parseFloat(s.width) <= 1 && parseFloat(s.height) <= 1)
    );
  };

  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    // Horizontal overflow — only report the element itself, not every
    // ancestor, and only when nothing above it clips.
    if (r.right > docWidth + 1 || r.left < -1) {
      const p = el.parentElement?.getBoundingClientRect();
      const parentAlreadyOver = p && (p.right > docWidth + 1 || p.left < -1);
      if (!parentAlreadyOver && style.position !== "fixed" && !isClipped(el)) {
        out.overflow.push({
          el: describe(el),
          left: Math.round(r.left),
          right: Math.round(r.right),
          over: Math.round(Math.max(r.right - docWidth, -r.left)),
        });
      }
    }

    // Tap targets — Apple HIG minimum is 44×44pt.
    // `.tap` extends the hit area with an ::after pseudo-element,
    // which getBoundingClientRect cannot see. The touch region really
    // is >=44px, so treat it as satisfied.
    const hasExtendedHit = el.classList.contains("tap") || el.closest(".tap");

    const interactive =
      el.matches("a, button, [role=button], input, select, textarea, summary") &&
      !el.closest("[aria-hidden=true]") &&
      !isScreenReaderOnly(el) &&
      !hasExtendedHit;
    if (interactive && (r.width < 44 || r.height < 44)) {
      // Ignore inline links inside running text — the rule is for
      // standalone controls.
      const inProse = el.tagName === "A" && el.closest("p, li, figcaption");
      if (!inProse) {
        out.smallTaps.push({ el: describe(el), w: Math.round(r.width), h: Math.round(r.height) });
      }
    }

    // Body text below 12px is unreadable on a phone.
    if (el.children.length === 0 && (el.textContent || "").trim().length > 8) {
      const fs = parseFloat(style.fontSize);
      if (fs && fs < 12) out.tinyText.push({ el: describe(el), px: +fs.toFixed(1) });
    }
  }

  const dedupe = (arr, key) => {
    const seen = new Set();
    return arr.filter((x) => !seen.has(x[key]) && seen.add(x[key]));
  };
  out.overflow = dedupe(out.overflow, "el").slice(0, 8);
  out.smallTaps = dedupe(out.smallTaps, "el").slice(0, 8);
  out.tinyText = dedupe(out.tinyText, "el").slice(0, 6);
  return out;
}

async function run() {
  if (!CHROME) {
    console.error("No Chrome/Edge found.");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  const routes = ONLY ? ROUTES.filter((r) => r.includes(ONLY)) : ROUTES;
  let totalOverflow = 0;
  let totalTaps = 0;
  let totalTiny = 0;

  console.log(`\n${c.cyan(`▸ Mobile audit — ${routes.length} routes × ${VIEWPORTS.length} viewports`)}`);
  console.log(c.dim(`  ${BASE}\n`));

  for (const route of routes) {
    const problems = [];

    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        isMobile: vp.width <= 768,
        hasTouch: vp.width <= 768,
      });
      // Headless reports `pointer: fine` by default, so touch-only
      // rules would never apply and the audit would measure a device
      // nobody is using.
      if (vp.width <= 768) {
        // puppeteer's emulateMediaFeatures does not cover pointer/hover,
        // so go straight to CDP.
        const client = await page.createCDPSession();
        await client.send("Emulation.setEmulatedMedia", {
          features: [
            { name: "pointer", value: "coarse" },
            { name: "any-pointer", value: "coarse" },
            { name: "hover", value: "none" },
          ],
        });
      }
      try {
        /* `networkidle2` is the wrong signal here. Edge defers load
           events for lazily-loaded images ("Images loaded lazily and
           replaced with placeholders"), so on the image-heavy home
           page the idle event never fires even though in-flight
           requests sit at zero the whole time — it timed out on three
           of four viewports and reported nothing useful. Wait for the
           DOM, then settle, which is what the layout actually needs. */
        await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
        await new Promise((r) => setTimeout(r, 2200));
        const res = await page.evaluate(audit);

        const overflowed = res.scrollWidth > res.docWidth + 1 && res.canScrollX;
        if (overflowed || res.overflow.length || res.smallTaps.length || res.tinyText.length) {
          problems.push({ vp, res, overflowed });
        }
      } catch (err) {
        problems.push({ vp, error: err.message });
      }
      await page.close();
    }

    if (problems.length === 0) {
      console.log(`  ${c.green("✓")} ${route}`);
      continue;
    }

    console.log(`  ${c.red("✗")} ${c.bold(route)}`);
    for (const p of problems) {
      if (p.error) {
        console.log(`      ${c.red(p.vp.name)}: ${p.error}`);
        continue;
      }
      const tags = [];
      if (p.overflowed) tags.push(c.red(`overflows ${p.res.scrollWidth}px > ${p.res.docWidth}px`));
      if (p.res.smallTaps.length) tags.push(c.yellow(`${p.res.smallTaps.length} small taps`));
      if (p.res.tinyText.length) tags.push(c.yellow(`${p.res.tinyText.length} tiny text`));
      console.log(`      ${c.dim(p.vp.name.padEnd(11))} ${tags.join("  ")}`);

      for (const o of p.res.overflow) {
        console.log(`        ${c.red("→")} +${o.over}px  ${c.dim(o.el)}`);
        totalOverflow++;
      }
      for (const t of p.res.smallTaps) {
        console.log(`        ${c.yellow("tap")} ${t.w}×${t.h}  ${c.dim(t.el)}`);
        totalTaps++;
      }
      for (const t of p.res.tinyText) {
        console.log(`        ${c.yellow("txt")} ${t.px}px  ${c.dim(t.el)}`);
        totalTiny++;
      }
    }
  }

  await browser.close();
  console.log(
    `\n${c.cyan("▸ Summary")}  ${totalOverflow} overflow  ·  ${totalTaps} small tap targets  ·  ${totalTiny} tiny text\n`,
  );
  process.exit(totalOverflow > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
