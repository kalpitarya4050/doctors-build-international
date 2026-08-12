import type { NextConfig } from "next";

/**
 * Two build modes.
 *
 * Default (`npm run dev` / `npm run build`)
 *   A normal Next.js server build. Image optimisation on, everything
 *   available. Use this locally and on any Node host.
 *
 * Static (`STATIC_EXPORT=1 npm run build`)
 *   Emits a folder of plain HTML/CSS/JS/images to `out/`, which any
 *   static host can serve — GitHub Pages, Netlify, Cloudflare Pages,
 *   or the client's own cPanel once they buy hosting.
 *
 *   Trade-offs, all handled:
 *     · No server code. The lead form posts to Google Sheets and hands
 *       off to WhatsApp from the browser instead (src/lib/lead-delivery.ts).
 *     · next/image cannot resize on the fly, so images are served as
 *       they sit on disk — which is why `npm run images:compress`
 *       caps them at 1600px first.
 *     · GitHub Pages serves from a sub-path, so BASE_PATH prefixes
 *       every route and asset.
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        // Pages serves /about as /about/index.html — without this the
        // deep links 404 on a refresh.
        trailingSlash: true,
        images: {
          /**
           * `unoptimized: true` is the usual answer for a static export,
           * but it ships one full-size file to every device — measured
           * at 5MB of images on the homepage, with 1600px JPEGs landing
           * in 218px slots.
           *
           * Instead, `npm run images:variants` pre-renders WebP at each
           * width and this loader maps requests onto them, so Next still
           * emits a real srcset. These lists must match WIDTHS in the
           * generator, or Next will ask for a width nobody built.
           */
          loader: "custom" as const,
          loaderFile: "./src/lib/image-loader.ts",
          deviceSizes: [640, 828, 1200, 1600],
          imageSizes: [320, 480],
        },
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),

  /**
   * In dev, Next blocks cross-origin requests for its own assets
   * (/_next/static/*, HMR, fonts). Tunnelling localhost through a
   * public host therefore serves HTML but no JavaScript — the page
   * renders, hydration never happens, and every Motion-animated
   * element stays at its `initial` opacity of 0, i.e. a blank white
   * page below the header. These entries only matter when tunnelling
   * `npm run dev`; `npm run share` serves a production build.
   */
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.vercel.app",
  ],
};

export default nextConfig;
