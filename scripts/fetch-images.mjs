#!/usr/bin/env node
/**
 * Pulls the site's photography from Pexels and writes a typed manifest.
 *
 *   npm run images          # fetch anything missing
 *   npm run images -- --force   # refetch everything
 *   npm run images -- --only=georgia,hero-students
 *
 * Needs PEXELS_API_KEY in .env.local. Free key: https://www.pexels.com/api/new/
 *
 * Every image is downloaded locally into public/images so the site has no
 * runtime dependency on Pexels and no external requests at page load.
 * Photographer credit is recorded in the manifest — Pexels asks for
 * attribution, and it is rendered in the footer.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "lib", "data", "images.ts");

/* ------------------------------------------------------------------ */
/* Slots. `q` is the Pexels query; `pick` selects which result to take,
   so two slots sharing a query do not land on the same photo.
   `orientation` and `alt` are set per slot.                            */
/* ------------------------------------------------------------------ */

const SLOTS = [
  /* ---------- Destinations: real places, captioned as places ---------- */
  { id: "country-georgia", q: "Tbilisi Georgia city", pick: 0, orientation: "landscape", alt: "Tbilisi, the capital of Georgia" },
  { id: "country-georgia-alt", q: "Georgia Caucasus mountains", pick: 1, orientation: "landscape", alt: "The Caucasus mountains in Georgia" },
  { id: "country-russia", q: "Russia city architecture", pick: 0, orientation: "landscape", alt: "Russian city architecture" },
  { id: "country-russia-alt", q: "Russia winter street", pick: 2, orientation: "landscape", alt: "A Russian street in winter" },
  { id: "country-kyrgyzstan", q: "Kyrgyzstan mountains landscape", pick: 0, orientation: "landscape", alt: "Mountain landscape in Kyrgyzstan" },
  { id: "country-kyrgyzstan-alt", q: "Bishkek Kyrgyzstan", pick: 0, orientation: "landscape", alt: "Bishkek, the capital of Kyrgyzstan" },
  { id: "country-nepal", q: "Kathmandu Nepal temple", pick: 0, orientation: "landscape", alt: "Kathmandu, Nepal" },
  { id: "country-nepal-alt", q: "Himalaya Nepal mountains", pick: 1, orientation: "landscape", alt: "The Himalayas in Nepal" },
  { id: "country-china", q: "China city skyline", pick: 0, orientation: "landscape", alt: "A city skyline in China" },
  { id: "country-china-alt", q: "China traditional architecture", pick: 1, orientation: "landscape", alt: "Traditional architecture in China" },
  { id: "country-kazakhstan", q: "Kazakhstan city architecture", pick: 0, orientation: "landscape", alt: "Modern architecture in Kazakhstan" },
  { id: "country-kazakhstan-alt", q: "Kazakhstan steppe landscape", pick: 1, orientation: "landscape", alt: "The Kazakh steppe" },

  /* ---------- University slots: the host city, captioned as the city ---------- */
  { id: "uni-geomedi", q: "Tbilisi old town street", pick: 1, orientation: "landscape", alt: "Tbilisi, Georgia — where GEOMEDI University is located" },
  { id: "uni-kemerovo", q: "Siberia Russia city winter", pick: 0, orientation: "landscape", alt: "Kemerovo region, Siberia, Russia" },
  { id: "uni-north-caucasian", q: "Caucasus mountains Russia village", pick: 0, orientation: "landscape", alt: "The North Caucasus region of Russia" },
  { id: "uni-ingush", q: "modern city architecture Russia", pick: 3, orientation: "landscape", alt: "Magas, Republic of Ingushetia, Russia" },
  { id: "uni-south-asia", q: "Kyrgyzstan city mountains", pick: 2, orientation: "landscape", alt: "Bishkek, Kyrgyzstan" },
  { id: "uni-nepal", q: "Nepal city Kathmandu valley", pick: 2, orientation: "landscape", alt: "Kathmandu valley, Nepal" },

  /* ---------- Hero + editorial ---------- */
  { id: "hero-students", q: "medical students group white coat", pick: 0, orientation: "landscape", alt: "Medical students in white coats" },
  { id: "hero-doctor", q: "young doctor stethoscope portrait", pick: 0, orientation: "portrait", alt: "A doctor with a stethoscope" },
  { id: "students-campus", q: "university students walking campus", pick: 0, orientation: "landscape", alt: "Students walking across a university campus" },
  { id: "students-study", q: "students studying together library", pick: 0, orientation: "landscape", alt: "Students studying together in a library" },
  { id: "lecture-hall", q: "university lecture hall students", pick: 0, orientation: "landscape", alt: "A university lecture hall" },
  { id: "library", q: "university library books shelves", pick: 1, orientation: "landscape", alt: "A university library" },
  { id: "graduation", q: "graduation ceremony cap gown", pick: 0, orientation: "landscape", alt: "A graduation ceremony" },

  /* ---------- Clinical ---------- */
  { id: "clinical-training", q: "medical students hospital training", pick: 0, orientation: "landscape", alt: "Medical students during clinical training" },
  { id: "laboratory", q: "medical laboratory microscope research", pick: 0, orientation: "landscape", alt: "A medical research laboratory" },
  { id: "hospital-ward", q: "hospital corridor modern", pick: 0, orientation: "landscape", alt: "A modern hospital corridor" },
  { id: "anatomy", q: "anatomy model medical education", pick: 0, orientation: "landscape", alt: "Anatomy teaching model" },
  { id: "surgery", q: "surgeons operating theatre", pick: 0, orientation: "landscape", alt: "Surgeons in an operating theatre" },
  { id: "stethoscope", q: "stethoscope medical desk", pick: 0, orientation: "landscape", alt: "A stethoscope on a desk" },

  /* ---------- Service / process ---------- */
  { id: "counselling", q: "counsellor meeting student desk", pick: 0, orientation: "landscape", alt: "A counselling session" },
  { id: "consultation", q: "family meeting advisor office", pick: 0, orientation: "landscape", alt: "A family meeting an advisor" },
  { id: "documents", q: "passport documents paperwork desk", pick: 0, orientation: "landscape", alt: "Passport and application documents" },
  { id: "visa-stamp", q: "passport visa stamp travel", pick: 1, orientation: "landscape", alt: "A passport with visa stamps" },
  { id: "airport", q: "airport departure terminal traveller", pick: 0, orientation: "landscape", alt: "An airport departure terminal" },
  { id: "aeroplane", q: "aeroplane flying sky window", pick: 0, orientation: "landscape", alt: "An aeroplane in flight" },

  /* ---------- Student life ---------- */
  { id: "hostel-room", q: "student dormitory room bed", pick: 0, orientation: "landscape", alt: "A student hostel room" },
  { id: "indian-food", q: "indian food thali meal", pick: 0, orientation: "landscape", alt: "An Indian meal" },
  { id: "students-friends", q: "international students friends smiling", pick: 0, orientation: "landscape", alt: "International students together" },
  { id: "student-laptop", q: "student studying laptop notes", pick: 0, orientation: "landscape", alt: "A student studying with a laptop" },

  /* ---------- Per-university galleries ----------
     Four images each, so every university page carries its own
     photography rather than repeating one shared set. The first
     three are the actual host city or region; the fourth is a
     medical/teaching scene, varied per university so no two pages
     show the same picture. Captions name the place truthfully —
     none of these claim to be the campus itself.              */

  // 1 · GEOMEDI — Tbilisi, Georgia
  { id: "u-geomedi-1", q: "Tbilisi Georgia old town street", pick: 2, orientation: "landscape", alt: "A street in old town Tbilisi, Georgia" },
  { id: "u-geomedi-2", q: "Tbilisi Georgia city night lights", pick: 0, orientation: "landscape", alt: "Tbilisi, Georgia at night" },
  { id: "u-geomedi-3", q: "Georgia Tbilisi cafe people street", pick: 0, orientation: "landscape", alt: "Street life in Tbilisi, Georgia" },
  { id: "u-geomedi-4", q: "medical university laboratory students", pick: 1, orientation: "landscape", alt: "Students in a medical teaching laboratory" },

  // 2 · Kemerovo — Siberia, Russia
  { id: "u-kemerovo-1", q: "Siberia Russia city street winter", pick: 1, orientation: "landscape", alt: "A city street in Siberia, Russia" },
  { id: "u-kemerovo-2", q: "Russia snow covered city", pick: 1, orientation: "landscape", alt: "A snow-covered Russian city" },
  { id: "u-kemerovo-3", q: "Russia apartment buildings city", pick: 0, orientation: "landscape", alt: "Residential buildings in a Russian city" },
  { id: "u-kemerovo-4", q: "hospital doctors walking corridor", pick: 1, orientation: "landscape", alt: "Doctors in a hospital corridor" },

  // 3 · North Caucasian — Cherkessk, Russia
  { id: "u-ncsma-1", q: "Caucasus mountains village Russia", pick: 1, orientation: "landscape", alt: "A village in the Caucasus mountains" },
  { id: "u-ncsma-2", q: "Russia small town street summer", pick: 0, orientation: "landscape", alt: "A small town street in southern Russia" },
  { id: "u-ncsma-3", q: "Caucasus mountains river valley", pick: 0, orientation: "landscape", alt: "A river valley in the Caucasus" },
  { id: "u-ncsma-4", q: "anatomy class medical students", pick: 0, orientation: "landscape", alt: "Students in an anatomy class" },

  // 4 · Ingush State — Magas, Russia
  { id: "u-ingush-1", q: "modern city architecture building glass", pick: 2, orientation: "landscape", alt: "Modern city architecture" },
  { id: "u-ingush-2", q: "Caucasus mountains Russia landscape", pick: 3, orientation: "landscape", alt: "The Caucasus mountains" },
  { id: "u-ingush-3", q: "new city buildings development", pick: 1, orientation: "landscape", alt: "A newly built city district" },
  { id: "u-ingush-4", q: "medical simulation training mannequin", pick: 0, orientation: "landscape", alt: "Medical simulation training" },

  // 5 · Fergana — Uzbekistan

  // 6 · University of South Asia — Bishkek, Kyrgyzstan
  { id: "u-southasia-1", q: "Bishkek Kyrgyzstan city street", pick: 1, orientation: "landscape", alt: "A street in Bishkek, Kyrgyzstan" },
  { id: "u-southasia-2", q: "Kyrgyzstan city mountains view", pick: 3, orientation: "landscape", alt: "Bishkek with the mountains behind" },
  { id: "u-southasia-3", q: "Kyrgyzstan landscape lake mountains", pick: 1, orientation: "landscape", alt: "Mountain landscape in Kyrgyzstan" },
  { id: "u-southasia-4", q: "medical lecture hall students listening", pick: 1, orientation: "landscape", alt: "A medical lecture in progress" },

  // 7 · Nepal universities
  { id: "u-nepal-1", q: "Kathmandu Nepal street market", pick: 1, orientation: "landscape", alt: "A street market in Kathmandu, Nepal" },
  { id: "u-nepal-2", q: "Nepal city buildings hills", pick: 1, orientation: "landscape", alt: "A Nepali city set against the hills" },
  { id: "u-nepal-3", q: "Nepal temple architecture", pick: 2, orientation: "landscape", alt: "Temple architecture in Nepal" },
  { id: "u-nepal-4", q: "doctor patient consultation clinic", pick: 0, orientation: "landscape", alt: "A doctor consulting a patient" },
];

