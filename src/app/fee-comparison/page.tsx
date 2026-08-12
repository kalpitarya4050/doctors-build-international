import type { Metadata } from "next";
import { Info, TrendingDown, ShieldOff, Receipt } from "lucide-react";
import { UNIVERSITIES, ADDITIONAL_COSTS } from "@/lib/data/universities";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { FeeTable } from "@/components/ui/FeeTable";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";
import { inrShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: `MBBS Abroad Fee Comparison ${SITE.admissionYear} — All Seven Universities`,
  description:
    "Compare MBBS abroad fees across seven NMC-approved universities in Georgia, Russia, Uzbekistan, Kyrgyzstan and Nepal. Tuition, total six-year cost, living expenses and FMGE pass rates — sortable, in USD or INR.",
  alternates: { canonical: "/fee-comparison" },
  keywords: [
    "MBBS abroad fees comparison",
    "cheapest MBBS abroad",
    "low cost MBBS for Indian students",
    "MBBS abroad total cost",
    "MBBS fees in rupees",
  ],
};

const cheapest = [...UNIVERSITIES]
  .filter((u) => u.totalExpenseInr !== null)
  .sort((a, b) => (a.totalExpenseInr ?? 0) - (b.totalExpenseInr ?? 0))[0];

const dearest = [...UNIVERSITIES]
  .filter((u) => u.totalExpenseInr !== null)
  .sort((a, b) => (b.totalExpenseInr ?? 0) - (a.totalExpenseInr ?? 0))[0];

export default function FeeComparisonPage() {
  return (
    <>
      <PageHero
        eyebrow={`Admission Portfolio ${SITE.admissionYear}`}
        title="Every fee, on one page."
        highlight={["fee,"]}
        crumbs={[{ label: "Fee Comparison" }]}
        image="documents"
        lead="This is our official Admission Portfolio, made interactive. Tuition, total six-year expense, monthly living costs, duration, intake, FMGE pass rates and safety ratings for all seven universities — sortable and switchable between local currency and rupees."
      />

      {/* Headline numbers */}
      <section className="border-y border-hairline bg-[var(--bg-sunken)] py-12" aria-label="Cost range">
        <div className="shell">
          <RevealGroup className="grid gap-8 sm:grid-cols-3" stagger={0.07}>
            <RevealItem>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
                  <TrendingDown className="size-4 text-[var(--green-600)]" />
                  Lowest total cost
                </span>
                <span className="t-num font-[family-name:var(--font-playfair)] text-[2.25rem] font-bold leading-none text-brand">
                  {cheapest?.totalExpenseInr ? inrShort(cheapest.totalExpenseInr) : "—"}
                </span>
                <span className="t-small">
                  {cheapest?.shortName} · {cheapest?.country}
                </span>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
                  <Receipt className="size-4 text-[var(--accent)]" />
                  Highest total cost
                </span>
                <span className="t-num font-[family-name:var(--font-playfair)] text-[2.25rem] font-bold leading-none text-brand">
                  {dearest?.totalExpenseInr ? inrShort(dearest.totalExpenseInr) : "—"}
                </span>
                <span className="t-small">
                  {dearest?.shortName} · {dearest?.country}
                </span>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
                  <ShieldOff className="size-4 text-[var(--green-600)]" />
                  Donation / capitation
                </span>
                <span className="font-[family-name:var(--font-playfair)] text-[2.25rem] font-bold leading-none text-[var(--green-600)]">
                  Zero
                </span>
                <span className="t-small">At every university, at every stage</span>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* The table */}
      <section className="section" aria-labelledby="table">
        <div className="shell">
          <Reveal direction="up">
            <FeeTable />
          </Reveal>
        </div>
      </section>

      {/* Additional costs */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="additional">
        <div className="shell">
          <SectionHeading
            eyebrow="Full Transparency"
            title={
              <>
                What the table <span className="gold-text">does not</span> include
              </>
            }
            lead="These costs sit outside the university's quoted total. Nobody should discover them after paying a deposit, so here they are up front."
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {ADDITIONAL_COSTS.map((c) => (
              <RevealItem key={c.label}>
                <div className="material-card flex h-full flex-col rounded-[var(--radius-lg)] p-6">
                  <p className="t-h4 text-brand">{c.label}</p>
                  <p className="t-num mt-2 text-[1.0625rem] font-bold text-[var(--accent)]">
                    {c.amount}
                  </p>
                  <p className="t-small mt-3 leading-relaxed">{c.note}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal direction="up" delay={0.16}>
            <div className="mt-10 flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-[var(--bg-elevated)] p-6">
              <Info className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
              <div>
                <p className="t-h4 text-brand">How to read these figures</p>
                <p className="t-small mt-2 max-w-[76ch] leading-relaxed">
                  &ldquo;Tuition&rdquo; is the university&rsquo;s published academic fee for the full
                  course. &ldquo;Total expense&rdquo; is that tuition plus the university&rsquo;s
                  quoted associated costs across the programme. INR conversions are approximate and
                  move with the exchange rate — a rouble-denominated course can shift several lakh
                  over six years, which is one reason our USD-denominated options in Georgia,
                  Uzbekistan and Kyrgyzstan are worth considering if budget certainty matters to your
                  family. All figures are as per official brochures for {SITE.admissionYear}; confirm
                  the current position with the university or its official representative before
                  applying.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LeadSection
        source="fee-comparison"
        heading={
          <>
            Which of these fits <span className="gold-text">your</span> budget?
          </>
        }
        lead="Send us your NEET score and what your family can realistically spend across six years. We will come back with two or three genuine matches — and tell you honestly if none of them work."
      />
    </>
  );
}
