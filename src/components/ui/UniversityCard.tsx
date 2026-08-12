import Link from "next/link";
import { ArrowUpRight, MapPin, Clock, TrendingUp, Users } from "lucide-react";
import type { University } from "@/lib/data/universities";
import { uniImage, uniCaption } from "@/lib/data/media-map";
import { Media, Scrim } from "./Media";
import { Flag } from "./Flag";
import { Chip } from "./Surface";
import { cn, inrShort, num } from "@/lib/utils";

/** Formats a currency total for display, tolerating the Nepal
 *  record where fees vary by institution. */
export function formatTotal(u: University): string {
  if (u.totalExpense === null) return "As per University";
  if (u.currency === "USD") return `USD ${num(u.totalExpense)}`;
  if (u.currency === "RUB") return `RUB ${new Intl.NumberFormat("en-IN").format(u.totalExpense)}`;
  return "As per University";
}

export function formatTuition(u: University): string {
  if (u.tuitionTotal === null) return "As per University";
  if (u.currency === "USD") return `USD ${num(u.tuitionTotal)}`;
  if (u.currency === "RUB") return `RUB ${new Intl.NumberFormat("en-IN").format(u.tuitionTotal)}`;
  return "As per University";
}

export function UniversityCard({
  university: u,
  className,
  showRank = false,
}: {
  university: University;
  className?: string;
  showRank?: boolean;
}) {
  return (
    <Link
      href={`/universities/${u.slug}`}
      className={cn(
        "group material-card relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)]",
        "transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      {/* Photograph of the host city, captioned as the city */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Media
          id={uniImage(u.slug)}
          className="absolute inset-0"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Scrim strength="medium" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            {showRank && (
              <span
                className="grid size-7 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                style={{ background: u.accent }}
              >
                {u.rank}
              </span>
            )}
            <span className="rounded-full bg-white/14 px-2.5 py-1 text-[0.6875rem] font-bold text-white backdrop-blur-md">
              <Flag country={u.countrySlug} className="mr-1.5 h-3 w-[1.125rem]" />
              {u.country}
            </span>
          </div>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/14 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-[var(--accent-bright)] group-hover:text-[var(--navy-950)]">
            <ArrowUpRight className="size-4" strokeWidth={2.2} />
          </span>
        </div>

        <p className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-4 text-[0.75rem] font-medium text-white/85">
          <MapPin className="size-3.5" />
          {uniCaption(u.slug) || `${u.city}, ${u.country}`}
        </p>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className="t-h4 text-brand transition-colors duration-200 group-hover:text-[var(--accent)]">
          {u.name}
        </h3>
        <p className="mb-3 mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-ink-muted">
          <MapPin className="size-3.5" />
          {u.city}, {u.country}
        </p>
        <p className="t-small line-clamp-3 leading-relaxed">{u.blurb}</p>

        {/* Key figures */}
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-hairline pt-5">
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
              Total (6 yrs)
            </dt>
            <dd className="t-num mt-1 text-[0.9375rem] font-bold leading-tight text-brand">
              {formatTotal(u)}
              {u.totalExpenseInr && (
                <span className="ml-1 block text-[0.75rem] font-medium text-ink-muted">
                  ≈ {inrShort(u.totalExpenseInr)}
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-[0.06em] text-ink-muted uppercase">
              FMGE pass rate
            </dt>
            <dd className="t-num mt-1 flex items-center gap-1.5 text-[0.9375rem] font-bold text-[var(--green-600)]">
              <TrendingUp className="size-4" />
              {u.fmgePassRate}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-1.5">
          <Chip tone="default">
            <Clock className="size-3" />
            {u.durationYears} yrs
          </Chip>
          <Chip tone="default">
            <Users className="size-3" />
            {u.indianStudents} Indians
          </Chip>
          {u.recognition.slice(0, 2).map((r) => (
            <Chip key={r} tone="green">
              {r}
            </Chip>
          ))}
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[var(--accent)]">
          View fees & details
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
