import { USPS, PILLARS } from "@/lib/data/content";
import { SectionHeading, Bloom } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/Surface";
import { Media, Scrim } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Bento layout — the first card spans two columns on large
 *  screens so the grid has a clear focal point rather than seven
 *  equal tiles competing for attention. */
const SPANS = [
  "lg:col-span-2 lg:row-span-1",
  "",
  "",
  "",
  "lg:col-span-2",
  "",
  "",
];

export function WhyUs() {
  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="why-title">
      <Bloom tone="gold" />

      <div className="shell">
        <SectionHeading
          eyebrow="Why Choose Doctors Build"
          title={
            <>
              The reasons families <span className="gold-text">refer us</span> to other families.
            </>
          }
          lead="Most of our enquiries now arrive through parents who have already sent one child abroad with us. These are the seven reasons they give."
        />

        <RevealGroup
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {USPS.map((u, i) => (
            <RevealItem key={u.title} className={cn(SPANS[i])}>
              <TiltCard className="h-full" intensity={4}>
                <div className="material-card relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon name={u.icon} className="size-5" strokeWidth={1.9} />
                    </span>
                    <span className="text-right">
                      <span className="block font-[family-name:var(--font-playfair)] text-[1.75rem] font-bold leading-none text-brand">
                        {u.stat}
                      </span>
                      <span className="mt-1 block text-[0.625rem] font-semibold tracking-[0.08em] text-ink-muted uppercase">
                        {u.statLabel}
                      </span>
                    </span>
                  </div>

                  <h3 className="t-h4 mt-6 text-brand">{u.title}</h3>
                  <p className="t-small mt-2.5 leading-relaxed">{u.body}</p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}

          {/* Photographic tile — fills the bento's last cell and stops
              the grid reading as seven identical boxes. */}
          <RevealItem>
            <div className="relative h-full min-h-[14rem] overflow-hidden rounded-[var(--radius-lg)] border border-line">
              <Media
                id="students-friends"
                className="absolute inset-0"
                imgClassName="transition-transform duration-[1100ms] ease-out hover:scale-[1.06]"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <Scrim strength="heavy" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-[family-name:var(--font-playfair)] text-[1.375rem] leading-tight tracking-[-0.02em] text-white">
                  You will not be the <span className="gold-text">only Indian</span> there.
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/70">
                  Between 800 and 2500 Indian students are already on every campus we place into.
                </p>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>

        {/* Support pillars strip */}
        <div className="mt-20">
          <RevealGroup
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7"
            stagger={0.05}
          >
            {PILLARS.map((p) => (
              <RevealItem key={p.title}>
                <div className="group flex h-full flex-col items-center gap-3 rounded-[var(--radius)] border border-line bg-[var(--bg-elevated)] p-5 text-center transition-colors duration-300 hover:border-[var(--accent)]">
                  <span className="grid size-11 place-items-center rounded-full bg-[var(--bg-sunken)] text-[var(--accent)] transition-colors duration-300 group-hover:bg-[var(--accent-soft)]">
                    <Icon name={p.icon} className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-[0.8125rem] font-bold leading-tight text-ink">
                    {p.title}
                  </span>
                  <span className="text-[0.6875rem] leading-relaxed text-ink-muted">{p.body}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
