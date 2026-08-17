#!/usr/bin/env node
/**
 * Bakes an equirectangular LAND MASK for the WebGL hero globe.
 *
 *   curl -sSL -o land-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json
 *   node scripts/build-globe-texture.mjs land-50m.json
 *
 * Output: public/brand/globe-land.png — 8-bit greyscale, white = land.
 *
 * Why a mask rather than a photographic Earth texture:
 *   - A NASA Blue Marble tile is 2-6MB and arrives in its own colours,
 *     which then have to be fought back to navy and gold. A one-channel
 *     mask compresses to a fraction of that and lets the fragment
 *     shader paint land, ocean, coast glow and terminator in the site's
 *     own palette — including a different palette per theme, for free.
 *   - The shader derives the coast glow by blurring this mask on the
 *     GPU, so no distance field needs baking or shipping.
 *
 * Why 1:50m rather than the 1:110m set already baked into
 * src/lib/data/land.ts: that file is 3,400 points, simplified for
 * drawing outlines a few hundred pixels wide. Filled and magnified
 * across a sphere it reads as a polygon soup — the Black Sea closes
 * up, the Gulf disappears. 50m is the coarsest set that still looks
 * like Earth at hero size.
 *
 * TopoJSON decode, in full: arcs are quantised integers, delta-encoded
 * after the first point, and mapped back through `transform`. A
 * negative arc index means "traverse arc (-1 - i) backwards".
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { deflateSync } from "node:zlib";

const SRC = process.argv[2] ?? "land-50m.json";
const OUT = process.argv[3] ?? "public/brand/globe-land.png";

/** Texture size, chosen for roughly one texel per device pixel.
 *
 *  The visible hemisphere spans 180 degrees across the sphere's
 *  diameter, so H/2 texels have to cover 2R device pixels. At the
 *  largest the globe is drawn — ~440 CSS px radius, DPR capped at
 *  1.75 in the renderer — that is about 1540 device pixels against
 *  1024 texels: a mild magnification, which is exactly where you
 *  want to be. 4096x2048 was tried first and lands at 2.5x
 *  MINIFICATION instead, which shimmers under rotation unless
 *  mipmaps are generated — and mipmaps put a permanently blurred
 *  seam down the antimeridian, because the wrap makes the texture
 *  derivative there enormous. Smaller is genuinely better here.
 *
 *  Width is twice height, as equirectangular requires. */
const W = 2048;
const H = 1024;
/** Vertical supersampling. Horizontal coverage is computed
 *  analytically from the span ends, so only Y needs subsamples. */
const SS = 4;

/* ------------------------------------------------------------------
   TopoJSON → lon/lat rings
   ------------------------------------------------------------------ */

const topo = JSON.parse(readFileSync(SRC, "utf8"));
const { scale, translate } = topo.transform;

function arcPoints(index) {
  const reversed = index < 0;
  const arc = topo.arcs[reversed ? -1 - index : index];
  let x = 0;
  let y = 0;
  const out = [];
  for (const [dx, dy] of arc) {
    x += dx;
    y += dy;
    out.push([x * scale[0] + translate[0], y * scale[1] + translate[1]]);
  }
  return reversed ? out.reverse() : out;
}

function ringFrom(arcIndexes) {
  const pts = [];
  for (const i of arcIndexes) {
    const seg = arcPoints(i);
    // Arcs share endpoints; drop the duplicate at each join.
    pts.push(...(pts.length ? seg.slice(1) : seg));
  }
  return pts;
}

/** Every ring in the file, outer and hole alike. Holes need no special
 *  handling: the scanline fill below uses the even-odd rule, so a ring
 *  nested inside another subtracts itself. */
const rings = [];
function collect(geom) {
  if (!geom) return;
  if (geom.type === "GeometryCollection") {
    geom.geometries.forEach(collect);
  } else if (geom.type === "Polygon") {
    for (const r of geom.arcs) rings.push(ringFrom(r));
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.arcs) for (const r of poly) rings.push(ringFrom(r));
  }
}
collect(topo.objects.land ?? Object.values(topo.objects)[0]);

/* ------------------------------------------------------------------
   Rasterise, equirectangular
   ------------------------------------------------------------------ */

const SUBROWS = H * SS;
const lonToX = (lon) => ((lon + 180) / 360) * W;
const latToY = (lat) => ((90 - lat) / 180) * SUBROWS;

/** Edges bucketed by the subrows they span, so each scanline tests a
 *  few dozen edges instead of all ~130,000. */
const buckets = Array.from({ length: SUBROWS }, () => []);
let edgeCount = 0;
let wrapped = 0;

