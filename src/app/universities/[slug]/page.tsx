import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  Clock,
  Calendar,
  Languages,
  ShieldCheck,
  Users,
  Star,
  Thermometer,
  Wallet,
  TrendingUp,
  MapPin,
  Check,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  UNIVERSITIES,
  getUniversity,
  PACKAGE_INCLUDES,
  ADDITIONAL_COSTS,
  NMC_VERIFY_NOTE,
  PRIORITY_TIERS,
  type University,
} from "@/lib/data/universities";
import { getCountry } from "@/lib/data/countries";
import { FAQS } from "@/lib/data/faq";
import { SITE } from "@/lib/site";
import {
  uniCityCaption,
  uniHero,
  uniHeroCaption,
  uniSlotImage,
} from "@/lib/data/media-map";
import { uniCampusImages, uniCityImages } from "@/lib/data/university-images";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { UniversityMedia } from "@/components/sections/UniversityMedia";
import { RevealMedia, ParallaxMedia } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Surface";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { UniversityCard, formatTotal, formatTuition } from "@/components/ui/UniversityCard";
import { cn, inr, num } from "@/lib/utils";

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUniversity(slug);
  if (!u) return { title: "University not found" };

  // Only claim figures we actually hold. Metadata is the one place a
  // fabricated number would also end up in search results.
  const facts = [
    u.totalExpenseInr
      ? `Total ₹${(u.totalExpenseInr / 100000).toFixed(2)} lakh for ${u.duration}.`
      : u.duration
        ? `${u.duration}, English medium.`
        : "English-medium MBBS.",
    u.fmgePassRate ? `${u.fmgePassRate} FMGE pass rate.` : "",
    u.indianStudents ? `${u.indianStudents} Indian students.` : "",
    u.affiliatedHospitals ? `${u.affiliatedHospitals}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: `${u.name}, ${u.country} — MBBS Fees ${SITE.admissionYear}, Eligibility & Admission`,
    description: `MBBS at ${u.name} in ${u.city}, ${u.country}. ${u.recognitionText}. ${facts} Free counselling — ${SITE.phoneDisplay}.`,
    alternates: { canonical: `/universities/${u.slug}` },
    openGraph: {
      title: `${u.name} — MBBS Fees & Admission ${SITE.admissionYear}`,
      description: `${u.blurb} ${u.recognitionText}.`,
      url: `${SITE.url}/universities/${u.slug}`,
    },
    keywords: [
      `${u.name} MBBS fees`,
      `${u.name} admission`,
      `MBBS in ${u.country}`,
      `${u.shortName} for Indian students`,
      `MBBS ${u.city}`,
      `${u.name} FMGE pass rate`,
    ],
  };
}

/* ---------------------------------------------------------- */

const SEMESTER_LABELS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
];

const ELIGIBILITY = [
  {
    label: "NEET-UG",
    value: "Qualifying percentile required (50th General / 40th SC, ST, OBC)",
  },
  { label: "Class 12", value: "Physics, Chemistry, Biology and English" },
  { label: "Minimum marks", value: "50% aggregate in PCB (40% for SC, ST, OBC)" },
  { label: "Age", value: "17 years completed on or before 31 December of the admission year" },
  { label: "English test", value: "Not required — no IELTS or TOEFL" },
  { label: "Passport", value: "Valid for at least two years from the date of travel" },
];

const DOCUMENTS = [
  "Class 10 mark sheet and passing certificate",
  "Class 12 mark sheet and passing certificate",
  "NEET-UG scorecard",
  "Valid passport (minimum two years validity)",
  "Passport-size photographs (white background)",
  "Birth certificate",
  "Medical fitness certificate",
  "HIV-negative test report",
  "Gap certificate (if applicable)",
  "Apostille / ministry attestation of academic documents",
];

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const u = getUniversity(slug);
  if (!u) notFound();

  const country = getCountry(u.countrySlug);
  // Siblings in the same country first — that is what a student
  // comparing options actually wants — then fill from elsewhere.
  const others = UNIVERSITIES.filter((x) => x.slug !== u.slug);
  const related = [
    ...others.filter((x) => x.countrySlug === u.countrySlug),
    ...others.filter((x) => x.countrySlug !== u.countrySlug),
  ].slice(0, 3);
  const pageFaqs = FAQS.filter((f) =>
    ["Eligibility", "Fees & Funding", "Recognition & Licensing"].includes(f.category),
  ).slice(0, 8);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `MBBS at ${u.name}`,
    description: u.blurb,
    provider: {
      "@type": "CollegeOrUniversity",
      name: u.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: u.city,
        addressCountry: u.country,
      },
    },
    educationalCredentialAwarded: "Bachelor of Medicine, Bachelor of Surgery (MBBS/MD)",
    inLanguage: "en",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      ...(u.duration ? { courseWorkload: u.duration } : {}),
      location: { "@type": "Place", name: `${u.city}, ${u.country}` },
    },
    // Only emit an Offer where we hold a published tuition figure —
    // structured data carrying an invented price is worse than none.
    ...(u.hasPublishedFees && u.tuitionTotal !== null
      ? {
          offers: {
            "@type": "Offer",
            category: "Tuition",
            price: u.tuitionTotal,
            priceCurrency: u.currency === "RUB" ? "RUB" : "USD",
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Universities", item: `${SITE.url}/universities` },
      { "@type": "ListItem", position: 3, name: u.name, item: `${SITE.url}/universities/${u.slug}` },
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([courseSchema, breadcrumbSchema, faqSchema]),
        }}
      />

      <PageHero
        eyebrow={`${PRIORITY_TIERS[u.priority].sub} · ${u.country}`}
        title={u.name}
        flagCountry={u.countrySlug}
        accent={u.accent}
        crumbs={[
          { label: "Universities", href: "/universities" },
          { label: u.shortName },
        ]}
        lead={u.blurb}
        image={uniHero(u.slug)}
        imageCaption={
          uniHeroCaption(u.slug)
            ? `${uniHeroCaption(u.slug)} — photograph of the region, not of the campus`
            : undefined
        }
      >
        <Reveal direction="up" delay={0.22}>
          <div className="mt-8 flex flex-wrap gap-2">
            {u.recognition.map((r) => (
              <Chip key={r} tone="green">
                <ShieldCheck className="size-3" />
                {r}
              </Chip>
            ))}
            {u.fmgePassRate && (
              <Chip tone="gold">
                <TrendingUp className="size-3" />
                {u.fmgePassRate} FMGE pass rate
              </Chip>
            )}
            {u.indianStudents && (
              <Chip tone="default">
                <Users className="size-3" />
                {u.indianStudents} Indian students
              </Chip>
            )}
            {u.affiliatedHospitals && (
              <Chip tone="default">
                <ShieldCheck className="size-3" />
                {u.affiliatedHospitals}
              </Chip>
            )}
            <Chip tone="default">No IELTS required</Chip>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.28}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#counselling" variant="gold" size="lg">
              Check my eligibility
              <ArrowRight className="size-4" />
            </Button>
            <Button href="/fee-comparison" variant="outline" size="lg">
              Compare with other universities
            </Button>
          </div>
        </Reveal>
      </PageHero>

      {/* ---------------- Key facts strip ---------------- */}
      <section className="border-y border-hairline bg-[var(--bg-sunken)] py-10" aria-label="Key facts">
        <div className="shell">
          <RevealGroup
            className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-6"
            stagger={0.045}
          >
            {/* Facts render only where the brochure gives us the value,
                so the strip is short and true rather than padded. */}
            <Fact icon={<MapPin className="size-4" />} label="City" value={u.city} />
            <Fact icon={<Clock className="size-4" />} label="Duration" value={u.duration} />
            <Fact icon={<Calendar className="size-4" />} label="Intake" value={u.intake} />
            <Fact icon={<Languages className="size-4" />} label="Medium" value={u.medium} />
            <Fact
              icon={<Plane className="size-4" />}
              label="Nearest airport"
              value={
                u.airportCode
                  ? [u.airportCode, u.airportDistance, u.airportDrive]
                      .filter(Boolean)
                      .join(" · ")
                  : null
              }
            />
            <Fact
              icon={<Wallet className="size-4" />}
              label="Living cost"
              value={u.livingCost ? `${u.livingCost} / month` : null}
            />
            <Fact icon={<Thermometer className="size-4" />} label="Climate" value={u.climate} />
            <Fact
              icon={<Star className="size-4" />}
              label="Safety rating"
              value={u.safetyRating !== null ? `${u.safetyRating.toFixed(1)} / 5` : null}
            />
            <Fact
              icon={<Users className="size-4" />}
              label="Indian students"
              value={u.indianStudents}
            />
            <Fact
              icon={<TrendingUp className="size-4" />}
              label="FMGE pass rate"
              value={u.fmgePassRate}
              highlight
            />
            <Fact
              icon={<ShieldCheck className="size-4" />}
              label="Recognition"
              value={u.recognition.join(" · ")}
            />
            <Fact
              icon={<ShieldCheck className="size-4" />}
              label="Teaching hospitals"
              value={u.affiliatedHospitals}
            />
            <Fact icon={<Plane className="size-4" />} label="Airport" value={u.airport} />
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section className="section" aria-labelledby="about-uni">
        <div className="shell grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="About the University"
              title={`Why ${u.shortName}?`}
            />
            <div className="mt-7 flex flex-col gap-5">
              {u.about.map((p, i) => (
                <Reveal key={i} direction="up" delay={i * 0.05}>
                  <p className="t-body max-w-[70ch]">{p}</p>
                </Reveal>
              ))}
            </div>

            <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2" stagger={0.05}>
              {u.highlights.map((h) => (
                <RevealItem key={h} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--green-600)]/12 text-[var(--green-600)]">
                    <Check className="size-3" strokeWidth={3.2} />
                  </span>
                  <span className="text-[0.9375rem] font-medium leading-snug text-ink-secondary">
                    {h}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Sticky cost summary */}
          <Reveal direction="left">
            <RevealMedia
              id={uniSlotImage(u.slug, "city")}
              from="bottom"
              className="mb-5 aspect-[16/10] w-full rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
              sizes="(max-width: 1024px) 100vw, 24rem"
              overlay={
                uniCityCaption(u.slug) ? (
                  <>
                    <Scrim strength="medium" />
                    <p className="absolute inset-x-0 bottom-0 p-4 text-[0.8125rem] font-semibold text-white">
                      {uniCityCaption(u.slug)}
                    </p>
                  </>
                ) : undefined
              }
            />
            <aside className="material-card sticky top-28 rounded-[var(--radius-lg)] p-7">
              <p className="t-eyebrow text-[var(--accent)]">Cost Summary</p>

              {u.hasPublishedFees ? (
                <>
                  <p className="mt-4 text-[0.75rem] font-semibold tracking-[0.05em] text-ink-muted uppercase">
                    Total for the full course
                  </p>
                  <p className="t-num mt-1.5 font-[family-name:var(--font-playfair)] text-[2.25rem] font-bold leading-none text-brand">
                    {u.totalExpenseInr ? `₹${inr(u.totalExpenseInr)}` : "On request"}
                  </p>
                  <p className="t-num mt-2 text-[0.875rem] text-ink-muted">
                    {formatTotal(u)}
                    {u.totalExpense !== null && " · approximate INR"}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 font-[family-name:var(--font-playfair)] text-[1.5rem] font-bold leading-tight text-brand">
                    Fees confirmed on request
                  </p>
                  <p className="t-small mt-2.5 leading-relaxed">
                    Our current brochure does not publish a fee table for {u.shortName}. Rather than
                    print an estimate, we confirm the exact tuition, hostel and living costs with the
                    university and send them to you in writing.
                  </p>
                </>
              )}

              <dl className="mt-6 flex flex-col gap-3.5 border-t border-hairline pt-6 text-[0.875rem]">
                <Row label="Tuition (total)" value={formatTuition(u)} />
                {u.tuitionInr !== null && (
                  <Row label="Tuition in INR" value={`₹${inr(u.tuitionInr)}`} />
                )}
                <Row label="Living cost" value={u.livingCost ? `${u.livingCost} / month` : null} />
                <Row label="Duration" value={u.duration} />
                <Row label="Next intake" value={u.intake} />
                <Row label="Medium" value={u.medium} />
              </dl>

              <div className="mt-6 rounded-[var(--radius)] bg-[var(--green-600)]/8 p-3.5">
                <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-[var(--green-600)]">
                  <Check className="size-4" strokeWidth={3} />
                  Zero donation · Zero capitation
                </p>
              </div>

              <Button href="#counselling" variant="gold" size="md" fullWidth className="mt-6">
                {u.hasPublishedFees ? "Get the full fee breakdown" : "Request the fee structure"}
              </Button>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Why study here ---------------- */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="why-study">
        <div className="shell">
          <SectionHeading
            eyebrow="Student Experience"
            title={
              <>
                What studying at <span className="gold-text">{u.shortName}</span> is actually like
              </>
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_20rem]">
            <RevealGroup className="grid gap-5 sm:grid-cols-2" stagger={0.07}>
              {u.whyStudy.map((w) => (
                <RevealItem key={w.title}>
                  <div className="material-card h-full rounded-[var(--radius-lg)] p-7">
                    <h3 className="t-h4 text-brand">{w.title}</h3>
                    <p className="t-body mt-2.5">{w.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="flex flex-col gap-5">
              <RevealMedia
                id={uniSlotImage(u.slug, "hospital")}
                from="bottom"
                className="aspect-[4/5] rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
                sizes="(max-width: 1024px) 100vw, 20rem"
                overlay={
                  <>
                    <Scrim strength="medium" />
                    <p className="absolute inset-x-0 bottom-0 p-5 text-[0.875rem] font-semibold text-white">
                      Clinical rotations from year three
                    </p>
                  </>
                }
              />
              <RevealMedia
                id={uniSlotImage(u.slug, "laboratory")}
                from="bottom"
                className="aspect-[4/3] rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
                sizes="(max-width: 1024px) 100vw, 20rem"
                overlay={
                  <>
                    <Scrim strength="medium" />
                    <p className="absolute inset-x-0 bottom-0 p-5 text-[0.875rem] font-semibold text-white">
                      Laboratories and practical work
                    </p>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Photographic band ---------------- */}
      <ParallaxMedia
        id={uniSlotImage(u.slug, "students")}
        strength={12}
        className="h-[15rem] w-full sm:h-[20rem]"
        sizes="100vw"
        overlay={
          <>
            <Scrim strength="medium" from="bottom" />
            <div className="shell absolute inset-x-0 bottom-0 pb-8">
              <p className="font-[family-name:var(--font-playfair)] text-[clamp(1.25rem,2.6vw,2rem)] leading-tight tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(5,15,34,0.5)]">
                {u.indianStudents
                  ? `${u.indianStudents} Indian students already on campus.`
                  : "You will not be the only Indian student there."}
              </p>
              <p className="mt-2 text-[0.8125rem] text-white/65">
                Seniors, societies and an Indian mess waiting when you land.
              </p>
            </div>
          </>
        }
      />

      {/* ---------------- Fees ---------------- */}
      <FeeBreakdown university={u} />

      {/* ---------------- Eligibility & documents ---------------- */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="eligibility">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading align="left" eyebrow="Eligibility" title="Do you qualify?" />
            <RevealGroup className="mt-8 flex flex-col divide-y divide-[var(--hairline)]" stagger={0.05}>
              {ELIGIBILITY.map((e) => (
                <RevealItem key={e.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                  <span className="w-40 shrink-0 text-[0.875rem] font-bold text-brand">
                    {e.label}
                  </span>
                  <span className="text-[0.875rem] leading-relaxed text-ink-secondary">
                    {e.value}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Documentation"
              title="What you will need"
            />
            <RevealGroup className="mt-8 grid gap-2.5" stagger={0.04}>
              {DOCUMENTS.map((d) => (
                <RevealItem key={d} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Check className="size-3" strokeWidth={3.2} />
                  </span>
                  <span className="text-[0.875rem] leading-snug text-ink-secondary">{d}</span>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal direction="up" delay={0.2}>
              <p className="t-small mt-6 flex items-start gap-2 rounded-[var(--radius)] border border-line bg-[var(--bg-elevated)] p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" />
                We issue a destination-specific checklist and verify every document before it is
                submitted, so nothing is discovered missing at the embassy.
              </p>
            </Reveal>

            {/* The brochure footnotes NMC eligibility rather than
                asserting it flatly. We carry the caveat. */}
            <Reveal direction="up" delay={0.26}>
              <p className="t-small mt-4 flex items-start gap-2 rounded-[var(--radius)] border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" />
                {NMC_VERIFY_NOTE}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Included / additional ---------------- */}
      <section className="section" aria-labelledby="package">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="What's Included"
              title="Handled by our team"
            />
            <RevealGroup className="mt-8 grid gap-2.5" stagger={0.045}>
              {PACKAGE_INCLUDES.map((p) => (
                <RevealItem key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--green-600)]/12 text-[var(--green-600)]">
                    <Check className="size-3" strokeWidth={3.2} />
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-ink-secondary">{p}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Budget Honestly"
              title="Costs beyond the package"
            />
            <p className="t-small mt-4 max-w-[54ch]">
              Being explicit about these is the transparency this brand is built on. Nobody should
              discover a cost after they have already paid a deposit.
            </p>
            <RevealGroup className="mt-7 flex flex-col divide-y divide-[var(--hairline)]" stagger={0.05}>
              {ADDITIONAL_COSTS.map((c) => (
                <RevealItem key={c.label} className="py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.9375rem] font-bold text-brand">{c.label}</span>
                    <span className="t-num shrink-0 text-[0.875rem] font-semibold text-[var(--accent)]">
                      {c.amount}
                    </span>
                  </div>
                  <p className="t-small mt-1">{c.note}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <UniversityMedia
        campus={uniCampusImages(u.slug)}
        city={uniCityImages(u.slug)}
        universityName={u.shortName}
        place={`${u.city}, ${u.country}`}
      />

      {/* ---------------- FAQ ---------------- */}
      <section className="section" aria-labelledby="uni-faq">
        <div className="shell">
          <SectionHeading
            eyebrow="Common Questions"
            title={`MBBS at ${u.shortName} — your questions answered`}
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <Accordion items={pageFaqs.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={0} />
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="tap inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[var(--accent)] hover:underline"
              >
                Read all 30 questions
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Related ---------------- */}
      <section className="section" aria-labelledby="related">
        <div className="shell">
          <SectionHeading
            eyebrow="Compare"
            title="Other universities worth considering"
            lead={
              country
                ? `Students looking at ${u.shortName} usually compare it with these before deciding.`
                : undefined
            }
          />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.07}>
            {related.map((r) => (
              <RevealItem key={r.slug}>
                <UniversityCard university={r} className="h-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <LeadSection
        source={`university-${u.slug}`}
        defaultInterest={`MBBS in ${u.country}`}
        heading={
          <>
            Ready to apply to <span className="gold-text">{u.shortName}</span>?
          </>
        }
        lead={`Tell us your NEET score and we will confirm within one call whether you are eligible for ${u.name} — and what the complete ${
          u.duration ? u.duration.toLowerCase() : "course"
        } budget looks like for your family.`}
      />
    </>
  );
}

/* ---------------------------------------------------------- */

function Fact({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  highlight?: boolean;
}) {
  // An unpublished fact is omitted, not shown as an empty row.
  if (!value) return null;

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
              ? "text-[0.9375rem] font-bold leading-tight text-[var(--green-600)]"
              : "text-[0.9375rem] font-semibold leading-tight text-ink"
          }
        >
          {value}
        </span>
      </div>
    </RevealItem>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-ink-muted">{label}</dt>
      {/* The China records carry a long duration string — "6 Years
          (5 Years + 1 Year Internship)" — which pushed this row past
          the viewport when the value could not shrink. It wraps now;
          the label holds its width instead. */}
      <dd className="t-num min-w-0 text-right font-semibold text-balance text-ink">{value}</dd>
    </div>
  );
}

/* ---------------------------------------------------------- */

function FeeBreakdown({ university: u }: { university: University }) {
  const hasSchedule = u.semesterSchedule.some((s) => s !== null);
  const symbol = u.currency === "RUB" ? "RUB" : "USD";

  return (
    <section className="section" aria-labelledby="fees">
      <div className="shell">
        <SectionHeading
          eyebrow={`Fee Structure ${SITE.admissionYear}`}
          title={
            u.hasPublishedFees ? (
              <>
                The complete cost, <span className="gold-text">published</span>
              </>
            ) : (
              <>
                What this will <span className="gold-text">actually</span> cost
              </>
            )
          }
          lead={
            u.hasPublishedFees
              ? "Exactly as printed in our official Admission Portfolio. No donation, no capitation, and no figure that appears only after you have committed."
              : `Our current brochure does not publish a fee table for ${u.shortName}, so we are not going to print one. What follows is what the cost is actually made up of — and a counsellor will confirm every line of it in writing before you commit to anything.`
          }
        />

        <Reveal direction="up" className="mt-12">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            {/* Payment schedule */}
            <div className="material-card overflow-hidden rounded-[var(--radius-lg)]">
              <div className="border-b border-hairline px-6 py-5">
                <h3 className="t-h4 text-brand">Payment schedule</h3>
                <p className="t-small mt-1">
                  As per the official university brochure for {SITE.admissionYear}
                </p>
              </div>

              {hasSchedule ? (
                <div className="scroll-x">
                  <table className="w-full min-w-[26rem] border-collapse text-left">
                    <thead>
                      <tr className="bg-[var(--bg-sunken)]">
                        <th
                          scope="col"
                          className="px-6 py-3 text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase"
                        >
                          Instalment
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-[0.6875rem] font-bold tracking-[0.06em] text-ink-muted uppercase"
                        >
                          Amount ({symbol})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {u.semesterSchedule.map((amount, i) => (
                        <tr key={i} className="border-t border-hairline">
                          <td className="px-6 py-3.5 text-[0.875rem] text-ink-secondary">
                            {SEMESTER_LABELS[i]}
                          </td>
                          <td className="t-num px-6 py-3.5 text-right text-[0.9375rem] font-semibold text-ink">
                            {amount === null
                              ? "As per University"
                              : u.currency === "RUB"
                                ? new Intl.NumberFormat("en-IN").format(amount)
                                : num(amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-[var(--accent)] bg-[var(--accent-soft)]">
                        <td className="px-6 py-4 text-[0.875rem] font-bold text-brand">
                          Total tuition fee
                        </td>
                        <td className="t-num px-6 py-4 text-right text-[1.0625rem] font-bold text-brand">
                          {formatTuition(u)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="t-body mx-auto max-w-[52ch]">
                    The instalment schedule for {u.shortName} is confirmed with the university for
                    each intake and is not published in our current brochure. Ask us and we will
                    send you the exact structure — tuition, hostel, living costs and the payment
                    dates — on university letterhead.
                  </p>
                  <Button href="#counselling" variant="gold" size="sm" className="mt-5">
                    Request the fee structure
                  </Button>
                </div>
              )}

              {hasSchedule && (
                <p className="flex items-start gap-2 border-t border-hairline px-6 py-4 text-[0.75rem] leading-relaxed text-ink-muted">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  The instalment schedule above is reproduced from the official brochure. The total
                  tuition figure is the university&rsquo;s stated total and is the authoritative
                  number for the full course. Confirm the current schedule with the university or
                  its official representative before paying.
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-5">
              <div className="rounded-[var(--radius-lg)] bg-[var(--navy-900)] p-7 text-white">
                <p className="t-eyebrow text-[var(--gold-300)]">
                  Total expense{u.duration ? ` · ${u.duration}` : ""}
                </p>
                <p className="t-num mt-4 font-[family-name:var(--font-playfair)] text-[2.5rem] font-bold leading-none">
                  {u.totalExpenseInr ? `₹${inr(u.totalExpenseInr)}` : "On request"}
                </p>
                {u.totalExpense !== null && (
                  <p className="t-num mt-2.5 text-[0.9375rem] text-white/60">{formatTotal(u)}</p>
                )}
                <p className="mt-5 border-t border-white/12 pt-5 text-[0.8125rem] leading-relaxed text-white/60">
                  {u.hasPublishedFees
                    ? "Includes tuition plus the university’s quoted associated costs. Airfare, personal spending, insurance and the annual residence permit are additional — see the breakdown below."
                    : "We will confirm the total in writing before you commit. Whatever the tuition figure turns out to be, airfare, personal spending, insurance and the annual residence permit sit on top of it — see the breakdown below."}
                </p>
              </div>

              <div className="material-card rounded-[var(--radius-lg)] p-6">
                <p className="t-eyebrow text-[var(--accent)]">Monthly living</p>
                <p
                  className={cn(
                    "t-num mt-3 text-[1.75rem] font-bold leading-none",
                    u.livingCost ? "text-brand" : "text-ink-muted",
                  )}
                >
                  {u.livingCost ?? "On request"}
                </p>
                <p className="t-small mt-2">
                  Hostel accommodation and food. Indian mess available on or near campus.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
