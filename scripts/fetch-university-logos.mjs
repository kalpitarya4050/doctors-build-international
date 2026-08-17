#!/usr/bin/env node
/**
 * Pulls each partner university's own logo from its own website.
 *
 *   npm run images:logos
 *   npm run images:logos -- --force
 *   npm run images:logos -- --only=kazan-federal-university
 *
 * The domains below were each resolved and title-checked by hand
 * against the institution's own homepage — NOT taken from an agent
 * directory, several of which list the wrong campus. Notes on the
 * three that needed a decision:
 *
 *   north-caucasian  ncsa.ru. The Cherkessk institution files under
 *                    "Humanitarian and Technological Academy"; the
 *                    medical academy is its Medical Institute. Same
 *                    site, and the only official one.
 *   fergana          fergmi.uz, the institute's own domain. fmiph.uz
 *                    also answers but is an admissions-agent mirror.
 *   south-asia       usa-kg.com has NO A record — the site is off the
 *                    air, not merely blocked from here. There is no
 *                    official source to take a logo from, so it is
 *                    left out and the UI renders its monogram.
 *
 * The apex of every .edu.cn here is A-record-less; only `www` answers.
 * Keep the `www.` in those entries or all five silently fail.
 *
 * WHAT IT PICKS
 * Candidates are scored, not first-matched: an SVG beats a raster,
 * "logo" in the path beats a bare filename, and apple-touch-icon
 * beats favicon.ico (which is usually a 16px smear). A candidate is
 * only accepted once downloaded and sniffed — content-type lies
 * often enough that the magic bytes are what actually decide.
 *
 * THE BROWSER FALLBACK
 * kpfu.ru answers every /img/* request from plain HTTP with its own
 * 70KB error page under a 200 status, whatever the referer. It only
 * serves the real asset to a browser session. So when the HTTP path
 * finds nothing, the site is re-opened in headless Chrome and the
 * logo is read from the live DOM — same origin, same cookies, so the
 * filter is satisfied. This costs ~4s per site and is why it is a
 * fallback rather than the default.
 */

import { writeFile, readFile, mkdir, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "images", "university-logos");
const MANIFEST = path.join(ROOT, "src", "lib", "data", "university-logos.ts");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

/** slug → homepage. Ordered as the site orders countries. */
const SITES = {
  "geomedi-university-georgia": "https://geomedi.edu.ge/",
  "avicenna-batumi-medical-university": "https://avicenna.edu.ge/",
  "georgian-american-university": "https://gau.edu.ge/",
  "georgian-national-university-seu": "https://seu.edu.ge/",
  "east-west-university-georgia": "https://ewu.edu.ge/",
  "david-tvildiani-medical-university": "https://dtmu.edu.ge/",

  "kazan-federal-university": "https://kpfu.ru/",
  "bashkir-state-medical-university": "https://bashgmu.ru/",
  "ulyanovsk-state-university": "https://ulsu.ru/",
  "chuvash-state-medical-university": "https://chuvsu.ru/",
  "kemerovo-state-medical-university": "https://kemsmu.ru/",
  "north-caucasian-state-medical-academy": "https://ncsa.ru/",
  "kabardino-balkarian-state-university": "https://kbsu.ru/",
  "ingush-state-university": "https://inggu.ru/",

  // kaznmu.kz serves the Aksay university CLINIC, a different brand
  // with its own logo. The university itself is on .edu.kz.
  "kazakh-national-medical-university": "https://kaznmu.edu.kz/",
  "kazakh-russian-medical-university": "https://krmu.edu.kz/",

  "nanjing-medical-university": "https://www.njmu.edu.cn/",
  "southern-medical-university": "https://www.smu.edu.cn/",
  "chongqing-medical-university": "https://www.cqmu.edu.cn/",
  "tianjin-medical-university": "https://www.tmu.edu.cn/",
  "capital-medical-university": "https://www.ccmu.edu.cn/",

  "fergana-medical-institute-of-public-health": "https://fergmi.uz/",
};

/**
 * Exact logo URLs for the sites where scoring picks the wrong image.
 * Every one of these was found by rendering the homepage and reading
 * the header, then confirmed by eye on a contact sheet — auto-picking
 * had produced, in order: a messenger app icon, a "JuniorSkills"
 * partner banner, a mail glyph, and a children's-clinic sub-brand.
 * Scoring cannot tell those from a crest. A human looking at the
 * header can, so that judgement is recorded here rather than being
 * re-guessed on every run.
 */
