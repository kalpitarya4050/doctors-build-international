"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Surface";
import { OrbField } from "@/components/ui/Decor";
import { VIEWPORT } from "@/lib/motion";

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

      <div className="shell">
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
