"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================
   SCROLL EXPAND.

   A media block that starts inset and rounded, then widens to
   full bleed and squares off as it crosses the viewport. It is
   the single most recognisable move in the reference site, and it
   works because the image is doing the same thing the section is:
   opening up.

   Driven by scroll position rather than a viewport trigger, so it
   is scrubbable — scroll back and it closes again. That is the
   part that makes it feel like a material and not a canned
   animation.
   ============================================================ */

export function ScrollExpand({
  children,
  className,
  /** How far in the block starts, as a percentage of the container. */
  from = 14,
  /** Corner radius at the inset end. */
  radius = "var(--radius-2xl)",
}: {
  children: React.ReactNode;
  className?: string;
  from?: number;
  radius?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Ends at 0.6 rather than 1: the block should be fully open well
  // before it leaves, so it is read at its widest, not glimpsed.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.6"],
  });

  const inset = useTransform(scrollYProgress, [0, 0.65], [`${from}%`, "0%"]);
  const round = useTransform(scrollYProgress, [0, 0.65], [radius, "0px"]);
  const scale = useTransform(scrollYProgress, [0, 0.65], [0.94, 1]);

  if (reduced) {
    return (
      <div ref={ref} className={cn("overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          marginInline: inset,
          borderRadius: round,
          scale,
          willChange: "margin, border-radius, transform",
        }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}
