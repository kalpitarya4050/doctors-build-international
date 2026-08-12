import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBody } from "@/components/layout/LegalBody";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing the use of ${SITE.domain} and the counselling and admission services provided by ${SITE.name}.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    h: "What we are",
    p: [
      `${SITE.name} is an overseas education consultancy. We advise Indian students on admission to medical universities abroad, and we assist with applications, documentation, visas and arrival support.`,
      "We are not a university, and we do not grant degrees or admissions. Admission decisions are made solely by the university concerned. Visa decisions are made solely by the embassy or consulate concerned. We can prepare and advocate; we cannot guarantee an outcome that is not ours to give.",
    ],
  },
  {
    h: "Information on this website",
    p: [
      `Fees, course durations, intake dates, recognition status and FMGE pass rates published on ${SITE.domain} are taken from official university brochures for the ${SITE.admissionYear} session and from published data available at the time of writing.`,
      "Universities revise fees and requirements without notice, and exchange rates move continuously — INR figures shown are approximate conversions and will differ from what you actually pay. You must confirm the current position with the university or its official representative before applying or paying.",
      "We correct errors as soon as we become aware of them, but we do not warrant that every figure is current at the moment you read it.",
    ],
  },
  {
    h: "Fees and payments",
    p: [
      "Tuition and university charges are paid directly to the university's official account. We do not collect tuition on a university's behalf, and you should treat any request to do so — by us or by anyone else — as a serious warning sign.",
      "Where we charge a service fee, it is disclosed to you in writing before you commit, and it is separate from and additional to university tuition. You will not encounter a charge you were not told about in advance.",
    ],
  },
  {
    h: "Your responsibilities",
    p: [
      "You are responsible for the accuracy of the information and documents you give us. A false or incomplete document can cause an application or visa to be rejected, and can have consequences well beyond a lost intake cycle.",
      "You are responsible for qualifying NEET-UG before admission if you intend to practise in India, and for meeting the National Medical Commission's eligibility requirements. We will advise you on these, but we cannot meet them for you.",
    ],
  },
  {
    h: "NMC and licensure",
    p: [
      "A foreign medical degree does not by itself permit practice in India. Under the NMC's Foreign Medical Graduate Licentiate Regulations 2021, you must qualify NEET before admission, complete a course meeting the prescribed duration and content requirements, clear the FMGE or NExT screening examination, and complete a further internship in India before permanent registration.",
      "We provide guidance on all of this. We do not and cannot guarantee that you will clear FMGE or NExT — that depends on your own preparation and performance.",
    ],
  },
  {
    h: "Limitation of liability",
    p: [
      "To the extent permitted by law, our liability arising out of our services is limited to the service fee you have paid us. We are not liable for university decisions, visa refusals, changes in national regulations, currency movements, or circumstances beyond our reasonable control.",
    ],
  },
  {
    h: "Intellectual property",
    p: [
      `All content on ${SITE.domain}, including text, layout, graphics and the ${SITE.name} name and logo, belongs to us. You may not reproduce it commercially without written permission.`,
    ],
  },
  {
    h: "Governing law",
    p: [
      "These terms are governed by the laws of India, and the courts of Himachal Pradesh have exclusive jurisdiction over any dispute arising from them.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        crumbs={[{ label: "Terms of Use" }]}
        lead="What we do, what we do not do, and what we cannot promise. Written plainly rather than defensively."
      />
      <LegalBody sections={SECTIONS} updated="10 August 2026" />
    </>
  );
}
