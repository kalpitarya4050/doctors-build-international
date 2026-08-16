import Link from "next/link";
import { Table2 } from "lucide-react";
import { UNIVERSITIES, PACKAGE_INCLUDES, type University } from "@/lib/data/universities";
import { uniImage } from "@/lib/data/media-map";
import { Media, Scrim } from "@/components/ui/Media";
import { Flag } from "@/components/ui/Flag";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { AnimatedArrow, CheckList, Sparkle } from "@/components/ui/Bits";
import { DotGrid } from "@/components/ui/Decor";
import { formatTotal } from "@/components/ui/UniversityCard";
import { inrShort, cn } from "@/lib/utils";

/* ============================================================
   THREE TIERS.

   Not service packages — DBI does not sell those, and inventing
   prices for them would put made-up numbers on the one page
   families read most carefully.

   Instead the tiers are the real spread of published six-year
   totals: the cheapest option we hold a figure for, the one in
   the middle, and the dearest. Every rupee below comes from
   universities.ts. The 17 universities without published fees are
   excluded entirely — a pricing block is the last place to imply
   a number we do not have.
   ============================================================ */

const PRICED = UNIVERSITIES.filter(
  (u): u is University & { totalExpenseInr: number } =>
    u.hasPublishedFees && u.totalExpenseInr !== null,
).sort((a, b) => a.totalExpenseInr - b.totalExpenseInr);

type Tier = {
  university: University & { totalExpenseInr: number };
  label: string;
  blurb: string;
  featured: boolean;
};

/** Cheapest, median and dearest of the published set. Computed
 *  rather than hard-coded, so adding a priced university to
 *  universities.ts re-points these automatically.
 *
 *  The labels describe POSITION IN THE PUBLISHED RANGE and nothing
 *  else. An earlier draft called the middle one "most chosen" —
 *  which would be a claim about DBI's actual placement mix, and
 *  that number is not in this codebase. Since the cards are
 *  computed, no blurb may assume a particular country either. */
const TIERS: Tier[] = [
  {
    university: PRICED[0],
    label: "Lowest published",
    blurb: "The smallest six-year total we hold a published figure for, living costs included.",
    featured: false,
  },
  {
    university: PRICED[Math.floor(PRICED.length / 2)],
    label: "Mid-range",
    blurb: "The middle of our published range — the usual balance point between total cost and clinical exposure.",
    featured: true,
  },
  {
    university: PRICED[PRICED.length - 1],
    label: "Highest published",
    blurb: "The largest six-year total on our published list. Every rupee of it is on the university's own invoice.",
    featured: false,
  },
];

/** Country → its hue from the client's own poster. */
const DEST_TINT: Record<string, string> = {
  georgia: "var(--dest-georgia)",
  russia: "var(--dest-russia)",
  kazakhstan: "var(--dest-kazakhstan)",
  china: "var(--dest-china)",
  uzbekistan: "var(--dest-uzbekistan)",
  kyrgyzstan: "var(--dest-kyrgyzstan)",
};

