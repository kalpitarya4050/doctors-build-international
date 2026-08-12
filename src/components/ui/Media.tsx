import Image from "next/image";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

/* ============================================================
   Server-safe image primitives. Every image on the site goes
   through one of these (or through MediaMotion for the animated
   variants), so behaviour is consistent everywhere.

   If the manifest is empty — before `npm run images` has run —
   each falls back to a branded gradient rather than a broken
   <img>, so the site is always presentable.
   ============================================================ */

export function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic branded gradient, used when an image is missing. */
export function Placeholder({ className, seed = 0 }: { className?: string; seed?: number }) {
  const angle = 120 + ((seed * 37) % 120);
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(${angle}deg, var(--navy-900), var(--navy-700) 45%, var(--gold-600) 145%)`,
      }}
    >
      <span
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), transparent 55%)",
        }}
      />
    </div>
  );
}

/** An 8×6 SVG of the image's average colour, URL-encoded.
 *  `btoa`/`Buffer` are avoided so this is safe on both server and
 *  client without a polyfill. */
export function solidBlur(hex: string): string {
  const c = (hex || "#0A1F44").replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) || 10;
  const g = parseInt(c.slice(2, 4), 16) || 31;
  const b = parseInt(c.slice(4, 6), 16) || 68;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='6'><rect width='8' height='6' fill='rgb(${r},${g},${b})'/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* ------------------------------------------------------------------ */

export function Media({
  id,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  alt,
  overlay,
}: {
  id: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
  overlay?: React.ReactNode;
}) {
  const src = img(id);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={src.src}
          alt={alt ?? src.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={solidBlur(src.avgColor)}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <Placeholder className="absolute inset-0" seed={hashId(id)} />
      )}
      {overlay}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Gradient scrim so text stays legible over any photograph, whatever
 *  its exposure. Type sits on this layer, never on the raw image. */
export function Scrim({
  className,
  strength = "medium",
  from = "bottom",
}: {
  className?: string;
  strength?: "light" | "medium" | "heavy";
  from?: "bottom" | "top" | "all";
}) {
  const stops = {
    light: "rgba(5,15,34,0.58), rgba(5,15,34,0.16) 45%, transparent 75%",
    medium: "rgba(5,15,34,0.84), rgba(5,15,34,0.36) 50%, transparent 82%",
    heavy: "rgba(5,15,34,0.93), rgba(5,15,34,0.62) 45%, rgba(5,15,34,0.28) 82%",
  }[strength];

  if (from === "all") {
    return (
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", className)}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 18%, rgba(5,15,34,0.78) 100%)",
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background: `linear-gradient(${from === "top" ? "180deg" : "0deg"}, ${stops})` }}
    />
  );
}