const OVERRIDES = {
  "bashkir-state-medical-university": "https://bashgmu.ru/include/logo01.png",
  "kabardino-balkarian-state-university":
    "https://kbsu.ru/wp-content/themes/kbsu/img/logo-kbsu.png",
  "georgian-national-university-seu": "https://seu.edu.ge/assets/DPqFdKZN.svg",
  "kazakh-national-medical-university":
    "https://kaznmu.edu.kz/wp-content/uploads/2024/03/logo-4.png",
};

/**
 * Hosts whose certificate chain Node will not verify. chuvsu.ru is
 * signed by a Russian national CA that ships in no default trust
 * store. We are downloading a public logo from a public homepage, so
 * the exposure is a wrong logo, not a leaked secret — but keep this
 * list explicit and short rather than disabling verification globally.
 */
const INSECURE_TLS = new Set(["chuvsu.ru"]);

/** Forces a navy tile regardless of what the pixels measure. */
const DARK_TILE = new Set();

/**
 * Hosts that need a much longer leash. chuvsu.ru and ncsa.ru both
 * take 45s+ to return their homepage — not a transient blip, it is
 * their steady state. At the default 20s they look unreachable and
 * the run silently drops two universities.
 */
const SLOW_HOSTS = new Set(["chuvsu.ru", "ncsa.ru"]);
const slowFor = (url) => {
  try {
    return SLOW_HOSTS.has(new URL(url).hostname) ? 90000 : 0;
  } catch {
    return 0;
  }
};

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = (args.find((a) => a.startsWith("--only=")) || "").slice(7);

/* ------------------------------------------------------------------
   Fetch helpers
   ------------------------------------------------------------------ */

async function get(url, { timeout = 20000, binary = false } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();
  const relax = INSECURE_TLS.has(host);
  const prevTls = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  if (relax) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent": UA,
        accept: binary
          ? "image/avif,image/webp,image/svg+xml,image/*,*/*;q=0.8"
          : "text/html,application/xhtml+xml,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (binary) return { buf: Buffer.from(await res.arrayBuffer()), type, url: res.url };
    return { text: await res.text(), type, url: res.url };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
    if (relax) {
      if (prevTls === undefined) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      else process.env.NODE_TLS_REJECT_UNAUTHORIZED = prevTls;
    }
  }
}

/* ------------------------------------------------------------------
   Candidate extraction
   ------------------------------------------------------------------ */

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return m ? m[1].trim() : "";
};

/**
 * Scores a candidate URL. Higher wins. The weights encode what
 * actually produces a usable 32px nav mark, learned the hard way:
 * a wordmark SVG scales, a 16px favicon.ico does not.
 */
/** "stud-new2.kpfu.ru" and "kpfu.ru" → "kpfu.ru". Good enough for the
 *  two-label TLDs in this set (.edu.ge, .edu.cn, .edu.kz). */
function registrable(host) {
  const p = host.split(".");
  const twoLabelTld = p.length > 2 && ["edu", "ac", "co", "com", "org"].includes(p[p.length - 2]);
  return p.slice(twoLabelTld ? -3 : -2).join(".");
}

function score(url, { kind, sizes = "", pageHost = "" }) {
  const u = url.toLowerCase();
  let s = 0;

  /* A third-party host is almost never the university's own mark.
     bashgmu.ru links a messenger badge from logo-teka.com whose
     filename literally ends "-logo.svg", and on filename alone it
     outscored the real crest sitting at /include/logo01.png. */
  if (pageHost) {
    try {
      if (registrable(new URL(url).hostname) !== registrable(pageHost)) s -= 80;
    } catch {
      /* unparseable — leave the score alone */
    }
  }

  if (u.endsWith(".svg") || u.includes(".svg?")) s += 60;
  else if (u.endsWith(".png") || u.includes(".png?")) s += 30;
  else if (/\.(jpe?g|webp)(\?|$)/.test(u)) s += 14;
  else if (u.endsWith(".ico")) s += 2;

  if (/logo|brand|emblem|herb/.test(u)) s += 40;

  if (kind === "img-logo") s += 30;
  else if (kind === "apple-touch") s += 22;
  else if (kind === "icon") s += 10;
  else if (kind === "og") s += 4; // usually a campus photo, not a mark

  // "192x192" beats "16x16" when the site declares it.
  const px = Math.max(...(sizes.match(/\d+/g) || [0]).map(Number));
  if (px >= 180) s += 16;
  else if (px >= 96) s += 8;
  else if (px && px <= 32) s -= 10;

  // Sprite sheets and spacers are never the logo.
  if (/sprite|placeholder|blank|spacer|1x1/.test(u)) s -= 60;
  return s;
}

