import type { Metadata } from "next";
import { Destinations } from "@/components/sections/Destinations";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { FeeTable } from "@/components/ui/FeeTable";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `MBBS Abroad Destinations ${SITE.admissionYear} — Seven Countries Compared`,
  description:
    "Compare MBBS abroad destinations for Indian students: Georgia, Russia, Uzbekistan, Kyrgyzstan, Nepal, China and Kazakhstan. Fees from ₹15.91 lakh, NMC approved, English medium, no IELTS.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Study MBBS Abroad"
        title="Seven destinations. One honest comparison."
        highlight={["honest"]}
        crumbs={[{ label: "Destinations" }]}
        image="students-campus"
        imageCaption="Illustrative of student life abroad"
        lead="Every country below offers NMC or WHO recognized medical universities teaching entirely in English, with no IELTS requirement. What differs is cost, climate, course length, FMGE outcomes and how far you will be from home — and we will tell you plainly which of those matters most for you."
      />

      <Destinations />

      <section className="section" aria-labelledby="compare">
        <div className="shell">
          <SectionHeading
            eyebrow="Side by Side"
            title={
              <>
                All seven universities, <span className="gold-text">every number</span>
              </>
            }
            lead="Sort by cost, FMGE pass rate, Indian student numbers or safety. Switch between local currency and rupees."
          />
          <Reveal direction="up" className="mt-12">
            <FeeTable />
          </Reveal>
        </div>
      </section>

      <LeadSection source="destinations-hub" />
    </>
  );
}