/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.find((a) => a.startsWith("--only="))?.slice("--only=".length)?.split(",");

async function loadKey() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) {
    fail(
      "No .env.local found.\n" +
        "  Create it and add:  PEXELS_API_KEY=your_key_here\n" +
        "  Free key: https://www.pexels.com/api/new/",
    );
  }
  const raw = await readFile(envPath, "utf8");
  const match = raw.match(/^\s*PEXELS_API_KEY\s*=\s*(.+)$/m);
  const key = match?.[1]?.trim().replace(/^["']|["']$/g, "");
  if (!key) {
    fail(
      "PEXELS_API_KEY is empty in .env.local.\n" +
        "  Paste your key after the = sign, with no quotes.\n" +
        "  Free key: https://www.pexels.com/api/new/",
    );
  }
  return key;
}

function fail(msg) {
  console.error(`\n\x1b[31m✗ ${msg}\x1b[0m\n`);
  process.exit(1);
}

async function search(key, query, orientation, perPage = 12) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", orientation);

  const res = await fetch(url, { headers: { Authorization: key } });

  if (res.status === 401) fail("Pexels rejected the API key (401). Check the value in .env.local.");
  if (res.status === 429) fail("Pexels rate limit hit (429). Wait an hour, then re-run.");
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);

  const data = await res.json();
  return data.photos ?? [];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

