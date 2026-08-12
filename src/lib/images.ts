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
