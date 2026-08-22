#!/usr/bin/env node
/**
 * Cuts the shield-and-doctor emblem out of the full brand lockup.
 *
 *   node scripts/extract-logo-mark.mjs
 *
 * The source (loho.PNG) is the complete circular logo: monogram,
 * globe, aeroplane, wordmark, and — at its centre — the gold shield
 * with the doctor inside. Only that shield is the app mark.
 *
 * WHY THIS IS NOT A PLAIN CROP
 *
 * The shield sits on near-black artwork and its own interior is also
 * near-black, so no colour threshold separates the two: a crop keeps
 * a black box around the emblem, which reads as a dark rectangle on
 * the light header. The gold border is the only real boundary.
 *
 * The outline was measured off the source by scanning for gold
 * (r>150, r−b>90) row by row. Those measurements are the constants
 * below: the emblem spans x 432–745 and y 515–848, is symmetric
 * about x 588.5, runs straight down to y 645 and then curves to a
 * point. SHIELD is that outline redrawn as a path and used as an
 * alpha mask, so what leaves here is the emblem on transparency.
 *
 * The path is deliberately inset a few px from the measured edge.
 * Erring inward loses a sliver of gold; erring outward would ring
 * the mark with the navy it was cut from, which is the one artefact
 * that would be obvious against a white header.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.resolve(ROOT, "../loho.PNG");

/* ------------------------------------------------------------------
   THE OUTLINE, MEASURED OFF THE SOURCE.

   The first version of this cut the shield off with a flat top at
   y=515. It is not flat: the shield has a curved crown that peaks at
   y=449, a full 66px higher, and lopping it left a shield with its
   head sawn off. The rows between 449 and 517 had been dismissed as
   the monogram behind it — they were the crown.

   CROWN is the left and right outer edge of the gold, read row by
   row off the artwork. Both sides are recorded rather than one
   mirrored, because the emblem carries a slight 3D bevel: the midline
   sits at x 593 at the apex and drifts to 588.5 by the shoulders.
   Mirroring one side would straighten a crown that is deliberately
   not straight.
   ------------------------------------------------------------------ */

/** [y, leftEdge, rightEdge] down the crown, apex to shoulder. */
const CROWN = [
  [449, 593, 594], [453, 588, 598], [457, 584, 603], [461, 579, 605],
  [465, 578, 608], [469, 573, 613], [473, 567, 619], [477, 561, 624],
  [481, 555, 631], [485, 547, 638], [489, 539, 645], [493, 530, 653],
  [497, 521, 662], [501, 510, 671], [505, 498, 684], [509, 483, 696],
  [513, 464, 714], [517, 436, 741], [520, 432, 745],
];

const SIDE_L = 432;        // straight flanks, constant for 125 rows
const SIDE_R = 745;
const FLANK_TOP = 520;
const FLANK_BOTTOM = 645;
const TIP = { x: 588.5, y: 848 };

/* The lower taper, one cubic per side. Controls fitted to the scanned
   edge: it leaves the flank almost vertically, then turns hard into
   the point. */
const CURVE_L = [[SIDE_L, FLANK_BOTTOM], [432, 720], [537, 847], [TIP.x, TIP.y]];
const CURVE_R = [[SIDE_R, FLANK_BOTTOM], [745, 720], [640, 847], [TIP.x, TIP.y]];

/** What the outline occupies in the source. */
const BOX = { left: 432, top: 449, width: 314, height: 400 };

/** Inset applied to the whole outline before masking. Erring inward
 *  loses a sliver of gold; erring outward rings the mark with the
 *  navy it was cut from, which is the artefact that would actually
 *  show against the white header. */
const INSET = 3;

function cubic([p0, p1, p2, p3], steps) {
  const pts = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    pts.push([
      u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
      u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1],
    ]);
  }
  return pts;
}

/** The closed outline, clockwise from the apex. */
function outline() {
  const left = CROWN.map(([y, xl]) => [xl, y]);
  const right = CROWN.map(([y, , xr]) => [xr, y]).reverse();
  return [
    ...left,
    [SIDE_L, FLANK_TOP], [SIDE_L, FLANK_BOTTOM],
    ...cubic(CURVE_L, 26),
    ...cubic(CURVE_R, 26).reverse(),
    [SIDE_R, FLANK_BOTTOM], [SIDE_R, FLANK_TOP],
    ...right,
  ];
}

