"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal scroller. Content is duplicated once and
 *  translated -50%, so the loop is seamless. Pauses on hover and
 *  is disabled entirely under reduced motion (globals.css). */
export function Marquee({
  children,
  className,
  speed = 42,
  reverse = false,
  fade = true,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
  fade?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "flex w-max animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={
          {
            "--marquee-duration": `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
