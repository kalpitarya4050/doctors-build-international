"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Phone, ShieldCheck, Star } from "lucide-react";
import { SPRING_UI } from "@/lib/motion";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { Globe } from "@/components/ui/Globe";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { RevealWords } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { KenBurns } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";

const FLOAT_STATS = [
  { value: 5000, suffix: "+", label: "Students & parents", pos: "left-[-2%] top-[42%]", delay: 0.62 },
];

/** Photo cards ringed around the globe. Each carries its own float
 *  offset and a slight rotation, so the cluster reads as a scattered
 *  set of prints rather than a grid. */
const FLOAT_PHOTOS = [
  {
    id: "clinical-training",
    caption: "Clinical training",
    pos: "right-[-2%] top-[2%] w-[9.5rem] sm:w-[12rem]",
    ratio: "aspect-[3/4]",
    rotate: 3,
    delay: 0.5,
    float: "0s",
  },
  {
    id: "graduation",
    caption: "Graduation",
    pos: "right-[2%] bottom-[2%] w-[10.5rem] sm:w-[13rem]",
    ratio: "aspect-[4/3]",
    rotate: -3,
    delay: 0.62,
    float: "1.6s",
  },
  {
    id: "campus-geomedi",
    caption: "GEOMEDI, Tbilisi",
    pos: "left-[-3%] top-[4%] w-[9rem] sm:w-[11.5rem]",
    ratio: "aspect-[4/3]",
    rotate: -4,
    delay: 0.74,
    float: "2.9s",
  },
  {
    id: "students-friends",
    caption: "Indian community",
    pos: "left-[3%] bottom-[4%] w-[8.5rem] sm:w-[10.5rem]",
    ratio: "aspect-square",
    rotate: 4,
    delay: 0.86,
    float: "4.1s",
  },
];

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Gentle parallax — the globe drifts slower than the copy,
  // and both fade as the section leaves.
  const globeY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "44%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden grain"
      aria-labelledby="hero-title"
    >
      {/* Ground + ambient blooms */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_58%,var(--bg)_100%)]" />
        <div
          className="absolute -top-24 left-1/2 size-[46rem] -translate-x-1/2 rounded-full opacity-60 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--gold-500) 20%, transparent), transparent 68%)",
          }}
        />
        <div
          className="absolute bottom-0 right-[8%] size-[32rem] rounded-full opacity-45 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--navy-600) 30%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="shell-wide relative grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[1.06fr_1fr] lg:gap-8 lg:pb-24 lg:pt-20">
        {/* ---------------- Copy ---------------- */}
        <motion.div style={reduced ? undefined : { y: copyY, opacity: fade }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_UI, delay: 0.05 }}
            className="material-chip inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
          >
            <span className="rounded-full bg-[var(--navy-900)] px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.08em] text-[var(--gold-300)] uppercase">
              {SITE.admissionYear}
            </span>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">
              Admissions open · NMC-approved universities
            </span>
          </motion.div>

          <h1 id="hero-title" className="t-display mt-6 text-brand">
            <RevealWords text="From Dreams" delay={0.12} />
            <br />
            <RevealWords text="To White Coat." delay={0.24} highlight={["White", "Coat"]} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_UI, delay: 0.42 }}
            className="t-lead mt-6 max-w-[54ch]"
          >
            We help aspiring doctors secure admission at top global medical universities with ease,
            transparency and complete support — from your first counselling call to the day you
            graduate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_UI, delay: 0.5 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/apply" variant="gold" size="lg">
              Get Free Counselling
              <ArrowRight className="size-4" />
            </Button>
            <Button href={whatsappLink()} external variant="whatsapp" size="lg">
              <WhatsAppIcon className="size-[18px]" />
              WhatsApp Us
            </Button>
            <a
              href={telLink()}
              className="flex items-center gap-2 px-1 text-[0.9375rem] font-semibold text-ink-secondary transition-colors hover:text-[var(--accent)] sm:px-3"
            >
              <Phone className="size-4" />
              {SITE.phoneDisplay}
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.66 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3.5"
          >
            <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink-secondary">
              <ShieldCheck className="size-4 text-[var(--green-600)]" />
              NMC · WHO recognized
            </span>
            <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink-secondary">
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-[var(--gold-500)] text-[var(--gold-500)]" />
                ))}
              </span>
              4.5/5 from 5000+ families
            </span>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">
              Zero donation · Zero capitation
            </span>
          </motion.div>
        </motion.div>

        {/* ---------------- Globe ---------------- */}
        <motion.div
          style={reduced ? undefined : { y: globeY, opacity: fade }}
          className="relative mx-auto aspect-square w-full max-w-[36rem] lg:max-w-none"
        >
          {/* Globe sits inset so the photo ring has room to breathe */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0, duration: 1.1, delay: 0.18 }}
            className="absolute inset-[9%]"
          >
            <Globe />
          </motion.div>

          {/* Floating glass stat chips, anchored around the globe */}
          {FLOAT_STATS.map((s) => (
            <motion.div
              key={s.label}
              className={`material-card absolute ${s.pos} rounded-[var(--radius)] px-4 py-3 ${
                reduced ? "" : "animate-float-slow"
              }`}
              style={{ animationDelay: `${s.delay}s` }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...SPRING_UI, delay: s.delay }}
            >
              <p className="t-num text-[1.375rem] font-bold leading-none text-brand">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-[0.6875rem] font-medium tracking-[0.02em] text-ink-muted">
                {s.label}
              </p>
            </motion.div>
          ))}

          {/* Floating photo cards */}
          {FLOAT_PHOTOS.map((p) => (
            <motion.figure
              key={p.id}
              className={`absolute ${p.pos} ${reduced ? "" : "animate-float-slow"}`}
              style={{ animationDelay: p.float }}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.82, y: 20, rotate: p.rotate * 2.4 }
              }
              animate={{ opacity: 1, scale: 1, y: 0, rotate: p.rotate }}
              transition={{ ...SPRING_UI, delay: p.delay }}
            >
              <div
                className={`relative ${p.ratio} overflow-hidden rounded-[var(--radius-lg)] border-2 border-white/70 shadow-[var(--shadow-xl)] dark:border-white/20`}
              >
                <KenBurns
                  id={p.id}
                  className="absolute inset-0"
                  sizes="(max-width: 640px) 42vw, 13rem"
                  duration={30}
                  scale={1.14}
                />
                <Scrim strength="medium" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-[0.6875rem] font-semibold tracking-[0.01em] text-white">
                  {p.caption}
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ opacity: fade }}
        >
          <div className="flex h-9 w-6 items-start justify-center rounded-full border border-line-strong p-1.5">
            <motion.span
              className="size-1 rounded-full bg-[var(--accent)]"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
