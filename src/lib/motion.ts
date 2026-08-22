import type { Transition, Variants } from "motion/react";

/* ============================================================
   Apple's motion model, translated to Motion/Framer.
   Apple replaced the physics triplet (mass/stiffness/damping)
   with two designer-facing parameters:
     - damping ratio  → controls overshoot (1.0 = none)
     - response       → how fast it reaches target, in seconds
   Motion's `bounce` + `duration` spring API maps onto these
   almost directly: bounce 0 ≈ damping 1.0, bounce 0.2 ≈ 0.8.
   ============================================================ */

/** Default for essentially all UI. Critically damped — graceful,
 *  non-distracting, never overshoots. */
export const SPRING_UI: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

/** Snappier critically-damped variant for small, frequent moves. */
export const SPRING_SNAPPY: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.26,
};

/** Under-damped. Use ONLY when the gesture itself carried
 *  momentum — a flick, a throw, a drag release. Overshoot on a
 *  menu that merely faded in feels wrong. */
export const SPRING_MOMENTUM: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.4,
};

/** Drawers and sheets — Apple ships damping 0.8 / response 0.3. */
export const SPRING_SHEET: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.3,
};

/** Large surfaces travelling a long distance settle slower. */
export const SPRING_SOFT: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.62,
};

/** Non-gesture, non-spatial fades (opacity/colour only). */
export const EASE_OUT: Transition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

/** Mirrored curve for the return leg of a reversible transition
 *  (Apple §7 — the outbound path must match the return path). */
export const EASE_IN: Transition = {
  duration: 0.32,
  ease: [0.64, 0, 0.78, 0],
};

/* ============================================================
   Momentum projection (Apple §6)
   Where will a flick come to rest? Use the projected endpoint to
   choose the snap target — never the release point. This is the
   exponential-decay form from the Designing Fluid Interfaces
   sample code, NOT the textbook v²/(2·decel).
   ============================================================ */
export function project(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Snap target nearest a projected endpoint. */
export function nearestSnapPoint(value: number, points: number[]): number {
  if (points.length === 0) return value;
  return points.reduce((best, p) =>
    Math.abs(p - value) < Math.abs(best - value) ? p : best,
  );
}

/* ============================================================
   Rubber-banding (Apple §9)
   At a boundary, resist progressively instead of stopping hard.
   A hard stop reads as "frozen"; continuous resistance reads as
   "responsive, but there is nothing more here".
   ============================================================ */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (dimension === 0) return 0;
  return (
    (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
  );
}

/** Clamp a drag position to bounds, rubber-banding past the edges. */
export function clampWithRubberband(
  value: number,
  min: number,
  max: number,
  dimension: number,
): number {
  if (value > max) return max + rubberband(value - max, dimension);
  if (value < min) return min + rubberband(value - min, dimension);
  return value;
}

/* ============================================================
   Velocity tracking
   Track a short position/time history rather than a single
   delta — you need a stable velocity at release (Apple §2, §5).
   ============================================================ */
export type Sample = { x: number; y: number; t: number };

export class VelocityTracker {
  private samples: Sample[] = [];
  private readonly window: number;

  constructor(windowMs = 100) {
    this.window = windowMs;
  }

  add(x: number, y: number, t = performance.now()) {
    this.samples.push({ x, y, t });
    const cutoff = t - this.window;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) {
      this.samples.shift();
    }
  }

  /** px per second, decomposed into independent axes (Apple §3 —
   *  a single spring on 2D distance desyncs when X and Y differ). */
  velocity(): { x: number; y: number } {
    if (this.samples.length < 2) return { x: 0, y: 0 };
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return { x: 0, y: 0 };
    return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt };
  }

  reset() {
    this.samples = [];
  }
}

/* ============================================================
   Shared variants
   Transform + opacity only — both composite on the GPU.
   ============================================================ */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: SPRING_UI },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: EASE_OUT },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: SPRING_UI },
};

/** Parent that releases children in sequence. */
export function stagger(staggerChildren = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/** Viewport config for scroll reveals — fire slightly before the
 *  element is fully on screen so motion never feels late.
 *
 *  `amount` is deliberately "some" and not a fraction. A fractional
 *  threshold is only ever satisfiable while
 *
 *      elementHeight <= detectionBandHeight / amount
 *
 *  and the detection band is the viewport shrunk by the margin below.
 *  At amount 0.2 on a 900px viewport that caps out around 4050px —
 *  so the 19-card university grid (4267px) could never reach the
 *  threshold, whileInView never fired, and every child sat at
 *  opacity 0 forever. The taller the page got, the more of it went
 *  invisible, which is the worst possible failure mode for a
 *  reveal-on-scroll.
 *
 *  "some" cannot fail that way at any height. The negative bottom
 *  margin still holds the trigger ~10% of the viewport in, so the
 *  original "fire slightly early, not instantly" intent survives. */
export const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -10% 0px" } as const;
