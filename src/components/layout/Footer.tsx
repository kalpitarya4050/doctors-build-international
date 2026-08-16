import Link from "next/link";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { COUNTRIES } from "@/lib/data/countries";
import { UNIVERSITIES } from "@/lib/data/universities";
import { SERVICES, OFFICES } from "@/lib/data/content";
import { HAS_IMAGES } from "@/lib/images";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const SOCIALS = [
  { href: SITE.social.facebook, Icon: FacebookIcon, label: "Facebook" },
  { href: SITE.social.instagram, Icon: InstagramIcon, label: "Instagram" },
  { href: SITE.social.youtube, Icon: YoutubeIcon, label: "YouTube" },
  { href: SITE.social.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-[var(--navy-950)] text-white grain">
      {/* Ambient gold bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-[36rem] rounded-full opacity-[0.16] blur-[130px]"
        style={{ background: "radial-gradient(circle, #C9A227, transparent 70%)" }}
      />

      <div className="relative">
        {/* CTA band */}
        <div className="border-b border-white/10">
          <div className="shell flex flex-col items-center gap-6 py-14 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.02em]">
                Building Futures. <span className="gold-text">Changing Lives.</span>
              </h2>
              <p className="mt-2.5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/65">
                Speak to a doctor-led counsellor today. Free, honest and with no obligation —
                including telling you if studying abroad is the wrong call for you.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <Button href={whatsappLink()} external variant="gold" size="lg">
                Get Free Counselling
              </Button>
              <Button
                href={telLink()}
                external
                size="lg"
                className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                variant="ghost"
              >
                <Phone className="size-4" />
                {SITE.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="size-12" id="footer" />
              <span className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-playfair)] text-[1.125rem] font-bold tracking-[-0.015em]">
                  Doctors <span className="gold-text">Build</span>
                </span>
                <span className="t-eyebrow mt-1 text-[0.5rem] text-white/45">International</span>
              </span>
            </div>
            <p className="mt-3 font-[family-name:var(--font-playfair)] text-[0.9375rem] italic text-[var(--gold-300)]">
              {SITE.tagline}
            </p>
            <p className="mt-4 max-w-[40ch] text-[0.875rem] leading-relaxed text-white/60">
              Helping Indian students secure MBBS admission at NMC-eligible medical universities
              across Georgia, Russia, Kazakhstan, China and beyond — with complete transparency at
              every step.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 text-[0.875rem]">
              <li>
                <a
                  href={telLink()}
                  className="flex items-center gap-2.5 text-white/70 transition-colors hover:text-[var(--gold-300)]"
                >
                  <Phone className="size-4 shrink-0 text-[var(--gold-500)]" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 text-white/70 transition-colors hover:text-[var(--gold-300)]"
                >
                  <Mail className="size-4 shrink-0 text-[var(--gold-500)]" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-white/70">
                <Globe className="size-4 shrink-0 text-[var(--gold-500)]" />
                {SITE.domain}
              </li>
            </ul>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="tap grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[var(--gold-500)] hover:bg-white/5 hover:text-[var(--gold-300)]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title="Study MBBS Abroad"
            links={COUNTRIES.map((c) => ({
              label: `MBBS in ${c.name}`,
              href: `/destinations/${c.slug}`,
            }))}
          />

          <FooterColumn
            title="Partner Universities"
            links={UNIVERSITIES.map((u) => ({
              label: u.shortName,
              href: `/universities/${u.slug}`,
            }))}
          />

          <div className="flex flex-col gap-10">
            <FooterColumn
              title="Company"
              links={[
                { label: "About Us", href: "/about" },
                { label: "Our Services", href: "/services" },
                { label: "Why Choose Us", href: "/why-us" },
                { label: "Fee Comparison", href: "/fee-comparison" },
                { label: "FAQs", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
                { label: "Apply Now", href: "/apply" },
              ]}
            />
            <FooterColumn
              title="Popular Services"
              links={SERVICES.slice(0, 5).map((s) => ({
                label: s.title,
                href: `/services#${s.slug}`,
              }))}
            />
          </div>
        </div>

        {/* Offices */}
        <div className="border-t border-white/10">
          <div className="shell py-8">
            <p className="t-eyebrow mb-4 text-[var(--gold-300)]">Our Offices</p>
            <ul className="grid gap-4 sm:grid-cols-3">
              {OFFICES.map((o) => (
                <li key={o.city} className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--gold-500)]" />
                  <span>
                    <span className="block text-[0.9375rem] font-semibold">
                      {o.city}
                      {o.isHQ && (
                        <span className="ml-2 rounded-full bg-[var(--gold-500)]/15 px-2 py-0.5 text-[0.625rem] font-bold tracking-wider text-[var(--gold-300)] uppercase">
                          HQ
                        </span>
                      )}
                    </span>
                    <span className="block text-[0.8125rem] text-white/55">{o.region}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-white/10">
          <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-[0.8125rem] text-white/50 sm:flex-row">
            <p>
              © {year} {SITE.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy-policy" className="tap inline-flex min-h-11 items-center transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="tap inline-flex min-h-11 items-center transition-colors hover:text-white">
                Terms of Use
              </Link>
              <Link href="/contact" className="tap inline-flex min-h-11 items-center transition-colors hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="shell flex flex-col gap-3 pb-8">
            {HAS_IMAGES && (
              <p className="text-[0.6875rem] leading-relaxed text-white/35">
                Photography is illustrative and sourced from{" "}
                <a
                  href="https://www.pexels.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors hover:text-white/60"
                >
                  Pexels
                </a>
                . Images show the destination country or general student life; they are not
                photographs of the specific university campus unless stated. Ask a counsellor for
                current photographs and video of any campus.
              </p>
            )}
            <p className="text-[0.6875rem] leading-relaxed text-white/35">
              Disclaimer: Fees shown are as per official university brochures for {SITE.admissionYear}.
              INR conversions are approximate and vary with the prevailing exchange rate. Students
              are advised to confirm the latest details with the university or its official
              representative before applying. NEET qualification is mandatory for Indian students
              intending to practise in India under NMC regulations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="t-eyebrow mb-4 text-[var(--gold-300)]">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-[0.875rem] text-white/65 transition-colors hover:text-[var(--gold-300)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
