import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian digit grouping: 2788500 → "27,88,500" */
export function inr(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

/** Western grouping for USD/RUB: 33000 → "33,000" */
export function num(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

/** 3053000 → "₹30.53 L" ; 12500000 → "₹1.25 Cr" */
export function inrShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${inr(value)}`;
}

/** Pastel wash a card fades to on hover, read by `.hover-pastel`.
 *
 *  Passed as a CSS variable rather than a class so a card can carry
 *  its own tint without a variant per colour. Lives here rather
 *  than beside the surface components because most callers are
 *  server components, and a "use client" module cannot export a
 *  function they are allowed to call. */
export type PastelTint = "gold" | "mint" | "sky" | "lilac" | "blush";

export function tint(t: PastelTint): React.CSSProperties {
  return { "--hover-tint": `var(--pastel-${t})` } as React.CSSProperties;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
