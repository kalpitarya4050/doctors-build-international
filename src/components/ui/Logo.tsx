import Link from "next/link";
import { cn } from "@/lib/utils";

/** The DB monogram, redrawn as vector so it stays crisp at any
 *  size and adapts to light and dark grounds — the source logo is
 *  a JPEG on a hard white background and cannot do either. */
export function LogoMark({ className, id = "dbi" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8851D" />
          <stop offset="38%" stopColor="#E8C766" />
          <stop offset="62%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#F2DDA0" />
        </linearGradient>
        <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14315F" />
          <stop offset="100%" stopColor="#0A1F44" />
        </linearGradient>
      </defs>

      {/* Shield ground */}
      <path
        d="M32 2.5 60 11v22.5C60 47.8 48.2 57.9 32 61.5 15.8 57.9 4 47.8 4 33.5V11L32 2.5Z"
        fill={`url(#${id}-navy)`}
      />
      <path
        d="M32 2.5 60 11v22.5C60 47.8 48.2 57.9 32 61.5 15.8 57.9 4 47.8 4 33.5V11L32 2.5Z"
        stroke={`url(#${id}-gold)`}
        strokeWidth="2.4"
      />

      {/* Graduation cap */}
      <path d="M32 13 46 18.6 32 24.2 18 18.6 32 13Z" fill={`url(#${id}-gold)`} />
      <path
        d="M23 21.2v5.1c0 2.4 4 4.3 9 4.3s9-1.9 9-4.3v-5.1"
        stroke={`url(#${id}-gold)`}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M46 18.6v6.6" stroke={`url(#${id}-gold)`} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="46" cy="26.4" r="1.5" fill={`url(#${id}-gold)`} />

      {/* Caduceus / ECG pulse — the medical mark */}
      <path
        d="M14 42h7l3.2-7.4 4.4 14.6 4-9.4 2.6 5.2H50"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  compact = false,
}: {
  className?: string;
  showWordmark?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Doctors Build International — home"
    >
      <LogoMark className={compact ? "size-9" : "size-11"} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-[family-name:var(--font-playfair)] font-bold tracking-[-0.015em] text-brand",
              compact ? "text-[0.95rem]" : "text-[1.0625rem]",
            )}
          >
            Doctors <span className="gold-text">Build</span>
          </span>
          <span className="t-eyebrow mt-1 text-[0.5rem] text-ink-muted">
            International
          </span>
        </span>
      )}
    </Link>
  );
}
