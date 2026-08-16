#!/usr/bin/env node
/**
 * Bakes Natural Earth 110m land outlines into a static source file.
 *
 *   node scripts/build-land.mjs
 *
 * Why bake rather than fetch at runtime:
 *   - `world-atlas` ships TopoJSON, which needs `topojson-client` to
 *     decode and `d3-geo` to project — ~60KB of runtime dependency for
 *     a decorative hero graphic.
 *   - The globe already does its own orthographic projection
 *     (toCartesian + rotateY/rotateX in Globe.tsx), so all it actually
 *     needs is lon/lat rings.
 *   - A baked file costs one static import and no network request on a
 *     page that already pulls 35 images.
 *
 * TopoJSON decode, in full: arcs are quantised integers, delta-encoded
 * after the first point, and mapped back through `transform`. A
 * negative arc index means "traverse arc (-1 - i) backwards".
 */

import { readFileSync, writeFileSync } from "node:fs";

const SRC = process.argv[2] ?? "land-110m.json";
const OUT = "src/lib/data/land.ts";

/** Drop points closer than this (degrees) to the previous kept point.
 *  At globe size a 110m outline is already far finer than the screen
 *  can show; this roughly halves the payload with no visible loss. */
const MIN_STEP = 0.9;
/** Rings smaller than this bounding box are islands that render as a
 *  single pixel. Keeping them costs bytes and draws nothing. */
const MIN_SPAN = 3.2;

const topo = JSON.parse(readFileSync(SRC, "utf8"));
const { scale, translate } = topo.transform;

/** Decode one arc index into absolute [lon, lat] pairs. */
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

function simplify(ring) {
  const out = [];
  let last = null;
  for (const p of ring) {
    if (!last || Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) >= MIN_STEP) {
      out.push(p);
      last = p;
    }
  }
  // A ring needs to close and needs enough points to still be a shape.
  if (out.length < 4) return null;
  out.push(out[0]);
  return out;
}

function span(ring) {
  let minX = 180, maxX = -180, minY = 90, maxY = -90;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return Math.max(maxX - minX, maxY - minY);
}

const rings = [];
for (const geom of topo.objects.land.geometries) {
  const polys = geom.type === "Polygon" ? [geom.arcs] : geom.arcs;
  for (const poly of polys) {
    // poly[0] is the outer ring; holes (lakes) are dropped — at this
    // size they are noise, and the globe is not a reference map.
    const ring = simplify(ringFrom(poly[0]));
    if (ring && span(ring) >= MIN_SPAN) rings.push(ring);
  }
}

rings.sort((a, b) => b.length - a.length);

// One decimal is ~11km at the equator — well under a pixel here, and
// it keeps the file a third of the size of full precision.
const body = rings
  .map((r) => `[${r.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(",")}]`)
  .join(",\n  ");

const file = `/* GENERATED — do not edit by hand.
 * Run \`node scripts/build-land.mjs land-110m.json\` to rebuild.
 *
 * Natural Earth 1:110m land outlines (public domain), decoded from
 * world-atlas TopoJSON and flattened to lon/lat rings so the globe can
 * project them with the orthographic maths it already has.
 *
 * ${rings.length} rings, ${rings.reduce((n, r) => n + r.length, 0)} points.
 */
export const LAND: number[][] = [
  ${body},
];
`;

writeFileSync(OUT, file);
const kb = (Buffer.byteLength(file) / 1024).toFixed(1);
console.log(`${OUT}: ${rings.length} rings, ${rings.reduce((n, r) => n + r.length, 0)} points, ${kb}KB`);
