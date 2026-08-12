import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock3, MessageCircle } from "lucide-react";
import { OFFICES } from "@/lib/data/content";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact Us — Free MBBS Abroad Counselling | Shimla, Chandigarh, Vadodara",
  description: `Talk to Doctors Build International about MBBS abroad. Call ${SITE.phoneDisplay}, message on WhatsApp, or walk into our offices in Shimla, Chandigarh or Vadodara. Response within two hours.`,
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: Phone,
    label: "Call us",
    value: SITE.phoneDisplay,
    href: `tel:${SITE.phone}`,
    note: "Fastest route. Someone picks up.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phoneDisplay,
    href: whatsappLink(),
    note: "Send your NEET score and we will reply with options.",
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    note: "For documents and detailed queries.",
  },
  {
    icon: Clock3,
    label: "Response time",
    value: "Within 2 hours",
    note: "Every day, including weekends during admission season.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Ask us anything. We will answer honestly."
        highlight={["honestly."]}
        crumbs={[{ label: "Contact" }]}
        image="consultation"
        lead="Counselling is free and carries no obligation. Bring your parents into the call — most of our conversations are with families, not students alone, and the questions parents ask are usually the right ones."
      />

      <section className="section" aria-label="Contact channels">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
              {CHANNELS.map((c) => {
                const Body = (
                  <>
                    <span className="grid size-11 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                      <c.icon className="size-5" />
                    </span>
                    <span className="mt-4 block text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
                      {c.label}
                    </span>
                    <span className="t-num mt-1 block text-[1.0625rem] font-bold text-brand">
                      {c.value}
                    </span>
                    <span className="mt-2 block text-[0.8125rem] leading-relaxed text-ink-muted">
                      {c.note}
                    </span>
                  </>
                );
                return (
                  <RevealItem key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="material-card block h-full rounded-[var(--radius-lg)] p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]"
                      >
                        {Body}
                      </a>
                    ) : (
                      <div className="material-card h-full rounded-[var(--radius-lg)] p-6">
                        {Body}
                      </div>
                    )}
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <Reveal direction="up" delay={0.2}>
              <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--navy-900)] p-7 text-white">
                <p className="t-eyebrow text-[var(--gold-300)]">Prefer to talk right now?</p>
                <p className="mt-3 font-[family-name:var(--font-playfair)] text-[1.5rem] leading-[1.2] tracking-[-0.02em]">
                  Message us on WhatsApp and get options within the hour.
                </p>
                <Button
                  href={whatsappLink()}
                  external
                  variant="whatsapp"
                  size="lg"
                  className="mt-6"
                  fullWidth
                >
                  <MessageCircle className="size-4" />
                  Open WhatsApp
                </Button>
                <Button
                  href={telLink()}
                  external
                  variant="ghost"
                  size="lg"
                  fullWidth
                  className="mt-2.5 border border-white/25 bg-white/5 text-white hover:bg-white/10"
                >
                  <Phone className="size-4" />
                  {SITE.phoneDisplay}
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left">
            <LeadForm
              source="contact-page"
              title="Send us your details"
              subtitle="We will call you back within two hours and open WhatsApp with your enquiry pre-filled so you can start immediately."
            />
          </Reveal>
        </div>
      </section>

      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="offices">
        <div className="shell">
          <SectionHeading
            eyebrow="Our Offices"
            title="Three locations. No appointment needed."
            lead="Walk in with your marksheets and your parents. We will sit down and go through the whole picture properly."
          />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.08}>
            {OFFICES.map((o) => (
              <RevealItem key={o.city}>
                <div className="material-card h-full rounded-[var(--radius-lg)] p-7">
                  <span className="grid size-11 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <MapPin className="size-5" />
                  </span>
                  <h3 className="t-h3 mt-5 flex items-center gap-2.5 text-brand">
                    {o.city}
                    {o.isHQ && (
                      <span className="rounded-full bg-[var(--navy-900)] px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.08em] text-[var(--gold-300)] uppercase">
                        HQ
                      </span>
                    )}
                  </h3>
                  <p className="t-small mt-1.5">{o.region}</p>
                  <p className="t-body mt-4">{o.address}</p>
                  <div className="mt-5 flex flex-col gap-1.5">
                    <a
                      href={telLink()}
                      className="t-num text-[0.9375rem] font-semibold text-[var(--accent)] hover:underline"
                    >
                      {SITE.phoneDisplay}
                    </a>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-[0.875rem] text-ink-muted hover:text-[var(--accent)]"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