function emitRing(pts, lonShift) {
  for (let i = 0; i < pts.length - 1; i++) {
    const x0 = lonToX(pts[i][0] + lonShift);
    const y0 = latToY(pts[i][1]);
    const x1 = lonToX(pts[i + 1][0] + lonShift);
    const y1 = latToY(pts[i + 1][1]);
    if (y0 === y1) continue; // horizontal edges never cross a scanline
    const lo = Math.max(0, Math.floor(Math.min(y0, y1)));
    const hi = Math.min(SUBROWS - 1, Math.ceil(Math.max(y0, y1)));
    if (hi < lo) continue;
    const e = { x0, y0, x1, y1 };
    for (let b = lo; b <= hi; b++) buckets[b].push(e);
    edgeCount++;
  }
}

for (const ring of rings) {
  /* Unwrap longitude before rasterising.
     A handful of features straddle the antimeridian — Fiji, Wrangel,
     Chukotka — and world-atlas stores them with points at both -180
     and +180. Read literally in equirectangular space those rings
     stretch across the entire map, and the even-odd fill then paints a
     white band right around the world at that latitude. Accumulating
     the deltas instead lets the ring run continuously past 180, after
     which it is drawn once per 360-degree offset that still touches
     the map and the span clipper discards the rest. */
  const pts = [ring[0]];
  let lon = ring[0][0];
  let min = lon;
  let max = lon;
  for (let i = 1; i < ring.length; i++) {
    let d = ring[i][0] - ring[i - 1][0];
    if (d > 180) d -= 360;
    else if (d < -180) d += 360;
    lon += d;
    if (lon < min) min = lon;
    if (lon > max) max = lon;
    pts.push([lon, ring[i][1]]);
  }
  // A ring must close, or the scanline fill leaks along its open edge.
  const a = pts[0];
  const b = pts[pts.length - 1];
  if (a[0] !== b[0] || a[1] !== b[1]) pts.push([a[0], a[1]]);

  let copies = 0;
  for (const shift of [-360, 0, 360]) {
    if (max + shift < -180 || min + shift > 180) continue;
    emitRing(pts, shift);
    copies++;
  }
  if (copies > 1) wrapped++;
}

const pixels = Buffer.alloc(W * H);
const acc = new Float32Array(W);
const xs = [];

/** Add [a,b) horizontal coverage to the accumulator, with fractional
 *  weight at both ends so coastlines are antialiased in X. */
function addSpan(a, b) {
  if (b <= a) return;
  a = Math.max(0, a);
  b = Math.min(W, b);
  if (b <= a) return;
  const ia = Math.floor(a);
  const ib = Math.floor(b);
  if (ia === ib) {
    acc[ia] += b - a;
    return;
  }
  acc[ia] += ia + 1 - a;
  for (let i = ia + 1; i < ib; i++) acc[i] += 1;
  if (ib < W) acc[ib] += b - ib;
}

for (let row = 0; row < H; row++) {
  acc.fill(0);
  for (let s = 0; s < SS; s++) {
    const sy = row * SS + s + 0.5;
    xs.length = 0;
    for (const e of buckets[row * SS + s]) {
      // Half-open test on Y, so a vertex shared by two edges is
      // counted once and the fill never leaks.
      if (e.y0 <= sy === e.y1 <= sy) continue;
      xs.push(e.x0 + ((sy - e.y0) / (e.y1 - e.y0)) * (e.x1 - e.x0));
    }
    if (xs.length < 2) continue;
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) addSpan(xs[i], xs[i + 1]);
  }
  const base = row * W;
  const inv = 255 / SS;
  for (let x = 0; x < W; x++) {
    const v = acc[x] * inv;
    pixels[base + x] = v > 255 ? 255 : v < 0 ? 0 : Math.round(v);
  }
}

/* ------------------------------------------------------------------
   Greyscale PNG encoder
   ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 0; // colour type 0 = greyscale
// 10..12 = compression, filter, interlace — all zero

/* Filter 1 (Sub) turns the long flat runs of ocean and inland into
   runs of zero bytes, which deflate then collapses. Measured at about
   a third the size of unfiltered. */
const raw = Buffer.alloc(H * (W + 1));
for (let y = 0; y < H; y++) {
  const o = y * (W + 1);
  raw[o] = 1;
  const base = y * W;
  raw[o + 1] = pixels[base];
  for (let x = 1; x < W; x++) raw[o + 1 + x] = (pixels[base + x] - pixels[base + x - 1]) & 0xff;
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);

let land = 0;
for (let i = 0; i < pixels.length; i++) land += pixels[i];
console.log(
  `${OUT}  ${W}x${H}  ${(png.length / 1024).toFixed(0)} KB  ` +
    `${rings.length} rings (${wrapped} wrapped) / ${edgeCount} edges  ` +
    `land ${((land / 255 / pixels.length) * 100).toFixed(1)}%`,
);
