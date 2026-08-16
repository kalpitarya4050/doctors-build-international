import type { ReactNode } from "react";
import { STATS } from "@/lib/data/content";
import { Counter } from "@/components/ui/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ============================================================
   Editorial statistics.

   Previously a flat four-up grid of bold sans numbers, which read
   as a dashboard. The reference sets its figures very large in the
   display serif and steps each one further down the page, so the
   block scans as a diagonal rather than a row — the numbers get to
   be the composition instead of sitting inside one.

   The cascade is desktop-only; on a phone it collapses to a plain
   two-column grid, because a 30% offset per item on a narrow column
   just produces a very tall, very empty section.
   ============================================================ */

/** One destination hue per figure. Reading left to right they walk
 *  the same spectrum the country cards use, so the two sections are
 *  visibly part of the same system. */
const RULE_HUES = [
  "var(--dest-georgia)",
  "var(--dest-russia)",
  "var(--dest-uzbekistan)",
  "var(--dest-kyrgyzstan)",
];

export function Stats({
  eyebrow = "By The Numbers",
  title = (
    <>
      Numbers we can <em>stand behind</em>.
    </>
  ),
  lead = "Every figure below is ours, not an industry average — students we placed, families who trusted us with the decision, and the universities we actually work with.",
  cta,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <section data-ground="linen" className="section relative" aria-label="Key figures">
      <div className="shell">
        {/* Heading left, standfirst right — the reference's split. */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Reveal direction="up">
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.05}>
              <h2 className="t-h2 mt-5 max-w-[18ch] text-brand">{title}</h2>
            </Reveal>
          </div>
          {lead && (
            <Reveal direction="up" delay={0.1}>
              <p className="t-body max-w-[46ch] lg:pt-3">{lead}</p>
            </Reveal>
          )}
        </div>

        <RevealGroup
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-14 lg:mt-24 lg:grid-cols-4 lg:gap-x-10 lg:pb-24"
          stagger={0.1}
        >
          {STATS.map((s, i) => (
            <RevealItem
              key={s.label}
              className={cn(
                // Each figure steps further down than the last.
                i === 1 && "lg:translate-y-[28%]",
                i === 2 && "lg:translate-y-[56%]",
                i === 3 && "lg:translate-y-[84%]",
              )}
            >
              <p className="t-figure t-figure-xl grad-text">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  decimal={"decimal" in s ? s.decimal : false}
                />
              </p>
              {/* Hairline under the figure, then the label — the rule is
                  what makes it read as a caption rather than a stack.
                  One spectrum hue per figure, so the four rules read
                  left to right as the destination range. */}
              <span
                aria-hidden
                className="mt-5 block h-[2px] w-full rounded-full"
                style={{ background: RULE_HUES[i % RULE_HUES.length] }}
              />
              <p className="mt-4 text-[0.9375rem] font-semibold tracking-[-0.005em] text-ink">
                {s.label}
              </p>
              <p className="t-caption mt-1">{s.sub}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {cta && (
          <Reveal direction="up" delay={0.2}>
            <div className="mt-16 flex justify-center lg:mt-8">
              <Button href={cta.href} variant="gold" size="lg">
                {cta.label}
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
