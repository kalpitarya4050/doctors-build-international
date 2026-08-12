#!/usr/bin/env node
/**
 * Shrinks everything in public/images in place.
 *
 *   npm run images:compress
 *
 * On a Node host, next/image resizes and re-encodes on the fly. A
 * static host (GitHub Pages) serves whatever is on disk, so the raw
 * Pexels downloads — some over 2MB — would be shipped to phones as-is.
 * This caps them at 1600px wide and re-encodes at quality 78, which
 * takes the set from ~47MB to roughly a third of that with no visible
 * difference at the sizes we actually display.
 *
 * Idempotent: an already-compressed file is skipped, so re-running is
 * safe and cheap.
 */

import { readdir, stat, rename, unlink, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "images");
const LEDGER = path.join(DIR, ".compressed.json");

const MAX_WIDTH = 1600;
const QUALITY = 78;

const c = {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function run() {
  if (!existsSync(DIR)) {
    console.log("No public/images yet — run `npm run images` first.");
    return;
  }

  let done = {};
  if (existsSync(LEDGER)) {
    try {
      done = JSON.parse(await readFile(LEDGER, "utf8"));
    } catch {
      done = {};
    }
  }

  const files = await walk(DIR);
  let before = 0;
  let after = 0;
  let touched = 0;
  let skipped = 0;

  console.log(`\n${c.cyan(`▸ Compressing ${files.length} images (max ${MAX_WIDTH}px, q${QUALITY})`)}\n`);

  for (const file of files) {
    const rel = path.relative(DIR, file).split(path.sep).join("/");
    const size = (await stat(file)).size;
    before += size;

    if (done[rel] === size) {
      after += size;
      skipped++;
      continue;
    }

    const tmp = `${file}.tmp`;
    try {
      await sharp(file)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
        .toFile(tmp);

      const newSize = (await stat(tmp)).size;

      if (newSize < size) {
        await unlink(file);
        await rename(tmp, file);
        after += newSize;
        done[rel] = newSize;
        touched++;
        if (size - newSize > 200_000) {
          console.log(
            `  ${c.green("✓")} ${rel.padEnd(58)} ${c.dim(
              `${(size / 1048576).toFixed(1)}MB → ${(newSize / 1048576).toFixed(1)}MB`,
            )}`,
          );
        }
      } else {
        // Already smaller than we'd produce — keep the original.
        await unlink(tmp);
        after += size;
        done[rel] = size;
        skipped++;
      }
    } catch (err) {
      console.log(`  ✗ ${rel}: ${err.message}`);
      after += size;
      if (existsSync(tmp)) await unlink(tmp).catch(() => {});
    }
  }

  await writeFile(LEDGER, JSON.stringify(done, null, 2));

  console.log(
    `\n${c.green("▸ Done.")} ${touched} compressed, ${skipped} already optimal.\n` +
      `  ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB ` +
      `(${(100 - (after / before) * 100).toFixed(0)}% smaller)\n`,
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
