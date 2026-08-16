"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { img, isOwned } from "@/lib/images";
import { Placeholder, solidBlur, hashId } from "./Media";
import { SPRING_UI, SPRING_SHEET, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  caption: string;
  /** Tailwind span classes for the bento layout. */
  span?: string;
}

export function Gallery({
  items,
  className,
}: {
  items: GalleryItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const active = open === null ? null : items[open];
  const activeSrc = active ? img(active.id) : undefined;

  return (
    <>
      <div className={cn("grid auto-rows-[8.5rem] grid-cols-2 gap-2.5 sm:auto-rows-[11rem] sm:gap-3 lg:grid-cols-4", className)}>
        {items.map((item, i) => {
          const src = img(item.id);
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View: ${item.caption}`}
              className={cn(
                "group relative overflow-hidden rounded-[var(--radius-lg)] border border-line",
                item.span,
              )}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...SPRING_UI, delay: (i % 6) * 0.05 }}
              whileTap={{ scale: 0.985 }}
            >
              {src ? (
                <Image
                  src={src.src}
                  alt={src.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={solidBlur(src.avgColor)}
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
              ) : (
                <Placeholder className="absolute inset-0" seed={hashId(item.id)} />
              )}

              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(5,15,34,0.88), rgba(5,15,34,0.2) 48%, transparent 72%)",
                }}
              />

              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left">
                <span className="text-[0.8125rem] font-semibold leading-tight tracking-[-0.005em] text-white">
                  {item.caption}
                </span>
                <span className="grid size-7 shrink-0 place-items-center material-chip-dark rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Expand className="size-3.5" />
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-8">
            <motion.div
              className="absolute inset-0 bg-[var(--navy-950)]/92 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={EASE_OUT}
              onClick={close}
            />

            <motion.figure
              key={active.id}
              role="dialog"
              aria-modal="true"
              aria-label={active.caption}
              className="relative flex max-h-[88dvh] w-full max-w-5xl flex-col"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={reduced ? { duration: 0.2 } : SPRING_SHEET}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--navy-900)]">
                {activeSrc ? (
                  <Image
                    src={activeSrc.src}
                    alt={activeSrc.alt}
                    fill
                    sizes="90vw"
                    placeholder="blur"
                    blurDataURL={solidBlur(activeSrc.avgColor)}
                    className="object-cover"
                  />
                ) : (
                  <Placeholder className="absolute inset-0" seed={hashId(active.id)} />
                )}
              </div>

              <figcaption className="mt-4 flex items-center justify-between gap-4">
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-white">
                    {active.caption}
                  </span>
                  {activeSrc && (
                    <span className="mt-0.5 block text-[0.75rem] text-on-dark-muted">
                      {isOwned(active.id)
                        ? `Photo: ${activeSrc.photographer}`
                        : `Illustrative · Photo: ${activeSrc.photographer} / Pexels`}
                    </span>
                  )}
                </span>
                <span className="text-[0.8125rem] tabular-nums text-on-dark-muted">
                  {(open ?? 0) + 1} / {items.length}
                </span>
              </figcaption>
            </motion.figure>

            {/* Controls */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full material-chip-dark transition-colors hover:bg-on-dark-fill-hover sm:right-8 sm:top-8"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full material-chip-dark transition-colors hover:bg-on-dark-fill-hover sm:left-6"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full material-chip-dark transition-colors hover:bg-on-dark-fill-hover sm:right-6"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
