import { IMAGES, type SiteImage } from "./data/images";
import { UNIVERSITY_IMAGES } from "./data/university-images";

/* ============================================================
   Image resolution layer.

   Two sources are merged:

   1. GENERATED — public/images/*.jpg fetched from Pexels by
      `npm run images`, listed in data/images.ts. These are
      illustrative: destination countries and general student
      life, never claimed to be a specific campus.

   2. OWNED — photography the client holds rights to, or that
      comes from the client's own reference sites (same
      proprietor, reuse authorised). These ARE the real thing
      and are captioned as such.

   Owned entries win, and survive `npm run images` because they
   live here rather than in the generated file.
   ============================================================ */

const OWNED: Record<string, SiteImage> = {
  /* Partnership photography — our own visit to North Caucasian State
     Academy. Deliberately uncaptioned as to who is in frame: we know
     the roles, not a verified spelling of either name, and a title
     printed under a real person's face has to be right. Names go in
     when the client confirms them. */
  "dbi-ncsa-dean-welcome": {
    src: "/images/owned/dbi/ncsa-dean-welcome.jpg",
    alt: "A Doctors Build International representative presenting a bouquet to the Dean of North Caucasian State Academy during a partnership visit",
    width: 1050,
    height: 1400,
    photographer: "Doctors Build International",
    photographerUrl: "",
    pexelsUrl: "",
    avgColor: "#75685B",
  },
  /* The handshake again, cut to a portrait. The home page frames it
     as an oval, and a 3:4 photograph centred in a 4:5 hole crops
     heads first — so the crop is done at full resolution in the
     ingest rather than with object-position at display time. */
  "dbi-ncsa-dean-portrait": {
    src: "/images/owned/dbi/ncsa-dean-portrait.jpg",
    alt: "A Doctors Build International representative shaking hands with the Dean of North Caucasian State Academy",
    width: 666,
    height: 832,
    photographer: "Doctors Build International",
    photographerUrl: "",
    pexelsUrl: "",
    avgColor: "#7D7A78",
  },

  "dbi-ncsa-dean-handshake": {
    src: "/images/owned/dbi/ncsa-dean-handshake.jpg",
    alt: "A Doctors Build International representative shaking hands with the Dean of North Caucasian State Academy",
    width: 1050,
    height: 1400,
    photographer: "Doctors Build International",
    photographerUrl: "",
    pexelsUrl: "",
    avgColor: "#88847D",
  },

  /* NCSA's real campus, used in the homepage university strip. The
     university's own page draws from owned-photos.ts; this id exists
     so the strip can show the genuine article instead of the regional
     landscape that UNI_IMAGE still points at for the page hero, whose
     caption explicitly says "photograph of the region". */
  "uni-ncsa-campus": {
    src: "/images/owned/north-caucasian-state-academy/campus-grounds.jpg",
    alt: "Indian students on the grounds of North Caucasian State Academy in Cherkessk, Russia",
    width: 1280,
    height: 720,
    photographer: "Doctors Build International",
    photographerUrl: "",
    pexelsUrl: "",
    avgColor: "#9DA3A2",
  },

  "campus-geomedi": {
    src: "/images/campus-geomedi.jpg",
    alt: "The GEOMEDI University building in Tbilisi, Georgia, with Georgian and Indian flags outside",
    width: 1170,
    height: 459,
    photographer: "GEOMEDI University",
    photographerUrl: "",
    pexelsUrl: "",
    avgColor: "#8E9689",
  },
};

/* ------------------------------------------------------------------
   basePath handling.

   `next/image` prefixes basePath onto its own /_next/image URLs, but
   when `unoptimized: true` is set — which a static export requires —
   it uses the `src` verbatim. On GitHub Pages the site is served from
   /<repo>, so every /images/... path would 404. Prefixing here means
   every component gets it right without knowing basePath exists.

   NEXT_PUBLIC_ is required: BASE_PATH alone is build-only and would
   be undefined in the browser bundle.
   ------------------------------------------------------------------ */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(src: string): string {
  if (!BASE_PATH) return src;
  if (!src.startsWith("/")) return src;
  if (src.startsWith(`${BASE_PATH}/`)) return src;
  return `${BASE_PATH}${src}`;
}

/** True where the image is genuine photography of the thing it
 *  depicts, rather than illustrative stock. Drives the caption. */
export function isOwned(id: string): boolean {
  return id in OWNED;
}

/** Resolves an id from any of three sources:
 *
 *   "campus-geomedi"                              → OWNED
 *   "uni:<slug>:City/01_Skyline"                  → the CSV manifest
 *   "country-georgia"                             → the generated set
 *
 * The `uni:` form lets every existing component (Media, KenBurns,
 * ParallaxMedia, PageHero…) address the client's manifest images
 * without any of them needing to know it exists. */
export function img(id: string): SiteImage | undefined {
  if (id.startsWith("uni:")) {
    const sep = id.indexOf(":", 4);
    const slug = id.slice(4, sep);
    const key = id.slice(sep + 1);
    const found = (UNIVERSITY_IMAGES[slug] ?? []).find((i) => i.key === key);
    if (!found) return undefined;
    return {
      src: withBasePath(found.src),
      alt: found.alt,
      width: 1880,
      height: 1253,
      photographer: found.photographer,
      photographerUrl: "",
      pexelsUrl: "",
      avgColor: found.avgColor,
    };
  }
  const found = OWNED[id] ?? (IMAGES as Record<string, SiteImage>)[id];
  if (!found) return undefined;
  return { ...found, src: withBasePath(found.src) };
}

/** Builds a `uni:` id for the resolver above. */
export function uniImageId(slug: string, key: string): string {
  return `uni:${slug}:${key}`;
}

export const HAS_IMAGES =
  Object.keys(IMAGES).length > 0 || Object.keys(OWNED).length > 0;

export type { SiteImage };
