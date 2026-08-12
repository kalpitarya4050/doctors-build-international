import Link from "next/link";
import { ArrowRight, Table2 } from "lucide-react";
import { UNIVERSITIES } from "@/lib/data/universities";
import { uniImage, uniCaption } from "@/lib/data/media-map";
import { Media, Scrim } from "@/components/ui/Media";
import { Flag } from "@/components/ui/Flag";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { formatTotal } from "@/components/ui/UniversityCard";
import { inrShort } from "@/lib/utils";

/** The three cheapest options, as a hook into the full table. */
const CHEAPEST = [...UNIVERSITIES]
  .filter((u) => u.totalExpenseInr !== null)
  .sort((a, b) => (a.totalExpenseInr ?? 0) - (b.totalExpenseInr ?? 0))
  .slice(0, 3);

export function FeeTeaser() {
  return (
    <section className="section relative" aria-labelledby="fees-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Transparent Pricing"
          title={
            <>
              Every fee, <span className="gold-text">published</span>. Nothing discovered later.
            </>
          }
          lead="Zero donation. Zero capitation. The published tuition is the entire tuition — and we show you the six-year total, not just the first instalment."
        />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.08}>
          {CHEAPEST.map((u, i) => (
            <RevealItem key={u.slug}>
              <Link
                href={`/universities/${u.slug}`}
                className="group material-card relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)]"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Media
                    id={uniImage(u.slug)}
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Scrim strength="medium" />
                  {i === 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-[var(--green-600)] px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.06em] text-white uppercase">
                      Best value
                    </span>
                  )}
                  <Flag country={u.countrySlug} className="absolute left-4 top-4 h-5 w-[1.875rem] shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
                  <p className="absolute inset-x-0 bottom-0 p-4 text-[0.75rem] font-medium text-white/85">
                    {uniCaption(u.slug)}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="t-h4 text-brand group-hover:text-[var(--accent)] transition-colors">
                    {u.shortName}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] text-ink-muted">
                    {u.city}, {u.country}
                  </p>

                  <div className="mt-auto pt-7">
                    <p className="text-[0.625rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                      Total, all six years
                    </p>
                    <p className="t-num mt-1.5 font-[family-name:var(--font-playfair)] text-[1.875rem] font-bold leading-none text-brand">
                      {u.totalExpenseInr ? inrShort(u.totalExpenseInr) : "On request"}
                    </p>
                    <p className="t-num mt-1.5 text-[0.8125rem] text-ink-muted">
                      {formatTotal(u)} · incl. living costs
                    </p>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal direction="up" delay={0.14}>
          <div className="mt-10 flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-line bg-[var(--bg-sunken)] p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                <Table2 className="size-5" />
              </span>
              <div>
                <p className="t-h4 text-brand">Compare all seven, side by side.</p>
                <p className="t-small mt-1.5">
                  Tuition, total expense, duration, intake, FMGE pass rate, Indian student numbers
                  and safety rating — sortable, filterable, in USD or rupees.
                </p>
              </div>
            </div>
            <Button href="/fee-comparison" variant="gold" size="lg" className="shrink-0">
              Open the comparison
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
