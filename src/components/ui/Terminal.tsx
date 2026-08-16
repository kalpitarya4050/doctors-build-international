"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================
   TERMINAL WINDOW.

   A console frame that types its contents out when it scrolls
   into view. Used once, by the admission console, to show the
   pipeline as a sequence of resolved steps.

   It is a stylised diagram, not a product surface — there is no
   input, nothing is executed, and the copy is the same PROCESS
   data the rest of the site renders as cards.
   ============================================================ */

export type ConsoleLine = {
  /** `$` prompt line, `ok` resolved step, `note` dim commentary. */
  kind: "cmd" | "ok" | "note";
  text: string;
  /** Shown right-aligned on `ok` lines — the step's duration. */
  meta?: string;
};

const CHAR_MS = 14;
const LINE_GAP_MS = 260;

export function Terminal({
  title = "admissions — doctorsbuild",
  lines,
  className,
}: {
  title?: string;
  lines: readonly ConsoleLine[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  // How many lines have started, and how far into the current one.
  const [typedLines, setTypedLines] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  /* Reduced motion gets the finished state, derived rather than
     written: setting it from inside the effect would be a cascading
     render for a value that is a pure function of `reduced`. */
  const shown = reduced ? lines.length : typedLines;
  const chars = reduced ? Infinity : typedChars;
  const done = shown >= lines.length;

  useEffect(() => {
    if (!inView || reduced) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const typeLine = (index: number) => {
      if (cancelled || index >= lines.length) return;
      setTypedLines(index + 1);
      setTypedChars(0);

      const total = lines[index].text.length;
      let c = 0;

      const tick = () => {
        if (cancelled) return;
        c += 1;
        setTypedChars(c);
        if (c < total) {
          timers.push(setTimeout(tick, CHAR_MS));
        } else {
          timers.push(setTimeout(() => typeLine(index + 1), LINE_GAP_MS));
        }
      };

      timers.push(setTimeout(tick, CHAR_MS));
    };

    typeLine(0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduced, lines]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-[var(--on-dark-line)] bg-[var(--navy-950)] shadow-[var(--shadow-xl)]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[var(--on-dark-line)] bg-[color-mix(in_srgb,var(--navy-900)_70%,black)] px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate font-mono text-[0.75rem] text-[var(--on-dark-muted)]">
          {title}
        </span>
      </div>

      {/* Body. The full text is present for screen readers from the
          first render; the typing only masks it visually. */}
      <div className="scroll-x px-4 py-5 font-mono text-[0.8125rem] leading-[1.85] sm:px-6 sm:py-6 sm:text-[0.875rem]">
        <div className="sr-only">
          {lines.map((l) => `${l.text}${l.meta ? ` (${l.meta})` : ""}`).join(". ")}
        </div>

        <div aria-hidden className="min-w-[22rem]">
          {lines.map((line, i) => {
            if (i >= shown) return null;
            const isLast = i === shown - 1;
            const text = isLast && chars !== Infinity ? line.text.slice(0, chars) : line.text;
            const complete = !isLast || chars === Infinity || chars >= line.text.length;

            return (
              <div key={i} className="flex items-baseline gap-2">
                <span className="shrink-0 select-none text-[var(--gold-400)]">
                  {line.kind === "cmd" ? "$" : line.kind === "ok" ? "✓" : " "}
                </span>
                <span
                  className={cn(
                    "flex-1",
                    line.kind === "cmd" && "text-[var(--on-dark)]",
                    line.kind === "ok" && "text-[var(--on-dark-secondary)]",
                    line.kind === "note" && "text-[var(--on-dark-faint)] italic",
                  )}
                >
                  {text}
                  {isLast && !done && <Caret />}
                </span>
                {line.meta && complete && (
                  <span className="shrink-0 text-[0.6875rem] text-[var(--on-dark-faint)]">
                    {line.meta}
                  </span>
                )}
              </div>
            );
          })}

          {done && (
            <div className="flex items-baseline gap-2">
              <span className="select-none text-[var(--gold-400)]">$</span>
              <Caret />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="animate-caret ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.12em] bg-[var(--gold-400)]"
    />
  );
}
