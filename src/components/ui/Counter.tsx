"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Odometer that rolls up when it scrolls into view.
 *  requestAnimationFrame is the web's display-synced clock. */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimal = false,
  duration = 1600,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimal?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    const start = performance.now();
    // Reduced motion: the first frame lands on the final value, so
    // there is no roll — but no synchronous setState either.
    const runFor = reduced ? 0 : duration;

    const tick = (now: number) => {
      const t = runFor === 0 ? 1 : Math.min(1, (now - start) / runFor);
      // Ease-out cubic — fast start, gentle settle. Keeps the
      // per-frame delta below the perception threshold near the end.
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  const shown = decimal
    ? display.toFixed(1)
    : Math.round(display).toLocaleString("en-IN");

  return (
    <span ref={ref} className={cn("t-num tabular-nums", className)}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
