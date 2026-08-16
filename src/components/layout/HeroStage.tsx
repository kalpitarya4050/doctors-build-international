"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================
   HERO STAGE.

   The page banner used to be a photograph with a 30-second Ken
   Burns on it and a gradient fade at the bottom. Nothing tracked
   the pointer, every layer moved as one, and the fade read as the
   image running out of ink rather than as a transition.

   This rebuilds it as three layers that separate under the
   pointer, which is where the depth comes from — the photo pushes
   away from the cursor, the copy leans toward it. Apple §2: the
   content moves with the input, not on a timer.

   Everything is spring-driven off live motion values, so it stays
   interruptible (§3) — swing the pointer back mid-travel and the
   layers reverse from wherever they actually are on screen rather
   than finishing the old move first.
   ============================================================ */

/** Critically damped. No bounce: this is a surface following a
 *  pointer, not an object that was thrown (Apple §4 — bounce is
 *  reserved for gestures that carried momentum). */
const TRACK = { stiffness: 140, damping: 26, mass: 0.55 } as const;

export function HeroStage({
  children,
  photo,
  className,
}: {
  children: ReactNode;
  /** The photographic layer. Passed in rather than rendered here so
   *  the server can keep owning next/image and its priority hint. */
  photo?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Pointer position within the stage, 0..1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const active = useMotionValue(0);

  const sx = useSpring(px, TRACK);
  const sy = useSpring(py, TRACK);
  const sActive = useSpring(active, { stiffness: 120, damping: 24, mass: 0.5 });

  // Layers travel different distances and in opposite directions.
  // That opposition is the whole trick — parallel motion at
  // different speeds reads as drift; opposed motion reads as depth.
  const photoX = useTransform(sx, [0, 1], [26, -26]);
  const photoY = useTransform(sy, [0, 1], [18, -18]);
  const copyX = useTransform(sx, [0, 1], [-10, 10]);
  const copyY = useTransform(sy, [0, 1], [-7, 7]);

  // Pointer-following light. Sits on soft-light so it lifts the
  // photograph underneath instead of painting a grey disc on it.
  const lightX = useTransform(sx, (v) => `${v * 100}%`);
  const lightY = useTransform(sy, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(38rem circle at ${lightX} ${lightY}, rgba(233,199,102,0.30), rgba(201,162,39,0.10) 34%, transparent 62%)`;

  // Scroll handoff: the photo keeps drifting after the pointer has
  // gone, so leaving the section is a continuation of the same
  // movement rather than a dead stop.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    // Coarse pointers have no hover state to track; a touch would
    // slam the layers to the tap point and back.
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    active.set(1);
  };

  const release = () => {
    px.set(0.5);
    py.set(0.5);
    active.set(0);
  };

  if (reduced) {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {photo}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onPointerMove={track}
      onPointerLeave={release}
      className={cn("relative", className)}
    >
      {/* Photo layer. Inset past the bleed so parallax travel never
          exposes an edge, and scroll keeps it moving after the
          pointer leaves. */}
      {photo && (
        <motion.div
          aria-hidden
          /* Below the legibility gradients, which sit at -z-10 in
             PageHero. Same stacking context, so later DOM would
             otherwise paint the photo on top of its own scrim. */
          className="pointer-events-none absolute inset-[-5%] -z-20"
          style={{ x: photoX, y: photoY, translateY: scrollY, scale: scrollScale }}
        >
          {photo}
        </motion.div>
      )}

      {/* Pointer light, above the photo and below the copy. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] mix-blend-soft-light"
        style={{ background: light, opacity: sActive }}
      />

      {/* Copy leans into the pointer, against the photo's push. */}
      <motion.div style={{ x: copyX, y: copyY }} className="relative">
        {children}
      </motion.div>
    </div>
  );
}
