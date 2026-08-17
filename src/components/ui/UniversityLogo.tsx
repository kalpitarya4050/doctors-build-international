"use client";

import { useState } from "react";
import { UNIVERSITY_LOGOS, monogram } from "@/lib/data/university-logos";
import { withBasePath } from "@/lib/images";
import { cn } from "@/lib/utils";

/* ============================================================
   A partner university's own mark, in a fixed tile.

   THE TILE IS NOT DECORATION. These are twenty-odd logos from
   twenty-odd institutions with no shared design system: wide
   Cyrillic wordmarks, square crests, one that is basically a
   photograph of a building. Dropped inline they turn a tidy list
   into a ransom note. A fixed square with `object-contain`
   normalizes the ragged set into one rhythm, and is the only
   reason the menu reads as a single thing.

   The tile is light in BOTH themes. Nearly every mark here is
   dark-on-transparent — drawn for a white page — so a tile that
   followed the theme would erase most of the set in dark mode.
   The handful drawn white-for-a-dark-header carry tone: "dark"
   in the manifest and get a navy tile instead.

   Four universities have no logo (see the manifest header) and
   render initials. That is a real state, not a loading one: two
   of those sites are down and one has never published a mark.
   ============================================================ */

export function UniversityLogo({
  slug,
  shortName,
  className,
  size = 32,
}: {
  slug: string;
  shortName: string;
  className?: string;
  /** Rendered edge length in px. The files are 128px tall. */
  size?: number;
}) {
  const logo = UNIVERSITY_LOGOS[slug];
  // A 404 on a logo must not leave a blank hole in the row, so a
  // failed load falls through to exactly the same monogram tile.
  const [failed, setFailed] = useState(false);
  const dark = logo?.tone === "dark";

  const base = cn(
    "grid shrink-0 place-items-center overflow-hidden rounded-[var(--radius-sm)]",
    "ring-1 ring-black/10 dark:ring-white/15",
    className,
  );
  const style = { width: size, height: size };

  if (!logo || failed) {
    return (
      <span
        aria-hidden
        style={style}
        className={cn(base, "bg-[var(--navy-900)] text-[var(--gold-300)]")}
      >
        <span
          className="font-semibold leading-none tracking-[0.02em]"
          style={{ fontSize: Math.round(size * 0.34) }}
        >
          {monogram(shortName)}
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden style={style} className={cn(base, dark ? "bg-[var(--navy-900)]" : "bg-white")}>
      {/* Bare <img>: next/image adds a wrapper span and a srcSet for
          a 32px mark that is already a 128px PNG — all overhead, no
          saving. The rule's concern is bytes; the whole set is under
          200KB and every one of these is lazy. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(logo.src)}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="size-full object-contain p-[9%]"
      />
    </span>
  );
}
