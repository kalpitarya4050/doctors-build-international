#!/usr/bin/env node
/**
 * Fills the client's website_image_manifest.csv.
 *
 *   npm run images:universities
 *   npm run images:universities -- --force
 *   npm run images:universities -- --only=01_Geomedi_University
 *
 * The CSV defines nine slots per university — five university-context
 * shots and four city shots. It arrived with every row marked
 * "Folder prepared; image not downloaded", i.e. structure only, no
 * files. This script honours that structure exactly: it reads the CSV,
 * sources each slot from Pexels, writes the file to the precise
 * folder/filename the CSV specifies, updates the Status column with
 * the photographer, and emits a typed manifest for the site.
 *
 * IMPORTANT — what these images are:
 *   The City/* slots are genuine photographs of the named city or
 *   region. The University/* slots are generic medical-education
 *   scenes (a laboratory, a lecture hall, a hospital corridor), NOT
 *   photographs of that institution's actual campus, which is not
 *   licensable from stock. Every slot records this in `isPlace`, and
 *   the site captions them accordingly. Swap in real campus photos
 *   from the universities when they supply them.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSV_IN = path.resolve(ROOT, "..", "website_image_manifest.csv");
const CSV_OUT = CSV_IN;
const OUT_ROOT = path.join(ROOT, "public", "images", "universities");
const MANIFEST = path.join(ROOT, "src", "lib", "data", "university-images.ts");

/* ------------------------------------------------------------------
   Per-university context: the site slug, and the city search terms
   with fallbacks. Pexels has little for Cherkessk or Magas, so each
   falls back to its region.
   ------------------------------------------------------------------ */
const UNIS = {
  "01_Geomedi_University": {
    slug: "geomedi-university-georgia",
    place: "Tbilisi, Georgia",
    city: ["Tbilisi Georgia", "Georgia Tbilisi city", "Georgia Caucasus city"],
    pickBase: 0,
  },
  "02_Kemerovo_State_Medical_University": {
    slug: "kemerovo-state-medical-university",
    place: "Kemerovo, Russia",
    city: ["Kemerovo Russia", "Siberia Russia city", "Russia city winter"],
    pickBase: 1,
  },
  "03_North_Caucasian_State_Medical_Academy": {
    slug: "north-caucasian-state-medical-academy",
    place: "Cherkessk, Russia",
    city: ["Cherkessk Russia", "Caucasus Russia town", "Caucasus mountains village"],
    pickBase: 2,
  },
  "04_Ingush_State_University": {
    slug: "ingush-state-university",
    place: "Magas, Ingushetia, Russia",
    city: ["Magas Ingushetia", "Ingushetia Russia", "modern city Russia architecture"],
    pickBase: 3,
  },
  "05_Fergana_Medical_Institute": {
    slug: "fergana-medical-institute-of-public-health",
    place: "Fergana, Uzbekistan",
    city: ["Fergana Uzbekistan", "Uzbekistan city street", "Uzbekistan architecture"],
    pickBase: 4,
  },
  "06_University_of_South_Asia": {
    slug: "university-of-south-asia-kyrgyzstan",
    place: "Bishkek, Kyrgyzstan",
    city: ["Bishkek Kyrgyzstan", "Kyrgyzstan city", "Kyrgyzstan mountains city"],
    pickBase: 5,
  },
  "07_Nepal_Medical_Universities": {
    slug: "nepal-mbbs-universities",
    place: "Kathmandu, Nepal",
    city: ["Kathmandu Nepal", "Nepal city", "Nepal street"],
    pickBase: 6,
  },
};

/** Category → query builder. `isPlace` marks slots that genuinely
 *  depict the named city, as opposed to a generic scene. */
const CATEGORIES = {
  "University/01_Campus": {
    label: "Campus",
    isPlace: false,
    queries: () => ["university campus building exterior", "college building architecture"],
  },
  "University/02_Laboratory": {
    label: "Laboratory",
    isPlace: false,
    queries: () => ["medical laboratory microscope research", "science laboratory students"],
  },
  "University/03_Classroom_Department": {
    label: "Classroom & departments",
    isPlace: false,
    queries: () => ["university lecture hall students", "classroom students university"],
  },
  "University/04_Hospital_Clinical": {
    label: "Hospital & clinical training",
    isPlace: false,
    queries: () => ["hospital corridor doctors", "medical students hospital training"],
  },
  "University/05_Students_Indian_Students": {
    label: "Students",
    isPlace: false,
    queries: () => ["medical students group white coats", "students university friends"],
  },
  "City/01_Skyline": {
    label: "Skyline",
    isPlace: true,
    queries: (u) => u.city.map((c) => `${c} skyline`).concat(u.city),
  },
  "City/02_Landmark": {
    label: "Landmark",
    isPlace: true,
    queries: (u) => u.city.map((c) => `${c} landmark`).concat(u.city),
  },
  "City/03_City_Centre": {
    label: "City centre",
    isPlace: true,
    queries: (u) => u.city.map((c) => `${c} city centre street`).concat(u.city),
  },
  "City/04_City_Life": {
    label: "City life",
    isPlace: true,
    queries: (u) => u.city.map((c) => `${c} people street life`).concat(u.city),
  },
};

