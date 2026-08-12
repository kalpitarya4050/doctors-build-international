"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { MessageCircle, Phone, X, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { SPRING_UI, SPRING_SHEET, EASE_OUT } from "@/lib/motion";
import { SITE, whatsappLink, telLink } from "@/lib/site";
import { LeadForm } from "@/components/forms/LeadForm";
import { cn } from "@/lib/utils";

/** Floating WhatsApp button. Appears once the user has scrolled
 *  past the hero, so it never competes with the primary CTA. */
export function WhatsAppFAB() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 520));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group fixed bottom-[5.5rem] right-4 z-40 flex items-center gap-0 overflow-hidden rounded-full bg-[var(--green-500)] pl-0 text-[#062611] shadow-[0_10px_34px_rgba(37,211,102,0.38)] md:bottom-6 md:right-6"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          transition={SPRING_UI}
          whileTap={{ scale: 0.94 }}
        >
          <span className="grid size-14 shrink-0 place-items-center">
            <MessageCircle className="size-6" strokeWidth={2.2} fill="currentColor" />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.875rem] font-bold transition-[max-width,padding] duration-400 ease-out group-hover:max-w-[12rem] group-hover:pr-5">
            Chat with a counsellor
          </span>
          {!reduced && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-[var(--green-500)]"
            />
          )}
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/** Sticky call/apply bar. Mobile only — on desktop the header CTA
 *  is always visible so a second one would be noise. */
export function MobileCTABar() {
  return (
    <div className="material-chrome fixed inset-x-0 bottom-0 z-40 border-t border-line md:hidden">
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
        <a
          href={telLink()}
          className="flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-line-strong text-[0.875rem] font-semibold text-ink active:scale-[0.98]"
        >
          <Phone className="size-4" />
          Call Now
        </a>
        <Link
          href="/apply"
          className="flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[linear-gradient(100deg,var(--gold-600),var(--gold-300)_45%,var(--gold-500))] text-[0.875rem] font-bold text-[var(--navy-950)] active:scale-[0.98]"
        >
          <CalendarCheck className="size-4" />
          Apply Now
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   Lead modal.

   Shown ONCE per session, and only while a student is genuinely
   researching — on a university or destination page, after real
   engagement. It is not an exit-intent trap: the previous version
   re-fired on every pointer exit because the listener was never
   detached, which is exactly the behaviour that makes people
   distrust a site.

   Eligibility, all of which must hold:
     · path is /universities/* or /destinations/*
     · not already shown this session
     · at least MIN_DWELL on the page (so a bounce never triggers it)

   Then whichever comes first:
     · scrolled past 55% of the page — they are reading
     · SLOW_DWELL elapsed — they are lingering
     · exit intent, but only once the dwell minimum has passed
   ============================================================ */

const SEEN_KEY = "dbi-lead-modal-seen";
const MIN_DWELL = 20_000;
const SLOW_DWELL = 75_000;
const SCROLL_TRIGGER = 0.55;

function isResearchPage(path: string): boolean {
  return path.startsWith("/universities/") || path.startsWith("/destinations/");
}

export function LeadModal() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  // Survives client-side navigation; sessionStorage survives reload.
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firedRef.current) return;
    // Only where a student is actually comparing options — never on a
    // page whose whole purpose is already a form.
    if (!isResearchPage(pathname)) return;
    if (sessionStorage.getItem(SEEN_KEY)) return;

    const landedAt = Date.now();
    let disposed = false;

    // Every listener and timer is torn down the instant this runs, so
    // it can fire exactly once and never again.
    const fire = () => {
      if (disposed || firedRef.current) return;
      firedRef.current = true;
      sessionStorage.setItem(SEEN_KEY, "1");
      teardown();
      setOpen(true);
    };

    const onScroll = () => {
      if (Date.now() - landedAt < MIN_DWELL) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= SCROLL_TRIGGER) fire();
    };

    const onLeave = (e: MouseEvent) => {
      // Top edge only — heading for the tabs or the close button.
      if (e.clientY > 4) return;
      if (Date.now() - landedAt < MIN_DWELL) return;
      fire();
    };

    const slow = setTimeout(fire, SLOW_DWELL);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    function teardown() {
      clearTimeout(slow);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    }

    return () => {
      disposed = true;
      teardown();
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <motion.div
            className="absolute inset-0 bg-[var(--navy-950)]/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={EASE_OUT}
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)]",
              "bg-[var(--bg-elevated)] shadow-[var(--shadow-xl)]",
              "max-h-[92dvh] overflow-y-auto",
            )}
            // Materialize on the way in, and dismiss along the same
            // path on the way out.
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
            transition={reduced ? { duration: 0.2 } : SPRING_SHEET}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-line bg-[var(--bg-elevated)]/80 text-ink-muted backdrop-blur hover:text-ink"
            >
              <X className="size-4" />
            </button>

            <div className="bg-[var(--navy-900)] px-7 py-6 text-white">
              <p className="t-eyebrow text-[var(--gold-300)]">
                Admissions Open {SITE.admissionYear}
              </p>
              <h2
                id="lead-modal-title"
                className="mt-2.5 font-[family-name:var(--font-playfair)] text-[1.625rem] leading-[1.15] tracking-[-0.02em]"
              >
                Comparing universities? <span className="gold-text">Let us shortlist for you.</span>
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-white/65">
                Send your NEET score and budget. A doctor-led counsellor will come back with two or
                three genuine matches — and tell you honestly if none of them fit. Free, no
                obligation, and we will only ask once.
              </p>
            </div>

            <LeadForm
              source="exit-intent-modal"
              compact
              className="!border-0 !bg-transparent !shadow-none !backdrop-blur-none"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Thin gold progress line pinned under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[linear-gradient(90deg,var(--gold-600),var(--gold-300),var(--gold-500))]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
