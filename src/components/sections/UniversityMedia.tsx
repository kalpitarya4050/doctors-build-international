"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X, Expand, Camera, MapPin } from "lucide-react";
import type { GalleryImage } from "@/lib/data/owned-photos";
import { withBasePath } from "@/lib/images";
import { SPRING_UI, SPRING_SHEET, EASE_OUT } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ============================================================
   Renders nine tiles: five of the university, four of the host city.

   Every caption in here turns on whether the picture is real. City
   shots are genuine photographs of the named place. The five campus
   tiles are one of two things, and the UI must never blur them:

     · `campusIsOwned` — the client's own photographs of that campus.
       Credited to Doctors Build International, no disclaimer.

     · otherwise — Pexels stock, illustrative of medical study and
       NOT that institution. Every tile is badged "Illustrative", the
       lightbox repeats it, and the footnote says so in full.

   A family reading this page is choosing where to send a child and
   several lakhs. Captioning stock as campus would be found out after
   they had paid, so the disclaimer is driven by data rather than
   left to whoever edits this next.
   ============================================================ */

// On a 2-column phone grid a "col-span-2 row-span-2" tile becomes a
// full-width double-height block, which is right for the lead image
// but wrong for the rest. Spans only apply from sm upward.
const BENTO = [
  "col-span-2 row-span-2",
  "",
  "",
  "sm:col-span-2",
  "",
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:col-span-2",
];

export function UniversityMedia({
  campus,
  city,
  universityName,
  place,
  campusIsOwned = false,
}: {
  campus: GalleryImage[];
  city: GalleryImage[];
  universityName: string;
  place: string;
  /** True where the five campus tiles are the client's own
   *  photographs of this campus rather than illustrative stock. */
  campusIsOwned?: boolean;
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
              Life at <em>{universityName}</em>, in pictures
            </>
          }
          lead={`The city you would be living in, and what studying medicine there looks like day to day.`}
        />

        <Reveal direction="up" className="mt-14">
          <div className="grid auto-rows-[8.5rem] grid-cols-2 gap-2.5 sm:auto-rows-[10rem] sm:gap-3 lg:grid-cols-4">
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
                  src={withBasePath(item.src)}
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
                    <span className="mt-0.5 block text-[0.6875rem] text-on-dark-secondary">
                      {item.isPlace ? item.place : "Illustrative"}
                    </span>
                  </span>
                  <span className="grid size-7 shrink-0 place-items-center material-chip-dark rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
              {campusIsOwned ? (
                <>
                  Campus photographs are our own, taken at {universityName}. City photographs show{" "}
                  {place}. Ask a counsellor and we will send you the full set, including video of
                  the hostel, mess and teaching hospital.
                </>
              ) : (
                <>
                  City photographs show {place}. The teaching, laboratory and hospital images are
                  illustrative of medical study abroad and are not photographs of this
                  university&rsquo;s own campus — ask a counsellor and we will send you current
                  campus photographs and video.
                </>
              )}
            </span>
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <div className="mt-9 flex justify-center">
            <Button href="#counselling" variant="outline" size="lg">
              {campusIsOwned ? <>Request more photos &amp; video</> : <>Request campus photos &amp; video</>}
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
                  src={withBasePath(active.src)}
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
                      <span className="ml-2 font-normal text-on-dark-muted">· {active.place}</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] text-on-dark-muted">
                    {active.isPlace ? "" : "Illustrative · "}Photo: {active.photographer}
                    {active.owned ? "" : " / Pexels"}
                  </span>
                </span>
                <span className="text-[0.8125rem] tabular-nums text-on-dark-muted">
                  {(open ?? 0) + 1} / {all.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full material-chip-dark hover:bg-on-dark-fill-hover sm:right-8 sm:top-8"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full material-chip-dark hover:bg-on-dark-fill-hover sm:left-6"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full material-chip-dark hover:bg-on-dark-fill-hover sm:right-6"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
