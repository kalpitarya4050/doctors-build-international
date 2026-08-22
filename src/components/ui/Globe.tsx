"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { COUNTRIES, ORIGIN } from "@/lib/data/countries";
import { VelocityTracker, project } from "@/lib/motion";
import {
  GlobeRenderer,
  greatCircle,
  projectLatLng,
  type GlobeColors,
} from "@/lib/globe-gl";
import { withBasePath } from "@/lib/images";
import { Flag } from "@/components/ui/Flag";
import { cn } from "@/lib/utils";

/* ============================================================
   The hero globe.

   A real sphere, rendered by a fragment shader that solves the
   orthographic projection in closed form (src/lib/globe-gl.ts),
   textured from a baked Natural Earth land mask and lit in the
   site's own navy and gold. It replaces a wireframe canvas
   drawing that read as a diagram of a globe rather than a globe.

   Three layers, one rotation:

     1. WebGL canvas — the Earth itself.
     2. 2D canvas    — flight arcs from India, surface markers,
                       and the leader lines out to the labels.
     3. DOM          — the flag chips, so they stay real text
                       that a screen reader and a translator can
                       both reach.

   Every layer reads the same `yaw`/`pitch` from the same rAF
   tick, so nothing can drift off the sphere it is drawn on.
   ============================================================ */

/* Land is blue and the Earth is the ground; gold is reserved for our
   own marks on it — the arcs, the markers, the coastline glow and the
   rim. That split is what keeps six destinations legible on top of a
   fully painted planet, and it is why the land is not gold too. */
const PALETTES: Record<"light" | "dark" | "onNavy", GlobeColors & {
  arc: string;
  arcHead: string;
  marker: string;
  origin: string;
  leader: string;
}> = {
  onNavy: {
    oceanLit: "#0b2c5c",
    oceanDark: "#061530",
    landLow: "#255ca4",
    landHigh: "#63a1e2",
    coast: "#e8c766",
    rim: "#c9a227",
    atmosphere: "#e8c766",
    arc: "rgba(233,199,102,0.55)",
    arcHead: "250,231,170",
    marker: "#f2dda0",
    origin: "#ffffff",
    leader: "rgba(233,199,102,0.6)",
  },
  dark: {
    oceanLit: "#0b2851",
    oceanDark: "#040c20",
    landLow: "#1f4c8e",
    landHigh: "#5f95d8",
    coast: "#e8c766",
    rim: "#c9a227",
    atmosphere: "#c9a227",
    arc: "rgba(233,199,102,0.36)",
    arcHead: "233,199,102",
    marker: "#e8c766",
    origin: "#ffffff",
    leader: "rgba(233,199,102,0.45)",
  },
  light: {
    /* On white the sphere has to hold its own edge, so the ocean is
       darker here than on the navy hero, not lighter — a pale globe
       on a pale page has no silhouette at all. */
    oceanLit: "#173f7d",
    oceanDark: "#0a1f44",
    landLow: "#3b76c4",
    landHigh: "#8fbdf0",
    coast: "#c9a227",
    rim: "#a8851d",
    atmosphere: "#c9a227",
    arc: "rgba(10,31,68,0.30)",
    arcHead: "10,31,68",
    marker: "#c9a227",
    origin: "#0A1F44",
    leader: "rgba(10,31,68,0.35)",
  },
};

/** Radius as a fraction of the stage's short side. Leaves room for the
 *  atmosphere halo and for labels fanned outside the limb. */
const RADIUS_RATIO = 0.4;

/** Fill cost scales with the square of this, and the shader does
 *  thirteen texture fetches per pixel. 1.75 is past the point where
 *  more resolution is visible on the limb. */
const MAX_DPR = 1.75;

/* Module-level so a theme flip — which tears the render effect down
   and builds it again — reuses the decoded bitmap instead of going
   back to the network. Rejects once and stays rejected, which is the
   right answer: if the mask 404s, it will 404 again. */
