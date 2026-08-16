"use client";

import {
  motion,
  useMotionValue,
  animate,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VelocityTracker, project, clampWithRubberband, SPRING_MOMENTUM, SPRING_UI } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ============================================================
   A carousel that behaves like a physical object.

   - 1:1 tracking with the pointer, respecting the grab offset
   - velocity history sampled over a short window, not one delta
   - on release, the resting point is PROJECTED from velocity and
     the nearest slide to that projection becomes the target
   - release velocity is handed to the spring, so there is no
     seam between dragging and animating
   - rubber-banding at both ends instead of a hard stop
   - fully interruptible: grabbing mid-flight reads the live
     presentation value and continues from there
   ============================================================ */

export function DragCarousel({
  children,
  className,
  itemClassName,
  gap = 20,
  showArrows = true,
  showDots = true,
  ariaLabel = "Carousel",
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  gap?: number;
  showArrows?: boolean;
  showDots?: boolean;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const tracker = useRef(new VelocityTracker(100));
  const running = useRef<AnimationPlaybackControls | null>(null);

  const dragging = useRef(false);
  const grabOffset = useRef(0);
  const startX = useRef(0);
  const committed = useRef(false);

  const [bounds, setBounds] = useState({ min: 0, max: 0 });
  const [snaps, setSnaps] = useState<number[]>([0]);
  const [active, setActive] = useState(0);

  /* ---- measure snap points from real laid-out geometry ---- */
  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const items = Array.from(track.children) as HTMLElement[];
    if (items.length === 0) return;

    const trackWidth = track.scrollWidth;
    const vpWidth = vp.clientWidth;
    const min = Math.min(0, vpWidth - trackWidth);

    const trackLeft = track.getBoundingClientRect().left;
    const currentX = x.get();
    // Offset of each item relative to the track origin
    const points = items.map((el) => {
      const offset = el.getBoundingClientRect().left - trackLeft + currentX;
      return -offset;
    });

    setBounds({ min, max: 0 });
    setSnaps(points.map((p) => Math.max(min, Math.min(0, p))));
  }, [x]);

  useEffect(() => {
    measure();
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  /* ---- keep the dot indicator in sync with the live value ---- */
  useEffect(() => {
    const unsub = x.on("change", (v) => {
      if (snaps.length === 0) return;
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < snaps.length; i++) {
        const d = Math.abs(snaps[i] - v);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      setActive((prev) => (prev === nearest ? prev : nearest));
    });
    return unsub;
  }, [x, snaps]);

  const stopRunning = () => {
    running.current?.stop();
    running.current = null;
  };

  /* ---- animate to an index, optionally inheriting velocity ---- */
  const goTo = useCallback(
    (index: number, velocity = 0) => {
      const clamped = Math.max(0, Math.min(snaps.length - 1, index));
      const target = snaps[clamped] ?? 0;
      stopRunning();
      // Bounce ONLY when a flick preceded this. A dot-click or an
      // arrow press gets the critically-damped spring.
      const spring = Math.abs(velocity) > 80 ? SPRING_MOMENTUM : SPRING_UI;
      running.current = animate(x, target, { ...spring, velocity });
    },
    [snaps, x],
  );

  /* ---------------- pointer handling ---------------- */

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "mouse" && e.button !== 0) return;
    // Interrupt: read the live presentation value and continue
    // from exactly there. Never restart from the logical target.
    stopRunning();
    dragging.current = true;
    committed.current = false;
    startX.current = e.clientX;
    grabOffset.current = e.clientX - x.get();
    tracker.current.reset();
    tracker.current.add(e.clientX, e.clientY);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    tracker.current.add(e.clientX, e.clientY);

    // ~10px of hysteresis before committing to a horizontal drag,
    // so a vertical page scroll is never hijacked.
    if (!committed.current) {
      if (Math.abs(e.clientX - startX.current) < 10) return;
      committed.current = true;
    }

    const raw = e.clientX - grabOffset.current;
    const vpWidth = viewportRef.current?.clientWidth ?? 1;
    // Soft boundaries — resist progressively rather than stop hard.
    x.set(clampWithRubberband(raw, bounds.min, bounds.max, vpWidth));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }

    if (!committed.current) return;

    const v = tracker.current.velocity().x;
    const current = x.get();

    // Animate to where the gesture is GOING, not where it stopped.
    const projected = current + project(v);
    const clampedProjection = Math.max(bounds.min, Math.min(bounds.max, projected));

    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < snaps.length; i++) {
      const d = Math.abs(snaps[i] - clampedProjection);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    goTo(nearest, v);
  };

  const canPrev = active > 0;
  const canNext = active < snaps.length - 1;

  /* ---- reduced motion: a plain scroll container, no springs ---- */
  if (reduced) {
    return (
      <div className={cn("relative", className)}>
        <div
          className="scroll-x no-scrollbar flex snap-x snap-mandatory"
          style={{ gap }}
          role="region"
          aria-label={ariaLabel}
        >
          {children.map((child, i) => (
            <div key={i} className={cn("snap-start shrink-0", itemClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewportRef}
        className="overflow-hidden"
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
      >
        <motion.div
          ref={trackRef}
          className="flex touch-pan-y select-none"
          style={{ x, gap, willChange: "transform", cursor: "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          whileTap={{ cursor: "grabbing" }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className={cn("shrink-0", itemClassName)}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${children.length}`}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {(showArrows || showDots) && (
        <div className="mt-7 flex items-center justify-between gap-6">
          {showDots ? (
            <div className="flex items-center gap-2" role="tablist" aria-label={`${ariaLabel} slides`}>
              {snaps.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Go to slide ${i + 1}`}
                  onPointerDown={() => goTo(i)}
                  /* `tap` expands the hit area to 44x44 on coarse
                     pointers without changing the visual dot, which
                     has to stay small to read as a dot. Padding alone
                     left these at 38x18 — under Apple's minimum, and
                     the mobile audit flags them on every carousel. */
                  className="tap group/dot grid place-items-center p-1.5"
                >
                  <motion.span
                    className="block h-1.5 rounded-full bg-[var(--border-strong)]"
                    animate={{
                      width: i === active ? 26 : 7,
                      backgroundColor:
                        i === active ? "var(--accent-bright)" : "var(--border-strong)",
                    }}
                    transition={SPRING_UI}
                  />
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}

          {showArrows && (
            <div className="flex items-center gap-2.5">
              <CarouselArrow
                direction="prev"
                disabled={!canPrev}
                onPress={() => goTo(active - 1)}
              />
              <CarouselArrow
                direction="next"
                disabled={!canNext}
                onPress={() => goTo(active + 1)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onPress,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onPress: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      // Feedback on press, not on click.
      onPointerDown={() => !disabled && onPress()}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      whileTap={{ scale: 0.92 }}
      transition={SPRING_UI}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-line-strong",
        "bg-[var(--bg-elevated)] text-ink shadow-[var(--shadow-sm)]",
        "disabled:opacity-35 disabled:pointer-events-none",
        "hover:border-[var(--accent)] hover:text-[var(--accent)]",
      )}
    >
      <Icon className="size-[18px]" strokeWidth={2.2} />
    </motion.button>
  );
}
