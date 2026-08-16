import Link from "next/link";
import { ArrowUpRight, Clock, Calendar, ShieldCheck } from "lucide-react";
import { COUNTRIES } from "@/lib/data/countries";
import { UNIVERSITIES } from "@/lib/data/universities";
import { countryImage } from "@/lib/data/media-map";
import { Media, Scrim } from "@/components/ui/Media";
import { Flag } from "@/components/ui/Flag";
import { SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TiltCard, Chip } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";

export function Destinations() {
  return (
    <section data-ground="linen"
      className="section relative" aria-labelledby="destinations-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Study in Top Destinations"
          title={
            <>
              {COUNTRIES.length} countries. One <em>honest</em> shortlist.
            </>
          }
          lead="Every destination below is NMC-eligible or WHO recognized, taught entirely in English, and requires no IELTS. We tell you the trade-offs of each — climate, cost, food, clinical exposure — before you choose."
        />

        <RevealGroup
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {COUNTRIES.map((c) => {
            const unis = UNIVERSITIES.filter((u) => u.countrySlug === c.slug);
            return (
              <RevealItem key={c.slug} as="article">
                <TiltCard className="h-full" intensity={5}>
                  <Link
                    href={`/destinations/${c.slug}`}
                    className="group material-card hover-lift relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)]"
                  >
                    {/* Country hue as a top rule. Each accent is the
                        colour that destination already carries in the
                        client's printed comparison sheets, so the six
                        cards together read as their spectrum. */}
                    <span
                      aria-hidden
                      className="h-1.5 w-full shrink-0"
                      style={{ background: c.accent }}
                    />

                    {/* Country photograph */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Media
                        id={countryImage(c.slug)}
                        className="absolute inset-0"
                        imgClassName="transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <Scrim strength="medium" />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-50"
                        style={{ background: `linear-gradient(160deg, ${c.accent}, transparent 65%)` }}
                      />

                      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
                        <Flag country={c.slug} className="h-7 w-[2.625rem] shadow-[var(--shadow-badge)]" />
                        <span className="grid size-8 place-items-center rounded-full material-chip-dark transition-all duration-300 group-hover:bg-[var(--accent-bright)] group-hover:text-[var(--navy-950)] group-hover:shadow-[var(--neon-gold)]">
                          <ArrowUpRight
                            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2.2}
                          />
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h3 className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-white">
                          MBBS in {c.name}
                        </h3>
                        <p className="mt-1 text-[0.8125rem] font-medium italic text-[var(--gold-300)]">
                          {c.tagline}
                        </p>
                      </div>
                    </div>

                    <dl className="relative grid grid-cols-2 gap-y-3.5 px-6 pt-5">
                      <div>
                        <dt className="text-[0.6875rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                          Total from
                        </dt>
                        <dd className="t-num mt-1 text-[0.9375rem] font-bold text-brand">
                          {c.startingFrom}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                          Universities
                        </dt>
                        <dd className="mt-1 text-[0.9375rem] font-bold text-brand">
                          {unis.length > 0 ? unis.length : "On request"}
                        </dd>
                      </div>
                    </dl>

                    <div className="relative mt-5 flex flex-wrap gap-1.5 px-6 pb-6">
                      <Chip tone="default">
                        <Clock className="size-3" />
                        {c.duration}
                      </Chip>
                      <Chip tone="default">
                        <Calendar className="size-3" />
                        {c.intake}
                      </Chip>
                      {c.recognition.slice(0, 2).map((r) => (
                        <Chip key={r} tone="green">
                          <ShieldCheck className="size-3" />
                          {r}
                        </Chip>
                      ))}
                      {!c.ieltsRequired && <Chip tone="gold">No IELTS</Chip>}
                    </div>
                  </Link>
                </TiltCard>
              </RevealItem>
            );
          })}

          {/* Terminal card — the "& More…" tile from the brochure */}
          <RevealItem as="article">
            <div className="group relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] bg-[var(--navy-900)] p-6 text-white">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-55"
                style={{ background: "radial-gradient(circle, #C9A227, transparent 70%)" }}
              />
              <div className="relative">
                <p className="t-eyebrow text-[var(--gold-300)]">& More…</p>
                <h3 className="mt-4 text-[1.625rem] leading-[1.15] tracking-[-0.02em]">
                  Looking for a country not listed here?
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-on-dark-secondary">
                  We work with recognized medical universities beyond these {COUNTRIES.length}. Tell
                  us your NEET score and budget and we will find the honest match.
                </p>
              </div>
              <Button variant="gold" size="sm" className="relative mt-7 w-fit" href="/contact">
                Talk to a counsellor
              </Button>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
