import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, WipeLine } from "@/components/ui/Reveal";
import { KenBurns } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Eyebrow } from "@/components/ui/Surface";
import { Flag } from "@/components/ui/Flag";
import { DotGrid, OrbField, SpectrumRule } from "@/components/ui/Decor";
import { HeroStage } from "@/components/layout/HeroStage";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Wraps the highlighted words in the gold serif accent. RevealWords
 *  used to do this internally; the headline now travels as one
 *  mask-wiped line — matching the homepage hero — so the highlight has
 *  to be resolved here instead. Punctuation is stripped for the match
 *  but kept in the output. */
function withHighlight(title: string, highlight?: string[]): ReactNode {
  if (!highlight?.length) return title;
  const hi = new Set(highlight.map((w) => w.toLowerCase().replace(/[.,:;]/g, "")));

  return title.split(" ").map((word, i) => {
    const clean = word.toLowerCase().replace(/[.,:;]/g, "");
    const space = i > 0 ? " " : "";
    return hi.has(clean) ? (
      <span key={i}>
        {space}
        <em className="t-accent">{word}</em>
      </span>
    ) : (
      <span key={i}>
        {space}
        {word}
      </span>
    );
  });
}

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  lead,
  crumbs = [],
  children,
  accent,
  align = "left",
  flagCountry,
  image,
  imageCaption,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  lead?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  accent?: string;
  align?: "left" | "center";
  /** Country slug or name — renders an SVG flag. Emoji flags are not
   *  used anywhere: Windows ships no flag glyphs and falls back to the
   *  bare regional-indicator letters, so "GEOMEDI University" prefixed
   *  with the Georgia emoji displays as "GE GEOMEDI University". */
  flagCountry?: string;
  /** Image slot id. When set, the hero becomes a dark photographic
   *  banner instead of the light gradient. */
  image?: string;
  imageCaption?: string;
}) {
  const photo = image ? img(image) : undefined;
  const onPhoto = Boolean(photo);

  return (
    <section className={cn("relative isolate overflow-hidden", !onPhoto && "grain")}>
      {onPhoto ? (
        <>
          {/* The wash is now a two-axis blend rather than a single
              105° ramp: horizontal for headline legibility, vertical
              so the photograph reads as lit from above.

              The old build also ended on a flat `linear-gradient(0deg,
              var(--bg), transparent)` strip, which is what made the
              bottom look like the image running out of ink. It is gone
              — the section now ends on the spectrum rule instead, a
              deliberate edge rather than a dissolve. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(102deg, rgba(5,15,34,0.95) 0%, rgba(5,15,34,0.80) 40%, rgba(5,15,34,0.34) 76%, rgba(5,15,34,0.22) 100%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,15,34,0.55) 0%, transparent 32%, transparent 62%, rgba(5,15,34,0.62) 100%)",
            }}
          />
          <Scrim strength="light" className="-z-10" />
        </>
      ) : (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg-sunken),var(--bg))]" />
            <div
              className="absolute -top-28 left-1/2 size-[40rem] -translate-x-1/2 rounded-full opacity-55 blur-[125px]"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, ${
                  accent ?? "var(--gold-500)"
                } 22%, transparent), transparent 68%)`,
              }}
            />
          </div>
          {/* The banner used to be a single static bloom on a flat
              gradient, which read as an empty shelf above the content.
              A dot grid gives it a surface and the orbs give it drift. */}
          <DotGrid gap={26} opacity={0.75} />
          <OrbField tone="gold" count={2} intensity={0.28} />
        </>
      )}

      <HeroStage
        photo={
          onPhoto ? (
            <KenBurns
              id={image!}
              className="absolute inset-0"
              sizes="100vw"
              priority
              /* Was 30s / 1.12. Too slow and too shallow to register
                 as movement — it read as a still. */
              duration={18}
              scale={1.18}
            />
          ) : undefined
        }
      >
      <div
        className={cn(
          "shell relative pb-14 pt-10 lg:pt-14",
          onPhoto ? "pb-20 lg:pb-28" : "lg:pb-20",
          align === "center" && "text-center",
        )}
      >
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol
              className={cn(
                "flex flex-wrap items-center gap-1.5 text-[0.8125rem]",
                onPhoto ? "text-on-dark-secondary" : "text-ink-muted",
                align === "center" && "justify-center",
              )}
            >
              <li>
                <Link href="/" className="transition-colors hover:text-[var(--accent)]">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3.5 opacity-50" />
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-[var(--accent)]">
                      {c.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={cn("font-medium", onPhoto ? "text-on-dark-secondary" : "text-ink-secondary")}
                    >
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <Reveal>
            <Eyebrow
              className={cn(
                align === "center" && "justify-center",
                // Vibrancy: over a photograph, lift the label off the
                // muted gold onto the brighter tone so it stays legible.
                onPhoto && "!text-[var(--gold-300)]",
              )}
            >
              {eyebrow}
            </Eyebrow>
          </Reveal>
        )}

        {/* Mask wipe, not a per-word slide — the same move the homepage
            hero makes, so arriving on an inner page reads as the same
            site rather than a different one. */}
        <h1
          className={cn(
            "t-h1 mt-5",
            onPhoto ? "text-white [text-shadow:0_2px_24px_rgba(5,15,34,0.45)]" : "text-brand",
            align === "center" && "mx-auto max-w-[22ch]",
          )}
        >
          {flagCountry && (
            <Flag country={flagCountry} className="mr-3 h-[0.62em] w-[0.93em] align-baseline" />
          )}
          <WipeLine delay={0.12} duration={0.9}>
            {withHighlight(title, highlight)}
          </WipeLine>
        </h1>

        {lead && (
          <Reveal direction="up" delay={0.16}>
            <div
              className={cn(
                "t-lead mt-6 max-w-[64ch]",
                onPhoto && "!text-on-dark-secondary",
                align === "center" && "mx-auto",
              )}
            >
              {lead}
            </div>
          </Reveal>
        )}

        {children}

        {onPhoto && imageCaption && (
          <p className="liquid-glass mt-10 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-medium !text-on-dark-secondary">
            <Camera className="size-3.5" />
            {imageCaption}
          </p>
        )}
      </div>
      </HeroStage>

      {/* Closes the banner with the same spectrum band every printed
          piece the client puts out ends on. Also gives the eye a hard
          edge between the hero and whatever section follows. */}
      <SpectrumRule className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
