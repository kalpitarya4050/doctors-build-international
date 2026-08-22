#!/usr/bin/env node
/**
 * Redirect stubs for URLs that no longer exist.
 *
 *   npm run redirects
 *
 * The site ships as a static export on GitHub Pages, which cannot issue
 * a real 301 — there is no server in front of it to issue one. The next
 * best thing, and what Google documents as an acceptable substitute, is
 * a page that carries `rel=canonical` to the replacement, `noindex` so
 * the dead URL drops out of the index, and an instant meta-refresh plus
 * a JS replace so a human never sees it.
 *
 * These write into public/, so they survive `next build` untouched and
 * land in out/ exactly where the old page used to be. `trailingSlash`
 * is on, so each stub is written as <path>/index.html.
 *
 * If the site ever moves to a host that can do real redirects (Netlify,
 * Vercel, Cloudflare Pages), REDIRECTS below is the single source to
 * generate a _redirects or vercel.json from — do that and delete the
 * stubs rather than running both.
 */

import { writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");

/* ------------------------------------------------------------------
   from → to. Every entry is a URL that was live and is not any more.

   The target is the nearest honest equivalent, never a page that would
   misrepresent what the visitor was looking for. Where nothing close
   exists — Uzbekistan, Fergana — the target is the index, not a
   different country dressed up as a match.
   ------------------------------------------------------------------ */
export const REDIRECTS = [
  // Uzbekistan removed in full (client instruction, FINAL MASTER UPDATE).
  ["/destinations/uzbekistan", "/destinations"],
  ["/universities/fergana-medical-institute-of-public-health", "/universities"],

  // BSMU replaced by Kazan State Medical University.
  ["/universities/bashkir-state-medical-university", "/universities/kazan-state-medical-university"],

  // Kazan Federal removed; Kazan State is the Kazan institution we now place into.
  ["/universities/kazan-federal-university", "/universities/kazan-state-medical-university"],

  // Kabardino-Balkarian removed; NCSA is the remaining northern-Caucasus option.
  ["/universities/kabardino-balkarian-state-university", "/universities/north-caucasian-state-academy"],

  // No close equivalent — send to the country page.
  ["/universities/ulyanovsk-state-university", "/destinations/russia"],
  ["/universities/chuvash-state-medical-university", "/destinations/russia"],

  // Renamed to the institution's own current name.
  ["/universities/north-caucasian-state-medical-academy", "/universities/north-caucasian-state-academy"],
];

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://doctorsbuild.com";

/* GitHub Pages serves from /<repo>, so an absolute "/destinations/" would
   land outside the site. The canonical and the meta-refresh are written
   with BASE_PATH baked in; the JS path derives the prefix from the stub's
   own location instead, so it stays correct even if the site later moves
   to a root domain without this script being re-run. */
const BASE_PATH = process.env.BASE_PATH ?? "";

function stub(from, to) {
  const target = `${BASE_PATH}${to}/`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Page moved</title>
<link rel="canonical" href="${SITE}${target}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${target}">
<script>
(function () {
  var from = ${JSON.stringify(from + "/")}, to = ${JSON.stringify(to + "/")};
  var here = location.pathname;
  if (here.slice(-1) !== "/") here += "/";
  var base = here.slice(-from.length) === from ? here.slice(0, -from.length) : "";
  location.replace(base + to + location.search + location.hash);
})();
</script>
<style>
  body{font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;margin:0;
       min-height:100vh;display:grid;place-items:center;padding:2rem;
       background:#fbfaf7;color:#1a2233}
  @media (prefers-color-scheme: dark){body{background:#0b1220;color:#e8ecf4}}
  a{color:#0f7a8a}
</style>
</head>
<body>
<main>
  <h1>This page has moved</h1>
  <p>Taking you to <a href="${target}">${target}</a> …</p>
</main>
</body>
</html>
`;
}

async function main() {
  let written = 0;

  for (const [from, to] of REDIRECTS) {
    const dir = path.join(PUBLIC, ...from.split("/").filter(Boolean));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), stub(from, to), "utf8");
    written++;
    console.log(`  \x1b[32m→\x1b[0m ${from.padEnd(56)} \x1b[90m${to}\x1b[0m`);
  }

  // A stub must never shadow a live route. If a slug is ever reinstated,
  // this is what stops the redirect quietly winning over the real page.
  const live = new Set(REDIRECTS.map(([from]) => from));
  for (const from of live) {
    const appRoute = path.join(ROOT, "src", "app", ...from.split("/").filter(Boolean), "page.tsx");
    if (existsSync(appRoute)) {
      console.error(`\n\x1b[31m✗ ${from} has a real page at ${appRoute}\x1b[0m`);
      console.error("  Remove it from REDIRECTS, or delete the stub.\n");
      await rm(path.join(PUBLIC, ...from.split("/").filter(Boolean)), { recursive: true, force: true });
      process.exit(1);
    }
  }

  console.log(`\n\x1b[32m▸ Done.\x1b[0m ${written} redirect stubs in public/.\n`);
}

main();