async function run() {
  const key = await loadKey();
  await mkdir(OUT_DIR, { recursive: true });

  const slots = ONLY ? SLOTS.filter((s) => ONLY.includes(s.id)) : SLOTS;
  const manifest = {};
  let fetched = 0;
  let skipped = 0;

  // Reuse existing manifest entries for slots we skip, so a partial run
  // never wipes credits for images already on disk.
  let previous = {};
  if (existsSync(MANIFEST)) {
    const prevRaw = await readFile(MANIFEST, "utf8");
    const m = prevRaw.match(/export const IMAGES[^=]*=\s*(\{[\s\S]*?\}) as const;/);
    if (m) {
      try {
        previous = JSON.parse(m[1].replace(/(\w+):/g, '"$1":').replace(/,(\s*[}\]])/g, "$1"));
      } catch {
        /* previous manifest unparsable — regenerate from scratch */
      }
    }
  }

  console.log(`\n\x1b[36m▸ Fetching ${slots.length} images from Pexels\x1b[0m\n`);

  for (const slot of slots) {
    const file = path.join(OUT_DIR, `${slot.id}.jpg`);
    const onDisk = existsSync(file);

    if (onDisk && !FORCE && previous[slot.id]) {
      manifest[slot.id] = previous[slot.id];
      skipped++;
      console.log(`  \x1b[90m· ${slot.id.padEnd(26)} already present\x1b[0m`);
      continue;
    }

    try {
      const photos = await search(key, slot.q, slot.orientation);
      if (photos.length === 0) {
        console.log(`  \x1b[33m! ${slot.id.padEnd(26)} no results for "${slot.q}"\x1b[0m`);
        continue;
      }

      const photo = photos[Math.min(slot.pick, photos.length - 1)];
      const src = photo.src.large2x ?? photo.src.large ?? photo.src.original;
      const bytes = await download(src, file);

      manifest[slot.id] = {
        src: `/images/${slot.id}.jpg`,
        alt: slot.alt,
        width: 1880,
        height: slot.orientation === "portrait" ? 2820 : 1253,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        pexelsUrl: photo.url,
        avgColor: photo.avg_color ?? "#0A1F44",
      };

      fetched++;
      console.log(
        `  \x1b[32m✓ ${slot.id.padEnd(26)}\x1b[0m ${(bytes / 1024).toFixed(0)}KB  ` +
          `\x1b[90m${photo.photographer}\x1b[0m`,
      );

      // Stay well inside the 200/hour free limit.
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.log(`  \x1b[31m✗ ${slot.id.padEnd(26)} ${err.message}\x1b[0m`);
    }
  }

  // Carry forward any slot we did not touch this run.
  for (const [id, entry] of Object.entries(previous)) {
    if (!manifest[id] && existsSync(path.join(OUT_DIR, `${id}.jpg`))) {
      manifest[id] = entry;
    }
  }

  await writeManifest(manifest);

  console.log(
    `\n\x1b[32m▸ Done.\x1b[0m ${fetched} fetched, ${skipped} already present, ` +
      `${Object.keys(manifest).length} in manifest.\n` +
      `  Manifest: src/lib/data/images.ts\n`,
  );
}

