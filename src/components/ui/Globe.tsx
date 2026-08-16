"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { COUNTRIES, ORIGIN } from "@/lib/data/countries";
import { VelocityTracker, project } from "@/lib/motion";
import { Shield3D } from "@/components/ui/Shield3D";
import { Flag } from "@/components/ui/Flag";
import { cn } from "@/lib/utils";

/* ============================================================
   A slowly rotating wireframe globe with animated flight arcs
   from India to every destination we place students into.

   Canvas + requestAnimationFrame (the web's display-synced
   clock). Rotation is deliberately slow — well away from the
   ~0.2 Hz oscillation band that triggers vestibular discomfort —
   and the whole thing renders as a single static frame under
   prefers-reduced-motion.
   ============================================================ */

type Vec3 = { x: number; y: number; z: number };

function toCartesian(latDeg: number, lngDeg: number, r: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lng = (lngDeg * Math.PI) / 180;
  return {
    x: r * Math.cos(lat) * Math.sin(lng),
    y: r * Math.sin(lat),
    z: r * Math.cos(lat) * Math.cos(lng),
  };
}

function rotateY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function rotateX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

/** Spherical interpolation so an arc follows the great circle,
 *  the way a flight path actually does. */
function slerp(a: Vec3, b: Vec3, t: number, r: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, (a.x * b.x + a.y * b.y + a.z * b.z) / (r * r)));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const w1 = Math.sin((1 - t) * omega) / s;
  const w2 = Math.sin(t * omega) / s;
  return { x: a.x * w1 + b.x * w2, y: a.y * w1 + b.y * w2, z: a.z * w1 + b.z * w2 };
}

/* ------------------------------------------------------------------
   The canvas cannot inherit CSS custom properties, so the palette is
   declared here per theme. The original values were tuned against a
   dark ground and were almost invisible on the light one — on white,
   the sphere and graticule need far more contrast to read at all.
   ------------------------------------------------------------------ */
type GlobePalette = {
  glowInner: string;
  glowMid: string;
  bodyTop: string;
  bodyMid: string;
  bodyEdge: string;
  rim: string;
  parallel: string;
  meridian: string;
  arcTrack: string;
  cometHead: (a: number) => string;
  nodeRing: (a: number) => string;
  originFill: string;
};

const PALETTES: Record<"light" | "dark" | "onNavy", GlobePalette> = {
  light: {
    // Gold reads as a warm halo but disappears as a line on a warm
    // sphere, so on light the arcs and nodes go navy for contrast and
    // gold is kept for the glow and rim only.
    glowInner: "rgba(201,162,39,0.22)",
    glowMid: "rgba(201,162,39,0.08)",
    bodyTop: "rgba(42,85,159,0.22)",
    bodyMid: "rgba(10,31,68,0.15)",
    bodyEdge: "rgba(10,31,68,0.06)",
    rim: "rgba(168,133,29,0.80)",
    parallel: "rgba(10,31,68,0.28)",
    meridian: "rgba(10,31,68,0.22)",
    arcTrack: "rgba(10,31,68,0.30)",
    cometHead: (a) => `rgba(10,31,68,${Math.min(1, a * 1.15)})`,
    nodeRing: (a) => `rgba(10,31,68,${Math.min(1, a * 1.2)})`,
    originFill: "#0A1F44",
  },
  dark: {
    glowInner: "rgba(201,162,39,0.16)",
    glowMid: "rgba(201,162,39,0.05)",
    bodyTop: "rgba(28,64,128,0.20)",
    bodyMid: "rgba(10,31,68,0.13)",
    bodyEdge: "rgba(10,31,68,0.03)",
    rim: "rgba(201,162,39,0.40)",
    parallel: "rgba(90,140,220,0.30)",
    meridian: "rgba(90,140,220,0.24)",
    arcTrack: "rgba(201,162,39,0.24)",
    cometHead: (a) => `rgba(233,199,102,${a})`,
    nodeRing: (a) => `rgba(233,199,102,${a})`,
    originFill: "#E8C766",
  },
  /* On the navy hero the globe is the ground, not an ornament beside
     the copy — so everything is pushed brighter than the `dark`
     palette, which was tuned to sit quietly next to text. */
  onNavy: {
    glowInner: "rgba(201,162,39,0.30)",
    glowMid: "rgba(201,162,39,0.09)",
    bodyTop: "rgba(58,104,190,0.34)",
    bodyMid: "rgba(18,44,92,0.24)",
    bodyEdge: "rgba(10,31,68,0.06)",
    rim: "rgba(233,199,102,0.62)",
    parallel: "rgba(132,172,236,0.40)",
    meridian: "rgba(132,172,236,0.30)",
    arcTrack: "rgba(233,199,102,0.38)",
    cometHead: (a) => `rgba(250,231,170,${Math.min(1, a * 1.25)})`,
    nodeRing: (a) => `rgba(233,199,102,${Math.min(1, a * 1.2)})`,
    originFill: "#F2DDA0",
  },
};