export function FeeTeaser() {
  return (
    <section className="section relative isolate" data-ground="white" aria-labelledby="fees-title">
      <DotGrid />

      <div className="shell">
        <SectionHeading
          eyebrow="💰 Transparent Pricing"
          title={
            <>
              Three budgets. <em>Nothing discovered later.</em>
            </>
          }
          lead="Zero donation. Zero capitation. Where a university publishes its fees we show you the whole six-year total, not just the first instalment — and where it does not, we say so and confirm the figure with you in writing."
        />

        <RevealGroup className="mt-14 grid items-start gap-6 lg:grid-cols-3" stagger={0.09}>
          {TIERS.map((tier) => (
            <RevealItem key={tier.university.slug}>
              <TierCard tier={tier} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal direction="up" delay={0.14}>
          <p className="t-caption mt-7 text-center text-ink-muted">
            Figures are the published six-year total including living costs, converted at the
            rate printed in the {new Date().getFullYear()} brochure. {UNIVERSITIES.length - PRICED.length} of our{" "}
            {UNIVERSITIES.length} universities do not publish fees — those are quoted on request,
            in writing.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.18}>
          <div className="hover-lift mt-10 flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-line bg-[var(--bg-sunken)] p-7 text-center transition-shadow sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                <Table2 className="size-5" />
              </span>
              <div>
                <p className="t-h4 text-brand">Compare all {UNIVERSITIES.length}, side by side.</p>
                <p className="t-small mt-1.5">
                  Tuition, total expense, duration, intake, FMGE pass rate, Indian student numbers
                  and safety rating — sortable, filterable, in USD or rupees.
                </p>
              </div>
            </div>
            <Button href="/fee-comparison" variant="gold" size="lg" className="group shrink-0">
              Open the comparison
              <AnimatedArrow />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const u = tier.university;
  const hue = DEST_TINT[u.countrySlug] ?? "var(--navy-600)";

  return (
    <Link
      href={`/universities/${u.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] transition-[transform,box-shadow] duration-300",
        tier.featured
          ? "bg-[var(--navy-950)] shadow-[var(--shadow-xl)] ring-2 ring-[var(--gold-500)] lg:-translate-y-4 hover:-translate-y-6"
          : "material-card hover:-translate-y-2 hover:shadow-[var(--shadow-xl)]",
      )}
      data-ground={tier.featured ? "navy" : undefined}
    >
      {/* Country hue as a top rule — the poster's colour-coding. */}
      <span aria-hidden className="h-1.5 w-full shrink-0" style={{ background: hue }} />

      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
        <Media
          id={uniImage(u.slug)}
          className="absolute inset-0"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <Scrim strength="medium" />
        <Flag
          country={u.countrySlug}
          className="absolute left-4 top-4 h-5 w-[1.875rem] shadow-[var(--shadow-badge)]"
        />
        <span
          className={cn(
            "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.06em]",
            tier.featured ? "bg-[var(--gold-500)] text-[var(--navy-950)]" : "bg-white/90 text-[var(--navy-900)]",
          )}
        >
          {tier.featured && <Sparkle className="size-3 text-[var(--navy-950)]" />}
          {tier.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3
          className={cn(
            "t-h4 transition-colors",
            tier.featured ? "text-on-dark" : "text-brand group-hover:text-[var(--accent)]",
          )}
        >
          {u.shortName}
        </h3>
        <p className={cn("mt-1 text-[0.8125rem]", tier.featured ? "text-on-dark-muted" : "text-ink-muted")}>
          {u.city}, {u.country}
        </p>

        <div className="mt-6">
          <p
            className={cn(
              "text-[0.625rem] font-semibold uppercase tracking-[0.06em]",
              tier.featured ? "text-on-dark-muted" : "text-ink-muted",
            )}
          >
            Total, all six years
          </p>
          <p
            className={cn(
              "t-num t-figure mt-1.5 text-[2.5rem] font-bold leading-none",
              tier.featured ? "gold-text" : "text-brand",
            )}
          >
            {inrShort(u.totalExpenseInr)}
          </p>
          <p
            className={cn(
              "t-num mt-1.5 text-[0.8125rem]",
              tier.featured ? "text-on-dark-muted" : "text-ink-muted",
            )}
          >
            {formatTotal(u)} · incl. living costs
          </p>
        </div>

        <p className={cn("t-small mt-5", tier.featured ? "!text-on-dark-secondary" : "")}>
          {tier.blurb}
        </p>

        <div
          className={cn(
            "mt-6 border-t pt-6",
            tier.featured ? "border-[var(--on-dark-line)]" : "border-line",
          )}
        >
          <p
            className={cn(
              "t-eyebrow mb-4",
              tier.featured ? "text-[var(--gold-300)]" : "text-[var(--accent)]",
            )}
          >
            Handled by our team
          </p>
          {/* Same unpriced inclusions on every tier — the support
              does not change with the university, and pretending it
              does is how tiered pricing usually lies. */}
          <CheckList items={PACKAGE_INCLUDES.slice(0, 5)} tone={tier.featured ? "gold" : "green"} />
        </div>

        <span
          className={cn(
            "mt-7 inline-flex items-center gap-2 text-[0.875rem] font-semibold",
            tier.featured ? "text-[var(--gold-300)]" : "text-[var(--accent)]",
          )}
        >
          See the full breakdown
          <AnimatedArrow />
        </span>
      </div>
    </Link>
  );
}
