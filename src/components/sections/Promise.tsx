import { Check } from "lucide-react";
import { WHY_POINTS } from "@/lib/data/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { RevealMedia, ParallaxMedia } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Eyebrow } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { Bloom } from "@/components/ui/Section";

/** "Your Dream. Our Guidance. Your Future." — the brochure's
 *  core promise, given a full section. */
export function PromiseSection() {
  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="promise-title">
      <Bloom tone="both" />

      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Doctor-Led Counselling</Eyebrow>
          </Reveal>

          <h2 id="promise-title" className="t-h2 mt-5 text-brand">
            <Reveal direction="up" delay={0.04}>
              <span className="block">Your Dream.</span>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <em className="block">Our Guidance.</em>
            </Reveal>
            <Reveal direction="up" delay={0.16}>
              <span className="block">Your Future.</span>
            </Reveal>
          </h2>

          <Reveal direction="up" delay={0.22}>
            <p className="t-lead mt-6 max-w-[52ch]">
              We help aspiring doctors achieve their dreams by getting admission in top global
              medical universities with ease, transparency and complete support.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.28}>
            <p className="t-body mt-4 max-w-[54ch]">
              Our counsellors include practising doctors who have walked this path themselves. That
              is why the first thing we do is tell you honestly whether studying abroad is the right
              decision for you — before anything else is discussed.
            </p>
          </Reveal>

          <RevealGroup className="mt-9 grid gap-3 sm:grid-cols-2" stagger={0.06} delay={0.32}>
            {WHY_POINTS.map((p) => (
              <RevealItem key={p} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--green-600)]/12 text-[var(--green-600)]">
                  <Check className="size-3" strokeWidth={3.2} />
                </span>
                <span className="text-[0.9375rem] font-medium leading-snug text-ink-secondary">
                  {p}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal direction="up" delay={0.44}>
            <Button href="/about" variant="primary" size="lg" className="mt-9">
              Read Our Story
            </Button>
          </Reveal>
        </div>

        {/* Photo composition — a tall lead image with two offset
            supporting frames, so the block reads as a spread rather
            than a single stock photo. */}
        <div className="relative pb-8">
          <div className="relative mx-auto max-w-[32rem]">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[var(--radius-2xl)] opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--gold-500) 24%, transparent), transparent 70%)",
              }}
            />

            <div className="relative grid grid-cols-5 gap-3">
              <RevealMedia
                id="hero-students"
                from="bottom"
                className="col-span-3 aspect-[3/4] rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-lg)]"
                sizes="(max-width: 1024px) 55vw, 20rem"
                overlay={<Scrim strength="light" />}
              />

              <div className="col-span-2 flex flex-col gap-3">
                <ParallaxMedia
                  id="counselling"
                  strength={9}
                  className="aspect-square rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
                  sizes="(max-width: 1024px) 35vw, 13rem"
                />
                <RevealMedia
                  id="stethoscope"
                  from="right"
                  className="flex-1 rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-md)]"
                  sizes="(max-width: 1024px) 35vw, 13rem"
                />
              </div>
            </div>

            {/* Anchored badge. Solid rather than translucent — it sits
                over a photograph, and a light material on top of a busy
                image collapses legibility. */}
            <Reveal direction="up" delay={0.28}>
              <div className="absolute -bottom-7 left-2 rounded-[var(--radius)] border border-line bg-[var(--bg-elevated)] px-5 py-3.5 shadow-[var(--shadow-lg)] sm:-left-6">
                <p className="t-figure text-[1.75rem] font-bold leading-none text-brand">
                  10<span className="gold-text">+</span>
                </p>
                <p className="mt-1.5 text-[0.6875rem] font-medium tracking-[0.02em] text-ink-muted">
                  Years in medical education
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