export function Globe({
  className,
  /** "auto" follows the page theme. Pass an explicit tone when the
   *  globe sits on a ground that does not track the theme — the navy
   *  hero is navy in both schemes. */
  tone = "auto",
}: {
  className?: string;
  tone?: "auto" | "light" | "dark" | "onNavy";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const flagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const paletteKey = tone === "auto" ? (isDark ? "dark" : "light") : tone;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const P = PALETTES[paletteKey];

    let raf = 0;
    let width = 0;
    let height = 0;
    let radius = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.38;
    };

    resize();

    const origin = { lat: ORIGIN.lat, lng: ORIGIN.lng };
    const targets = COUNTRIES.map((c) => ({
      lat: c.lat,
      lng: c.lng,
      accent: c.accent,
      name: c.name,
    }));

    const TILT = -0.38;
    const start = performance.now();

    /* ---- drag state (Apple 2, 5, 6) ----------------------------
       `userSpin` is the offset the pointer has added on top of the
       ambient rotation. On release the flick is projected forward
       with the same exponential-decay model the carousel uses, then
       bled off — so letting go continues the gesture rather than
       stopping it dead. */
    let userSpin = 0;
    let userTilt = 0;
    let spinVel = 0;   // radians/s, decaying after release
    let tiltVel = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const vt = new VelocityTracker(90);

    /* Every place this globe plots — India and all six destinations —
       sits between 37°E and 116°E. Starting the rotation at 0° put
       that whole corridor on the far side, so the arcs were culled
       and the sphere rendered as a bare wireframe for most of the
       cycle. Offsetting the base rotation brings the corridor to the
       front at load, which is the only reason the globe is here. */
    const FOCUS_LNG = 76;
    const BASE_SPIN = (-FOCUS_LNG * Math.PI) / 180;

    const draw = (now: number) => {
      // Nothing measurable yet — wait for the observer to report a size
      // rather than burning a frame drawing a zero-radius sphere.
      if (width === 0 || height === 0) {
        if (!reduced) raf = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (now - start) / 1000;
      // ~105 s per revolution. Slower than before because the arcs are
      // now the subject rather than ambient decoration — they want
      // time on screen, not a tour.
      // Ambient drift pauses while the pointer owns the globe, so the
      // two never fight for the same axis.
      const ambient = reduced ? 0 : dragging ? 0 : elapsed * 0.06;
      const spin = BASE_SPIN + ambient + userSpin;
      const tilt = TILT + userTilt;

      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      /* ---- outer atmosphere glow ---- */
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.42);
      glow.addColorStop(0, P.glowInner);
      glow.addColorStop(0.55, P.glowMid);
      glow.addColorStop(1, "rgba(201,162,39,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.42, 0, Math.PI * 2);
      ctx.fill();

      /* ---- sphere body ---- */
      const body = ctx.createRadialGradient(
        cx - radius * 0.34,
        cy - radius * 0.4,
        radius * 0.06,
        cx,
        cy,
        radius,
      );
      body.addColorStop(0, P.bodyTop);
      body.addColorStop(0.62, P.bodyMid);
      body.addColorStop(1, P.bodyEdge);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      /* ---- rim ---- */
      ctx.strokeStyle = P.rim;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      const projectPoint = (lat: number, lng: number) => {
        let p = toCartesian(lat, lng, radius);
        p = rotateY(p, spin);
        p = rotateX(p, tilt);
        return { sx: cx + p.x, sy: cy - p.y, z: p.z };
      };

      /* ---- graticule: parallels ---- */
      ctx.lineWidth = 0.75;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 4) {
          const { sx, sy, z } = projectPoint(lat, lng);
          if (z < 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = P.parallel;
        ctx.stroke();
      }

      /* ---- graticule: meridians ---- */
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const { sx, sy, z } = projectPoint(lat, lng);
          if (z < 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = P.meridian;
        ctx.stroke();
      }

      /* ---- flight arcs, India → each destination ---- */
      const a = toCartesian(origin.lat, origin.lng, radius);

      targets.forEach((t, idx) => {
        const b = toCartesian(t.lat, t.lng, radius);
        // Each arc runs its own 5.5 s cycle, offset so they never
        // all fire together.
        const cycle = 5.5;
        const phase = reduced ? 0.65 : ((elapsed + idx * 0.78) % cycle) / cycle;

        const SEGMENTS = 44;
        const pts: { sx: number; sy: number; z: number }[] = [];

        for (let i = 0; i <= SEGMENTS; i++) {
          const s = i / SEGMENTS;
          let p = slerp(a, b, s, radius);
          // Lift the arc off the surface so it reads as a flight path
          const lift = 1 + Math.sin(s * Math.PI) * 0.19;
          p = { x: p.x * lift, y: p.y * lift, z: p.z * lift };
          p = rotateY(p, spin);
          p = rotateX(p, tilt);
          pts.push({ sx: cx + p.x, sy: cy - p.y, z: p.z });
        }

        // Static arc track
        ctx.beginPath();
        let started = false;
        for (const p of pts) {
          if (p.z < -radius * 0.12) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.sx, p.sy);
            started = true;
          } else {
            ctx.lineTo(p.sx, p.sy);
          }
        }
        ctx.strokeStyle = P.arcTrack;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Travelling comet head with a short trail
        const headIdx = Math.floor(phase * SEGMENTS);
        const TRAIL = 9;
        for (let k = 0; k < TRAIL; k++) {
          const i = headIdx - k;
          if (i < 0 || i >= pts.length - 1) continue;
          const p = pts[i];
          const n = pts[i + 1];
          if (p.z < -radius * 0.12 || n.z < -radius * 0.12) continue;
          const alpha = (1 - k / TRAIL) * 0.85;
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(n.sx, n.sy);
          ctx.strokeStyle = P.cometHead(alpha);
          ctx.lineWidth = 2.1 * (1 - k / TRAIL) + 0.5;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Destination node
        const dest = pts[pts.length - 1];
        if (dest.z > -radius * 0.06) {
          const pulse = reduced ? 0.5 : (Math.sin(elapsed * 1.9 + idx) + 1) / 2;
          ctx.beginPath();
          ctx.arc(dest.sx, dest.sy, 3.1 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = t.accent;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dest.sx, dest.sy, 6.5 + pulse * 5.5, 0, Math.PI * 2);
          ctx.strokeStyle = P.nodeRing(0.55 - pulse * 0.34);
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      });

      /* ---- origin node: India ---- */
      const originPt = projectPoint(origin.lat, origin.lng);
      if (originPt.z > -radius * 0.06) {
        const pulse = reduced ? 0.5 : (Math.sin(elapsed * 2.2) + 1) / 2;
        ctx.beginPath();
        ctx.arc(originPt.sx, originPt.sy, 4.6, 0, Math.PI * 2);
        ctx.fillStyle = P.originFill;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(originPt.sx, originPt.sy, 9 + pulse * 8, 0, Math.PI * 2);
        ctx.strokeStyle = P.nodeRing(0.6 - pulse * 0.4);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      /* ---- momentum decay after release ----
         Velocity bleeds off exponentially and is folded back into
         the ambient drift, so the globe never stops abruptly. */
      if (!dragging && (spinVel !== 0 || tiltVel !== 0)) {
        const dt = 1 / 60;
        userSpin += spinVel * dt;
        userTilt += tiltVel * dt;
        spinVel *= 0.94;
        tiltVel *= 0.94;
        if (Math.abs(spinVel) < 0.0008) spinVel = 0;
        if (Math.abs(tiltVel) < 0.0008) tiltVel = 0;
      }
      // Tilt is bounded — past roughly +/-50 degrees you are looking at
      // the poles and the graticule turns to mush.
      userTilt = Math.max(-0.55, Math.min(0.55, userTilt));

      /* ---- DOM layer, driven from the same projection ----
         Written straight to style rather than through React: this
         runs every frame, and a state update per frame would cost
         a full reconciliation for a transform. */
      const shield = shieldRef.current;
      if (shield) {
        // The element is authored at its natural 307px width, so the
        // factor has to divide that out — otherwise this is a 14x
        // blowup rather than a fit. Target is a little over half the
        // sphere, which leaves the graticule readable around it.
        const s = (radius * 0.66) / 307;
        shield.style.transform =
          `translate(-50%,-50%) rotateX(${(-tilt * 34).toFixed(2)}deg) ` +
          `rotateY(${(Math.sin(spin) * 26).toFixed(2)}deg) scale(${s.toFixed(3)})`;
        const spec = shield.querySelector<HTMLElement>("[data-shield-spec]");
        if (spec) {
          // Highlight slides against the turn — the cue that the
          // bezel is a raised surface and not a printed ring.
          spec.style.backgroundPosition = `${(50 - Math.sin(spin) * 46).toFixed(1)}% 0`;
        }
      }

      targets.forEach((t, i) => {
        const el = flagRefs.current[i];
        if (!el) return;
        /* Every destination we place into sits between 37E and 116E
           and 35-55N — a genuinely tight cluster, so at one uniform
           lift the six chips stack on top of each other. Fanning the
           radius per index pulls them apart without moving any of
           them off its true bearing. */
        const lift = 1.05 + (i % 3) * 0.085;
        let p = toCartesian(t.lat, t.lng, radius * lift);
        p = rotateY(p, spin);
        p = rotateX(p, tilt);
        const behind = p.z < 0;
        // Perspective: nearer reads bigger. Kept shallow so a flag
        // swinging to the front does not lunge at the viewer.
        const depth = 0.78 + (p.z / radius) * 0.22;
        el.style.transform =
          `translate(-50%,-50%) translate3d(${(cx + p.x).toFixed(1)}px, ${(cy - p.y).toFixed(1)}px, 0) ` +
          `scale(${depth.toFixed(3)})`;
        el.style.opacity = behind ? String(Math.max(0, 0.16 + (p.z / radius) * 0.5)) : "1";
        el.style.zIndex = String(Math.round(100 + (p.z / radius) * 50));
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    // A resize must also request a repaint. Under reduced motion `draw`
    // runs a single frame and never recurses, so without this the canvas
    // stays blank whenever that first frame lands before layout has
    // settled — and goes stale after any window resize.
    /* ---- direct manipulation ----
       setPointerCapture keeps tracking alive when the pointer leaves
       the element mid-drag (Apple 2). Touch is deliberately allowed to
       fall through to the page: a globe that eats vertical drags on a
       phone traps the reader in the hero. */
    const stage = stageRef.current;
    const onDown = (e: PointerEvent) => {
      if (reduced || e.pointerType === "touch") return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      vt.reset();
      vt.add(e.clientX, e.clientY);
      spinVel = 0;
      tiltVel = 0;
      stage?.setPointerCapture(e.pointerId);
      if (stage) stage.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      // 1:1 with the pointer, scaled by radius so the same swipe turns
      // the globe by the same amount at any size.
      const k = radius > 0 ? 1 / radius : 0.004;
      userSpin += (e.clientX - lastX) * k;
      userTilt += (e.clientY - lastY) * k * 0.6;
      lastX = e.clientX;
      lastY = e.clientY;
      vt.add(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage?.releasePointerCapture(e.pointerId);
      if (stage) stage.style.cursor = "grab";
      const v = vt.velocity();
      const k = radius > 0 ? 1 / radius : 0.004;
      // project() answers "where would this flick land"; converting
      // that back to a rate gives the initial decay velocity.
      spinVel = project(v.x) * k * 0.9;
      tiltVel = project(v.y) * k * 0.55;
    };

    if (stage) {
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);
      stage.style.cursor = "grab";
    }

    const ro = new ResizeObserver(() => {
      resize();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (stage) {
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", onUp);
        stage.removeEventListener("pointercancel", onUp);
      }
    };
    // Redraw with the other palette when the theme is toggled.
  }, [reduced, paletteKey]);

  return (
    /* Canvas draws the sphere; the DOM layer above it carries the
       shield and the flags. Both are driven by one projection in one
       rAF loop, so they cannot drift apart.

       `perspective` lives here rather than on the shield: it has to
       be on the ancestor for the children's Z offsets to foreshorten,
       and a perspective set on the element itself does nothing. */
    <div
      ref={stageRef}
      className={cn("relative size-full touch-pan-y select-none", className)}
      style={{ perspective: "1200px" }}
      role="img"
      aria-label="Interactive globe showing flight paths from India to Georgia, Russia, Kazakhstan, China, Uzbekistan and Kyrgyzstan. Drag to spin."
    >
      <canvas ref={canvasRef} className="size-full" aria-hidden />

      {/* Brand shield at the core of the sphere. Sized by the rAF
          loop from the measured radius, so it tracks the canvas. */}
      <Shield3D
        ref={shieldRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[384px] w-[307px] origin-center will-change-transform"
      />

      {/* Destination flags, pinned to their real coordinates. */}
      {COUNTRIES.map((c, i) => (
        <div
          key={c.slug}
          ref={(el) => {
            flagRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0 will-change-transform"
          style={{ opacity: 0 }}
        >
          <span
            className="flex items-center gap-1 rounded-full py-[3px] pl-[3px] pr-2 shadow-[var(--shadow-badge)] backdrop-blur-sm"
            style={{ background: "rgba(5,15,34,0.72)", border: `1px solid ${c.accent}` }}
          >
            <Flag country={c.slug} className="h-3 w-[1.125rem] rounded-[2px]" />
            {/* Name drops below sm. Six labels around a globe that is
                only ~150px across on a phone is unreadable clutter,
                and at that size the type falls under the 12px floor
                the rest of the site holds itself to. */}
            <span className="hidden whitespace-nowrap text-[0.625rem] font-bold tracking-[0.02em] text-white sm:inline">
              {c.name}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
