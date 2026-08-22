"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { img } from "@/lib/images";
import { Placeholder, solidBlur, hashId } from "./Media";
import { cn } from "@/lib/utils";

/* ============================================================
   Animated image variants. Transform + opacity only — both
   composite on the GPU — and every one collapses to a still
   frame or a cross-fade under prefers-reduced-motion.
   ============================================================ */

/** Slow scale drift, giving a still photograph a sense of depth.
 *  Per-frame movement stays well under the perception threshold, so it
 *  reads as air rather than as animation. */
export function KenBurns({
  id,
  className,
  sizes = "100vw",
  priority = false,
  overlay,
  alt,
  duration = 24,
  scale = 1.1,
}: {
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  overlay?: ReactNode;
  alt?: string;
  duration?: number;
  scale?: number;
}) {
  const reduced = useReducedMotion();
  const src = img(id);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={reduced ? { scale: 1 } : { scale }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }
          style={{ willChange: "transform" }}
        >
          <Image
            src={src.src}
            alt={alt ?? src.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL={solidBlur(src.avgColor)}
            className="object-cover"
          />
        </motion.div>
      ) : (
        <Placeholder className="absolute inset-0" seed={hashId(id)} />
      )}
      {overlay}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Image that drifts against the scroll. The container clips and the
 *  image is oversized top and bottom, so travel never exposes an edge. */
