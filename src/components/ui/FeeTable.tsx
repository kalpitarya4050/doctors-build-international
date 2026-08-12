"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpDown, Info, Star } from "lucide-react";
import { UNIVERSITIES, type University } from "@/lib/data/universities";
import { SPRING_UI } from "@/lib/motion";
import { formatTotal, formatTuition } from "./UniversityCard";
import { Chip } from "./Surface";
import { Flag } from "./Flag";
import { cn, inr, inrShort } from "@/lib/utils";

type SortKey = "rank" | "cost" | "fmge" | "students" | "safety";
type Money = "native" | "inr";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "rank", label: "Portfolio order" },
  { key: "cost", label: "Lowest total cost" },
  { key: "fmge", label: "Highest FMGE rate" },
  { key: "students", label: "Most Indian students" },
  { key: "safety", label: "Safety rating" },
];

function pct(v: string): number {
  return parseInt(v.replace(/\D/g, ""), 10) || 0;
}

function studentCount(v: string): number {
  return parseInt(v.replace(/\D/g, ""), 10) || 0;
}

export function FeeTable({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [sort, setSort] = useState<SortKey>("rank");
  const [money, setMoney] = useState<Money>("native");
  const [country, setCountry] = useState<string>("all");
  const reduced = useReducedMotion();

  const countries = useMemo(
    () => Array.from(new Set(UNIVERSITIES.map((u) => u.country))),
    [],
  );

  const rows = useMemo(() => {
    let list = [...UNIVERSITIES];
    if (country !== "all") list = list.filter((u) => u.country === country);

    switch (sort) {
      case "cost":
        // Nepal has no published figure — it sorts last rather than
        // pretending to be free.
        list.sort(
          (a, b) => (a.totalExpenseInr ?? Infinity) - (b.totalExpenseInr ?? Infinity),
        );
        break;
      case "fmge":
        list.sort((a, b) => pct(b.fmgePassRate) - pct(a.fmgePassRate));
        break;
      case "students":
        list.sort((a, b) => studentCount(b.indianStudents) - studentCount(a.indianStudents));
        break;
      case "safety":
        list.sort((a, b) => b.safetyRating - a.safetyRating);
        break;
      default:
        list.sort((a, b) => a.rank - b.rank);
    }
    return list;
  }, [sort, country]);

  const cost = (u: University) =>
    money === "inr"
      ? u.totalExpenseInr
        ? `₹${inr(u.totalExpenseInr)}`
        : "As per University"
      : formatTotal(u);

  const tuition = (u: University) =>
    money === "inr"
      ? u.tuitionInr
        ? `₹${inr(u.tuitionInr)}`
        : "As per University"
      : formatTuition(u);

  return (
    <div className={className}>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-secondary">
          <ArrowUpDown className="size-4 text-ink-muted" />
          <span className="sr-only sm:not-sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="tap-min rounded-[var(--radius-sm)] border border-line-strong bg-[var(--bg-elevated)] px-3 py-2 text-[0.8125rem] font-medium text-ink outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-secondary">
          <span className="sr-only sm:not-sr-only">Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="tap-min rounded-[var(--radius-sm)] border border-line-strong bg-[var(--bg-elevated)] px-3 py-2 text-[0.8125rem] font-medium text-ink outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Currency toggle */}
        <div
          role="group"
          aria-label="Currency"
          className="relative flex rounded-full border border-line-strong bg-[var(--bg-elevated)] p-1"
        >
          {(["native", "inr"] as Money[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoney(m)}
              aria-pressed={money === m}
              className={cn(
                "tap-min relative z-10 inline-flex items-center rounded-full px-4 py-1.5 text-[0.75rem] font-bold transition-colors duration-200",
                money === m ? "text-[var(--navy-950)]" : "text-ink-muted hover:text-ink",
              )}
            >
              {money === m && (
                <motion.span
                  layoutId="currency-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--accent-bright)]"
                  transition={reduced ? { duration: 0 } : SPRING_UI}
                />
              )}
              {m === "native" ? "USD / RUB" : "₹ INR"}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table — scrolls inside its own container */}
      <div className="scroll-x hidden rounded-[var(--radius-lg)] border border-line md:block">
        <table className="w-full min-w-[62rem] border-collapse text-left">
          <caption className="sr-only">
            Comparison of MBBS universities: country, city, duration, intake, recognition, FMGE pass
            rate, Indian students, safety rating, tuition and total expense.
          </caption>
          <thead>
            <tr className="bg-[var(--navy-900)] text-white">
              <Th className="sticky left-0 z-10 bg-[var(--navy-900)]">University</Th>
              <Th>Country / City</Th>
              <Th>Duration</Th>
              <Th>Intake</Th>
              <Th>Recognition</Th>
              <Th align="right">FMGE</Th>
              <Th align="right">Indians</Th>
              <Th align="right">Safety</Th>
              <Th align="right">Tuition</Th>
              <Th align="right">Total (6 yrs)</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u, i) => (
              <tr
                key={u.slug}
                className={cn(
                  "border-t border-hairline transition-colors duration-200 hover:bg-[var(--accent-soft)]",
                  i % 2 === 1 && "bg-[var(--bg-sunken)]/55",
                )}
              >
                <Td className="sticky left-0 z-10 bg-[inherit]">
                  <Link
                    href={`/universities/${u.slug}`}
                    className="tap-min group flex items-center gap-2.5"
                  >
                    <span
                      className="grid size-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold text-white"
                      style={{ background: u.accent }}
                    >
                      {u.rank}
                    </span>
                    <span className="font-semibold text-ink group-hover:text-[var(--accent)]">
                      {u.shortName}
                    </span>
                  </Link>
                </Td>
                <Td>
                  <span className="flex items-center gap-1.5">
                    <Flag country={u.countrySlug} className="h-3 w-[1.125rem]" />
                    {u.country}
                    <span className="text-ink-muted">· {u.city}</span>
                  </span>
                </Td>
                <Td>{u.duration}</Td>
                <Td>{u.intake}</Td>
                <Td>
                  <span className="flex flex-wrap gap-1">
                    {u.recognition.map((r) => (
                      <Chip key={r} tone="green" className="!px-2 !py-0.5 !text-[0.625rem]">
                        {r}
                      </Chip>
                    ))}
                  </span>
                </Td>
                <Td align="right" className="font-bold text-[var(--green-600)]">
                  {u.fmgePassRate}
                </Td>
                <Td align="right">{u.indianStudents}</Td>
                <Td align="right">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-[var(--gold-500)] text-[var(--gold-500)]" />
                    {u.safetyRating}
                  </span>
                </Td>
                <Td align="right" className="t-num">
                  {tuition(u)}
                </Td>
                <Td align="right" className="t-num font-bold text-brand">
                  {cost(u)}
                  {money === "native" && u.totalExpenseInr && (
                    <span className="block text-[0.6875rem] font-medium text-ink-muted">
                      ≈ {inrShort(u.totalExpenseInr)}
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — cards, because a 10-column table is unusable at 360px */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((u) => (
          <li key={u.slug}>
            <Link
              href={`/universities/${u.slug}`}
              className="material-card block rounded-[var(--radius-lg)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold text-white"
                    style={{ background: u.accent }}
                  >
                    {u.rank}
                  </span>
                  <div>
                    <p className="text-[0.9375rem] font-bold leading-tight text-brand">
                      {u.shortName}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                      <Flag country={u.countrySlug} className="mr-1.5 h-3 w-[1.125rem]" />{u.city}, {u.country}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--green-600)]/12 px-2.5 py-1 text-[0.75rem] font-bold text-[var(--green-600)]">
                  {u.fmgePassRate}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4 text-[0.8125rem]">
                <Cell label="Duration" value={u.duration} />
                <Cell label="Intake" value={u.intake} />
                <Cell label="Tuition" value={tuition(u)} />
                <Cell label="Total (6 yrs)" value={cost(u)} strong />
                <Cell label="Indian students" value={u.indianStudents} />
                <Cell label="Safety" value={`${u.safetyRating} / 5`} />
              </dl>
            </Link>
          </li>
        ))}
      </ul>

      {!compact && (
        <p className="mt-5 flex items-start gap-2 text-[0.75rem] leading-relaxed text-ink-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Fees are as per official university brochures for 2026-27. INR conversions are approximate
          and vary with the prevailing exchange rate. Total expense includes tuition plus the
          university&rsquo;s quoted associated costs; airfare, personal spending, insurance and the
          annual residence permit are additional. Confirm the latest figures with the university or
          its official representative before applying.
        </p>
      )}
    </div>
  );
}

function Th({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3.5 text-[0.6875rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-4 py-4 text-[0.8125rem] text-ink-secondary align-middle",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </td>
  );
}

function Cell({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-[0.625rem] font-semibold tracking-[0.05em] text-ink-muted uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          "t-num mt-0.5 leading-tight",
          strong ? "font-bold text-brand" : "text-ink-secondary",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
