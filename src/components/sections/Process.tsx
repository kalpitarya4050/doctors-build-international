"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { PROCESS } from "@/lib/data/content";
import { PROCESS_IMAGE } from "@/lib/data/media-map";
import { SectionHeading } from "@/components/ui/Section";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { RevealMedia } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 55%"],
  });

  // The connecting line draws itself as you scroll — the motion
  // points at where the sequence is going.
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section data-ground="linen"
      className="section relative" aria-labelledby="process-title">
      <div className="shell">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              Five steps. <em>Six to eight weeks.</em> One team.
            </>
          }
          lead="From your first counselling call to landing at the destination airport — here is exactly what happens, and when."
        />

        <div ref={ref} className="relative mt-16">
          {/* Track */}
          <div
            aria-hidden
            className="absolute left-[1.6875rem] top-2 h-[calc(100%-4rem)] w-px bg-[var(--border)] lg:left-0 lg:top-[3.4rem] lg:h-px lg:w-full"
          />
          {!reduced && (
            <motion.div
              aria-hidden
              className="absolute left-[1.6875rem] top-2 h-[calc(100%-4rem)] w-px origin-top bg-[linear-gradient(180deg,var(--gold-500),var(--gold-300))] lg:left-0 lg:top-[3.4rem] lg:h-px lg:w-full lg:origin-left lg:bg-[linear-gradient(90deg,var(--gold-500),var(--gold-300))]"
              style={{ scaleY: lineScale, scaleX: 1 }}
            />
          )}

          <RevealGroup className="grid gap-9 lg:grid-cols-5 lg:gap-5" stagger={0.1}>
            {PROCESS.map((p) => (
              <RevealItem key={p.step} className="relative flex gap-5 lg:flex-col lg:gap-0">
                {/* Node.
                    `w-fit` matters: on lg the item switches to flex-col,
                    where `shrink-0` no longer constrains width and this
                    wrapper stretched to the whole 5-column cell. The step
                    badge is anchored to its right edge, so it detached
                    from the icon and floated most of a column away. */}
                <div className="group relative z-10 w-fit shrink-0">
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-[var(--bg-elevated)] shadow-[var(--shadow-md)] transition-shadow duration-300 group-hover:shadow-[var(--neon-gold)]">
                    <Icon name={p.icon} className="size-6 text-[var(--accent)]" strokeWidth={1.7} />
                  </span>
                  {/* Gradient step orb, rather than the flat navy dot
                      it replaced — it has to survive on both the
                      linen ground and the elevated node behind it. */}
                  <span
                    aria-hidden
                    className="absolute -right-1.5 -top-1.5 grid size-7 place-items-center rounded-full text-[0.6875rem] font-bold text-white shadow-[var(--shadow-md)]"
                    style={{ background: "var(--grad-brand)" }}
                  >
                    {p.step}
                  </span>
                </div>

                <div className="lg:mt-6 lg:pr-5">
                  <RevealMedia
                    id={PROCESS_IMAGE[p.step] ?? "counselling"}
                    from="bottom"
                    className="mb-4 hidden aspect-[16/10] w-full rounded-[var(--radius)] border border-line shadow-[var(--shadow-sm)] lg:block"
                    sizes="(max-width: 1024px) 100vw, 15rem"
                    overlay={<Scrim strength="light" />}
                  />
                  <p className="t-eyebrow text-[var(--accent)]">{p.duration}</p>
                  <h3 className="t-h4 mt-2 text-brand">{p.title}</h3>
                  <p className="t-small mt-2 leading-relaxed">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
