import Link from "next/link";
import { UNIVERSITIES } from "@/lib/data/universities";
import { COUNTRIES } from "@/lib/data/countries";
import { STATS } from "@/lib/data/content";
import { SITE, whatsappLink } from "@/lib/site";
import { SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media, Scrim } from "@/components/ui/Media";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { AnimatedArrow, Sparkle } from "@/components/ui/Bits";
import { DotGrid } from "@/components/ui/Decor";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { cn, tint } from "@/lib/utils";

/* ============================================================
   BENTO.

   A four-column grid of unequal tiles. Two photographs carry the
   weight, the rest are single facts — every one of them pulled
   from data already on the site rather than written for the grid.

   The span map is declared once, the way WhyUs.tsx and
   UniversityMedia.tsx already do it, so the layout is legible in
   one place instead of scattered through class strings.
   ============================================================ */

const PRICED = UNIVERSITIES.filter((u) => u.hasPublishedFees && u.totalExpenseInr !== null);
const CHEAPEST = Math.min(...PRICED.map((u) => u.totalExpenseInr ?? Infinity));

const YEARS = STATS[0];
const FAMILIES = STATS[1];

export function BentoShowcase() {
  return (
    <section className="section relative isolate" data-ground="linen" aria-labelledby="bento-title">
      <DotGrid gap={28} opacity={0.6} />

      <div className="shell-wide">
        <SectionHeading
          eyebrow="🌍 The Whole Picture"
          title={
            <>
              Ten years of this, <em>in one frame</em>.
            </>
          }
          lead="Six countries, nineteen universities, and a team that still calls your mother two years after you land."
          align="left"
        />

        <RevealGroup
          className="mt-12 grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {/* ---- Big photo: campuses ---- */}
          <RevealItem className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <Link
              href="/universities"
              className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]"
            >
              <Media
                id="students-campus"
                className="absolute inset-0"
                imgClassName="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <Scrim strength="heavy" />
              <div className="relative p-7 sm:p-9">
                <p className="t-eyebrow text-[var(--gold-300)]">Partner Campuses</p>
                <p className="t-h2 mt-2 max-w-[14ch] text-on-dark">
                  {UNIVERSITIES.length} universities. <em>{COUNTRIES.length} countries.</em>
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--gold-300)]">
                  Browse every one
                  <AnimatedArrow />
                </span>
              </div>
            </Link>
          </RevealItem>

          {/* ---- Stat: years ---- */}
          <StatTile
            icon="Award"
            value={YEARS.value}
            suffix={YEARS.suffix}
            label={YEARS.label}
            sub={YEARS.sub}
            tintName="gold"
          />

          {/* ---- Stat: families ---- */}
          <StatTile
            icon="Users"
            value={FAMILIES.value}
            suffix={FAMILIES.suffix}
            label={FAMILIES.label}
            sub={FAMILIES.sub}
            tintName="sky"
          />

          {/* ---- Cheapest published total ---- */}
          <RevealItem className="lg:col-span-2">
            <Link
              href="/fee-comparison"
              className="hover-pastel group flex h-full flex-col justify-between rounded-[var(--radius-xl)] border border-line bg-[var(--bg-elevated)] p-7 shadow-[var(--shadow-md)]"
              style={tint("mint")}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="t-eyebrow text-[var(--accent)]">Lowest published total</p>
                <Sparkle delay={0.4} />
              </div>
              <div>
                <p className="t-num t-figure grad-text text-[3rem] font-bold leading-none sm:text-[3.75rem]">
                  ₹{(CHEAPEST / 100000).toFixed(2)}L
                </p>
                <p className="t-small mt-2">
                  All six years, living costs included — {PRICED.length} of {UNIVERSITIES.length}{" "}
                  universities publish a full figure.
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--accent)]">
                  Compare all fees
                  <AnimatedArrow />
                </span>
              </div>
            </Link>
          </RevealItem>

          {/* ---- Photo: life abroad ---- */}
          <RevealItem className="sm:col-span-2">
            <Link
              href="/destinations"
              className="group relative flex h-full min-h-[13rem] flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]"
            >
              <Media
                id="students-friends"
                className="absolute inset-0"
                imgClassName="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <Scrim strength="medium" />
              <div className="relative p-7">
                <p className="t-h4 text-on-dark">
                  You will not be the <em className="t-accent">only Indian</em> there.
                </p>
                <p className="t-small mt-1.5 !text-on-dark-secondary">
                  800 – 2,500 Indian students already on every campus we place into.
                </p>
              </div>
            </Link>
          </RevealItem>

          {/* ---- WhatsApp tile ---- */}
          <RevealItem className="sm:col-span-2">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-neon-green group flex h-full flex-col justify-between rounded-[var(--radius-xl)] bg-[var(--navy-950)] p-7 shadow-[var(--shadow-lg)]"
              data-ground="navy"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[var(--green-500)] text-[#062611] transition-transform duration-300 group-hover:scale-110">
                <WhatsAppIcon className="size-6" />
              </span>
              <div>
                <p className="t-h4 mt-6 text-on-dark">Ask us anything, right now.</p>
                <p className="t-small mt-1.5 !text-on-dark-secondary">
                  {SITE.phoneDisplay} · replies within two hours, every day.
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--green-500)]">
                  Open WhatsApp
                  <AnimatedArrow />
                </span>
              </div>
            </a>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

function StatTile({
  icon,
  value,
  suffix,
  label,
  sub,
  tintName,
  className,
}: {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  sub: string;
  tintName: Parameters<typeof tint>[0];
  className?: string;
}) {
  return (
    <RevealItem className={className}>
      <div
        className="hover-pastel flex h-full flex-col justify-between rounded-[var(--radius-xl)] border border-line bg-[var(--bg-elevated)] p-7 shadow-[var(--shadow-md)]"
        style={tint(tintName)}
      >
        <span className="grid size-11 place-items-center rounded-[var(--radius)] bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon name={icon} className="size-5" />
        </span>
        <div className="mt-6">
          <p className={cn("t-num t-figure text-[2.75rem] font-bold leading-none text-brand")}>
            <Counter value={value} suffix={suffix} />
          </p>
          <p className="t-h4 mt-2 text-brand">{label}</p>
          <p className="t-caption mt-1 text-ink-muted">{sub}</p>
        </div>
      </div>
    </RevealItem>
  );
}
