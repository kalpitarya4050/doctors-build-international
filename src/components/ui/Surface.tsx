"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Translucent material layer. Weight scales with surface size —
 *  bigger surfaces read as thicker glass (Apple §12). */
export function GlassCard({
  children,
  className,
  weight = "card",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  weight?: "chip" | "card" | "chrome";
  as?: "div" | "article" | "li" | "section";
}) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        weight === "chip" && "material-chip rounded-[var(--radius-sm)]",
        weight === "card" && "material-card rounded-[var(--radius-lg)]",
        weight === "chrome" && "material-chrome rounded-[var(--radius-xl)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Card that tilts toward the pointer and lifts on press.
 *  Springs, not CSS transitions, so it can be grabbed mid-motion. */
export function TiltCard({
  children,
  className,
  intensity = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 260, damping: 28, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const lift = useMotionValue(0);
  const liftSpring = useSpring(lift, { stiffness: 300, damping: 30, mass: 0.5 });

  // Declared at the top level — never inside JSX, which sits after
  // the reduced-motion early return.
  const glareBg = useTransform(
    [sx, sy],
    ([gx, gy]: number[]) =>
      `radial-gradient(420px circle at ${gx * 100}% ${gy * 100}%, rgba(255,255,255,0.5), transparent 62%)`,
  );

  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const enter = () => !reduced && lift.set(-6);
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
    lift.set(0);
  };

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={track}
      onPointerEnter={enter}
      onPointerLeave={leave}
      className={cn("group relative [transform-style:preserve-3d]", className)}
      style={{
        rotateX,
        rotateY,
        y: liftSpring,
        transformPerspective: 1100,
        willChange: "transform",
      }}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

/** Small pill label. */
export function Chip({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "gold" | "green" | "red" | "navy";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.01em] whitespace-nowrap",
        tone === "default" && "bg-[var(--bg-sunken)] text-ink-secondary border border-line",
        tone === "gold" && "bg-[var(--accent-soft)] text-[var(--gold-600)] border border-[color-mix(in_srgb,var(--gold-500)_35%,transparent)] dark:text-[var(--gold-300)]",
        tone === "green" && "bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] text-[var(--green-600)] border border-[color-mix(in_srgb,var(--green-600)_30%,transparent)]",
        tone === "red" && "bg-[color-mix(in_srgb,var(--red-600)_12%,transparent)] text-[var(--red-600)] border border-[color-mix(in_srgb,var(--red-600)_30%,transparent)]",
        tone === "navy" && "bg-[var(--navy-900)] text-white border border-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section eyebrow — gold rule + small-caps label. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 t-eyebrow text-[var(--accent)]", className)}>
      <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--gold-500))]" />
      {children}
    </span>
  );
}
