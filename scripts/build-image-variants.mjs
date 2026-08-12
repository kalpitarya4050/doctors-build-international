#!/usr/bin/env node
/**
 * Emits responsive WebP variants for every image.
 *
 *   npm run images:variants
 *   npm run images:variants -- --force
 *
 * On a Node host, next/image resizes and re-encodes per request. A
 * static export cannot, so `unoptimized` is normally the only option —
 * and that ships a 1600px JPEG into a 218px card. Measured: 5MB of
 * images on the homepage alone, most of it thrown away by the browser.
 *
 * Instead we pre-render the widths ahead of time and point next/image
 * at them through a custom loader (src/lib/image-loader.ts). Next then
 * emits a normal srcset and the browser picks the smallest file that
 * covers its slot — the same outcome as server-side optimisation, just
 * computed at build time.
 *
 * Idempotent: variants whose source has not changed are skipped.
 */

import { readdir, stat, writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const LEDGER = path.join(PUBLIC, "images", ".variants.json");

/** Must match `deviceSizes` + `imageSizes` in next.config.ts, or Next
 *  will request a width that was never generated. */
export const WIDTHS = [320, 480, 640, 828, 1200, 1600];
const QUALITY = 72;

/** Directories under public/ whose images should get variants. */
const DIRS = ["images", "brand"];

const c = {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

const FORCE = process.argv.includes("--force");

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    // Never treat an already-generated variant as a source.
    else if (/\.(jpe?g|png)$/i.test(e.name) && !/-\d+w\.webp$/.test(e.name)) out.push(full);
  }
  return out;
}

async function run() {
  const files = [];
  for (const d of DIRS) files.push(...(await walk(path.join(PUBLIC, d))));

  let ledger = {};
  if (existsSync(LEDGER) && !FORCE) {
    try {
      ledger = JSON.parse(await readFile(LEDGER, "utf8"));
    } catch {
      ledger = {};
    }
  }

  console.log(
    `\n${c.cyan(`▸ Building WebP variants for ${files.length} images`)} ${c.dim(`(${WIDTHS.join(", ")}px @ q${QUALITY})`)}\n`,
  );

  let made = 0;
  let skipped = 0;
  let sourceBytes = 0;
  let variantBytes = 0;

  for (const file of files) {
    const rel = path.relative(PUBLIC, file).split(path.sep).join("/");
    const size = (await stat(file)).size;
    sourceBytes += size;

    const meta = await sharp(file).metadata();
    const maxW = meta.width ?? 1600;
    // Never upscale — a 900px source gets variants up to 900px only.
    const targets = WIDTHS.filter((w) => w <= maxW);
    if (targets.length === 0) targets.push(maxW);

    const key = `${rel}:${size}`;
    if (ledger[key] && !FORCE) {
      skipped++;
      variantBytes += ledger[key];
      continue;
    }

    let produced = 0;
    for (const w of targets) {
      const out = file.replace(/\.(jpe?g|png)$/i, `-${w}w.webp`);
      await mkdir(path.dirname(out), { recursive: true });
      await sharp(file)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(out);
      produced += (await stat(out)).size;
    }

    ledger[key] = produced;
    variantBytes += produced;
    made++;
    if (made % 25 === 0) console.log(c.dim(`  …${made} done`));
  }

  await writeFile(LEDGER, JSON.stringify(ledger, null, 2));

  console.log(
    `\n${c.green("▸ Done.")} ${made} images processed, ${skipped} unchanged.\n` +
      `  sources ${(sourceBytes / 1048576).toFixed(1)}MB → variants ${(variantBytes / 1048576).toFixed(1)}MB total\n` +
      `  (a phone downloads ONE variant per image, not all of them)\n`,
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
