import type { Metadata } from "next";
import { UNIVERSITIES } from "@/lib/data/universities";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { FeeTable } from "@/components/ui/FeeTable";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Partner Medical Universities ${SITE.admissionYear} — NMC Approved MBBS Abroad`,
  description:
    "Seven NMC and WHO approved medical universities across Georgia, Russia, Uzbekistan, Kyrgyzstan and Nepal. Compare fees from ₹15.91 lakh, FMGE pass rates up to 65%, duration and intake — all published.",
  alternates: { canonical: "/universities" },
  keywords: [
    "NMC approved medical universities abroad",
    "MBBS universities for Indian students",
    "WHO listed medical colleges",
    "GEOMEDI University fees",
    "Kemerovo State Medical University",
    "Ingush State University MBBS",
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
        title="Seven universities. Every figure published."
        highlight={["published."]}
        crumbs={[{ label: "Universities" }]}
        image="lecture-hall"
        imageCaption="Illustrative of teaching abroad"
        lead="These are the universities we place students into — not a directory of everything that exists. Each one is here because of its recognition status, its FMGE outcomes and the support already in place for Indian students on campus."
      />

      <section className="section" aria-label="All universities">
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

      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="compare-all">
        <div className="shell">
          <SectionHeading
            eyebrow="Full Comparison"
            title={
              <>
                Compare all seven, <span className="gold-text">side by side</span>
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
