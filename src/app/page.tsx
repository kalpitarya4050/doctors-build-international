import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Stats } from "@/components/sections/Stats";
import { PromiseSection } from "@/components/sections/Promise";
import { Destinations } from "@/components/sections/Destinations";
import { CampusStrip } from "@/components/sections/CampusStrip";
import { FeaturedUniversities } from "@/components/sections/FeaturedUniversities";
import { FeeTeaser } from "@/components/sections/FeeTeaser";
import { LifeAbroad } from "@/components/sections/LifeAbroad";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { LeadSection } from "@/components/sections/LeadSection";
import { FEATURED_FAQS } from "@/lib/data/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Study MBBS Abroad ${SITE.admissionYear} — NMC Approved Universities | ${SITE.name}`,
  description:
    "Study MBBS abroad from ₹15.91 lakh at NMC-eligible, WHO recognized medical universities in Georgia, Russia, Kazakhstan and China. 23 partner universities, doctor-led counselling, zero donation. Free counselling — call 77460 00015.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "MBBS abroad for Indian students at NMC-approved universities. Transparent fees, doctor-led counselling and end-to-end support from application to arrival.",
    url: SITE.url,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FEATURED_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      {/* Photography lands within one scroll of the fold */}
      <CampusStrip />
      <TrustBar />
      <Stats />
      <PromiseSection />
      <Destinations />
      <FeaturedUniversities />
      <LifeAbroad />
      <FeeTeaser />
      <Process />
      <WhyUs />
      <Testimonials />
      <FaqPreview />
      <LeadSection source="homepage" />
    </>
  );
}
