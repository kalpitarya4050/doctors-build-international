"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { COUNTRIES, ORIGIN } from "@/lib/data/countries";
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

const PALETTES: Record<"light" | "dark", GlobePalette> = {
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
};

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const P = PALETTES[isDark ? "dark" : "light"];

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

    const draw = (now: number) => {
      // Nothing measurable yet — wait for the observer to report a size
      // rather than burning a frame drawing a zero-radius sphere.
      if (width === 0 || height === 0) {
        if (!reduced) raf = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (now - start) / 1000;
      // ~72 s per revolution — slow enough to read as ambient
      const spin = reduced ? 0.6 : elapsed * 0.087;

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
        p = rotateX(p, TILT);
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
          p = rotateX(p, TILT);
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

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    // A resize must also request a repaint. Under reduced motion `draw`
    // runs a single frame and never recurses, so without this the canvas
    // stays blank whenever that first frame lands before layout has
    // settled — and goes stale after any window resize.
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
    };
    // Redraw with the other palette when the theme is toggled.
  }, [reduced, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("size-full", className)}
      role="img"
      aria-label="Rotating globe showing flight paths from India to Georgia, Russia, Uzbekistan, Kyrgyzstan, Nepal, China and Kazakhstan"
    />
  );
}