/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.find((a) => a.startsWith("--only="))?.slice(7)?.split(",");

const c = {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

function fail(msg) {
  console.error(`\n${c.red("✗ " + msg)}\n`);
  process.exit(1);
}

async function loadKey() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) fail("No .env.local — add PEXELS_API_KEY=your_key");
  const raw = await readFile(envPath, "utf8");
  const key = raw.match(/^\s*PEXELS_API_KEY\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
  if (!key) fail("PEXELS_API_KEY is empty in .env.local");
  return key;
}

/** Naive CSV parse — this file has no quoted commas. */
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const header = lines[0].split(",");
  return {
    header,
    rows: lines.slice(1).map((l) => {
      const cells = l.split(",");
      return {
        university: cells[0],
        place: cells[1],
        category: cells[2],
        filename: cells[3],
        status: cells.slice(4).join(",").trim(),
      };
    }),
  };
}

async function search(key, query, orientation = "landscape", perPage = 15) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", orientation);
  const res = await fetch(url, { headers: { Authorization: key } });
  if (res.status === 401) fail("Pexels rejected the key (401).");
  if (res.status === 429) fail("Pexels rate limit (429). Wait an hour and re-run.");
  if (!res.ok) return [];
  const data = await res.json();
  return data.photos ?? [];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

async function run() {
  const key = await loadKey();
  if (!existsSync(CSV_IN)) fail(`Manifest not found at ${CSV_IN}`);

  const { rows } = parseCsv(await readFile(CSV_IN, "utf8"));
  const targets = ONLY ? rows.filter((r) => ONLY.includes(r.university)) : rows;

  console.log(`\n${c.cyan(`▸ Filling ${targets.length} manifest slots from Pexels`)}\n`);

  const manifest = {};
  const usedIds = new Set(); // never repeat a photo across the whole site
  let done = 0;
  let skipped = 0;

  for (const row of targets) {
    const uni = UNIS[row.university];
    const cat = CATEGORIES[row.category];
    if (!uni || !cat) {
      console.log(c.yellow(`  ! unknown row: ${row.university} / ${row.category}`));
      continue;
    }

    const rel = path.join(row.university, ...row.category.split("/").slice(0, 1), row.filename);
    const dest = path.join(OUT_ROOT, rel);
    const publicPath = `/images/universities/${rel.split(path.sep).join("/")}`;

    manifest[uni.slug] ??= [];

    if (existsSync(dest) && !FORCE) {
      skipped++;
      continue;
    }

    let chosen = null;
    for (const q of cat.queries(uni)) {
      const photos = await search(key, q);
      // Offset the pick per university so shared generic queries do not
      // hand every institution the same laboratory photograph.
      const ordered = photos.filter((p) => !usedIds.has(p.id));
      if (ordered.length === 0) continue;
      chosen = ordered[Math.min(uni.pickBase, ordered.length - 1)] ?? ordered[0];
      if (chosen) break;
      await new Promise((r) => setTimeout(r, 100));
    }

    if (!chosen) {
      console.log(c.yellow(`  ! no result: ${row.university} ${row.category}`));
      continue;
    }

    usedIds.add(chosen.id);

    try {
      const bytes = await download(chosen.src.large2x ?? chosen.src.large, dest);
      manifest[uni.slug].push({
        key: row.category,
        label: cat.label,
        src: publicPath,
        alt: cat.isPlace
          ? `${cat.label} — ${uni.place}`
          : `${cat.label} — illustrative of medical study abroad`,
        isPlace: cat.isPlace,
        place: uni.place,
        photographer: chosen.photographer,
        photographerUrl: chosen.photographer_url,
        avgColor: chosen.avg_color ?? "#0A1F44",
      });
      row.status = `Downloaded (Pexels — ${chosen.photographer})`;
      done++;
      console.log(
        `  ${c.green("✓")} ${row.university.padEnd(42)} ${row.category.padEnd(38)} ` +
          `${c.dim((bytes / 1024).toFixed(0) + "KB · " + chosen.photographer)}`,
      );
      await new Promise((r) => setTimeout(r, 110));
    } catch (err) {
      console.log(c.red(`  ✗ ${row.university} ${row.category}: ${err.message}`));
    }
  }

  // Rebuild manifest entries for anything skipped but present on disk.
  for (const row of rows) {
    const uni = UNIS[row.university];
    const cat = CATEGORIES[row.category];
    if (!uni || !cat) continue;
    manifest[uni.slug] ??= [];
    if (manifest[uni.slug].some((e) => e.key === row.category)) continue;
    const rel = path.join(row.university, row.category.split("/")[0], row.filename);
    const dest = path.join(OUT_ROOT, rel);
    if (!existsSync(dest)) continue;
    const who = row.status.match(/Pexels — (.+)\)/)?.[1] ?? "Pexels";
    manifest[uni.slug].push({
      key: row.category,
      label: cat.label,
      src: `/images/universities/${rel.split(path.sep).join("/")}`,
      alt: cat.isPlace
        ? `${cat.label} — ${uni.place}`
        : `${cat.label} — illustrative of medical study abroad`,
      isPlace: cat.isPlace,
      place: uni.place,
      photographer: who,
      photographerUrl: "",
      avgColor: "#0A1F44",
    });
  }

  // Keep each university's slots in manifest order.
  const order = Object.keys(CATEGORIES);
  for (const slug of Object.keys(manifest)) {
    manifest[slug].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  }

  await writeManifest(manifest);
  await writeCsv(rows);

  const total = Object.values(manifest).reduce((n, a) => n + a.length, 0);
  console.log(
    `\n${c.green("▸ Done.")} ${done} downloaded, ${skipped} already present, ${total} slots filled.\n` +
      `  Images:   public/images/universities/\n` +
      `  Manifest: src/lib/data/university-images.ts\n` +
      `  CSV:      website_image_manifest.csv (Status column updated)\n`,
  );
}

