import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBody } from "@/components/layout/LegalBody";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects the personal information you share when enquiring about MBBS admission abroad.`,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    h: "What we collect",
    p: [
      `When you submit an enquiry, apply, or contact us we collect the information you provide: your name, phone number, email address, city, NEET score, Class 12 results, budget range and the destination you are interested in. We also collect standard technical information such as your IP address, browser type and the pages you visited on ${SITE.domain}.`,
      "We do not collect payment card details on this website. Tuition fees are paid directly to the university's official account, never to us.",
    ],
  },
  {
    h: "Why we collect it",
    p: [
      "We use your information for one purpose: to provide the counselling and admission services you asked for. That means assessing your eligibility, shortlisting universities against your profile, preparing applications and documentation, and keeping you and your family informed through the admission process.",
      "We may also contact you about admission deadlines, intake changes and NMC regulation updates that affect your application. You can ask us to stop at any time.",
    ],
  },
  {
    h: "Who we share it with",
    p: [
      "We share your information with the universities you have asked us to apply to, and with the embassies or consulates processing your student visa. This is unavoidable — an application cannot be made without it.",
      "We do not sell your information. We do not share it with other consultancies, coaching institutes, lenders or marketing agencies.",
      "We may use third-party service providers for email delivery and record-keeping. These providers process data on our instructions only.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "We retain enquiry records for as long as necessary to provide our services and to meet any legal or regulatory obligation. If you ask us to delete your data and we are not legally required to keep it, we will do so.",
    ],
  },
  {
    h: "Your rights",
    p: [
      `You can ask us what information we hold about you, ask us to correct it, ask us to delete it, or withdraw your consent to us contacting you. Write to ${SITE.email} and we will respond within thirty days.`,
    ],
  },
  {
    h: "Cookies",
    p: [
      "This website uses only the cookies necessary for it to function, including remembering your light or dark theme preference. We do not use advertising cookies or cross-site tracking.",
    ],
  },
  {
    h: "Contact",
    p: [
      `Questions about this policy should be sent to ${SITE.email} or raised on ${SITE.phoneDisplay}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        crumbs={[{ label: "Privacy Policy" }]}
        lead="What we collect, why we collect it, and what we will never do with it."
      />
      <LegalBody sections={SECTIONS} updated="10 August 2026" />
    </>
  );
}
