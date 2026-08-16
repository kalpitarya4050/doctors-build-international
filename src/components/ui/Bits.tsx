import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   Small shared pieces.

   Each of these existed three or four times across the codebase
   as a hand-rolled span. Pulling them here means the checkmark
   list on /apply and the one in Promise.tsx are finally the same
   checkmark list.
   ============================================================ */

/** Arrow that nudges right when its group is hovered. Put `group`
 *  on the button or link that owns it — the nudge is driven from
 *  the ancestor, so an arrow inside a card moves when the card is
 *  hovered, not only when the arrow itself is. */
export function AnimatedArrow({ className }: { className?: string }) {
  return <ArrowRight aria-hidden className={cn("arrow-nudge size-4 shrink-0", className)} />;
}

/** Twinkling accent. Purely decorative — always aria-hidden. */
export function Sparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <Sparkles
      aria-hidden
      className={cn("sparkle size-4 text-[var(--accent)]", className)}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

type CheckTone = "gold" | "green";

/** Checkmark bullets — the client's own device, straight off the
 *  "WHY GEORGIA?" panels in their poster.
 *
 *  Rendered as a real <ul>: the marker is a decorative icon, so the
 *  list semantics have to come from the element, not the glyph. */
export function CheckList({
  items,
  className,
  itemClassName,
  tone = "gold",
  columns = 1,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  tone?: CheckTone;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-3",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className={cn("flex items-start gap-2.5", itemClassName)}>
          <span
            aria-hidden
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
              tone === "gold"
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "bg-[color-mix(in_srgb,var(--green-600)_16%,transparent)] text-[var(--green-600)]",
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span className="t-small text-ink-secondary">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered orb — the 1..5 markers from the client's university
 *  comparison sheets. */
export function NumberOrb({
  n,
  className,
  tone = "brand",
}: {
  n: number | string;
  className?: string;
  tone?: "brand" | "gold" | "violet";
}) {
  const bg =
    tone === "gold" ? "var(--grad-gold)" : tone === "violet" ? "var(--grad-violet)" : "var(--grad-brand)";

  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold text-white shadow-[var(--shadow-md)]",
        className,
      )}
      style={{ background: bg }}
    >
      {n}
    </span>
  );
}
