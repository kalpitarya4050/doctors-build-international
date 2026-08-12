"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { SPRING_SNAPPY } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Created once at module scope. Creating this inside render gives
 *  the component a new identity every pass, which remounts the
 *  anchor and throws away any in-flight animation. */
const MotionLink = motion.create(Link);

type Variant = "primary" | "gold" | "ghost" | "outline" | "whatsapp";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--navy-900)] text-white shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] dark:bg-white dark:text-[var(--navy-950)]",
  gold: "text-[var(--navy-950)] shadow-[var(--shadow-glow)] bg-[linear-gradient(100deg,var(--gold-600),var(--gold-300)_45%,var(--gold-500))]",
  ghost: "text-ink hover:bg-[var(--bg-sunken)]",
  outline: "border border-line-strong text-ink hover:border-[var(--accent)] bg-transparent",
  whatsapp: "bg-[var(--green-500)] text-[#062611] shadow-[0_8px_28px_rgba(37,211,102,0.32)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-12 px-6 text-[0.9375rem] gap-2 rounded-[var(--radius)]",
  lg: "h-14 px-8 text-base gap-2.5 rounded-[var(--radius)]",
};

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Pointer-following pull. Disabled automatically under reduced motion. */
  magnetic?: boolean;
  fullWidth?: boolean;
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonProps extends BaseProps {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function Button(props: LinkProps | ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    magnetic = true,
    fullWidth,
  } = props;

  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 320, damping: 26, mass: 0.4 });
  const y = useSpring(my, { stiffness: 320, damping: 26, mass: 0.4 });
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, { stiffness: 460, damping: 32, mass: 0.35 });

  const pull = (e: ReactPointerEvent) => {
    if (!magnetic || reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Pull toward the pointer, capped so the control never detaches
    // from its slot in the layout.
    mx.set(Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * 0.22)));
    my.set(Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * 0.22)));
  };

  const release = () => {
    mx.set(0);
    my.set(0);
    scale.set(1);
  };

  // Feedback lives on the press, not on release (Apple §1).
  const press = () => scale.set(0.97);

  const base = cn(
    "tap-min relative inline-flex items-center justify-center font-semibold select-none",
    "tracking-[-0.005em] isolate overflow-hidden",
    "focus-visible:outline-2 focus-visible:outline-offset-3",
    SIZES[size],
    VARIANTS[variant],
    fullWidth && "w-full",
    className,
  );

  const handlers = {
    onPointerMove: pull,
    onPointerLeave: release,
    onPointerDown: press,
    onPointerUp: () => scale.set(1),
    onPointerCancel: release,
  };

  const style = reduced ? undefined : { x, y, scale: scaleSpring };

  const inner = (
    <>
      {/* Sheen sweep on hover — decorative, opacity+transform only */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(100deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)",
        }}
      />
      {children}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(base, "group")}
          style={style}
          transition={SPRING_SNAPPY}
          {...handlers}
        >
          {inner}
        </motion.a>
      );
    }
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(base, "group")}
        style={style}
        transition={SPRING_SNAPPY}
        {...handlers}
      >
        {inner}
      </MotionLink>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonProps;
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, "group disabled:opacity-55 disabled:pointer-events-none")}
      style={style}
      transition={SPRING_SNAPPY}
      {...handlers}
    >
      {inner}
    </motion.button>
  );
}
