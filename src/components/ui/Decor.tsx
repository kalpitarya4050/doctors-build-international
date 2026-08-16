import { cn } from "@/lib/utils";

/* ============================================================
   Decorative backdrops.

   All of these are aria-hidden, pointer-events-none and sit at a
   negative z-index. They exist to stop a light section from
   reading as a blank sheet — never to carry meaning.

   Server components: none of them need state, so they cost
   nothing at runtime and add no client bundle.
   ============================================================ */

/** Printed-paper dot grid. `fade` masks it to an ellipse so it
 *  does not run hard into the section edges. */
export function DotGrid({
  className,
  fade = true,
  gap = 22,
  opacity = 1,
}: {
  className?: string;
  fade?: boolean;
  gap?: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 dot-grid", fade && "dot-grid-fade", className)}
      style={{ "--dot-gap": `${gap}px`, opacity } as React.CSSProperties}
    />
  );
}

type OrbTone = "gold" | "navy" | "violet" | "spectrum";

const ORB_TONES: Record<OrbTone, [string, string]> = {
  gold: ["var(--gold-500)", "var(--gold-300)"],
  navy: ["var(--navy-500)", "var(--navy-600)"],
  violet: ["var(--violet-500)", "var(--violet-300)"],
  spectrum: ["var(--dest-russia)", "var(--dest-kyrgyzstan)"],
};

/** Drifting radial orbs. Generalises the `Bloom` in Section.tsx —
 *  same idea, but the orbs move, so a long section does not sit
 *  completely still while you read it.
 *
 *  Periods are deliberately co-prime-ish (19s / 23s / 29s) so the
 *  cluster never falls into visible lockstep. */
export function OrbField({
  className,
  tone = "gold",
  count = 3,
  intensity = 0.5,
}: {
  className?: string;
  tone?: OrbTone;
  /** 2 or 3. More than three reads as fog. */
  count?: 2 | 3;
  intensity?: number;
}) {
  const [a, b] = ORB_TONES[tone];

  const orbs = [
    { size: "34rem", top: "-14%", left: "-8%", color: a, dur: "19s", blur: "120px" },
    { size: "28rem", top: "38%", left: "72%", color: b, dur: "23s", blur: "110px" },
    { size: "22rem", top: "76%", left: "18%", color: a, dur: "29s", blur: "100px" },
  ].slice(0, count);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-orb-drift"
          style={
            {
              width: o.size,
              height: o.size,
              top: o.top,
              left: o.left,
              opacity: intensity,
              filter: `blur(${o.blur})`,
              background: `radial-gradient(circle, color-mix(in srgb, ${o.color} 55%, transparent), transparent 68%)`,
              "--orb-duration": o.dur,
              animationDelay: `${i * -4}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** The band that closes every printed piece the client puts out —
 *  a spectrum rule, used as a section divider. */
export function SpectrumRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("color-stripe w-full", className)} />;
}
