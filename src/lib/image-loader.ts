/**
 * Custom next/image loader for the static export.
 *
 * Next cannot resize on a static host, so `scripts/build-image-variants.mjs`
 * pre-renders `<name>-<width>w.webp` beside every source image. This maps a
 * requested width onto the nearest generated variant, which lets Next emit a
 * normal `srcset` — the browser then downloads only the size it needs.
 *
 * Runs in the browser bundle: keep it synchronous and dependency-free.
 */

/** Must match WIDTHS in scripts/build-image-variants.mjs and the
 *  deviceSizes/imageSizes in next.config.ts. */
const WIDTHS = [320, 480, 640, 828, 1200, 1600];

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Anything remote, already a variant, or not a raster we generated is
  // passed straight through.
  if (!src.startsWith("/") || /-\d+w\.webp$/.test(src) || !/\.(jpe?g|png)$/i.test(src)) {
    return src;
  }

  // `src` may already carry the basePath (lib/images.ts adds it). Strip
  // it so the variant path is computed from the public/ layout, then
  // put it back once.
  const bare = BASE_PATH && src.startsWith(`${BASE_PATH}/`) ? src.slice(BASE_PATH.length) : src;

  // Smallest generated width that still covers the request; largest if
  // the request exceeds everything we made.
  const target = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];

  const variant = bare.replace(/\.(jpe?g|png)$/i, `-${target}w.webp`);
  return `${BASE_PATH}${variant}`;
}
