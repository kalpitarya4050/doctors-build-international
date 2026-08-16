import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { WhyUs } from "@/components/sections/WhyUs";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { DotGrid } from "@/components/ui/Decor";

export const metadata: Metadata = {
  title: "Why Choose Us — 100% Transparency, Doctor-Led, 5000+ Families",
  description:
    "Why Indian families choose Doctors Build International for MBBS abroad: 10+ years of experience, 100% transparent fees, personalized university shortlisting, end-to-end support, post-arrival assistance and 24×7 Indian mentors.",
  alternates: { canonical: "/why-us" },
};

/** The comparison that matters most to a parent deciding between
 *  consultancies. Stated as behaviour, not as marketing adjectives. */
const COMPARISON = [
  {
    point: "Fee disclosure",
    us: "Complete six-year cost in writing before you pay anything",
    them: "First-year fee quoted; the rest emerges later",
  },
  {
    point: "Tuition handling",
    us: "Paid directly to the university's official account, receipt in your name",
    them: "Routed through the consultant's account, or requested in cash",
  },
  {
    point: "Honest rejection",
    us: "We tell you if MBBS abroad is the wrong decision for you",
    them: "Every enquiry is a suitable candidate",
  },
  {
    point: "University shortlist",
    us: "Built from your NEET score, budget and preferences",
    them: "Built from which university pays the highest commission",
  },
  {
    point: "After the fee clears",
    us: "Airport pickup, hostel, registration, and a line open for six years",
    them: "Calls stop being returned",
  },
  {
    point: "FMGE / NExT",
    us: "Structured preparation planning from year three onwards",
    them: "Not their problem once you have enrolled",
  },
];

export default function WhyUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Doctors Build"
        title="Judge us on behaviour, not adjectives."
        highlight={["behaviour,"]}
        crumbs={[{ label: "Why Us" }]}
        image="hero-students"
        lead="Every consultancy claims transparency, trust and support. Those words cost nothing to print. Below is what those claims actually translate into in practice — and what they look like when a consultancy does not mean them."
      />

      {/* Comparison table */}
      <section data-ground="white" className="section relative isolate" aria-labelledby="comparison">
        <DotGrid gap={26} opacity={0.7} />
        <div className="shell">
          <SectionHeading
            eyebrow="The Difference"
            title={
              <>
                What it looks like <em>in practice</em>
              </>
            }
            lead="We are not naming anyone. But every family that has switched to us from another consultancy describes at least three of the right-hand column."
          />

          <Reveal direction="up" className="mt-12">
            <div className="scroll-x rounded-[var(--radius-lg)] border border-line">
              <table className="w-full min-w-[48rem] border-collapse text-left">
                <caption className="sr-only">
                  Comparison of Doctors Build International against typical consultancy behaviour
                </caption>
                <thead>
                  <tr className="bg-[var(--navy-900)] text-white">
                    <th
                      scope="col"
                      className="w-48 px-6 py-4 text-[0.6875rem] font-bold tracking-[0.08em] uppercase"
                    >
                      On this
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-[0.6875rem] font-bold tracking-[0.08em] text-[var(--gold-300)] uppercase"
                    >
                      Doctors Build International
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-[0.6875rem] font-bold tracking-[0.08em] text-on-dark-muted uppercase"
                    >
                      What you should watch for
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.point}
                      className={
                        i % 2 === 1
                          ? "border-t border-hairline bg-[var(--bg-sunken)]/55"
                          : "border-t border-hairline"
                      }
                    >
                      <th
                        scope="row"
                        className="px-6 py-5 align-top text-[0.875rem] font-bold text-brand"
                      >
                        {row.point}
                      </th>
                      <td className="px-6 py-5 align-top">
                        <span className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--green-600)]/14 text-[var(--green-600)]">
                            <Check className="size-3" strokeWidth={3.2} />
                          </span>
                          <span className="text-[0.875rem] leading-snug text-ink-secondary">
                            {row.us}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <span className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--red-600)]/12 text-[var(--red-600)]">
                            <X className="size-3" strokeWidth={3.2} />
                          </span>
                          <span className="text-[0.875rem] leading-snug text-ink-muted">
                            {row.them}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <WhyUs />
      <Testimonials />

      <LeadSection
        source="why-us"
        heading={
          <>
            Test us on the <em>first call</em>.
          </>
        }
        lead="Ask us the hardest question you have — about total cost, about FMGE odds, about what happens if it goes wrong. The quality of that answer is the only reliable way to judge a consultancy."
      />
    </>
  );
}
