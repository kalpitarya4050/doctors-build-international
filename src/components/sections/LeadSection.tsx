import { Phone, Mail, MapPin, Clock3 } from "lucide-react";
import { SITE, telLink } from "@/lib/site";
import { OFFICES } from "@/lib/data/content";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/ui/Reveal";
import { RevealMedia } from "@/components/ui/MediaMotion";
import { Eyebrow } from "@/components/ui/Surface";
import { DotGrid, OrbField } from "@/components/ui/Decor";
import { Sparkle } from "@/components/ui/Bits";

export function LeadSection({
  source = "homepage",
  defaultInterest,
  heading,
  lead,
}: {
  source?: string;
  defaultInterest?: string;
  heading?: React.ReactNode;
  lead?: string;
}) {
  return (
    <section className="section relative isolate overflow-hidden" id="counselling">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--bg),var(--bg-sunken))]"
      />
      <DotGrid gap={26} opacity={0.7} />
      <OrbField tone="gold" count={2} intensity={0.3} />

      <div className="shell grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>
              <Sparkle className="mr-1.5 inline size-3.5 align-[-0.15em]" />
              Free Counselling
            </Eyebrow>
          </Reveal>
          <Reveal direction="up" delay={0.05}>
            <h2 className="t-h2 mt-5 text-brand">
              {heading ?? (
                <>
                  Talk to a doctor-led counsellor <em>today</em>.
                </>
              )}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <p className="t-lead mt-5 max-w-[52ch]">
              {lead ??
                "Fifteen minutes, no cost, no obligation. We will assess your NEET score honestly against real admission cut-offs, walk your parents through the full six-year budget, and tell you plainly if MBBS abroad is the wrong decision for you."}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.16}>
            <ul className="mt-10 flex flex-col gap-5">
              <li className="hover-pastel flex items-start gap-4 rounded-[var(--radius)] p-2 -m-2">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[var(--shadow-sm)]">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.75rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                    Call or WhatsApp
                  </span>
                  <a
                    href={telLink()}
                    className="t-num mt-0.5 block text-[1.25rem] font-bold text-brand hover:text-[var(--accent)]"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </span>
              </li>
              <li className="hover-pastel flex items-start gap-4 rounded-[var(--radius)] p-2 -m-2">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[var(--shadow-sm)]">
                  <Mail className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.75rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                    Email
                  </span>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-0.5 block text-[1rem] font-semibold text-brand hover:text-[var(--accent)]"
                  >
                    {SITE.email}
                  </a>
                </span>
              </li>
              <li className="hover-pastel flex items-start gap-4 rounded-[var(--radius)] p-2 -m-2">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[var(--shadow-sm)]">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.75rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                    Walk into any office
                  </span>
                  <span className="mt-0.5 block text-[1rem] font-semibold text-brand">
                    {OFFICES.map((o) => o.city).join(" · ")}
                  </span>
                </span>
              </li>
              <li className="hover-pastel flex items-start gap-4 rounded-[var(--radius)] p-2 -m-2">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[var(--shadow-sm)]">
                  <Clock3 className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.75rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                    Response time
                  </span>
                  <span className="mt-0.5 block text-[1rem] font-semibold text-brand">
                    Within two hours, every day
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal direction="up" delay={0.24}>
            <div className="mt-10 grid grid-cols-3 gap-3">
              <RevealMedia
                id="counselling"
                from="bottom"
                className="aspect-square rounded-[var(--radius)] border border-line"
                sizes="(max-width: 1024px) 30vw, 10rem"
              />
              <RevealMedia
                id="documents"
                from="bottom"
                className="aspect-square rounded-[var(--radius)] border border-line"
                sizes="(max-width: 1024px) 30vw, 10rem"
              />
              <RevealMedia
                id="airport"
                from="bottom"
                className="aspect-square rounded-[var(--radius)] border border-line"
                sizes="(max-width: 1024px) 30vw, 10rem"
              />
            </div>
          </Reveal>
        </div>

        <Reveal direction="left" delay={0.08}>
          <LeadForm
            source={source}
            defaultInterest={defaultInterest}
            title="Request free counselling"
            subtitle="Fill this in and we will call you back within two hours. We will also open WhatsApp with your details so you can start straight away."
          />
        </Reveal>
      </div>
    </section>
  );
}
