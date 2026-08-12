"use client";

import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data/content";
import { DragCarousel } from "@/components/ui/DragCarousel";
import { Media } from "@/components/ui/Media";

export function Testimonials() {
  return (
    <section
      className="section relative overflow-hidden bg-[var(--navy-950)] text-white grain"
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
        style={{ background: "radial-gradient(circle, #C9A227, transparent 70%)" }}
      />

      <div className="shell relative">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="t-eyebrow inline-flex items-center gap-3 text-[var(--gold-300)]">
            <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--gold-500))]" />
            Success Stories
          </span>
          <h2
            id="testimonials-title"
            className="t-h2 max-w-[20ch] font-[family-name:var(--font-playfair)]"
          >
            Five thousand families. <span className="gold-text">One decision.</span>
          </h2>
          <p className="t-lead mx-auto max-w-[58ch] !text-white/65">
            Students currently studying at our partner universities, in their own words.
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
              className="relative flex h-full flex-col rounded-[var(--radius-lg)] border border-white/12 bg-white/[0.045] p-7 backdrop-blur-xl"
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

              <blockquote className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-white/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-white/12 pt-5">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--gold-600),var(--gold-300))] font-[family-name:var(--font-playfair)] text-[1.0625rem] font-bold text-[var(--navy-950)]"
                >
                  {t.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-bold">{t.name}</span>
                  <span className="block truncate text-[0.75rem] text-white/55">
                    {t.course} · {t.university}
                  </span>
                  <span className="block text-[0.6875rem] text-[var(--gold-300)]">{t.year}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </DragCarousel>
      </div>
    </section>
  );
}