let maskPromise: Promise<HTMLImageElement> | null = null;

function loadMask(): Promise<HTMLImageElement> {
  maskPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onerror = () => reject(new Error("globe mask failed to load"));
    img.src = withBasePath("/brand/globe-land.png");
    img.decode().then(() => resolve(img), reject);
  });
  return maskPromise;
}

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
  const stageRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const paletteKey = tone === "auto" ? (resolvedTheme === "dark" ? "dark" : "light") : tone;

  /* One effect owns the whole thing. The arcs, markers, labels and
     drag all work with no WebGL at all — they only need the rotation —
     so they start immediately, and the sphere fades in underneath them
     if and when the mask decodes and a context is granted. Which layer
     is showing is a property of two DOM nodes, not of React state:
     tracking it in state would re-render the tree for a crossfade and
     would mean writing setState from inside an effect. */
  useEffect(() => {
    const stage = stageRef.current;
    const glCanvas = glRef.current;
    const overlay = overlayRef.current;
    const fallback = fallbackRef.current;
    if (!stage || !glCanvas || !overlay) return;

    const P = PALETTES[paletteKey];
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    let renderer: GlobeRenderer | null = null;
    let disposed = false;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let width = 0;
    let height = 0;
    let radius = 1;

    /* The stage is deliberately wider than the viewport and hangs off
       the right edge — that crop is what makes the globe read as a
       place rather than an illustration. Labels must not inherit that:
       a chip pushed outward near the right limb lands in the crop and
       is simply gone. These are the stage's offsets, so the declutter
       can express "stay on screen" in stage-local coordinates. */
    let stageLeft = 0;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      stageLeft = rect.left;
      radius = Math.min(width, height) * RADIUS_RATIO;
      renderer?.resize(width, height, radius, dpr);
      overlay.width = Math.max(1, Math.floor(width * dpr));
      overlay.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    if (GlobeRenderer.isSupported()) {
      loadMask().then(
        (img) => {
          if (disposed) return;
          try {
            renderer = new GlobeRenderer(glCanvas, img, P);
          } catch {
            return; // fallback disc stays up
          }
          renderer.resize(width, height, radius, dpr);
          glCanvas.style.opacity = "1";
          if (fallback) fallback.style.opacity = "0";
          /* Under prefers-reduced-motion the loop draws exactly one
             frame and does not recurse — and that frame has already
             been and gone by the time the mask finishes decoding, so
             without this kick the sphere stays blank forever and only
             the fallback disc is ever seen. */
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(frame);
        },
        () => {},
      );
    }

    /* ---- destinations ----------------------------------------- */
    /* Fan the labels by LONGITUDE RANK, not array index. Kyrgyzstan
       (74.6E) and Kazakhstan (76.9E) sit two degrees apart, and Nepal
       (84.4E) is not far behind, so any fan keyed on array order can
       hand two neighbours the same offset and hide one behind the
       other. Ranking by longitude guarantees adjacent labels differ. */
    const byLng = [...COUNTRIES].sort((a, b) => a.lng - b.lng).map((c) => c.slug);
    const targets = COUNTRIES.map((c) => ({
      lat: c.lat,
      lng: c.lng,
      name: c.name,
      slug: c.slug,
      /** Label distance out from the limb, in sphere radii. */
      fan: 0.17 + (byLng.indexOf(c.slug) % 3) * 0.085,
      arc: greatCircle(ORIGIN.lat, ORIGIN.lng, c.lat, c.lng, 48),
    }));

    /* Per-frame label state. Allocated once and mutated in place: this
       is rewritten sixty times a second, and six fresh objects a frame
       is six hundred objects a second for the collector to sweep. */
    const layout = targets.map(() => ({
      sx: 0, // marker, on the surface
      sy: 0,
      x: 0, // label, after the fan and the declutter
      y: 0,
      z: 0,
      w: 90, // measured from the DOM in resize()
      h: 30,
      visible: false,
    }));
    /** Clear space demanded between two labels, in CSS pixels. */
    const LABEL_GAP = 8;
    /** Clear space demanded between a label and the viewport edge. */
    const EDGE_PAD = 12;

    const measureChips = () => {
      for (let i = 0; i < layout.length; i++) {
        const el = chipRefs.current[i];
        if (!el?.firstElementChild) continue;
        const r = el.firstElementChild.getBoundingClientRect();
        if (r.width > 0) {
          layout[i].w = r.width;
          layout[i].h = r.height;
        }
      }
    };
    measureChips();
    // Chip width is set by its text, so it changes when the webfont
    // swaps in. Measuring only at mount leaves the declutter working
    // from fallback-font metrics for the life of the page.
    document.fonts?.ready.then(() => {
      if (!disposed) measureChips();
    });

    /* ---- rotation --------------------------------------------- */
    /* Every place this globe plots — India and all six destinations —
       sits between 37E and 116E. A continuous revolution parks that
       whole corridor on the far side for most of its cycle, which is
       how the labels used to vanish for fifteen seconds at a stretch.
       A slow sway keeps the corridor facing the viewer permanently
       while the sphere still visibly turns. Dragging overrides it. */
    const FOCUS_LNG = 74;
    const BASE_YAW = (-FOCUS_LNG * Math.PI) / 180;
    /* POSITIVE pitch brings northern latitudes down toward the middle
       of the disc. Every destination sits between 39N and 56N, so a
       negative tilt — which was the first guess — stacks all six of
       them into the top sliver of the sphere with their labels piled
       on each other and half of them off the top of the section. */
    const BASE_PITCH = 0.4;
    const SWAY = 0.42;
    const SWAY_HZ = 0.026;

    let userYaw = 0;
    let userPitch = 0;
    let yawVel = 0;
    let pitchVel = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    const vt = new VelocityTracker(90);

    const start = performance.now();
    let raf = 0;
    let tick = 0;

    const drawOverlay = (yaw: number, pitch: number, elapsed: number) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.clearRect(0, 0, width, height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      /* A point is visible if it is on the near hemisphere. Arcs are
         allowed a little slack past the limb so they do not snap off
         mid-stroke exactly on the silhouette. */
      const ARC_CULL = -0.1;

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const pts = t.arc.map((p) =>
          // Lift the arc off the surface so it reads as a flight path
          // rather than a line painted on the ground.
          projectLatLng(p.lat, p.lng, yaw, pitch, radius, 1 + Math.sin(p.t * Math.PI) * 0.17),
        );

        // Static track
        ctx.beginPath();
        let open = false;
        for (const p of pts) {
          if (p.z < ARC_CULL) {
            open = false;
            continue;
          }
          if (open) ctx.lineTo(cx + p.x, cy + p.y);
          else {
            ctx.moveTo(cx + p.x, cy + p.y);
            open = true;
          }
        }
        ctx.strokeStyle = P.arc;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Travelling comet head. Each arc runs its own cycle, offset so
        // they never all fire at once.
        const CYCLE = 5.6;
        const phase = reduced ? 0.68 : ((elapsed + i * 0.82) % CYCLE) / CYCLE;
        const head = Math.floor(phase * (pts.length - 1));
        const TRAIL = 10;
        for (let k = 0; k < TRAIL; k++) {
          const j = head - k;
          if (j < 0 || j >= pts.length - 1) continue;
          const a = pts[j];
          const b = pts[j + 1];
          if (a.z < ARC_CULL || b.z < ARC_CULL) continue;
          const fade = 1 - k / TRAIL;
          ctx.beginPath();
          ctx.moveTo(cx + a.x, cy + a.y);
          ctx.lineTo(cx + b.x, cy + b.y);
          ctx.strokeStyle = `rgba(${P.arcHead},${(fade * 0.9).toFixed(3)})`;
          ctx.lineWidth = 2.3 * fade + 0.5;
          ctx.stroke();
        }
      }

      /* ---- destination labels ----
         Anchor, declutter, then draw. The three steps have to be
         separate passes: a label cannot be positioned without knowing
         where the others ended up. */
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const s = projectLatLng(t.lat, t.lng, yaw, pitch, radius);
        const L = layout[i];
        L.sx = cx + s.x;
        L.sy = cy + s.y;
        L.z = s.z;
        L.visible = s.z >= 0;
        if (!L.visible) continue;

        /* The label is pushed radially OUTWARD in screen space, not
           along the surface normal. A normal-space lift collapses to
           nothing for anything near the middle of the disc — where the
           normal points straight at the viewer — and drops the label on
           top of its own marker. Screen-radial always separates them,
           and it spreads a tight cluster automatically, because
           neighbours sit at slightly different bearings from centre. */
        const len = Math.hypot(s.x, s.y);
        const dirX = len > radius * 0.12 ? s.x / len : 0;
        const dirY = len > radius * 0.12 ? s.y / len : -1;
        const push = radius * t.fan;
        L.x = L.sx + dirX * push;
        L.y = L.sy + dirY * push;
      }

      /* Declutter. Ranking the fan by longitude spreads the labels but
         cannot guarantee they clear each other — the spacing that works
         at rest fails as soon as the globe is dragged, and Kyrgyzstan
         and Kazakhstan are two degrees apart, so at some rotations
         nothing keyed on position alone separates them. This resolves
         the boxes against each other directly: overlapping pairs are
         pushed apart along whichever axis needs the least movement,
         nearest label winning the tie. Three passes is enough for six
         labels and costs nothing. */
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < layout.length; i++) {
          const a = layout[i];
          if (!a.visible) continue;
          for (let j = i + 1; j < layout.length; j++) {
            const b = layout[j];
            if (!b.visible) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const ox = (a.w + b.w) / 2 + LABEL_GAP - Math.abs(dx);
            const oy = (a.h + b.h) / 2 + LABEL_GAP - Math.abs(dy);
            if (ox <= 0 || oy <= 0) continue;
            // Share the correction by depth: the label closer to the
            // viewer keeps its position, the one behind gives way.
            const wA = b.z / (a.z + b.z || 1);
            const wB = 1 - wA;
            if (oy < ox) {
              const s = (dy >= 0 ? 1 : -1) * oy;
              a.y -= s * wA;
              b.y += s * wB;
            } else {
              const s = (dx >= 0 ? 1 : -1) * ox;
              a.x -= s * wA;
              b.x += s * wB;
            }
          }
        }
        /* Clamp INSIDE the loop, not after it: a label shoved back into
           bounds can land on a neighbour, and only a further pass will
           notice.

           Vertical bounds are the STAGE, not the viewport. Tying them
           to the viewport would make the labels creep against the globe
           as the page scrolls, which reads as a bug. Horizontally the
           stage's own right edge is not enough, because that edge is
           off-screen by design — so the tighter of the two wins. */
        for (const L of layout) {
          if (!L.visible) continue;
          const hx = L.w / 2 + EDGE_PAD;
          const hy = L.h / 2 + EDGE_PAD;
          const right = Math.min(width, window.innerWidth - stageLeft) - hx;
          L.x = Math.min(Math.max(L.x, hx), Math.max(hx, right));
          L.y = Math.min(Math.max(L.y, hy), Math.max(hy, height - hy));
        }
      }

      for (let i = 0; i < layout.length; i++) {
        const L = layout[i];
        const chip = chipRefs.current[i];
        if (!L.visible) {
          if (chip) chip.style.opacity = "0";
          continue;
        }
        const near = Math.min(1, L.z * 3.2);

        ctx.beginPath();
        ctx.moveTo(L.sx, L.sy);
        ctx.lineTo(L.x, L.y);
        ctx.strokeStyle = P.leader;
        ctx.globalAlpha = near;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;

        const pulse = reduced ? 0.5 : (Math.sin(elapsed * 1.9 + i) + 1) / 2;
        ctx.beginPath();
        ctx.arc(L.sx, L.sy, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = P.marker;
        ctx.globalAlpha = near;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(L.sx, L.sy, 6 + pulse * 7, 0, Math.PI * 2);
        ctx.strokeStyle = P.marker;
        ctx.globalAlpha = near * (0.5 - pulse * 0.34);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (chip) {
          // Written straight to style, never through React state: this
          // runs every frame, and a state update per frame would cost a
          // full reconciliation to move a transform.
          chip.style.transform = `translate(-50%,-50%) translate3d(${L.x.toFixed(1)}px,${L.y.toFixed(1)}px,0)`;
          chip.style.opacity = near.toFixed(3);
          chip.style.zIndex = String(100 + Math.round(L.z * 50));
        }
      }

      /* ---- origin: India ---- */
      const o = projectLatLng(ORIGIN.lat, ORIGIN.lng, yaw, pitch, radius);
      if (o.z > 0) {
        const pulse = reduced ? 0.5 : (Math.sin(elapsed * 2.2) + 1) / 2;
        ctx.globalAlpha = Math.min(1, o.z * 3.2);
        ctx.beginPath();
        ctx.arc(cx + o.x, cy + o.y, 4.4, 0, Math.PI * 2);
        ctx.fillStyle = P.origin;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + o.x, cy + o.y, 8 + pulse * 9, 0, Math.PI * 2);
        ctx.strokeStyle = P.origin;
        ctx.globalAlpha *= 0.55 - pulse * 0.36;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      if (width === 0) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const elapsed = (now - start) / 1000;

      /* The hero slides this whole stage sideways with the pointer and
         down with the scroll, so the offset captured at resize goes
         stale and the right-edge clamp drifts with it. Re-reading the
         rect forces a layout, so it happens on one frame in sixteen —
         four times a second, against a parallax that only travels
         thirty-odd pixels. */
      if ((tick++ & 15) === 0) stageLeft = stage.getBoundingClientRect().left;

      if (!dragging && (yawVel !== 0 || pitchVel !== 0)) {
        // Momentum bleeds off exponentially and folds back into the
        // ambient sway, so releasing continues the gesture rather than
        // stopping it dead.
        const dt = 1 / 60;
        userYaw += yawVel * dt;
        userPitch += pitchVel * dt;
        yawVel *= 0.94;
        pitchVel *= 0.94;
        if (Math.abs(yawVel) < 0.0008) yawVel = 0;
        if (Math.abs(pitchVel) < 0.0008) pitchVel = 0;
      }
      // Past roughly 60 degrees you are looking down at a pole, where
      // an equirectangular texture is all seam and no detail.
      userPitch = Math.max(-1.05 - BASE_PITCH, Math.min(1.05 - BASE_PITCH, userPitch));

      const sway = reduced ? 0 : Math.sin(elapsed * SWAY_HZ * Math.PI * 2) * SWAY;
      const yaw = BASE_YAW + sway + userYaw;
      const pitch = BASE_PITCH + userPitch;

      renderer?.render({ yaw, pitch, time: elapsed });
      drawOverlay(yaw, pitch, elapsed);

      if (!reduced || dragging || yawVel !== 0 || pitchVel !== 0) {
        raf = requestAnimationFrame(frame);
      }
    };

    /* ---- direct manipulation ----------------------------------
       setPointerCapture keeps tracking alive when the pointer leaves
       the element mid-drag. Touch is deliberately allowed to fall
       through to the page: a globe that eats vertical drags on a phone
       traps the reader inside the hero. */
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      // Without this the browser starts a native text selection as the
      // pointer travels off the globe and across the headline, so a
      // spin leaves the hero copy highlighted.
      e.preventDefault();
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      vt.reset();
      vt.add(e.clientX, e.clientY);
      yawVel = 0;
      pitchVel = 0;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = "grabbing";
      if (reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      // 1:1 with the pointer, scaled by radius, so the same swipe turns
      // the globe by the same amount at any size.
      const k = 1 / radius;
      userYaw += (e.clientX - lastX) * k;
      userPitch += (e.clientY - lastY) * k * 0.62;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      vt.add(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.releasePointerCapture(e.pointerId);
      stage.style.cursor = "grab";
      // Dragging is direct manipulation and stays available under
      // reduced motion; the fling that outlives the finger is an
      // animation, and does not.
      if (reduced) return;
      // A flick that ended in a pause is not a flick. Without this a
      // held-still finger still launches, because the tracker's window
      // keeps the stale samples from the start of the drag.
      if (performance.now() - lastT > 120) return;
      const v = vt.velocity();
      const k = 1 / radius;
      // project() answers "where would this flick land"; converting
      // that back to a rate gives the initial decay velocity.
      yawVel = project(v.x) * k * 0.9;
      pitchVel = project(v.y) * k * 0.55;
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.style.cursor = "grab";

    const ro = new ResizeObserver(() => {
      resize();
      // The chip labels are hidden below the `sm` breakpoint, so their
      // boxes genuinely change size across a resize, not just position.
      measureChips();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    });
    ro.observe(stage);

    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      renderer?.dispose();
    };
  }, [paletteKey, reduced]);

  return (
    <div
      ref={stageRef}
      className={cn("relative size-full touch-pan-y select-none", className)}
      role="img"
      aria-label={
        "Interactive globe showing flight paths from India to " +
        COUNTRIES.map((c) => c.name).join(", ") +
        ". Drag to spin."
      }
    >
      {/* Fallback ground: a plain lit disc, shown until the sphere is
          live and kept forever where there is no WebGL. The arcs,
          markers and labels draw over it either way, so the
          composition survives the loss of the Earth itself. */}
      <div
        ref={fallbackRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle at 34% 30%, #17417f 0%, #0b2450 46%, #050f28 100%)",
          boxShadow: "0 0 0 1px rgba(201,162,39,0.45), 0 0 90px rgba(201,162,39,0.16)",
        }}
      />

      {/* The sphere. Starts transparent so the first painted frame is
          the finished Earth, never a bare disc mid-upload. */}
      <canvas
        ref={glRef}
        aria-hidden
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-700"
      />

      <canvas ref={overlayRef} aria-hidden className="absolute inset-0 size-full" />

      {/* Destination labels, pinned by the rAF loop to their real
          coordinates. Real DOM text, not canvas: a screen reader, a
          translator and browser find-in-page all reach it.

          Shown from `lg` only, which is where the hero becomes a
          genuine two-column composition with the globe in its own
          half. Below that the sphere is a full-bleed wash sitting
          BEHIND centred copy, and six opaque badges land straight on
          top of the lead paragraph — six flags with no room for their
          names, obscuring the one thing the reader came for. The
          surface markers and the flight arcs still draw at every size,
          so the journey still reads; only the labels stand down. */}
      {COUNTRIES.map((c, i) => (
        <div
          key={c.slug}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0 hidden will-change-transform lg:block"
          style={{ opacity: 0 }}
        >
          <span
            className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 shadow-[var(--shadow-badge)] backdrop-blur-md"
            style={{ background: "rgba(5,15,34,0.78)", border: `1.5px solid ${c.accent}` }}
          >
            <Flag
              country={c.slug}
              className="h-5 w-[1.875rem] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            />
            <span className="whitespace-nowrap text-[0.8125rem] font-bold tracking-[0.01em] text-white">
              {c.name}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