async function writeManifest(manifest) {
  const entries = Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b));

  const body = entries
    .map(([id, v]) => {
      const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `  "${id}": {
    src: "${esc(v.src)}",
    alt: "${esc(v.alt)}",
    width: ${v.width},
    height: ${v.height},
    photographer: "${esc(v.photographer)}",
    photographerUrl: "${esc(v.photographerUrl)}",
    pexelsUrl: "${esc(v.pexelsUrl)}",
    avgColor: "${esc(v.avgColor)}",
  },`;
    })
    .join("\n");

  const out = `/* AUTO-GENERATED by scripts/fetch-images.mjs — do not edit by hand.
 * Re-run with:  npm run images
 *
 * Photos sourced from Pexels (https://www.pexels.com) and downloaded
 * locally, so the site makes no external requests at page load.
 * Photographer credit is preserved here and rendered in the footer.
 */

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
  avgColor: string;
}

export const IMAGES = {
${body}
} as const;

export type ImageId = keyof typeof IMAGES;

/** Safe lookup — returns undefined rather than throwing when an image
 *  has not been fetched yet, so the site renders before \`npm run images\`. */
export function img(id: string): SiteImage | undefined {
  return (IMAGES as Record<string, SiteImage>)[id];
}

export const HAS_IMAGES = Object.keys(IMAGES).length > 0;

/** Unique photographers, for the footer credit line. */
export const PHOTO_CREDITS: { name: string; url: string }[] = Array.from(
  new Map(
    Object.values(IMAGES as Record<string, SiteImage>).map((i) => [
      i.photographer,
      { name: i.photographer, url: i.photographerUrl },
    ]),
  ).values(),
).sort((a, b) => a.name.localeCompare(b.name));
`;

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, out, "utf8");
}

run().catch((err) => fail(err.stack ?? String(err)));