/** Shrinks the outline by stepping every vertex toward the centroid.
 *  The shape is star-shaped about its centre, so a fixed step erodes
 *  it evenly enough at this scale. */
function insetPoly(points, d) {
  const cx = points.reduce((a, p) => a + p[0], 0) / points.length;
  const cy = points.reduce((a, p) => a + p[1], 0) / points.length;
  return points.map(([x, y]) => {
    const dx = cx - x, dy = cy - y;
    const len = Math.hypot(dx, dy) || 1;
    return [x + (dx / len) * d, y + (dy / len) * d];
  });
}
/* The mark is drawn from 36px in the header up to 128px in the intro,
   so 512 covers every use at 2x.

   WebP, not PNG, and the difference is not marginal: this is a
   photograph inside a shield, and lossless PNG of a photograph is
   495KB — for a graphic that renders 36px wide in the header of every
   page on the site. WebP at q86 is 43KB with the alpha channel
   intact. A PNG copy stays for the favicon and anything that cannot
   take WebP. */
const SIZES = [
  { w: 512, out: "brand/logo-mark.webp", webp: true },
  { w: 256, out: "brand/logo-mark.png", palette: true },
];

/** Packs PNG buffers into a single .ico.
 *
 *  Windows' own icon format, but every browser reads it, and it is
 *  the one file Next serves from src/app/favicon.ico. The directory
 *  header is 6 bytes, then 16 per image; a side of 256 is written as
 *  0, which is the format's way of saying "not 1..255".
 *
 *  Modern .ico allows the payload to be a PNG rather than a DIB, so
 *  the buffers go in untouched and the alpha channel survives. */
function buildIco(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // 1 = icon
  head.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const dir = [];
  for (const { size, buf } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    dir.push(e);
  }
  return Buffer.concat([head, ...dir, ...images.map((i) => i.buf)]);
}

/** Bounding box of everything at least half opaque. */
async function alphaBox(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minX = W, maxX = -1, minY = H, maxY = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > 127) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function run() {
  if (!existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }

  const poly = insetPoly(outline(), INSET)
    .map(([x, y]) => `${(x - BOX.left).toFixed(2)},${(y - BOX.top).toFixed(2)}`)
    .join(" ");

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BOX.width}" height="${BOX.height}">
       <polygon points="${poly}" fill="#fff"/>
     </svg>`,
  );

  // dest-in keeps the crop only where the mask is opaque.
  const masked = await sharp(SRC)
    .extract(BOX)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  /* Trim to the alpha bounding box. The inset mask leaves a few
     transparent rows and columns around the emblem, and a mark with
     invisible padding baked in sizes unpredictably in CSS — `size-9`
     would render an 8px-smaller shield than it claims. */
  const cut = await sharp(masked).extract(await alphaBox(masked)).png().toBuffer();

  for (const spec of SIZES) {
    const { w, out } = spec;
    const to = path.join(ROOT, "public", "images", out);
    await mkdir(path.dirname(to), { recursive: true });
    let pipe = sharp(cut).resize({ width: w, fit: "inside", withoutEnlargement: false });
    pipe = spec.webp
      ? pipe.webp({ quality: 86, alphaQuality: 100 })
      : pipe.png({ compressionLevel: 9, palette: spec.palette === true, quality: 90 });
    const buf = await pipe.toBuffer();
    await writeFile(to, buf);
    const meta = await sharp(buf).metadata();
    console.log(`  ok  ${out.padEnd(26)} ${meta.width}x${meta.height}  ${Math.round(buf.length / 1024)}KB`);
  }

  /* The favicon. The one that shipped was Next's default triangle
     placeholder — never replaced, so every tab showed the framework's
     mark rather than the client's. The emblem is taller than it is
     wide, so it is padded to square rather than squashed to fit. */
  const ico = buildIco(
    await Promise.all(
      [16, 32, 48, 64].map(async (size) => ({
        size,
        buf: await sharp({
          create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
        })
          .composite([
            {
              input: await sharp(cut).resize({ width: size, height: size, fit: "inside" }).png().toBuffer(),
              gravity: "centre",
            },
          ])
          .png({ compressionLevel: 9 })
          .toBuffer(),
      })),
    ),
  );
  const icoPath = path.join(ROOT, "src", "app", "favicon.ico");
  await writeFile(icoPath, ico);
  console.log(`  ok  ${"src/app/favicon.ico".padEnd(26)} 16-64px       ${Math.round(ico.length / 1024)}KB`);
}

run();
