import type { Metadata } from "next";
import { MapPin, Quote } from "lucide-react";
import { OFFICES, USPS } from "@/lib/data/content";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { LifeAbroad } from "@/components/sections/LifeAbroad";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { RevealMedia, ParallaxMedia } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { SectionHeading, Bloom } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — Doctor-Led Counselling for MBBS Abroad Since 2015",
  description:
    "Doctors Build International has guided Indian students into NMC-approved medical universities abroad for over a decade. Doctor-led counselling, 100% transparency, offices in Shimla, Chandigarh and Vadodara.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "We tell you when not to go.",
    body: "If your NEET score, your budget or your circumstances make studying abroad the wrong decision, we say so in the first call. We would rather lose an enrolment than place a student who should not have gone.",
  },
  {
    title: "Every rupee is written down first.",
    body: "The complete six-year cost — tuition, living, residence permit, insurance, travel — is on paper before you pay anything. No figure appears later. This is what 100% transparency actually means.",
  },
  {
    title: "We never handle your tuition.",
    body: "Fees go directly to the university's official account, and you keep the receipt. Any consultant who asks for tuition in cash, or through their own account, should be walked away from immediately.",
  },
  {
    title: "The degree is halfway, not the finish.",
    body: "An MBBS abroad is only worth what it converts into. We plan FMGE and NExT preparation from the third year, because a degree that does not lead to registration in India has not solved anything.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="From dreams to white coat — for a decade."
        highlight={["white", "coat"]}
        crumbs={[{ label: "About" }]}
        image="students-friends"
        imageCaption="Illustrative of student life abroad"
        lead="Doctors Build International was founded on a simple observation: Indian families making the biggest educational decision of their lives were doing it on incomplete information, from people who were paid to say yes. We built the opposite of that."
      />

      <Stats />

      {/* Founding story */}
      <section className="section relative isolate overflow-hidden" aria-labelledby="story">
        <Bloom tone="both" />
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why We Exist"
              title={
                <>
                  Doctor-led counselling, <span className="gold-text">for a reason</span>
                </>
              }
            />
            <div className="mt-7 flex flex-col gap-5">
              <Reveal direction="up">
                <p className="t-body max-w-[68ch]">
                  Every year, tens of thousands of Indian students qualify NEET but do not secure a
                  government seat — and cannot afford the fees a private Indian medical college
                  demands. Studying abroad is a genuine, recognized route for those students. It is
                  also an industry with very little accountability.
                </p>
              </Reveal>
              <Reveal direction="up" delay={0.05}>
                <p className="t-body max-w-[68ch]">
                  Our counsellors include practising doctors who took this path themselves. They know
                  what a fifth-year clinical rotation in a foreign hospital actually demands, what
                  FMGE actually tests, and what it feels like to be nineteen and eight thousand
                  kilometres from home in a language you do not speak. That experience is why our
                  first conversation is an honest assessment rather than a sales pitch.
                </p>
              </Reveal>
              <Reveal direction="up" delay={0.1}>
                <p className="t-body max-w-[68ch]">
                  Over ten years we have placed students into medical universities across Georgia,
                  Russia, Uzbekistan, Kyrgyzstan and Nepal. Five thousand families have made this
                  decision with us. Most of our enquiries now arrive through parents who have already
                  sent one child abroad and are sending the next — which is the only endorsement that
                  has ever mattered to us.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[var(--radius-2xl)] opacity-55 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--gold-500) 24%, transparent), transparent 70%)",
              }}
            />

            {/* Offset stack — a lead frame with two supporting frames
                on their own scroll offsets, so the block has depth. */}
            <div className="relative grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 pt-10">
                <ParallaxMedia
                  id="students-friends"
                  strength={10}
                  className="aspect-[3/4] rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-lg)]"
                  sizes="(max-width: 1024px) 45vw, 16rem"
                />
                <RevealMedia
                  id="hospital-ward"
                  from="left"
                  className="aspect-square rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
                  sizes="(max-width: 1024px) 45vw, 16rem"
                />
              </div>
              <div className="flex flex-col gap-4">
                <RevealMedia
                  id="hero-doctor"
                  from="bottom"
                  className="aspect-square rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
                  sizes="(max-width: 1024px) 45vw, 16rem"
                />
                <ParallaxMedia
                  id="consultation"
                  strength={10}
                  className="aspect-[3/4] rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-lg)]"
                  sizes="(max-width: 1024px) 45vw, 16rem"
                  overlay={
                    <>
                      <Scrim strength="medium" />
                      <p className="absolute inset-x-0 bottom-0 p-5 text-[0.8125rem] font-semibold leading-snug text-white">
                        Most of our conversations are with families, not students alone.
                      </p>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="values">
        <div className="shell">
          <SectionHeading
            eyebrow="What We Stand For"
            title={
              <>
                Four commitments we do <span className="gold-text">not</span> bend
              </>
            }
          />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2" stagger={0.07}>
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <div className="material-card relative h-full overflow-hidden rounded-[var(--radius-lg)] p-8">
                  <Quote
                    aria-hidden
                    className="absolute right-6 top-6 size-8 text-[var(--accent)]/16"
                    fill="currentColor"
                  />
                  <h3 className="t-h3 relative max-w-[22ch] text-brand">{v.title}</h3>
                  <p className="t-body relative mt-4">{v.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* USPs */}
      <section className="section" aria-labelledby="usps">
        <div className="shell">
          <SectionHeading
            eyebrow="Why Doctors Build"
            title="Seven reasons families come back"
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
            {USPS.map((u) => (
              <RevealItem key={u.title}>
                <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-[var(--bg-elevated)] p-6">
                  <span className="grid size-10 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon name={u.icon} className="size-5" />
                  </span>
                  <h3 className="t-h4 mt-5 text-brand">{u.title}</h3>
                  <p className="t-small mt-2 leading-relaxed">{u.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Offices */}
      <section className="section bg-[var(--bg-sunken)]" aria-labelledby="offices">
        <div className="shell">
          <SectionHeading
            eyebrow="Where To Find Us"
            title="Three offices. Walk in any time."
            lead="No appointment needed. Bring your parents, bring your marksheets, and bring every question you have."
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
                  <a
                    href={`tel:${SITE.phone}`}
                    className="t-num mt-5 inline-block font-semibold text-[var(--accent)] hover:underline"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <LifeAbroad />
      <Testimonials />

      <LeadSection source="about" />
    </>
  );
}
