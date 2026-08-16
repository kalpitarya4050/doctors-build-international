"use client";

import { forwardRef } from "react";
import { withBasePath } from "@/lib/images";
import { cn } from "@/lib/utils";

/* ============================================================
   THE BRAND SHIELD, BUILT AS A SOLID.

   Not a flat badge with a drop shadow. The shield is assembled
   from stacked layers separated along Z inside a
   `transform-style: preserve-3d` context, so when the parent
   rotates you see the side of the object — the rim edge slides
   against the face, and the back plate reveals itself. That
   self-parallax between layers is what reads as thickness.

   Layer order, back to front:
     -18px  back plate     (the far face, seen when turned)
     -12px  extrusion ring (the "wall" between the two faces)
       0px  face           (the doctor artwork, clipped to shape)
      +6px  gold rim       (the raised bezel catching light)
      +9px  specular       (a moving highlight on the bezel)

   Nine DOM nodes and no dependency, against ~180KB for a real
   mesh. The trade is honest: there is no true per-pixel lighting
   here, only a gradient sheet that moves with rotation.
   ============================================================ */

/* The filenames deliberately avoid a trailing `-<n>w`. .gitignore
   excludes CI-generated responsive variants by that suffix, so the
   first version of this asset was silently never committed and
   404'd in production — which left the shield as bare gold layers
   with no artwork inside it.
   (The ignore glob is not written out here on purpose: it contains
   a star-slash sequence that would close this comment early.) */

/** Traced from the artwork's own gold rim rather than reusing the
 *  LogoMark path — that path is a wider shield (0.95 aspect) than
 *  the photograph (0.78), so stretching it to fit pulled the
 *  background corners back into frame. */
const SHIELD_PATH =
  "M0.5 0.030 L0.945 0.150 L0.945 0.520 C0.945 0.740 0.775 0.900 0.5 0.978 C0.225 0.900 0.055 0.740 0.055 0.520 L0.055 0.150 Z";

const CLIP = "url(#dbi-shield-clip)";

export const Shield3D = forwardRef<HTMLDivElement, { className?: string }>(
  function Shield3D({ className }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative [transform-style:preserve-3d]", className)}
        aria-hidden
      >
        {/* The clip path lives in objectBoundingBox units so one
            definition serves every layer at any size. */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="dbi-shield-clip" clipPathUnits="objectBoundingBox">
              <path d={SHIELD_PATH} />
            </clipPath>
          </defs>
        </svg>

        {/* ---- back plate ---- */}
        <div
          className="absolute inset-0"
          style={{
            transform: "translateZ(-18px)",
            clipPath: CLIP,
            background: "linear-gradient(160deg, #0a1f44, #050f22 70%)",
          }}
        />

        {/* ---- extrusion: stacked slices make the wall read solid
                even though each is flat. Cheaper than a real mesh
                and, at this rotation range, indistinguishable. ---- */}
        {[-15, -12, -9, -6, -3].map((z, i) => (
          <div
            key={z}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${z}px)`,
              clipPath: CLIP,
              background: `linear-gradient(150deg, #6b5416, #2a2109 60%)`,
              opacity: 0.55 + i * 0.09,
            }}
          />
        ))}

        {/* ---- face: the artwork ---- */}
        <div className="absolute inset-0" style={{ transform: "translateZ(0px)", clipPath: CLIP }}>
          {/* Deliberately a bare <img>, not next/image: that wraps the
              element in its own positioned span, which introduces a
              second stacking context and flattens the preserve-3d
              chain this whole component depends on. The rule's real
              concern is bytes, so the srcSet below covers it — the
              shield renders at ~180px on desktop and ~110px on a
              phone, so the 320w file is what most visitors fetch. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/brand/shield-doctor.webp")}
            srcSet={`${withBasePath("/brand/shield-doctor-sm.webp")} 320w, ${withBasePath("/brand/shield-doctor.webp")} 600w`}
            sizes="(max-width: 640px) 120px, 200px"
            alt=""
            className="size-full object-cover"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* ---- gold bezel ---- */}
        <div
          className="absolute inset-0"
          style={{
            transform: "translateZ(6px)",
            clipPath: CLIP,
            background:
              "linear-gradient(140deg, rgba(242,221,160,0.95), rgba(201,162,39,0.5) 22%, transparent 34%, transparent 66%, rgba(168,133,29,0.55) 82%, rgba(242,221,160,0.9))",
            mixBlendMode: "screen",
            opacity: 0.55,
          }}
        />

        {/* ---- specular sweep: the only thing standing in for real
                lighting, so it is worth being a separate layer that
                the parent can slide as it turns. ---- */}
        <div
          data-shield-spec
          className="absolute inset-0"
          style={{
            transform: "translateZ(9px)",
            clipPath: CLIP,
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.34) 46%, rgba(255,255,255,0.06) 56%, transparent 70%)",
            backgroundSize: "260% 100%",
            backgroundPosition: "50% 0",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    );
  },
);