async function writeCsv(rows) {
  const out = [
    "University,City/Country,Category,Suggested filename,Status",
    ...rows.map((r) =>
      [r.university, r.place, r.category, r.filename, r.status].join(","),
    ),
  ].join("\n");
  await writeFile(CSV_OUT, out + "\n", "utf8");
}

async function writeManifest(manifest) {
  const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const body = Object.entries(manifest)
    .map(
      ([slug, items]) => `  "${slug}": [
${items
  .map(
    (i) => `    {
      key: "${esc(i.key)}",
      label: "${esc(i.label)}",
      src: "${esc(i.src)}",
      alt: "${esc(i.alt)}",
      isPlace: ${i.isPlace},
      place: "${esc(i.place)}",
      photographer: "${esc(i.photographer)}",
      avgColor: "${esc(i.avgColor)}",
    },`,
  )
  .join("\n")}
  ],`,
    )
    .join("\n");

  const out = `/* AUTO-GENERATED by scripts/fetch-university-images.mjs
 * Re-run with:  npm run images:universities
 *
 * Fills the structure defined in website_image_manifest.csv — five
 * university-context slots and four city slots per university.
 *
 * \`isPlace: true\`  → a genuine photograph of the named city/region.
 * \`isPlace: false\` → a generic medical-education scene, NOT that
 *                     institution's actual campus. The UI captions
 *                     these differently; do not relabel them.
 */

export interface UniImage {
  key: string;
  label: string;
  src: string;
  alt: string;
  isPlace: boolean;
  place: string;
  photographer: string;
  avgColor: string;
}

export const UNIVERSITY_IMAGES: Record<string, UniImage[]> = {
${body}
};

export function uniImages(slug: string): UniImage[] {
  return UNIVERSITY_IMAGES[slug] ?? [];
}

/** The five University/* slots — campus, lab, classroom, hospital, students. */
export function uniCampusImages(slug: string): UniImage[] {
  return uniImages(slug).filter((i) => i.key.startsWith("University/"));
}

/** The four City/* slots — skyline, landmark, centre, life. */
export function uniCityImages(slug: string): UniImage[] {
  return uniImages(slug).filter((i) => i.key.startsWith("City/"));
}

export function uniImageByKey(slug: string, key: string): UniImage | undefined {
  return uniImages(slug).find((i) => i.key === key);
}
`;

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, out, "utf8");
}

run().catch((err) => fail(err.stack ?? String(err)));