function candidates(html, baseUrl) {
  const out = [];
  const pageHost = (() => {
    try {
      return new URL(baseUrl).hostname;
    } catch {
      return "";
    }
  })();
  const push = (href, meta) => {
    if (!href || href.startsWith("data:")) return;
    let abs;
    try {
      abs = new URL(href, baseUrl).href;
    } catch {
      return;
    }
    out.push({ url: abs, ...meta, score: score(abs, { ...meta, pageHost }) });
  };

  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const rel = attr(tag, "rel").toLowerCase();
    if (!/icon/.test(rel)) continue;
    push(attr(tag, "href"), {
      kind: rel.includes("apple") ? "apple-touch" : "icon",
      sizes: attr(tag, "sizes"),
    });
  }

  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const p = (attr(tag, "property") || attr(tag, "name")).toLowerCase();
    if (p === "og:image" || p === "twitter:image") push(attr(tag, "content"), { kind: "og" });
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const src = attr(tag, "src") || attr(tag, "data-src");
    const hay = `${src} ${attr(tag, "class")} ${attr(tag, "id")} ${attr(tag, "alt")}`.toLowerCase();
    if (!/logo|emblem|brand/.test(hay)) continue;
    push(src, { kind: "img-logo" });
  }

  // Same URL can appear as both <link icon> and <img logo>; keep the best.
  const best = new Map();
  for (const c of out) {
    const prev = best.get(c.url);
    if (!prev || c.score > prev.score) best.set(c.url, c);
  }
  return [...best.values()].sort((a, b) => b.score - a.score);
}

/* ------------------------------------------------------------------
   Sniffing — content-type headers are not trustworthy here
   ------------------------------------------------------------------ */

function sniff(buf) {
  if (buf.length < 64) return null;
  const head = buf.subarray(0, 400).toString("latin1").trim();
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP")
    return "webp";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (/^<\?xml|^<svg/i.test(head)) return "svg";
  if (/<svg[\s>]/i.test(head)) return "svg";
  if (/^<!doctype html|^<html/i.test(head)) return null; // an error page
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01) return "ico";
  return null;
}

/** An SVG that is one <use> reference or an empty shell is not a logo. */
function svgLooksReal(buf) {
  const s = buf.toString("utf8");
  return /<(path|circle|rect|polygon|ellipse|text|image|g)\b/i.test(s);
}

async function tryCandidate(c) {
  const got = await get(c.url, { binary: true });
  if (!got) return null;
  const ext = sniff(got.buf);
  if (!ext) return null;
  if (ext === "ico" || ext === "gif") return null; // never crisp enough
  if (ext === "svg" && !svgLooksReal(got.buf)) return null;
  if (ext !== "svg" && got.buf.length < 900) return null; // a 16px stub
  if (got.buf.length > 4_000_000) return null;

  const png = await normalize(got.buf, ext);
  if (!png) return null;

  const stats = await analyse(png).catch(() => null);
  if (!stats) return null;
  // Below ~4% ink this is a glyph or an empty frame, not a mark.
  if (stats.coverage < 0.04) return null;

  return {
    ext: "png",
    buf: png,
    url: c.url,
    kind: c.kind,
    score: c.score,
    from: ext,
    tone: stats.tone,
    coverage: stats.coverage,
    meanLum: stats.meanLum,
  };
}

/* ------------------------------------------------------------------
   Normalize — what the site ships is not what the nav needs
   ------------------------------------------------------------------ */

/**
 * Everything becomes a trimmed PNG at 128px tall.
 *
 * As downloaded, this set ran to 1.3MB: Nanjing ships a 226KB raster
 * and Bashkir a 341KB SVG, both for a slot rendered at 36px. Universal
 * rasterizing also removes a whole class of layout bug — SVGs here
 * arrive with missing viewBoxes and percentage heights that collapse
 * to nothing inside a flex row.
 *
 * `trim` matters more than the resize: most of these marks carry a
 * wide transparent or white margin baked in, which in a fixed box
 * shrinks the visible logo to about half the space it should fill.
 *
 * 128px is ~3.5x the display size, so it stays crisp on a 3x screen.
 */
