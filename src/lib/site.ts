export const SITE = {
  name: "Doctors Build International",
  shortName: "Doctors Build",
  legalName: "Doctors Build International",
  tagline: "From Dreams to White Coat",
  headline: "Your Dream. Our Guidance. Your Future.",
  domain: "doctorsbuild.com",
  /** Overridden at build time by NEXT_PUBLIC_SITE_URL so canonical
   *  URLs, the sitemap and JSON-LD always match where the site is
   *  actually served from. Set it to the real domain at go-live. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://doctorsbuild.com",
  description:
    "Doctors Build International helps Indian students secure MBBS admission in NMC-approved medical universities in Georgia, Russia, Uzbekistan, Kyrgyzstan, Nepal and beyond — with doctor-led counselling, transparent fees and end-to-end support.",
  phone: "+917746000015",
  phoneDisplay: "+91 77460 00015",
  phoneRaw: "7746000015",
  whatsapp: "917746000015",
  email: "info@doctorsbuild.com",
  admissionYear: "2026-27",
  founded: "2015",
  social: {
    facebook: "https://facebook.com/doctorsbuildinternational",
    instagram: "https://instagram.com/doctorsbuildinternational",
    youtube: "https://youtube.com/@doctorsbuildinternational",
    linkedin: "https://linkedin.com/company/doctorsbuildinternational",
  },
} as const;

/** Pre-filled WhatsApp deep-link. Works with zero backend — this is
 *  how most Indian ed-consultancies actually convert. */
export function whatsappLink(message?: string): string {
  const text =
    message ??
    `Hi Doctors Build International, I would like free counselling for MBBS abroad ${SITE.admissionYear}.`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telLink(): string {
  return `tel:${SITE.phone}`;
}

/** Trust badges from the Admission Portfolio header strip. */
export const TRUST_BADGES = [
  { label: "Official Admission Partner", icon: "BadgeCheck" },
  { label: "NMC Guidance", icon: "ShieldCheck" },
  { label: "FMGE / NExT Preparation Support", icon: "GraduationCap" },
  { label: "Visa Assistance", icon: "StampIcon" },
  { label: "Education Loan Assistance", icon: "Landmark" },
  { label: "Airport Pickup", icon: "Plane" },
  { label: "Indian Hostel & Food Support", icon: "UtensilsCrossed" },
  { label: "Complete Documentation", icon: "FileCheck" },
] as const;

/** Recognition bodies used across university cards. */
export const ACCREDITORS = [
  { code: "NMC", full: "National Medical Commission, India" },
  { code: "WHO", full: "World Health Organization" },
  { code: "WDOMS", full: "World Directory of Medical Schools" },
  { code: "ECFMG", full: "Educational Commission for Foreign Medical Graduates" },
  { code: "FAIMER", full: "Foundation for Advancement of International Medical Education" },
  { code: "WFME", full: "World Federation for Medical Education" },
] as const;

export const NAV = [
  { label: "Home", href: "/" },
  {
    label: "Destinations",
    href: "/destinations",
    mega: "destinations" as const,
  },
  {
    label: "Universities",
    href: "/universities",
    mega: "universities" as const,
  },
  { label: "Fee Comparison", href: "/fee-comparison" },
  { label: "Services", href: "/services" },
  { label: "Why Us", href: "/why-us" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
