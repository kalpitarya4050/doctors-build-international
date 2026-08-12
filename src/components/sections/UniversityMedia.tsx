"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X, Expand, Camera, MapPin } from "lucide-react";
import type { UniImage } from "@/lib/data/university-images";
import { SPRING_UI, SPRING_SHEET, EASE_OUT } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ============================================================
   Renders the nine slots from the client's image manifest:
   five university-context shots and four of the host city.

   The two groups are labelled differently on purpose. City shots
   are genuine photographs of the named place. University shots
   are illustrative of medical study — they are not that
   institution's campus — and the UI says so rather than letting
   a family assume otherwise.
   ============================================================ */

const BENTO = [
  "col-span-2 row-span-2",
  "",
  "",
  "col-span-2",
  "",
  "col-span-2 row-span-2",
  "",
  "",
  "col-span-2",
];

export function UniversityMedia({
  campus,
  city,
  universityName,
  place,
}: {
  campus: UniImage[];
  city: UniImage[];
  universityName: string;
  place: string;
}) {
  const all = [...city, ...campus];
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + all.length) % all.length)),
    [all.length],
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

  if (all.length === 0) return null;
  const active = open === null ? null : all[open];

  return (
    <section className="section relative bg-[var(--bg-sunken)]" aria-labelledby="uni-media">
      <div className="shell">
        <SectionHeading
          eyebrow={place}
          title={
            <>
              Life at <span className="gold-text">{universityName}</span>, in pictures
            </>
          }
          lead={`The city you would be living in, and what studying medicine there looks like day to day.`}
        />

        <Reveal direction="up" className="mt-14">
          <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 lg:grid-cols-4">
            {all.map((item, i) => (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View: ${item.label}`}
                className={cn(
                  "group relative overflow-hidden rounded-[var(--radius-lg)] border border-line",
                  BENTO[i] ?? "",
                )}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...SPRING_UI, delay: (i % 5) * 0.05 }}
                whileTap={{ scale: 0.985 }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(5,15,34,0.9), rgba(5,15,34,0.2) 48%, transparent 74%)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left">
                  <span>
                    <span className="flex items-center gap-1.5 text-[0.8125rem] font-semibold leading-tight text-white">
                      {item.isPlace && <MapPin className="size-3 shrink-0" />}
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[0.6875rem] text-white/60">
                      {item.isPlace ? item.place : "Illustrative"}
                    </span>
                  </span>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/12 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="size-3.5" />
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.12}>
          <p className="t-small mx-auto mt-8 flex max-w-[76ch] items-start justify-center gap-2 text-center">
            <Camera className="mt-0.5 size-3.5 shrink-0" />
            <span>
              City photographs show {place}. The teaching, laboratory and hospital images are
              illustrative of medical study abroad and are not photographs of this
              university&rsquo;s own campus — ask a counsellor and we will send you current campus
              photographs and video.
            </span>
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <div className="mt-9 flex justify-center">
            <Button href="#counselling" variant="outline" size="lg">
              Request campus photos &amp; video
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-8">
            <motion.div
              className="absolute inset-0 bg-[var(--navy-950)]/93 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={EASE_OUT}
              onClick={close}
            />
            <motion.figure
              key={active.key}
              role="dialog"
              aria-modal="true"
              aria-label={active.label}
              className="relative flex max-h-[88dvh] w-full max-w-5xl flex-col"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={reduced ? { duration: 0.2 } : SPRING_SHEET}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--navy-900)]">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4">
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-white">
                    {active.label}
                    {active.isPlace && (
                      <span className="ml-2 font-normal text-white/55">· {active.place}</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] text-white/45">
                    {active.isPlace ? "" : "Illustrative · "}Photo: {active.photographer} / Pexels
                  </span>
                </span>
                <span className="text-[0.8125rem] tabular-nums text-white/45">
                  {(open ?? 0) + 1} / {all.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur hover:bg-white/16 sm:right-8 sm:top-8"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur hover:bg-white/16 sm:left-6"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur hover:bg-white/16 sm:right-6"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