/**
 * Measures the finished PNG so the tile colour and the reject
 * decision come from the pixels rather than from a guess.
 *
 *   coverage — share of pixels that are not transparent. Capital
 *              Medical's mark covers 20%; a stray UI glyph or an
 *              empty frame covers ~1%, which is how SEU's real logo
 *              was silently replaced by a mail icon.
 *   meanLum  — average luminance of those opaque pixels. Three of
 *              these universities publish a pure-white wordmark for
 *              a dark header; at 255 they are invisible on the white
 *              tile the rest need, so they get a navy one.
 */
async function analyse(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  let lum = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) continue;
    n++;
    lum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  const coverage = n / (info.width * info.height);
  const meanLum = n ? lum / n : 0;
  return { coverage, meanLum, tone: meanLum > 235 ? "dark" : "light" };
}

/**
 * Reduces a `crest + wordmark` lockup to just the crest.
 *
 * Chongqing's logo is 5.4:1, Capital's 3.9:1. Contained in the square
 * tile the menu uses, those render about six pixels tall — a smudge.
 * And the wordmark is redundant anyway: the university's name is set
 * in text immediately to the right of the tile.
 *
 * Nearly every wide logo in this set is emblem-left, text-right, so
 * the leftmost square is the emblem. Two guards keep that from
 * mangling the exceptions: only lockups at 2.5:1 or wider are touched
 * (GAU at 2.1:1 and SEU at 1.9:1 are stacked wordmarks with no
 * separate crest, and survive intact), and a crop that comes back
 * nearly empty — an emblem on the right, or no emblem at all — is
 * discarded in favour of the whole logo.
 */