export function ParallaxMedia({
  id,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  strength = 12,
  alt,
  overlay,
  priority = false,
}: {
  id: string;
  className?: string;
  sizes?: string;
  /** Percent of the container height travelled across the scroll range. */
  strength?: number;
  alt?: string;
  overlay?: ReactNode;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const src = img(id);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-x-0"
        style={{
          top: `-${strength}%`,
          bottom: `-${strength}%`,
          y: reduced ? 0 : y,
          willChange: "transform",
        }}
      >
        {src ? (
          <Image
            src={src.src}
            alt={alt ?? src.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL={solidBlur(src.avgColor)}
            className="object-cover"
          />
        ) : (
          <Placeholder className="absolute inset-0" seed={hashId(id)} />
        )}
      </motion.div>
      {overlay}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Revealed by a wipe on scroll-in, with the photo counter-moving so
 *  the frame fills rather than the image sliding.
 *
 *  The wipe is built from transforms, NOT clip-path. It was written
 *  with an animated `clipPath: inset(…)` and never once ran: the
 *  browser normalises `inset(100% 0 0 0)` to the three-value
 *  `inset(100% 0px 0px)`, which no longer matches the shape of the
 *  target string, so Motion could not interpolate and silently left
 *  every image pinned at its hidden value. Confirmed on the live
 *  site — the photos were loading at full size behind a 100% inset.
 *
 *  Two nested translations give the same effect with values Motion
 *  can actually drive, and keeps to the project's own rule of
 *  animating transform and opacity only. */
export function RevealMedia({
  id,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  alt,
  overlay,
  from = "bottom",
  priority = false,
}: {
  id: string;
  className?: string;
  sizes?: string;
  alt?: string;
  overlay?: ReactNode;
  from?: "bottom" | "left" | "right";
  priority?: boolean;
}) {
  const reduced = useReducedMotion();
  const src = img(id);

  /* The mask slides in from `from`; the photo slides the opposite way
     by the same amount, so it appears stationary while the frame
     uncovers it. */
  const wipe = {
    bottom: { mask: { y: "100%" }, photo: { y: "-100%" } },
    left: { mask: { x: "-100%" }, photo: { x: "100%" } },
    right: { mask: { x: "100%" }, photo: { x: "-100%" } },
  }[from];

  const EASE = { duration: 0.85, ease: [0.22, 1, 0.36, 1] } as const;

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={
        reduced
          ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35 } } }
          : { hidden: {}, visible: {} }
      }
    >
      {/* Mask */}
      <motion.div
        className="absolute inset-0"
        variants={
          reduced
            ? {}
            : {
                hidden: wipe.mask,
                visible: { x: "0%", y: "0%", transition: EASE },
              }
        }
        style={{ willChange: "transform" }}
      >
        {/* Counter-move, so the photo holds still while the mask travels */}
        <motion.div
          className="absolute inset-0"
          variants={
            reduced
              ? {}
              : {
                  hidden: { ...wipe.photo, scale: 1.14 },
                  visible: { x: "0%", y: "0%", scale: 1, transition: EASE },
                }
          }
          style={{ willChange: "transform" }}
        >
          {src ? (
            <Image
              src={src.src}
              alt={alt ?? src.alt}
              fill
              sizes={sizes}
              priority={priority}
              placeholder="blur"
              blurDataURL={solidBlur(src.avgColor)}
              className="object-cover"
            />
          ) : (
            <Placeholder className="absolute inset-0" seed={hashId(id)} />
          )}
        </motion.div>
      </motion.div>
      {overlay}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

/** Continuously scrolling band of photographs. Two identical tracks
 *  translated -50% make the loop seamless. */
export interface MarqueeTile {
  /** Image-registry id, resolved through `img()`. */
  id: string;
  /** Primary line over the photograph. */
  caption: string;
  /** Where the tile navigates. Every tile is a link — a row of
   *  photographs of places you can actually go to is an invitation,
   *  and an invitation that does not click is a dead end. */
  href: string;
  /** Optional second line — city, fee, count. */
  meta?: string;
}

export function MediaMarquee({
  items,
  className,
  speed = 58,
  reverse = false,
  tileClassName = "w-[15rem] sm:w-[19rem] aspect-[4/3]",
  gap = 14,
  label,
}: {
  items: MarqueeTile[];
  className?: string;
  speed?: number;
  reverse?: boolean;
  tileClassName?: string;
  gap?: number;
  /** Names the row for screen readers, e.g. "Study destinations". */
  label?: string;
}) {
  /* The keyframe translates the doubled strip by exactly -50%, i.e.
     one track width, so the loop only closes while a single track is
     wider than the viewport. Six destinations at 19rem come to about
     1900px — narrower than a large desktop, which would show a gap at
     the wrap. Repeating the list until there are at least eight tiles
     closes the loop without changing what is on screen. */
  const MIN_TILES = 8;
  const filled =
    items.length === 0 || items.length >= MIN_TILES
      ? items
      : Array.from({ length: Math.ceil(MIN_TILES / items.length) }, () => items).flat();

  /* `dup` renders the visual duplicate that makes the loop seamless.
     It is hidden from assistive tech AND taken out of the tab order:
     without tabIndex={-1} every destination would appear twice when
     tabbing through, landing on the same page both times. */
  const track = (dup: boolean) => (
    <div className="flex shrink-0 items-stretch" style={{ gap, paddingRight: gap }}>
      {filled.map((item, i) => {
        const src = img(item.id);
        return (
          <Link
            key={`${item.id}-${item.href}-${i}`}
            href={item.href}
            aria-hidden={dup || undefined}
            tabIndex={dup ? -1 : undefined}
            className={cn(
              "group/tile relative shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-line",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-bright)]",
              tileClassName,
            )}
          >
            {src ? (
              <Image
                src={src.src}
                alt={src.alt}
                fill
                sizes="(max-width: 640px) 60vw, 20vw"
                placeholder="blur"
                blurDataURL={solidBlur(src.avgColor)}
                className="object-cover transition-transform duration-[900ms] ease-out group-hover/tile:scale-[1.06]"
              />
            ) : (
              <Placeholder className="absolute inset-0" seed={hashId(item.id)} />
            )}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, rgba(5,15,34,0.88), rgba(5,15,34,0.18) 48%, transparent 72%)",
              }}
            />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] font-semibold tracking-[-0.005em] text-white">
                  {item.caption}
                </span>
                {item.meta && (
                  <span className="mt-0.5 block truncate text-[0.6875rem] text-on-dark-secondary">
                    {item.meta}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full material-chip-dark opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
              >
                <ArrowUpRight className="size-3.5" />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
      }}
    >
      {/* Pauses on hover so a moving tile can actually be clicked, and
          on focus-within so it stops for keyboard users too. */}
      <ul
        aria-label={label}
        className="flex w-max animate-marquee list-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={
          {
            "--marquee-duration": `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <li className="contents">{track(false)}</li>
        <li aria-hidden className="contents">
          {track(true)}
        </li>
      </ul>
    </div>
  );
}
