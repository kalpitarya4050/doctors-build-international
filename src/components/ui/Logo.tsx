import Link from "next/link";
import Image from "next/image";
import { withBasePath } from "@/lib/images";
import { cn } from "@/lib/utils";

/* ============================================================
   The brand mark: the gold shield with the doctor inside, cut from
   the client's master lockup (loho.PNG) by
   scripts/extract-logo-mark.mjs.

   This replaced a hand-drawn SVG monogram — a navy shield with a
   graduation cap and an ECG line. That version existed because the
   only artwork on file was a JPEG on a hard white background, which
   could not sit on a dark ground. The extracted emblem carries a
   real alpha channel, so it sits on the white header and the navy
   footer without either being cut for it, and the site now shows the
   client's actual mark rather than an interpretation of it.

   Sized with `fill` + `object-contain` inside a square box, so the
   shield fits to the box height and centres, whatever its aspect.

   The first version passed explicit width/height instead. That
   couples the component to the artwork: when the crown was restored
   the file went from 256x273 to 256x326, the constants did not, and
   next/image reserved the wrong box. `h-full` did not save it either
   — percentage height inside a content-sized grid row is cyclic, so
   it resolved to auto, the width clamped to the box instead, and the
   mark overflowed its own container by 12px. `fill` has no
   dimensions to keep in sync and cannot drift.
   ============================================================ */

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative block shrink-0", className)}>
      <Image
        src={withBasePath("/images/brand/logo-mark.webp")}
        alt=""
        aria-hidden
        fill
        // Largest rendered use is the 128px intro lockup.
        sizes="128px"
        // The header mark is above the fold on every page, and it is
        // the one image whose late arrival is obvious — the wordmark
        // would sit next to a gap.
        priority
        className="object-contain"
      />
    </span>
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
            // The wordmark keeps a serif voice even though the UI is
            // now sans — it is a brand mark, not interface type.
            className={cn(
              "font-accent tracking-[0.01em] text-brand",
              compact ? "text-[1.05rem]" : "text-[1.1875rem]",
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
