import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, Thermometer, Languages, Wallet, Stamp, ShieldCheck, Clock, Calendar } from "lucide-react";
import { COUNTRIES, getCountry } from "@/lib/data/countries";
import { countryImage, countryImageAlt, countryGallery, countryCityTiles } from "@/lib/data/media-map";
import { universitiesByCountry, UNIVERSITIES } from "@/lib/data/universities";
import { FAQS } from "@/lib/data/faq";
import { PROCESS } from "@/lib/data/content";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { PlaceGallery } from "@/components/sections/PlaceGallery";
import { ParallaxMedia } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Surface";
import { Flag } from "@/components/ui/Flag";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) return { title: "Destination not found" };

  const unis = universitiesByCountry(c.slug);
  const uniLine =
    unis.length > 0
      ? `${unis.length} NMC-approved ${unis.length === 1 ? "university" : "universities"}.`
      : "NMC and WHO recognized universities.";

  return {
    title: `MBBS in ${c.name} for Indian Students ${SITE.admissionYear} — Fees, Eligibility & Admission`,
    description: `Study MBBS in ${c.name} from ${c.startingFrom}. ${uniLine} ${c.duration}, English medium, no IELTS. NEET qualified students only. Free counselling — ${SITE.phoneDisplay}.`,
    alternates: { canonical: `/destinations/${c.slug}` },
    openGraph: {
      title: `MBBS in ${c.name} ${SITE.admissionYear} — Fees & Admission`,
      description: `${c.tagline} Study MBBS in ${c.name} from ${c.startingFrom} with complete admission support.`,
      url: `${SITE.url}/destinations/${c.slug}`,
    },
    keywords: [
      `MBBS in ${c.name}`,
      `MBBS in ${c.name} for Indian students`,
      `MBBS in ${c.name} fees`,
      `study medicine in ${c.name}`,
      `${c.name} medical universities NMC approved`,
      `MBBS ${c.name} ${SITE.admissionYear}`,
    ],
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) notFound();

  const unis = universitiesByCountry(c.slug);
  const others = COUNTRIES.filter((x) => x.slug !== c.slug).slice(0, 6);
  const pageFaqs = FAQS.filter((f) => f.featured).slice(0, 8);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE.url}/destinations` },
      {
        "@type": "ListItem",
        position: 3,
        name: `MBBS in ${c.name}`,
        item: `${SITE.url}/destinations/${c.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema]) }}
      />

      <PageHero
        eyebrow={`Admissions Open ${SITE.admissionYear}`}
        title={`MBBS in ${c.name}`}
        highlight={[c.name]}
        flagCountry={c.slug}
        accent={c.accent}
        crumbs={[{ label: "Destinations", href: "/destinations" }, { label: c.name }]}
        lead={c.intro[0]}
        image={countryImage(c.slug)}
        imageCaption={`${c.name} — photograph of the country, not of a specific campus`}
      >
        <Reveal direction="up" delay={0.22}>
          <div className="mt-8 flex flex-wrap gap-2">
            {c.recognition.map((r) => (
              <Chip key={r} tone="green">
                <ShieldCheck className="size-3" />
                {r} Recognized
              </Chip>
            ))}
            <Chip tone="gold">
              <Clock className="size-3" />
              {c.duration}
            </Chip>
            <Chip tone="default">
              <Calendar className="size-3" />
              Intake: {c.intake}
            </Chip>
            {!c.ieltsRequired && <Chip tone="default">No IELTS</Chip>}
            <Chip tone="default">NEET qualified required</Chip>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.28}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#counselling" variant="gold" size="lg">
              Get free counselling
              <ArrowRight className="size-4" />
            </Button>
            {unis.length > 0 && (
              <Button href="#universities" variant="outline" size="lg">
                See {unis.length} {unis.length === 1 ? "university" : "universities"}
              </Button>
            )}
          </div>
        </Reveal>
      </PageHero>

      {/* At a glance */}
      <section className="border-y border-hairline bg-[var(--bg-sunken)] py-10" aria-label="At a glance">
        <div className="shell">
          <RevealGroup className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-5" stagger={0.05}>
            <Glance
              icon={<Wallet className="size-4" />}
              label="Total course cost from"
              value={c.startingFrom}
              highlight
            />
            <Glance
              icon={<Clock className="size-4" />}
              label="Course duration"
              value={c.duration}
            />
            <Glance
              icon={<Wallet className="size-4" />}
              label="Monthly living"
              value={c.livingCost}
            />
            <Glance
              icon={<Thermometer className="size-4" />}
              label="Climate"
              value={c.climate}
            />
            <Glance
              icon={<Languages className="size-4" />}
              label="Language"
              value={c.language}
            />
          </RevealGroup>
        </div>
      </section>

      {/* Long-form intro */}
      <section className="section" aria-labelledby="overview">
        <div className="shell grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Overview"
              title={`Why Indian students choose ${c.name}`}
            />
            <div className="mt-7 flex flex-col gap-5">
              {c.intro.map((p, i) => (
                <Reveal key={i} direction="up" delay={i * 0.05}>
                  <p className="t-body max-w-[70ch]">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal direction="left">
            <aside className="material-card sticky top-28 rounded-[var(--radius-lg)] p-7">
              <p className="t-eyebrow text-[var(--accent)]">Quick Facts</p>
              <dl className="mt-5 flex flex-col gap-4 text-[0.875rem]">
                <QuickRow label="Universities we place into" value={unis.length > 0 ? `${unis.length}` : "On request"} />
                <QuickRow label="Medium of instruction" value="English" />
                <QuickRow label="NEET required" value={c.neetRequired ? "Yes — qualifying score" : "No"} />
                <QuickRow label="IELTS / TOEFL" value={c.ieltsRequired ? "Required" : "Not required"} />
                <QuickRow label="Intake months" value={c.intake} />
                <QuickRow label="Recognition" value={c.recognition.join(" · ")} />
              </dl>
              <div className="mt-6 rounded-[var(--radius)] border border-line bg-[var(--bg-sunken)] p-4">
                <p className="flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.05em] text-ink-muted uppercase">
                  <Stamp className="size-3.5 text-[var(--accent)]" />
                  Visa
                </p>
                <p className="t-small mt-2">{c.visaNote}</p>
              </div>
              <Button href="#counselling" variant="gold" size="md" fullWidth className="mt-6">
                Check my eligibility
              </Button>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Full-bleed photographic band */}
      <ParallaxMedia
        id={countryImageAlt(c.slug)}
        strength={12}
        className="h-[16rem] w-full sm:h-[22rem] lg:h-[26rem]"
        sizes="100vw"
        overlay={
          <>
            <Scrim strength="light" from="bottom" />
            <div className="shell absolute inset-x-0 bottom-0 pb-8">
              <p className="text-[clamp(1.375rem,3vw,2.25rem)] leading-tight tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(5,15,34,0.5)]">
                {c.tagline}
              </p>
              <p className="mt-2 text-[0.8125rem] text-on-dark-secondary">
                {c.name} · {c.livingCost} · {c.climate}
              </p>
            </div>
          </>
        }
      />

      {/* Advantages */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="advantages">
        <div className="shell">
          <SectionHeading
            eyebrow="Advantages"
            title={
              <>
                What <em>{c.name}</em> gives you
              </>
            }
            lead={c.tagline}
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {c.advantages.map((a) => (
              <RevealItem key={a.title}>
                <div className="material-card h-full rounded-[var(--radius-lg)] p-7">
                  <span className="grid size-10 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Check className="size-5" strokeWidth={2.4} />
                  </span>
                  <h3 className="t-h4 mt-5 text-brand">{a.title}</h3>
                  <p className="t-small mt-2.5 leading-relaxed">{a.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Universities */}
      <section className="section" id="universities" aria-labelledby="unis">
        <div className="shell">
          {unis.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Partner Universities"
                title={
                  <>
                    {unis.length === 1 ? "Our university" : `Our ${unis.length} universities`} in{" "}
                    <em>{c.name}</em>
                  </>
                }
                lead="Every figure below is taken directly from our official Admission Portfolio for 2026-27."
              />
              <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
                {unis.map((u) => (
                  <RevealItem key={u.slug}>
                    <UniversityCard university={u} className="h-full" showRank />
                  </RevealItem>
                ))}
              </RevealGroup>
            </>
          ) : (
            <>
              <SectionHeading
                eyebrow="Universities"
                title={
                  <>
                    Universities in <em>{c.name}</em>, on request
                  </>
                }
                lead={`We advise on ${c.name} admissions case by case. Speak to a counsellor for current university availability, fee structures and intake timelines for ${SITE.admissionYear}.`}
              />
              <Reveal direction="up" className="mt-10 text-center">
                <Button href="#counselling" variant="gold" size="lg">
                  Request university options
                  <ArrowRight className="size-4" />
                </Button>
              </Reveal>
            </>
          )}
        </div>
      </section>

      <PlaceGallery
        items={countryCityTiles(c.slug).length > 0 ? countryCityTiles(c.slug) : countryGallery(c.slug)}
        eyebrow={`Inside ${c.name}`}
        title={
          <>
            What {c.name} actually <em>looks like</em>
          </>
        }
        lead={`${c.tagline} Here is the country you would be living in for ${c.duration.toLowerCase()}.`}
        note="Photographs show the country and general medical teaching, not specific campuses. Ask a counsellor for current photos and video of any university."
      />

      {/* Process */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="process">
        <div className="shell">
          <SectionHeading
            eyebrow="Admission Process"
            title={`Getting to ${c.name}, step by step`}
            lead="Six to eight weeks from your first call to boarding the flight."
          />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5" stagger={0.07}>
            {PROCESS.map((p) => (
              <RevealItem key={p.step}>
                <div className="material-card flex h-full flex-col rounded-[var(--radius-lg)] p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon name={p.icon} className="size-5" />
                    </span>
                    <span className="text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
                      Step {p.step}
                    </span>
                  </div>
                  <h3 className="t-h4 mt-4 text-brand">{p.title}</h3>
                  <p className="t-small mt-2 leading-relaxed">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" aria-labelledby="country-faq">
        <div className="shell">
          <SectionHeading
            eyebrow="Questions & Answers"
            title={`MBBS in ${c.name} — common questions`}
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <Accordion items={pageFaqs.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={0} />
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="tap inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[var(--accent)] hover:underline"
              >
                Read all {FAQS.length} questions
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other destinations */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="other-destinations">
        <div className="shell">
          <SectionHeading eyebrow="Also Consider" title="Other destinations we place into" />
          <RevealGroup
            className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.05}
          >
            {others.map((o) => {
              const count = UNIVERSITIES.filter((u) => u.countrySlug === o.slug).length;
              return (
                <RevealItem key={o.slug}>
                  <Link
                    href={`/destinations/${o.slug}`}
                    className="group material-card flex items-center gap-4 rounded-[var(--radius-lg)] p-5"
                  >
                    <Flag country={o.slug} className="h-7 w-[2.625rem]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-bold text-brand group-hover:text-[var(--accent)] transition-colors">
                        MBBS in {o.name}
                      </span>
                      <span className="block text-[0.75rem] text-ink-muted">
                        From {o.startingFrom}
                        {count > 0 && ` · ${count} ${count === 1 ? "university" : "universities"}`}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <LeadSection
        source={`destination-${c.slug}`}
        defaultInterest={`MBBS in ${c.name}`}
        heading={
          <>
            Start your <em>{c.name}</em> application.
          </>
        }
        lead={`Tell us your NEET score and budget. We will confirm which ${c.name} universities you are eligible for, what the complete cost looks like, and what happens next — in one honest call.`}
      />
    </>
  );
}

/* ---------------------------------------------------------- */

function Glance({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <RevealItem>
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
          <span className="text-[var(--accent)]">{icon}</span>
          {label}
        </span>
        <span
          className={
            highlight
              ? "t-num text-[1.0625rem] font-bold leading-tight text-brand"
              : "text-[0.9375rem] font-semibold leading-tight text-ink"
          }
        >
          {value}
        </span>
      </div>
    </RevealItem>
  );
}

function QuickRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="shrink-0 text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
