import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SERVICES } from "@/lib/data/content";
import { SERVICE_IMAGE } from "@/lib/data/media-map";
import { PageHero } from "@/components/layout/PageHero";
import { LeadSection } from "@/components/sections/LeadSection";
import { Process } from "@/components/sections/Process";
import { Reveal } from "@/components/ui/Reveal";
import { RevealMedia } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Services — Counselling, Admission, Visa & Post-Arrival Support",
  description:
    "Ten services covering the complete MBBS abroad journey: career counselling, university selection, application guidance, admission and documentation support, visa and travel assistance, pre-departure briefing, post-arrival support and FMGE/NExT guidance.",
  alternates: { canonical: "/services" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.short,
      provider: { "@type": "Organization", name: SITE.name },
      areaServed: "IN",
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero
        eyebrow="What We Do"
        title="Ten services. One continuous process."
        highlight={["continuous"]}
        crumbs={[{ label: "Services" }]}
        image="counselling"
        lead="Most consultancies hand you off between departments — and go quiet once the fee clears. Everything below is delivered by one team, and that team stays reachable for the full six years of your degree."
      />

      <section className="section" aria-label="Services">
        <div className="shell flex flex-col gap-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} direction="up" delay={(i % 3) * 0.05}>
              <article
                id={s.slug}
                className="material-card grid scroll-mt-28 gap-7 overflow-hidden rounded-[var(--radius-lg)] p-7 lg:grid-cols-[13rem_1fr_18rem] lg:items-start lg:p-9"
              >
                <div className="flex items-center gap-4 lg:flex-col lg:items-stretch">
                  <RevealMedia
                    id={SERVICE_IMAGE[s.slug] ?? "counselling"}
                    from={i % 2 === 0 ? "left" : "bottom"}
                    className="hidden aspect-[4/3] w-full rounded-[var(--radius)] border border-line lg:block"
                    sizes="13rem"
                    overlay={<Scrim strength="light" />}
                  />
                  <span className="grid size-14 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)] lg:size-12">
                    <Icon name={s.icon} className="size-6 lg:size-5" strokeWidth={1.7} />
                  </span>
                  <span className="t-figure text-[1.75rem] font-bold leading-none text-[var(--border-strong)] lg:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h2 className="t-h3 text-brand">{s.title}</h2>
                  <p className="mt-1.5 text-[0.9375rem] font-medium italic text-[var(--accent)]">
                    {s.short}
                  </p>
                  <p className="t-body mt-4 max-w-[68ch]">{s.body}</p>
                </div>

                <ul className="flex flex-col gap-2.5 rounded-[var(--radius)] bg-[var(--bg-sunken)] p-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[var(--green-600)]/14 text-[var(--green-600)]">
                        <Check className="size-2.5" strokeWidth={3.5} />
                      </span>
                      <span className="text-[0.8125rem] leading-snug text-ink-secondary">{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Process />

      <LeadSection
        source="services"
        heading={
          <>
            Start with the <em>first</em> one.
          </>
        }
        lead="Career counselling is free and carries no obligation. Fifteen minutes with a doctor-led advisor who will assess your NEET score honestly — including telling you if going abroad is the wrong call."
      />
    </>
  );
}
