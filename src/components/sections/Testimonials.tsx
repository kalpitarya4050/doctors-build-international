"use client";

import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data/content";
import { DragCarousel } from "@/components/ui/DragCarousel";
import { Media } from "@/components/ui/Media";

/** Avatar orb tinted by destination — the poster's colour-coding,
 *  and it gives the row of avatars some variety. */
const DEST_TINT: Record<string, string> = {
  Georgia: "linear-gradient(135deg,var(--dest-georgia),var(--gold-300))",
  Russia: "linear-gradient(135deg,var(--dest-russia),var(--gold-300))",
  Kazakhstan: "linear-gradient(135deg,var(--dest-kazakhstan),var(--gold-300))",
  China: "linear-gradient(135deg,var(--dest-china),var(--gold-300))",
  Nepal: "linear-gradient(135deg,var(--dest-nepal),var(--gold-300))",
  Kyrgyzstan: "linear-gradient(135deg,var(--dest-kyrgyzstan),var(--gold-300))",
};

export function Testimonials() {
  return (
    <section
      data-ground="navy"
      className="section relative overflow-hidden grain"
      aria-labelledby="testimonials-title"
    >
      {/* Photographic ground, pushed far back so the cards stay dominant */}
      <Media
        id="graduation"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        imgClassName="scale-105"
        sizes="100vw"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--navy-950) 0%, rgba(5,15,34,0.86) 40%, var(--navy-950) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 size-[38rem] rounded-full opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gold-500) 90%, transparent), transparent 70%)",
        }}
      />

      <div className="shell relative">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="t-eyebrow inline-flex items-center gap-3 text-[var(--accent)]">
            <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--gold-500))]" />
            Success Stories
          </span>
          <h2
            id="testimonials-title"
            className="t-h2 max-w-[20ch]"
          >
            Five thousand families. <em>One decision.</em>
          </h2>
          <p className="t-lead mx-auto max-w-[58ch] !text-on-dark-secondary">
            Students currently studying at our partner universities, in their own words.
          </p>
          {/* Names are withheld, which is simply true of what is
              rendered — and the offer below is one the office can
              actually honour, so it carries the weight a named
              quote would. Revisit when TESTIMONIALS holds real,
              consented quotes: see the banner in data/content.ts. */}
          <p className="t-caption mx-auto max-w-[62ch] text-[var(--on-dark-faint)]">
            Names withheld. Ask us and we will put you in touch with a current student at any
            university on this list.
          </p>
        </div>
      </div>

      <div className="relative mt-14 pl-[max(1.125rem,calc((100vw-80rem)/2+2.5rem))]">
        <DragCarousel
          ariaLabel="Student testimonials"
          gap={20}
          itemClassName="w-[20rem] sm:w-[24rem]"
          className="pr-[max(1.125rem,calc((100vw-80rem)/2+2.5rem))] [&_button]:!text-white"
        >
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="liquid-glass hover-neon relative flex h-full flex-col rounded-[var(--radius-lg)] p-7"
            >
              <Quote
                aria-hidden
                className="absolute right-6 top-6 size-9 text-[var(--gold-500)]/22"
                fill="currentColor"
              />

              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-[var(--gold-400)] text-[var(--gold-400)]" />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-on-dark-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-on-dark-line pt-5">
                {/* Last character, not first: while the names are
                    placeholders they all begin with "Student", and
                    a row of identical S avatars looks broken. Real
                    names will still give a sensible initial. */}
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full text-[1.0625rem] font-bold text-[var(--navy-950)]"
                  style={{ background: DEST_TINT[t.country] ?? "var(--grad-gold)" }}
                >
                  {t.name.startsWith("Student ") ? t.name.slice(-1) : t.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-bold">{t.name}</span>
                  <span className="block truncate text-[0.75rem] text-on-dark-muted">
                    {t.course} · {t.university}
                  </span>
                  <span className="block text-[0.6875rem] text-[var(--accent)]">{t.year}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </DragCarousel>
      </div>
    </section>
  );
}
