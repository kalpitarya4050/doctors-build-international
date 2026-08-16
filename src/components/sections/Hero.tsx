"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Phone, ShieldCheck, Star } from "lucide-react";
import { SPRING_UI } from "@/lib/motion";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { UNIVERSITIES } from "@/lib/data/universities";
import { COUNTRIES } from "@/lib/data/countries";
import { Globe } from "@/components/ui/Globe";
import { Button } from "@/components/ui/Button";
import { WipeLine } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { useIntro } from "@/components/intro/Intro";

/* ============================================================
   Full-bleed hero.

   The previous version split the viewport into a copy column and
   a visual column, then scattered four rotated photo cards and a
   floating stat chip around the globe. Every element was small,
   nothing led, and the composition read as busy rather than
   confident.

   This one commits to a single ground — navy, edge to edge, with
   the globe as the subject rather than an ornament beside the
   text — and puts the type on it with room to breathe. The globe
   was the one thing worth keeping, so it is promoted rather than
   decorated around.
   ============================================================ */

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* The opening curtain releases this. Until it does, every entry
     animation below holds at `initial` — otherwise the whole hero
     would play out behind the panel and be finished and static by
     the time it lifted. On inner pages and repeat visits `ready`
     is true from the first frame. */
  const { ready } = useIntro();

  /** Rise-and-fade entry, held until `ready`. Every delay below is
   *  measured from the release, so the sequence reads identically
   *  whether the curtain ran or not. */
  const rise = (delay: number, y = 18) => ({
    initial: { opacity: 0, y },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { ...SPRING_UI, delay },
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The globe drifts slower than the copy, so the two layers
  // separate as the section leaves.
  const globeY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      data-ground="navy"
      className="relative isolate flex min-h-[min(46rem,calc(100svh-var(--header-h)))] flex-col justify-center overflow-hidden grain"
      aria-labelledby="hero-title"
    >
      {/* ---------------- Ground ---------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,var(--navy-950)_0%,var(--navy-900)_46%,#0d2a5c_100%)]" />
        {/* Warm bloom behind the globe, so the sphere sits in light
            rather than floating on a flat field. */}
        <div
          className="absolute right-[6%] top-1/2 size-[52rem] -translate-y-1/2 rounded-full opacity-70 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--gold-500) 22%, transparent), transparent 66%)",
          }}
        />
        <div
          className="absolute -left-[10%] bottom-[-20%] size-[38rem] rounded-full opacity-60 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--navy-500) 55%, transparent), transparent 70%)",
          }}
        />
      </div>

      {/* ---------------- Globe ----------------
          Deliberately oversized and cropped by the section. A globe
          that fits neatly inside a box reads as an illustration; one
          that runs past the edge reads as a place. */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: globeY, opacity: fade }}
        className="pointer-events-none absolute -right-[22%] top-1/2 -z-10 aspect-square w-[86%] -translate-y-1/2 sm:-right-[14%] sm:w-[70%] lg:right-[-6%] lg:w-[52%]"
      >
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduced ? 1 : 0.9 }}
          transition={{ type: "spring", bounce: 0, duration: 1.2, delay: 0.15 }}
          className="size-full"
        >
          <Globe tone="onNavy" />
        </motion.div>
      </motion.div>

      {/* Keeps the headline legible where it crosses the sphere. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--navy-950)_0%,color-mix(in_srgb,var(--navy-950)_72%,transparent)_38%,transparent_68%)]"
      />

      {/* ---------------- Copy ---------------- */}
      <motion.div
        style={reduced ? undefined : { y: copyY, opacity: fade }}
        className="shell-wide relative w-full py-16 sm:py-20 lg:py-28"
      >
        <motion.div
          {...rise(0.05, 14)}
          className="material-chip-dark hover-neon inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
        >
          <span className="shrink-0 whitespace-nowrap rounded-full bg-[var(--gold-500)] px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.08em] text-[var(--navy-950)] uppercase">
            {SITE.admissionYear}
          </span>
          <span className="text-[0.8125rem] font-medium text-on-dark-secondary">
            Admissions open · {UNIVERSITIES.length} universities · {COUNTRIES.length} countries
          </span>
        </motion.div>

        {/* Line-by-line mask wipe, matching the reference. Each line
            is its own block so the wipe travels the width of that
            line rather than the width of the whole heading. */}
        <h1 id="hero-title" className="t-display mt-7 max-w-[16ch] text-on-dark">
          <WipeLine as="div" play={ready} delay={0.1}>
            From Dreams
          </WipeLine>
          <WipeLine as="div" play={ready} delay={0.42}>
            To <em className="t-accent">White Coat.</em>
          </WipeLine>
        </h1>

        <motion.p
          {...rise(0.72)}
          className="t-lead mt-7 max-w-[46ch] !text-on-dark-secondary"
        >
          We help aspiring doctors secure admission at NMC-eligible medical universities
          abroad — with doctor-led counselling, published fees and support that does not
          stop at the airport.
        </motion.p>

        <motion.div
          {...rise(0.82)}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href="/apply" variant="gold" size="lg" className="w-full sm:w-auto">
            Get Free Counselling
            <ArrowRight className="size-4" />
          </Button>
          <Button
            href={whatsappLink()}
            external
            variant="whatsapp"
            size="lg"
            className="w-full sm:w-auto"
          >
            <WhatsAppIcon className="size-[18px]" />
            WhatsApp Us
          </Button>
          <a
            href={telLink()}
            className="tap flex min-h-11 items-center gap-2 px-1 text-[0.9375rem] font-semibold text-on-dark-secondary transition-colors hover:text-on-dark sm:px-3"
          >
            <Phone className="size-4" />
            {SITE.phoneDisplay}
          </a>
        </motion.div>
      </motion.div>

      {/* ---------------- Counter-line, bottom right ----------------
          The reference sets its headline against a second line in the
          opposite corner, so the eye crosses the whole frame. */}
      <motion.div
        style={reduced ? undefined : { opacity: fade }}
        // Below md the fixed Call/Apply bar overlays the viewport
        // bottom, and the last chip in this row was disappearing
        // behind it. Clear the bar plus the home indicator.
        className="shell-wide relative w-full pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-14"
      >
        <motion.div
          {...rise(0.96, 16)}
          className="flex flex-wrap items-center gap-x-7 gap-y-3.5 lg:justify-end"
        >
          <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-on-dark-secondary">
            <ShieldCheck className="size-4 text-[var(--gold-300)]" />
            NMC eligible · WHO recognized
          </span>
          <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-on-dark-secondary">
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-[var(--gold-400)] text-[var(--gold-400)]" />
              ))}
            </span>
            4.5/5 from 5000+ families
          </span>
          {/* Highlight block on the closing claim — the reference's
              marker-pen device, and the only one on the page. */}
          <span className="rounded-[var(--radius-sm)] bg-[var(--gold-500)] px-2.5 py-1 text-[0.8125rem] font-bold text-[var(--navy-950)]">
            Zero donation · Zero capitation
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
