import type { Metadata } from "next";
import { UNIVERSITIES } from "@/lib/data/universities";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { FeeTable } from "@/components/ui/FeeTable";
import { SITE } from "@/lib/site";
import { DotGrid } from "@/components/ui/Decor";

export const metadata: Metadata = {
  title: `Partner Medical Universities ${SITE.admissionYear} — NMC Eligible MBBS Abroad`,
  description:
    "23 NMC-eligible, WHO recognized medical universities across Georgia, Russia, Kazakhstan, China, Uzbekistan and Kyrgyzstan. Compare fees from ₹15.91 lakh, FMGE pass rates up to 65%, duration and intake.",
  alternates: { canonical: "/universities" },
  keywords: [
    "NMC approved medical universities abroad",
    "MBBS universities for Indian students",
    "WHO listed medical colleges",
    "GEOMEDI University fees",
    "Kazan Federal University MBBS",
    "Nanjing Medical University MBBS",
    "Kazakh National Medical University",
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Partner Medical Universities",
  itemListElement: UNIVERSITIES.map((u, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE.url}/universities/${u.slug}`,
    name: u.name,
  })),
};

export default function UniversitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <PageHero
        eyebrow={`Admission Portfolio ${SITE.admissionYear}`}
        title={`${UNIVERSITIES.length} universities. Chosen, not listed.`}
        highlight={["Chosen,"]}
        crumbs={[{ label: "Universities" }]}
        image="lecture-hall"
        imageCaption="Illustrative of teaching abroad"
        lead="These are the universities we place students into — not a directory of everything that exists. Each one is here because of its recognition status, its clinical exposure and the support already in place for Indian students on campus."
      />

      <section data-ground="white" className="section relative isolate" aria-label="All universities">
        <DotGrid gap={26} opacity={0.7} />
        <div className="shell">
          <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {UNIVERSITIES.map((u) => (
              <RevealItem key={u.slug}>
                <UniversityCard university={u} className="h-full" showRank />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section data-ground="linen" className="section" aria-labelledby="compare-all">
        <div className="shell">
          <SectionHeading
            eyebrow="Full Comparison"
            title={
              <>
                Compare all {UNIVERSITIES.length}, <em>side by side</em>
              </>
            }
            lead="Sort by total cost, FMGE pass rate, Indian student numbers or safety rating. Toggle between local currency and rupees."
          />
          <Reveal direction="up" className="mt-12">
            <FeeTable />
          </Reveal>
        </div>
      </section>

      <LeadSection source="universities-hub" />
    </>
  );
}
