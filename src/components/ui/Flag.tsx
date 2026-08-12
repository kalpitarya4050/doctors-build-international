import { cn } from "@/lib/utils";

/* ============================================================
   Country flags as inline SVG.

   Emoji flags (🇬🇪, 🇷🇺, …) do NOT render on Windows — Segoe UI
   Emoji ships no flag glyphs, so the browser falls back to the
   two regional-indicator letters and "🇬🇪 GEOMEDI University"
   displays as "GE GEOMEDI University". Since most Indian students
   and their parents are on Windows, that is the majority case,
   not an edge case.

   These are deliberately simplified — readable at 16–40px, which
   is the only size they are ever used at.
   ============================================================ */

export type FlagCode =
  | "georgia"
  | "russia"
  | "uzbekistan"
  | "kyrgyzstan"
  | "nepal"
  | "china"
  | "kazakhstan";

/** Accepts a country slug or display name, case-insensitive. */
export function toFlagCode(input: string): FlagCode | null {
  const k = input.trim().toLowerCase();
  if (k.includes("georgia")) return "georgia";
  if (k.includes("russia")) return "russia";
  if (k.includes("uzbek")) return "uzbekistan";
  if (k.includes("kyrgyz")) return "kyrgyzstan";
  if (k.includes("nepal")) return "nepal";
  if (k.includes("china")) return "china";
  if (k.includes("kazakh")) return "kazakhstan";
  return null;
}

const LABEL: Record<FlagCode, string> = {
  georgia: "Flag of Georgia",
  russia: "Flag of Russia",
  uzbekistan: "Flag of Uzbekistan",
  kyrgyzstan: "Flag of Kyrgyzstan",
  nepal: "Flag of Nepal",
  china: "Flag of China",
  kazakhstan: "Flag of Kazakhstan",
};

function Shapes({ code }: { code: FlagCode }) {
  switch (code) {
    case "georgia":
      return (
        <>
          <rect width="24" height="16" fill="#fff" />
          <rect x="9.6" width="4.8" height="16" fill="#FF0000" />
          <rect y="5.6" width="24" height="4.8" fill="#FF0000" />
          <g fill="#FF0000">
            <rect x="3.4" y="2.1" width="2.6" height="0.9" />
            <rect x="4.25" y="1.25" width="0.9" height="2.6" />
            <rect x="18" y="2.1" width="2.6" height="0.9" />
            <rect x="18.85" y="1.25" width="0.9" height="2.6" />
            <rect x="3.4" y="13" width="2.6" height="0.9" />
            <rect x="4.25" y="12.15" width="0.9" height="2.6" />
            <rect x="18" y="13" width="2.6" height="0.9" />
            <rect x="18.85" y="12.15" width="0.9" height="2.6" />
          </g>
        </>
      );

    case "russia":
      return (
        <>
          <rect width="24" height="16" fill="#fff" />
          <rect y="5.34" width="24" height="5.33" fill="#0039A6" />
          <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
        </>
      );

    case "uzbekistan":
      return (
        <>
          <rect width="24" height="16" fill="#0099B5" />
          <rect y="5.2" width="24" height="5.6" fill="#fff" />
          <rect y="10.8" width="24" height="5.2" fill="#1EB53A" />
          <rect y="5" width="24" height="0.4" fill="#CE1126" />
          <rect y="10.6" width="24" height="0.4" fill="#CE1126" />
          <circle cx="4.6" cy="2.6" r="1.7" fill="#fff" />
          <circle cx="5.5" cy="2.4" r="1.7" fill="#0099B5" />
          <g fill="#fff">
            <circle cx="8.4" cy="1.5" r="0.32" />
            <circle cx="8.4" cy="3.2" r="0.32" />
            <circle cx="10.1" cy="1.5" r="0.32" />
            <circle cx="10.1" cy="3.2" r="0.32" />
            <circle cx="11.8" cy="3.2" r="0.32" />
          </g>
        </>
      );

    case "kyrgyzstan":
      return (
        <>
          <rect width="24" height="16" fill="#E8112D" />
          <circle cx="12" cy="8" r="3.4" fill="#FFEF00" />
          <circle cx="12" cy="8" r="2.3" fill="#E8112D" />
          <circle cx="12" cy="8" r="1.7" fill="#FFEF00" />
          <g stroke="#FFEF00" strokeWidth="0.5">
            <line x1="12" y1="3.6" x2="12" y2="12.4" />
            <line x1="7.6" y1="8" x2="16.4" y2="8" />
            <line x1="8.9" y1="4.9" x2="15.1" y2="11.1" />
            <line x1="15.1" y1="4.9" x2="8.9" y2="11.1" />
          </g>
        </>
      );

    case "nepal":
      return (
        <>
          {/* The only non-rectangular national flag — a double pennant */}
          <path d="M3 1 L15 6.4 L8.2 6.4 L14.4 12.6 L3 12.6 Z" fill="#DC143C" stroke="#003893" strokeWidth="0.9" strokeLinejoin="round" />
          <circle cx="6.6" cy="9.9" r="1.35" fill="#fff" />
          <path d="M6 3.4 a1.15 1.15 0 1 0 1.5 1.5 a1.5 1.5 0 1 1 -1.5 -1.5 Z" fill="#fff" />
        </>
      );

    case "china":
      return (
        <>
          <rect width="24" height="16" fill="#DE2910" />
          <g fill="#FFDE00">
            <path d="M4.4 2 L5.24 4.6 L3.04 3 H5.76 L3.56 4.6 Z" />
            <circle cx="8.6" cy="1.9" r="0.62" />
            <circle cx="10.1" cy="3.5" r="0.62" />
            <circle cx="10.1" cy="5.7" r="0.62" />
            <circle cx="8.6" cy="7.2" r="0.62" />
          </g>
        </>
      );

    case "kazakhstan":
      return (
        <>
          <rect width="24" height="16" fill="#00AFCA" />
          <circle cx="12.6" cy="7" r="2.5" fill="#FEC50C" />
          <g stroke="#FEC50C" strokeWidth="0.45" strokeLinecap="round">
            <line x1="12.6" y1="3.4" x2="12.6" y2="4.2" />
            <line x1="12.6" y1="9.8" x2="12.6" y2="10.6" />
            <line x1="9" y1="7" x2="9.8" y2="7" />
            <line x1="15.4" y1="7" x2="16.2" y2="7" />
            <line x1="10.2" y1="4.6" x2="10.8" y2="5.2" />
            <line x1="14.4" y1="8.8" x2="15" y2="9.4" />
            <line x1="15" y1="4.6" x2="14.4" y2="5.2" />
            <line x1="10.8" y1="8.8" x2="10.2" y2="9.4" />
          </g>
          <path
            d="M9.4 11.6 q3.2 -1.5 6.4 0 q-3.2 -0.5 -6.4 0 Z"
            fill="#FEC50C"
          />
          <rect x="0" y="0" width="1.9" height="16" fill="#FEC50C" opacity="0.85" />
        </>
      );
  }
}

export function Flag({
  country,
  className,
  rounded = true,
}: {
  /** Country slug or display name — "georgia", "Russia", "MBBS in Nepal". */
  country: string;
  className?: string;
  rounded?: boolean;
}) {
  const code = toFlagCode(country);
  if (!code) return null;

  return (
    <svg
      viewBox="0 0 24 16"
      role="img"
      aria-label={LABEL[code]}
      className={cn(
        "inline-block shrink-0 align-middle",
        rounded && "rounded-[2px]",
        "ring-1 ring-black/10 dark:ring-white/15",
        className,
      )}
    >
      <Shapes code={code} />
    </svg>
  );
}
