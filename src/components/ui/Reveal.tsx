"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_UI, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  scale,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  scale?: boolean;
  as?: "div" | "section" | "li" | "span" | "article" | "header";
}) {
  const reduced = useReducedMotion();
  const off = OFFSET[direction];

  // Reduced motion is not "no feedback" — it is a gentler,
  // non-vestibular equivalent. Cross-fade, no travel.
  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25, delay } },
      }
    : {
        hidden: { opacity: 0, x: off.x, y: off.y, scale: scale ? 0.96 : 1 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { ...SPRING_UI, delay },
        },
      };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={variants}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that releases its children in sequence. Pair with
 *  <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: "div" | "li" | "article" | "span";
}) {
  const reduced = useReducedMotion();
  const off = OFFSET[direction];

  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.25 } } }
    : {
        hidden: { opacity: 0, x: off.x, y: off.y },
        visible: { opacity: 1, x: 0, y: 0, transition: SPRING_UI },
      };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag className={cn(className)} variants={variants} style={{ willChange: "transform, opacity" }}>
      {children}
    </MotionTag>
  );
}

/** Left-to-right mask wipe over a whole line.
 *
 *  Unlike RevealWords — which stays viewport-triggered and is used
 *  by every PageHero — this one is driven by a `play` prop, so the
 *  caller decides when it runs. The homepage hero uses it to hand
 *  over from the opening curtain.
 *
 *  The inset is negative on three sides: a serif descender or an
 *  italic overhang sits outside the text box and a flush inset
 *  shears it. */
export function WipeLine({
  children,
  className,
  delay = 0,
  play = true,
  duration = 0.85,
  as = "span",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Set false to hold at the un-wiped state. */
  play?: boolean;
  duration?: number;
  as?: "span" | "div";
}) {
  const reduced = useReducedMotion();
  const MotionTag = as === "div" ? motion.div : motion.span;

  if (reduced) {
    return (
      <MotionTag
        className={cn("inline-block", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 0.25, delay: play ? delay * 0.4 : 0 }}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={cn("inline-block", className)}
      initial={{ clipPath: "inset(-0.35em 100% -0.35em -0.12em)" }}
      animate={{
        clipPath: play
          ? "inset(-0.35em -0.12em -0.35em -0.12em)"
          : "inset(-0.35em 100% -0.35em -0.12em)",
      }}
      transition={{ duration, delay: play ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "clip-path" }}
    >
      {children}
    </MotionTag>
  );
}

/** Word-by-word headline reveal. Splits on spaces and releases
 *  each word on its own spring — reads as the sentence arriving
 *  rather than a block fading in. */
export function RevealWords({
  text,
  className,
  wordClassName,
  stagger = 0.045,
  delay = 0,
  highlight,
  highlightClassName = "gold-text",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  stagger?: number;
  delay?: number;
  /** Words (case-insensitive) to render with the highlight class. */
  highlight?: string[];
  highlightClassName?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const hi = new Set((highlight ?? []).map((w) => w.toLowerCase().replace(/[.,]/g, "")));

  if (reduced) {
    return (
      <motion.span
        className={cn("inline", className)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.3, delay }}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => {
        const clean = word.toLowerCase().replace(/[.,]/g, "");
        return (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.08em]">
            <motion.span
              aria-hidden
              className={cn("inline-block", wordClassName, hi.has(clean) && highlightClassName)}
              variants={{
                hidden: { y: "108%", opacity: 0 },
                visible: { y: "0%", opacity: 1, transition: SPRING_UI },
              }}
              style={{ willChange: "transform, opacity" }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </motion.span>
  );
}