async function emblem(png) {
  const meta = await sharp(png).metadata();
  if (!meta.width || !meta.height) return null;
  if (meta.width / meta.height < 2.5) return null;

  /* Cut at the whitespace between crest and wordmark, not at a fixed
     square. Kazan's crest is narrower than its height, so a square
     crop kept the first letter and a half of "КФУ" hanging off the
     edge — worse than not cropping. The gap is the real boundary the
     designer put there, so find that instead. */
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  /* Decide what counts as ink before looking at any column.

     Reading the background off the corner pixel is wrong for a
     trimmed transparent PNG, because the trim can leave the corner
     sitting ON the mark. Kazan's is white-on-transparent and its
     corner is white, so "differs from the corner" classified the
     entire logo as background and found no ink at all.

     If a meaningful share of the image is transparent, alpha is the
     signal and colour is irrelevant. Only for a fully opaque image
     (a JPEG on white) does the corner colour mean anything. */
  let clear = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 40) clear++;
  const alphaIsSignal = clear / (W * H) > 0.05;
  const bg = [data[0], data[1], data[2]];
  const isInk = (i) => {
    if (data[i + 3] < 40) return false;
    if (alphaIsSignal) return true;
    return (
      Math.abs(data[i] - bg[0]) > 24 ||
      Math.abs(data[i + 1] - bg[1]) > 24 ||
      Math.abs(data[i + 2] - bg[2]) > 24
    );
  };

  const colInk = new Array(W).fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (isInk((y * W + x) * 4)) colInk[x]++;
    }
  }

  const first = colInk.findIndex((c) => c > 0);
  if (first < 0) return null;

  /* A column is "empty" at up to 2% of the height rather than at
     exactly zero: antialiasing on a descender leaves one or two stray
     pixels in the gutter, and requiring a true zero missed the gap in
     Avicenna's lockup entirely. The gap itself only has to be 1% of
     the width — these gutters are tight. */
  const emptyAt = Math.floor(H * 0.02);
  const gapNeeded = Math.max(3, Math.round(W * 0.01));
  let cut = -1;
  let run = 0;
  for (let x = first; x < W; x++) {
    if (colInk[x] <= emptyAt) {
      run++;
      if (run >= gapNeeded && x - run - first >= H * 0.35) {
        cut = x - run + 1; // keep the gap's leading edge
        break;
      }
    } else {
      run = 0;
    }
  }
  if (cut < 0) return null;

  const cropped = await sharp(png)
    .extract({ left: 0, top: 0, width: cut, height: H })
    .trim({ threshold: 12 })
    .resize({ height: 128, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer()
    .catch(() => null);
  if (!cropped) return null;

  // Reject a crop that is still a wide strip (we cut inside the
  // wordmark) or nearly empty (the crest is not on the left).
  const cm = await sharp(cropped).metadata();
  if (!cm.width || !cm.height || cm.width / cm.height > 1.7) return null;
  const stats = await analyse(cropped).catch(() => null);
  if (!stats || stats.coverage < 0.08) return null;
  return cropped;
}

async function normalize(buf, ext) {
  const density = ext === "svg" ? 384 : 72; // render SVGs large, then downscale
  try {
    const trimmed = await sharp(buf, { density })
      .trim({ threshold: 12 })
      .resize({ height: 128, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const out = (await emblem(trimmed).catch(() => null)) ?? trimmed;
    // A trim that ate the whole image means the mark was uniform —
    // fall back to the untrimmed render rather than shipping nothing.
    const meta = await sharp(out).metadata();
    if (!meta.width || !meta.height || meta.width < 8 || meta.height < 8) {
      return await sharp(buf, { density })
        .resize({ height: 128, fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();
    }
    return out;
  } catch {
    return null; // undecodable — caller keeps looking
  }
}

/* ------------------------------------------------------------------
   Browser fallback — for sites that only serve assets to a session
   ------------------------------------------------------------------ */

let browser = null;

async function browserGrab(home) {
  if (!browser) {
    const [{ default: puppeteer }, { resolveBrowser }] = await Promise.all([
      import("puppeteer-core"),
      import("./browser.mjs"),
    ]);
    browser = await puppeteer.launch({
      executablePath: resolveBrowser().executablePath,
      headless: "new",
      args: ["--no-sandbox", "--disable-gpu", "--ignore-certificate-errors"],
    });
  }

  const page = await browser.newPage();
  try {
    await page.setUserAgent(UA);
    await page.goto(home, { waitUntil: "domcontentloaded", timeout: slowFor(home) || 35000 });
    await new Promise((r) => setTimeout(r, 1800)); // let a JS header mount

    /* Collect resolved src values from the live DOM and download them
       from Node, NOT from inside the page. kpfu.ru serves its header
       logo off stud-new2.kpfu.ru, so an in-page fetch is cross-origin
       and dies on CORS — while the same URL fetched directly is a
       plain 200. Only images that actually decoded (naturalWidth > 0)
       are considered, which drops the site's own broken references. */
    const hits = await page.evaluate(() => {
      const score = (el) => {
        const hay = `${el.getAttribute("src") || ""} ${el.className || ""} ${el.id || ""} ${el.alt || ""}`.toLowerCase();
        const r = el.getBoundingClientRect();
        if (!el.naturalWidth) return -1;
        let s = 0;
        if (/logo|emblem|brand|герб/.test(hay)) s += 50;
        if (r.top < 260) s += 20;
        if (r.width >= 40 && r.width <= 420) s += 15;
        if (/sprite|avatar|banner|photo|slider/.test(hay)) s -= 60;
        return s;
      };

      return [...document.images]
        .map((el) => ({ el, s: score(el) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map(({ el }) => el.currentSrc || el.src)
        .filter((src) => src && !src.startsWith("data:"));
    });

    for (const src of hits) {
      const picked = await tryCandidate({ url: src, kind: "browser", score: 0 });
      if (picked) return { ...picked, kind: "browser" };
    }
    return null;
  } catch {
    return null;
  } finally {
    await page.close().catch(() => {});
  }
}

/* ------------------------------------------------------------------
   Main
   ------------------------------------------------------------------ */

await mkdir(OUT_DIR, { recursive: true });

const existing = existsSync(OUT_DIR) ? await readdir(OUT_DIR) : [];
const results = {};
const failures = [];

for (const [slug, home] of Object.entries(SITES)) {
  if (ONLY && slug !== ONLY) continue;

  const already = existing.find((f) => f.startsWith(`${slug}.`));
  if (already && !FORCE) {
    // Re-measure rather than defaulting to a light tile: tone is a
    // property of the file on disk, and assuming it here would flip
    // the three white wordmarks onto a white tile — invisible — on
    // any run that did not re-download them.
    const cachedTone = await analyse(await readFile(path.join(OUT_DIR, already)))
      .then((s) => s.tone)
      .catch(() => "light");
    results[slug] = {
      file: already,
      source: OVERRIDES[slug] ?? home,
      tone: DARK_TILE.has(slug) ? "dark" : cachedTone,
    };
    console.log(`· ${slug} — cached (${already}, ${cachedTone} tile)`);
    continue;
  }

  process.stdout.write(`→ ${slug} … `);

  let picked = null;
  let nCands = 0;

  // A hand-picked URL wins outright — it exists precisely because
  // the automatic path was wrong here — but still goes through the
  // same download, sniff, normalize and measure as everything else.
  if (OVERRIDES[slug]) {
    picked = await tryCandidate({ url: OVERRIDES[slug], kind: "override", score: 999 });
    if (!picked) process.stdout.write("(override failed) ");
  }

  // Two attempts: these servers time out often enough that a single
  // miss says nothing about whether the site is actually up.
  let page = picked ? null : await get(home, { timeout: slowFor(home) || 20000 });
  if (!picked && !page) page = await get(home, { timeout: slowFor(home) || 35000 });

  if (!picked && page) {
    const cands = candidates(page.text, page.url);
    nCands = cands.length;
    for (const c of cands.slice(0, 8)) {
      picked = await tryCandidate(c);
      if (picked) break;
    }

    // Many CMSes serve these without ever declaring them in <head>.
    if (!picked) {
      for (const p of ["/favicon.svg", "/apple-touch-icon.png", "/favicon-192x192.png"]) {
        picked = await tryCandidate({ url: new URL(p, page.url).href, kind: "icon", score: 0 });
        if (picked) break;
      }
    }
  }

  if (!picked) {
    process.stdout.write("browser… ");
    picked = await browserGrab(home);
  }

  if (!picked) {
    console.log("NO USABLE LOGO");
    failures.push([slug, page ? `no usable candidate among ${nCands}` : "homepage unreachable"]);
    continue;
  }

  const tone = DARK_TILE.has(slug) ? "dark" : picked.tone;

  // Drop any stale extension for this slug before writing the new one.
  for (const f of existing.filter((f) => f.startsWith(`${slug}.`))) {
    await unlink(path.join(OUT_DIR, f)).catch(() => {});
  }

  const file = `${slug}.${picked.ext}`;
  await writeFile(path.join(OUT_DIR, file), picked.buf);
  results[slug] = { file, source: picked.url, bytes: picked.buf.length, kind: picked.kind, tone };
  console.log(
    `${(picked.buf.length / 1024).toFixed(1)}KB ${tone} tile ` +
      `(ink ${(picked.coverage * 100).toFixed(0)}%, lum ${Math.round(picked.meanLum)})  ← ${picked.kind}`,
  );
}

/* ---- manifest ---- */

if (!ONLY) {
  const entries = Object.entries(results)
    .map(
      ([slug, r]) =>
        `  "${slug}": {\n` +
        `    src: "/images/university-logos/${r.file}",\n` +
        `    source: "${r.source}",\n` +
        `    tone: "${r.tone ?? "light"}",\n` +
        `  },`,
    )
    .join("\n");

  const ts = `/* AUTO-GENERATED by scripts/fetch-university-logos.mjs
 * Re-run with:  npm run images:logos -- --force
 *
 * Each logo is the institution's own mark, taken from its own
 * website; \`source\` is the exact URL it came from so any one of
 * them can be re-checked without re-running the whole set.
 *
 * A university missing from this map is NOT an error — the UI falls
 * back to a monogram tile. University of South Asia is absent
 * because usa-kg.com is off the air (no A record).
 *
 * Logos are drawn on a light tile in both themes. Most of these are
 * dark-on-transparent and would vanish against the dark surface.
 */

export interface UniLogo {
  src: string;
  source: string;
  /** Which tile the mark needs behind it to stay visible. */
  tone: "light" | "dark";
}

export const UNIVERSITY_LOGOS: Record<string, UniLogo> = {
${entries}
};

/** Initials for the fallback tile — "Kazan Federal" → "KF".
 *
 *  Joining words are skipped: "University of South Asia" taken
 *  naively gives "UO", which looks like a typo rather than a mark. */
const SKIP = new Set(["of", "the", "and", "for"]);

export function monogram(shortName: string): string {
  const words = shortName
    .replace(/[^\\p{L}\\s-]/gu, "")
    .split(/[\\s-]+/)
    .filter((w) => w && !SKIP.has(w.toLowerCase()));
  if (!words.length) return "??";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
`;
  await writeFile(MANIFEST, ts);
  console.log(`\nmanifest → ${path.relative(ROOT, MANIFEST)}`);
}

if (browser) await browser.close().catch(() => {});

console.log(`\n${Object.keys(results).length}/${Object.keys(SITES).length} logos`);
if (failures.length) {
  console.log("\nfailed:");
  for (const [s, why] of failures) console.log(`  ${s} — ${why}`);
}
