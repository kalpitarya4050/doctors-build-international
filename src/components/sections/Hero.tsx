"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Phone, ShieldCheck, Star } from "lucide-react";
import { SPRING_UI } from "@/lib/motion";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { UNIVERSITIES } from "@/lib/data/universities";
import { COUNTRIES } from "@/lib/data/countries";
import { Globe } from "@/components/ui/Globe";
import { Button } from "@/components/ui/Button";
import { WipeLine } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { useIntro } from "@/components/intro/Intro";
import { AnimatedArrow } from "@/components/ui/Bits";

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

  /* ---- Pointer parallax (Apple §2/§3) ----
     Scroll already separates these layers vertically; the pointer
     separates them horizontally, which is what makes the globe read
     as sitting behind the type rather than beside it. Spring-driven
     off live values so a change of direction mid-travel reverses
     from the current on-screen position, never from the target. */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const lit = useMotionValue(0);
  const TRACK = { stiffness: 140, damping: 26, mass: 0.55 };
  const sx = useSpring(px, TRACK);
  const sy = useSpring(py, TRACK);
  const sLit = useSpring(lit, { stiffness: 120, damping: 24, mass: 0.5 });

  const globeX = useTransform(sx, [0, 1], [34, -34]);
  const globeTiltY = useTransform(sy, [0, 1], [22, -22]);
  const copyX = useTransform(sx, [0, 1], [-12, 12]);
  const copyLean = useTransform(sy, [0, 1], [-8, 8]);

  const lx = useTransform(sx, (v) => `${v * 100}%`);
  const ly = useTransform(sy, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(42rem circle at ${lx} ${ly}, rgba(233,199,102,0.20), rgba(201,162,39,0.07) 36%, transparent 64%)`;

  const track = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    lit.set(1);
  };
  const release = () => {
    px.set(0.5);
    py.set(0.5);
    lit.set(0);
  };

  return (
    <section
      ref={ref}
      onPointerMove={track}
      onPointerLeave={release}
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
      {/* Three nested layers, not one style object: scroll drift is a
          percentage and pointer offset is pixels, and `y` /
          `translateY` are the same transform — set both on one
          element and the second silently wins. */}
      <motion.div
        style={reduced ? undefined : { y: globeY, opacity: fade }}
        /* NOT pointer-events-none, and not aria-hidden: the globe is
           draggable, so it has to receive pointer events and announce
           itself. It previously sat inside a pointer-events-none
           wrapper, which silently swallowed every drag. */
        className="absolute -right-[22%] top-1/2 z-[1] aspect-square w-[86%] -translate-y-1/2 sm:-right-[14%] sm:w-[70%] lg:right-[-6%] lg:w-[52%]"
      >
        <motion.div
          style={reduced ? undefined : { x: globeX, y: globeTiltY }}
          className="size-full"
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
      </motion.div>

      {/* ---------------- Legibility veils ----------------
          Both sit ABOVE the globe: same z-index, later in source order.
          The copy at z-[2] still clears them.

          This layer used to be a single scrim at -z-10, BEHIND the
          globe — which protected nothing and went unnoticed only
          because the old globe was a faint wireframe. An opaque lit
          planet put bright coastline straight under the lead paragraph.

          Two gradients because there are two layouts. From sm up the
          copy is a left column and the globe is a right one, so the
          veil runs horizontally and leaves the sphere's own half
          alone. Below sm the globe is a full-bleed wash behind centred
          copy, and only a vertical veil can protect a line of text
          that spans the entire width. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,var(--navy-950)_0%,color-mix(in_srgb,var(--navy-950)_74%,transparent)_42%,color-mix(in_srgb,var(--navy-950)_34%,transparent)_66%,transparent_82%)] sm:block lg:bg-[linear-gradient(90deg,var(--navy-950)_0%,color-mix(in_srgb,var(--navy-950)_72%,transparent)_38%,transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] sm:hidden"
        style={{
          /* Tuned against the lead paragraph, which lands around 45-58%
             of the section's height — the band that has to stay opaque
             enough to read. Everything below 80% is left nearly clear
             so the sphere and its rim are still unmistakably there. */
          background:
            "linear-gradient(180deg," +
            "color-mix(in srgb, var(--navy-950) 84%, transparent) 0%," +
            "color-mix(in srgb, var(--navy-950) 66%, transparent) 52%," +
            "color-mix(in srgb, var(--navy-950) 20%, transparent) 82%," +
            "transparent 100%)",
        }}
      />

      {/* Pointer spotlight — lifts the ground where the cursor is,
          so the navy field is a lit surface rather than flat paint. */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[15] mix-blend-soft-light"
          style={{ background: spotlight, opacity: sLit }}
        />
      )}

      {/* ---------------- Copy ----------------
          The two wrappers are pointer-transparent and each real child
          opts back in.

          They are full-width blocks stacked ABOVE the globe, so while
          they accepted pointer events they covered the sphere
          completely and swallowed every drag — the globe was not
          draggable anywhere on the page, at any viewport. Making the
          globe's own wrapper interactive was necessary but not
          sufficient; nothing reached it. Verify with
          document.elementFromPoint at the sphere's centre before
          changing any of this. */}
      <motion.div
        style={reduced ? undefined : { y: copyY, opacity: fade }}
        className="pointer-events-none relative z-[2] w-full"
      >
      <motion.div
        style={reduced ? undefined : { x: copyX, y: copyLean }}
        className="shell-wide pointer-events-none relative w-full py-16 sm:py-20 lg:py-28"
      >
        <motion.div
          {...rise(0.05, 14)}
          className="material-chip-dark hover-neon pointer-events-auto inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
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
        {/* Headline and lead stay selectable — they opt back in, and
            their boxes end well short of the sphere. */}
        <h1 id="hero-title" className="t-display pointer-events-auto mt-7 max-w-[16ch] text-on-dark">
          <WipeLine as="div" play={ready} delay={0.1}>
            From Dreams
          </WipeLine>
          <WipeLine as="div" play={ready} delay={0.42}>
            To <em className="t-accent">White Coat.</em>
          </WipeLine>
        </h1>

        <motion.p
          {...rise(0.72)}
          className="t-lead pointer-events-auto mt-7 max-w-[46ch] !text-on-dark-secondary"
        >
          We help aspiring doctors secure admission at NMC-eligible medical universities
          abroad — with doctor-led counselling, published fees and support that does not
          stop at the airport.
        </motion.p>

        <motion.div
          {...rise(0.82)}
          className="pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href="/apply" variant="gold" size="lg" className="w-full sm:w-auto">
            Get Free Counselling
            <AnimatedArrow />
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
      </motion.div>

      {/* ---------------- Counter-line, bottom right ----------------
          The reference sets its headline against a second line in the
          opposite corner, so the eye crosses the whole frame. */}
      <motion.div
        style={reduced ? undefined : { opacity: fade }}
        // Below md the fixed Call/Apply bar overlays the viewport
        // bottom, and the last chip in this row was disappearing
        // behind it. Clear the bar plus the home indicator.
        className="shell-wide pointer-events-none relative w-full pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-14"
      >
        <motion.div
          {...rise(0.96, 16)}
          className="pointer-events-auto flex flex-wrap items-center gap-x-7 gap-y-3.5 lg:justify-end"
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
