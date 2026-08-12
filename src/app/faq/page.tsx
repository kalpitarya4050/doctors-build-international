import type { Metadata } from "next";
import { FAQS, FAQ_CATEGORIES, faqsByCategory } from "@/lib/data/faq";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Surface";
import { SITE } from "@/lib/site";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MBBS Abroad FAQs — NEET, FMGE, Fees, Safety & Recognition",
  description:
    "Thirty straight answers on studying MBBS abroad: is NEET compulsory, what NEET score you need, total cost, FMGE and NExT, NMC 2021 regulations, safety, Indian food, visa process and documents required.",
  alternates: { canonical: "/faq" },
  keywords: [
    "is NEET compulsory for MBBS abroad",
    "FMGE pass rate MBBS abroad",
    "NMC 2021 regulations foreign medical graduate",
    "MBBS abroad total cost",
    "documents required MBBS abroad",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow="Questions & Answers"
        title="Thirty questions. Thirty straight answers."
        highlight={["straight"]}
        crumbs={[{ label: "FAQs" }]}
        image="students-study"
        lead="Including the ones other consultancies avoid — what happens if your visa is rejected, whether you should use a consultancy at all, and what the total cost really comes to once everything is counted."
      />

      <section className="section" aria-label="Frequently asked questions">
        <div className="shell grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
          {/* Category jump list */}
          <nav aria-label="FAQ categories" className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="t-eyebrow mb-4 text-ink-muted">Jump to</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {FAQ_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <a
                      href={`#${slugify(cat)}`}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 text-[0.875rem] font-medium text-ink-secondary transition-colors hover:bg-[var(--bg-sunken)] hover:text-[var(--accent)]"
                    >
                      {cat}
                      <span className="ml-1.5 text-[0.75rem] text-ink-muted">
                        {faqsByCategory(cat).length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </nav>

          <div className="flex flex-col gap-14">
            {FAQ_CATEGORIES.map((cat) => (
              <section key={cat} id={slugify(cat)} aria-labelledby={`${slugify(cat)}-h`}>
                <Reveal>
                  <Eyebrow>{cat}</Eyebrow>
                  <h2 id={`${slugify(cat)}-h`} className="t-h3 mt-3 text-brand">
                    {cat}
                  </h2>
                </Reveal>
                <Reveal direction="up" delay={0.06}>
                  <Accordion
                    className="mt-4"
                    items={faqsByCategory(cat).map((f) => ({ q: f.q, a: f.a }))}
                  />
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </section>

      <LeadSection
        source="faq"
        heading={
          <>
            Still have a <span className="gold-text">question</span>?
          </>
        }
        lead={`Ask it directly. A counsellor will call you back within two hours, or reach us straight away on ${SITE.phoneDisplay}.`}
      />
    </>
  );
}
