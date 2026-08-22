#!/usr/bin/env node
/**
 * Ingests the client's own photography into public/images/owned/.
 *
 *   node scripts/ingest-owned-photos.mjs
 *   node scripts/ingest-owned-photos.mjs --source="../Upload Material"
 *
 * WHY A SEPARATE TREE
 *
 * `npm run images:universities` rewrites public/images/universities/**
 * from Pexels every time it runs. Photography the client actually owns
 * must never live somewhere a fetch script can overwrite it, so it
 * lands in public/images/owned/** instead — a tree no generator
 * touches — and is registered by hand in src/lib/data/owned-photos.ts.
 *
 * WHAT IT DOES
 *
 * Caps each image at maxWidth, re-encodes at quality 78 (the same
 * settings `npm run images:compress` applies to everything else, so a
 * later compress pass is a no-op), and prints the width, height and
 * average colour of each result. Those three values go straight into
 * the registry — avgColor is the placeholder tint behind an image
 * that has not decoded yet, so a wrong one shows as a colour flash.
 *
 * Source phones shoot 4032px JPEGs at 4–10MB. On a static host that
 * is what a family on a 4G connection downloads, so nothing gets
 * shipped un-resized.
 *
 * Idempotent: re-running overwrites the same outputs with the same
 * bytes. Adding a university is a data edit to MANIFEST below, not a
 * code change.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const SOURCE = path.resolve(
  ROOT,
  args.find((a) => a.startsWith("--source="))?.slice(9) ?? "../Upload Material",
);

/* Gallery tiles are shown at most a half-viewport wide and open in a
   lightbox at 90vw, so 1600px covers both without shipping a 4000px
   original. Portraits are capped on height instead — a 1600px-wide
   portrait is 2100px tall and much heavier than it looks. */
const WIDE = { maxWidth: 1600 };
const TALL = { maxHeight: 1400 };

const MANIFEST = [
  /* ---- North Caucasian State Academy, Cherkessk -----------------
     The client's own photographs. Every one of these is genuinely
     NCSA or its students; nothing here is illustrative. */
  {
    id: "ncsa-campus",
    from: "North Caucasian State Academy/NCSA Promotional Material/NCSA Sports/Cricket/(2).jpeg",
    to: "owned/north-caucasian-state-academy/campus-grounds.jpg",
    ...WIDE,
  },
  {
    id: "ncsa-sports-complex",
    from: "North Caucasian State Academy/NCSA Promotional Material/NCSA Sports/Cricket/(1).jpeg",
    to: "owned/north-caucasian-state-academy/sports-complex.jpg",
    ...TALL,
  },
  {
    id: "ncsa-students",
    from: "North Caucasian State Academy/NCSA Promotional Material/NCSA Sports/Cricket/(10).jpeg",
    to: "owned/north-caucasian-state-academy/indian-students.jpg",
    ...WIDE,
  },
  {
    id: "ncsa-freshers",
    from: "North Caucasian State Academy/NCSA Promotional Material/NCSA Freshers/Photos/photo_5429523748542417871_y.jpg",
    to: "owned/north-caucasian-state-academy/freshers-evening.jpg",
    ...WIDE,
  },
  {
    id: "ncsa-festival",
    from: "North Caucasian State Academy/NCSA Promotional Material/NCSA Festivals/.jpeg",
    to: "owned/north-caucasian-state-academy/festival.jpg",
    ...TALL,
  },

  /* ---- Partnership photography, used on /about ----------------- */
  {
    /* The same handshake, cut to a portrait for the oval frame on the
       home page. Cropping here rather than with object-position means
       the browser is not asked to upscale a downscaled photo to zoom
       in: this is the full-resolution original, cut head-to-hip at
       4:5 so both faces and the handshake carry the frame. */
    id: "dbi-dean-portrait",
    from: "Russia/North caucasian cherkessk/IMG-20260820-WA0008.jpg",
    to: "owned/dbi/ncsa-dean-portrait.jpg",
    crop: { left: 249, top: 160, width: 666, height: 832 },
    maxWidth: 900,
  },
  {
    id: "dbi-dean-welcome",
    from: "Russia/North caucasian cherkessk/IMG-20260820-WA0001.jpg",
    to: "owned/dbi/ncsa-dean-welcome.jpg",
    ...TALL,
  },
  {
    id: "dbi-dean-handshake",
    from: "Russia/North caucasian cherkessk/IMG-20260820-WA0008.jpg",
    to: "owned/dbi/ncsa-dean-handshake.jpg",
    ...TALL,
  },

  /* ---- Institution mark ----------------------------------------
     Stays PNG: the crest is dark maroon on transparency and is drawn
     over a light tile, which a JPEG's opaque box would break. */
  {
    id: "ncsa-logo",
    from: "North Caucasian State Academy/NCSA Logo/.png",
    to: "university-logos/north-caucasian-state-academy.png",
    maxWidth: 512,
    png: true,
  },
];

const hex = (n) => n.toString(16).padStart(2, "0");

async function run() {
  if (!existsSync(SOURCE)) {
    console.error(`Source folder not found: ${SOURCE}`);
    process.exit(1);
  }

  const results = [];
  for (const item of MANIFEST) {
    const from = path.join(SOURCE, item.from);
    if (!existsSync(from)) {
      console.error(`  MISSING  ${item.id}  <-  ${item.from}`);
      process.exitCode = 1;
      continue;
    }
    const to = path.join(ROOT, "public", "images", item.to);
    await mkdir(path.dirname(to), { recursive: true });

    // `withoutEnlargement` matters: several of these are already
    // smaller than the cap and upscaling would only add weight.
    let pipe = sharp(from).rotate();
    if (item.crop) pipe = pipe.extract(item.crop);
    pipe = pipe.resize({
      width: item.maxWidth,
      height: item.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
    pipe = item.png ? pipe.png({ compressionLevel: 9 }) : pipe.jpeg({ quality: 78, mozjpeg: true });

    const buf = await pipe.toBuffer();
    await writeFile(to, buf);

    const meta = await sharp(buf).metadata();
    /* The MEAN of each channel, not sharp's `dominant`. Dominant
       returns the most common single colour, which on a stage shot or
       a night photo is near-black even when the picture reads bright —
       and this value is painted behind the image while it decodes, so
       a wrong one shows as a dark flash before the photo appears. */
    const { channels } = await sharp(buf).stats();
    const [r, g, b] = channels.slice(0, 3).map((c) => Math.round(c.mean));
    const avgColor = `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();

    results.push({
      id: item.id,
      src: `/images/${item.to}`,
      width: meta.width,
      height: meta.height,
      avgColor,
      kb: Math.round(buf.length / 1024),
    });
    console.log(
      `  ok  ${item.id.padEnd(22)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ${String(results.at(-1).kb).padStart(5)}KB  ${avgColor}`,
    );
  }

  console.log("\nRegistry values:\n");
  console.log(JSON.stringify(results, null, 2));
}

run();
