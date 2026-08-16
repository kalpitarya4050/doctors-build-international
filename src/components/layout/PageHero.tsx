import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { KenBurns } from "@/components/ui/MediaMotion";
import { Scrim } from "@/components/ui/Media";
import { Eyebrow } from "@/components/ui/Surface";
import { Flag } from "@/components/ui/Flag";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

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
          <KenBurns
            id={image!}
            className="absolute inset-0 -z-10"
            sizes="100vw"
            priority
            duration={30}
            scale={1.12}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(105deg, rgba(5,15,34,0.94) 0%, rgba(5,15,34,0.82) 42%, rgba(5,15,34,0.44) 78%, rgba(5,15,34,0.3) 100%)",
            }}
          />
          <Scrim strength="light" className="-z-10" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28"
            style={{ background: "linear-gradient(0deg, var(--bg), transparent)" }}
          />
        </>
      ) : (
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
      )}

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
          <RevealWords text={title} highlight={highlight} />
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
          <p className="mt-10 inline-flex items-center gap-2 material-chip-dark rounded-full px-3.5 py-1.5 text-[0.6875rem] font-medium !text-on-dark-secondary">
            <Camera className="size-3.5" />
            {imageCaption}
          </p>
        )}
      </div>
    </section>
  );
}
