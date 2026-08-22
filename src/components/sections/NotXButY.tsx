"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Surface";
import { OrbField } from "@/components/ui/Decor";
import { Media } from "@/components/ui/Media";
import { VIEWPORT, SPRING_UI } from "@/lib/motion";

/* ============================================================
   "It's not X — it's Y."

   Three corrections, each striking through the thing families are
   sold elsewhere and replacing it with what is actually on offer
   here. Every claim below already appears somewhere on the site;
   this section is the compressed version of the argument, not a
   new one.

   The strike-through draws itself on scroll, so the correction
   happens in front of you rather than arriving pre-made.
   ============================================================ */

const LINES = [
  {
    not: "a donation",
    is: "zero capitation",
    tail: "— every rupee goes to the university's own account, and you keep the receipt.",
  },
  {
    not: "a brochure figure",
    is: "the whole six-year total",
    tail: "— tuition, hostel and living costs, published before you commit to anything.",
  },
  {
    not: "an agency desk",
    is: "doctor-led counselling",
    tail: "— the people who shortlist your university have practised medicine.",
  },
] as const;

export function NotXButY() {
  return (
    <section className="section relative isolate overflow-hidden" data-ground="linen" aria-labelledby="notx-title">
      <OrbField tone="violet" count={2} intensity={0.32} />

      {/* The three corrections carry the argument; the portrait is
          what makes them checkable. Claims this blunt read as
          marketing until there is a face and a place attached to
          them, so the photograph sits beside the copy rather than
          under it. */}
      <div className="shell grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>⚡ Straight Answers</Eyebrow>
          </Reveal>

          <h2 id="notx-title" className="sr-only">
            What we are and what we are not
          </h2>

          <div className="mt-9 space-y-9 sm:space-y-11">
            {LINES.map((line, i) => (
              <Line key={line.is} line={line} index={i} />
            ))}
          </div>
        </div>

        <DeanPortrait />
      </div>
    </section>
  );
}

function Line({ line, index }: { line: (typeof LINES)[number]; index: number }) {
  const reduced = useReducedMotion();

  return (
    <Reveal direction="up" delay={index * 0.08}>
      <p className="t-h2 max-w-[24ch] text-brand sm:max-w-[30ch]">
        <span className="text-ink-muted">It&rsquo;s not </span>
        <span className="relative inline-block whitespace-nowrap text-ink-muted">
          {line.not}
          {/* Rule drawn through, not a text-decoration: it has to
              arrive after the words, not with them. */}
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-[55%] h-[0.08em] origin-left rounded-full bg-[var(--red-600)]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={
              reduced
                ? { duration: 0.001 }
                : { duration: 0.5, delay: 0.35 + index * 0.08, ease: [0.22, 1, 0.36, 1] }
            }
          />
        </span>
        <span className="text-ink-muted"> — it&rsquo;s </span>
        <em className="t-accent">{line.is}</em>
        <span className="t-lead mt-2 block !text-ink-secondary">{line.tail}</span>
      </p>
    </Reveal>
  );
}

/* ============================================================
   The portrait.

   A true ellipse, not a pill: `rounded-full` on a 4:5 box gives a
   stadium with straight sides, while `rounded-[50%]` resolves the
   radius against each axis and gives the oval frame this wants.

   Three things move, all of them on scroll:

     · the frame rises and settles on a spring as it enters;
     · the gold rule draws itself around the ellipse, the same
       gesture as the strike-throughs beside it, so the section
       reads as one idea rather than a column plus a picture;
     · the photograph drifts a few percent against the frame while
       the section crosses the viewport, which is what keeps an
       oval from looking like a sticker.

   The image is deliberately over-tall inside its clip so the drift
   never exposes an edge. It is also a purpose-cut 4:5 portrait
   rather than the full-length original: centring a 3:4 photograph
   in a 4:5 hole crops heads first, and zooming past that with
   object-position would upscale an already-downscaled file.
   ============================================================ */
function DeanPortrait() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);

  return (
    <motion.figure
      ref={ref}
      className="relative mx-auto w-full max-w-[19rem] lg:mx-0 lg:max-w-none"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.94 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={reduced ? { duration: 0.2 } : SPRING_UI}
    >
      <div className="relative aspect-[4/5]">
        <div className="absolute inset-0 overflow-hidden rounded-[50%] shadow-[var(--shadow-xl)]">
          <motion.div
            className="absolute inset-x-0 -inset-y-[6%]"
            style={reduced ? undefined : { y: drift }}
          >
            <Media
              id="dbi-ncsa-dean-portrait"
              className="size-full"
              imgClassName="object-cover object-center"
              sizes="(max-width: 1024px) 19rem, 21rem"
            />
          </motion.div>
        </div>

        {/* The rule, drawn rather than painted. Its own SVG box so
            the stroke scales with the frame instead of distorting. */}
        <svg
          aria-hidden
          viewBox="0 0 400 500"
          className="pointer-events-none absolute -inset-[3%] size-[106%]"
          fill="none"
        >
          <defs>
            <linearGradient id="dean-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--gold-600)" />
              <stop offset="45%" stopColor="var(--gold-300)" />
              <stop offset="100%" stopColor="var(--gold-600)" />
            </linearGradient>
          </defs>
          <motion.ellipse
            cx="200"
            cy="250"
            rx="196"
            ry="246"
            stroke="url(#dean-ring)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={
              reduced
                ? { duration: 0.001 }
                : { duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }
            }
          />
        </svg>
      </div>

      <figcaption className="t-small mt-5 text-center lg:text-left">
        With the Dean of North Caucasian State Academy, Cherkessk — one of the universities we
        place students at.
      </figcaption>
    </motion.figure>
  );
}
