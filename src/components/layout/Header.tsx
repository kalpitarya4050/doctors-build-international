"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { SPRING_UI, SPRING_SHEET, EASE_OUT } from "@/lib/motion";
import { SITE, NAV, whatsappLink, telLink } from "@/lib/site";
import { COUNTRIES } from "@/lib/data/countries";
import { UNIVERSITIES } from "@/lib/data/universities";
import { Logo } from "@/components/ui/Logo";
import { Flag } from "@/components/ui/Flag";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn, inrShort } from "@/lib/utils";

/* Scroll offsets at which the bar compacts, and at which it goes back
   to full height. Two values, not one, and the gap between them has to
   stay wider than the 14px the bar loses when it compacts — see the
   note on the scroll listener below. */
const COMPACT_ENTER = 32;
const COMPACT_EXIT = 8;

export function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<"destinations" | "universities" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* One threshold here used to make the header oscillate at ~10Hz for
     as long as the reader sat near the top of any page.
       Compacting takes the bar from 78px to 64px, and the bar is in
     normal flow above everything else, so the document gets 14px
     shorter. The browser's scroll anchoring answers that by pulling
     scrollY down by the same 14px to hold the content still — which
     is the wrong call here, because the shrink is deliberate chrome,
     not content shifting under the reader. Measured on /: scrollY 14
     -> 1, back over the threshold, bar re-expands, scrollY pushed to
     14 again, forever.
       Two fixes, because either alone is thin. `overflow-anchor: none`
     on the body stops the correction at source (globals.css), and the
     dead band below means that even where that has no effect the
     crossing can only be made deliberately — a 14px nudge can no
     longer reach back across it. */
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled((prev) => (prev ? v > COMPACT_EXIT : v > COMPACT_ENTER));
  });

  // Close everything on navigation. Adjusting state during render on
  // a changed value is React's documented pattern for this — an
  // effect would queue an extra render pass after the new page paints.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMega(null);
    setMobileOpen(false);
  }

  // Lock body scroll behind the mobile sheet
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMega(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMega(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Announcement strip — the one place the tassel red is used.
          Capped with the destination spectrum so the brand's colour
          system is stated in the first 3px of the page, before any
          section has had a chance to. */}
      <div className="relative z-50 overflow-hidden bg-[var(--navy-900)] text-white">
        <div aria-hidden className="color-stripe" />
        <div className="shell-wide flex h-9 items-center justify-between gap-4 text-[0.75rem]">
          <p className="flex items-center gap-2 font-medium tracking-[0.01em]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-[var(--red-600)]" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--red-600)]" />
            </span>
            <span className="hidden sm:inline">
              Admissions Open for {SITE.admissionYear} — limited seats at NMC-approved universities
            </span>
            <span className="sm:hidden">Admissions Open {SITE.admissionYear}</span>
          </p>
          <a
            href={telLink()}
            className="tap hidden min-h-11 items-center gap-1.5 font-semibold text-[var(--gold-300)] transition-colors hover:text-white sm:flex"
          >
            <Phone className="size-3" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Translucent chrome — content scrolls underneath it */}
      <motion.header
        className={cn(
          "sticky top-0 z-40 w-full",
          scrolled ? "material-chrome" : "bg-transparent",
        )}
        animate={{
          boxShadow: scrolled ? "0 1px 0 var(--hairline), var(--shadow-md)" : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={EASE_OUT}
        onMouseLeave={scheduleClose}
      >
        <div className="shell-wide">
          <motion.div
            className="flex items-center justify-between gap-4"
            animate={{ height: scrolled ? 64 : 78 }}
            transition={reduced ? { duration: 0 } : SPRING_UI}
          >
            <Logo compact={scrolled} />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
              {NAV.map((item) => {
                const hasMega = "mega" in item && item.mega;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenMega(hasMega ? (item.mega as "destinations" | "universities") : null);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2",
                        "text-[0.875rem] font-medium tracking-[-0.005em] transition-colors duration-200",
                        isActive(item.href)
                          ? "text-[var(--accent)]"
                          : "text-ink-secondary hover:text-ink",
                      )}
                    >
                      {item.label}
                      {hasMega && (
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-200",
                            openMega === item.mega && "rotate-180",
                          )}
                        />
                      )}
                      {isActive(item.href) && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-[var(--accent-bright)]"
                          transition={SPRING_UI}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:grid" />
              <Button
                href={whatsappLink()}
                external
                variant="gold"
                size="sm"
                className="hidden md:inline-flex"
              >
                Free Counselling
              </Button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="tap grid size-10 place-items-center rounded-full border border-line text-ink lg:hidden"
              >
                <Menu className="size-[18px]" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mega menus — anchored to the bar that triggered them */}
        <AnimatePresence>
          {openMega && (
            <motion.div
              key={openMega}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              // Materialize: blur + scale together, so the surface reads
              // as glass arriving rather than a flat opacity fade.
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
              transition={reduced ? { duration: 0.18 } : SPRING_UI}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="shell-wide pt-2 pb-6">
                {/* Solid, not `material-chrome`. The translucent
                    chrome is right for the bar, which sits over a
                    single hero; it is wrong for a panel carrying two
                    columns of small type, because whatever the page
                    is showing underneath reads straight through the
                    labels — section headings and body copy were
                    legible through both menus. */}
                <div className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-[var(--surface-solid)] shadow-[var(--shadow-xl)]">
                  {openMega === "destinations" ? <DestinationsMega /> : <UniversitiesMega />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isActive={isActive} />
    </>
  );
}

/* ---------------------------------------------------------- */

function DestinationsMega() {
  return (
    <div className="grid gap-8 p-7 lg:grid-cols-[1fr_18rem]">
      <div>
        <p className="t-eyebrow mb-5 text-ink-muted">Study MBBS In</p>
        <ul className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
          {COUNTRIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/destinations/${c.slug}`}
                className="group flex items-center gap-3 rounded-[var(--radius)] p-3 transition-colors duration-200 hover:bg-[var(--bg-sunken)]"
              >
                <Flag country={c.slug} className="h-5 w-[1.875rem]" />
                <span className="min-w-0">
                  <span className="block truncate text-[0.875rem] font-semibold text-ink group-hover:text-[var(--accent)] transition-colors">
                    MBBS in {c.name}
                  </span>
                  <span className="block truncate text-[0.75rem] text-ink-muted">
                    {c.startingFrom} · {c.duration}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-[var(--navy-900)] p-6 text-white">
        <p className="t-eyebrow text-[var(--gold-300)]">Not sure which?</p>
        <p className="mt-3 text-[1.375rem] leading-[1.2] tracking-[-0.018em]">
          Compare all {UNIVERSITIES.length} side by side.
        </p>
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-on-dark-secondary">
          Fees, duration, intake, FMGE pass rates and safety ratings — one table, no sales pitch.
        </p>
        <Button href="/fee-comparison" variant="gold" size="sm" className="mt-5" fullWidth>
          Compare Universities
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
   Partner universities — one country open at a time.

   The previous version printed all six countries and all 19
   universities at once, in three columns, inside a scroll box. It
   was accurate and unreadable: six headings and 19 two-line
   entries is more than a nav menu can carry, the columns broke the
   country grouping across gutters, and any country below the fold
   needed a scroll inside a hover menu — which closes the moment
   the pointer leaves to reach the scrollbar.

   This shows six rows, the same shape as the Destinations menu
   beside it, and expands exactly one. Height is therefore bounded
   by the largest country (Russia, 8) rather than by the total, and
   nothing scrolls.
   ============================================================ */
function UniversitiesMega() {
  const reduced = useReducedMotion();
  const groups = COUNTRIES.map((c) => ({
    country: c,
    unis: UNIVERSITIES.filter((u) => u.countrySlug === c.slug),
  })).filter((g) => g.unis.length > 0);

  // Open on the first country rather than on nothing: an empty panel
  // makes the menu look broken for however long it takes to aim.
  const [open, setOpen] = useState(groups[0]?.country.slug ?? "");

  return (
    <div className="grid gap-8 p-7 lg:grid-cols-[1fr_18rem]">
      <div className="min-w-0">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <p className="t-eyebrow text-ink-muted">Partner Universities {SITE.admissionYear}</p>
          <Link
            href="/universities"
            className="shrink-0 text-[0.8125rem] font-semibold text-[var(--accent)] hover:underline"
          >
            View all {UNIVERSITIES.length} →
          </Link>
        </div>

        <ul className="flex flex-col gap-0.5">
          {groups.map(({ country, unis }) => {
            const isOpen = open === country.slug;
            return (
              <li
                key={country.slug}
                /* onMouseMove, deliberately NOT onMouseEnter.
                 *
                 * Collapsing a country shortens the list, so every row
                 * below it slides up. If the pointer is sitting still
                 * at the moment that happens — which is exactly the
                 * case, the user has just arrived at the row they
                 * aimed for — a different row lands under the cursor
                 * and mouseEnter fires for it. Aiming at Russia
                 * opened Kazakhstan.
                 *
                 * mousemove only fires when the pointer genuinely
                 * moves, so a row arriving underneath a stationary
                 * cursor cannot steal the selection. Re-setting the
                 * same slug is a no-op, so the extra events are free.
                 */
                onMouseMove={() => setOpen(country.slug)}
              >
                <Link
                  href={`/destinations/${country.slug}`}
                  onFocus={() => setOpen(country.slug)}
                  aria-expanded={isOpen}
                  className={cn(
                    "group flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5",
                    "transition-colors duration-200",
                    isOpen ? "bg-[var(--bg-sunken)]" : "hover:bg-[var(--bg-sunken)]",
                  )}
                >
                  <Flag country={country.slug} className="h-5 w-[1.875rem]" />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-[0.875rem] font-semibold transition-colors",
                        isOpen ? "text-[var(--accent)]" : "text-ink group-hover:text-[var(--accent)]",
                      )}
                    >
                      MBBS in {country.name}
                    </span>
                    <span className="block truncate text-[0.75rem] text-ink-muted">
                      {unis.length} {unis.length === 1 ? "university" : "universities"} ·{" "}
                      {country.startingFrom}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-ink-muted transition-transform duration-200",
                      isOpen && "rotate-180 text-[var(--accent)]",
                    )}
                  />
                </Link>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="unis"
                      initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={reduced ? { duration: 0.15 } : { ...EASE_OUT, duration: 0.26 }}
                      // Clipping is what makes it read as a slide
                      // rather than a fade — without it the rows below
                      // are overlapped by content that has not
                      // finished arriving.
                      className="overflow-hidden"
                    >
                      <ul className="grid grid-cols-1 gap-0.5 pt-1 pb-2 pl-3 sm:grid-cols-2">
                        {unis.map((u) => (
                          <li key={u.slug}>
                            <Link
                              href={`/universities/${u.slug}`}
                              className="group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 transition-colors duration-200 hover:bg-[var(--bg-elevated)]"
                            >
                              <UniversityLogo slug={u.slug} shortName={u.shortName} size={30} />
                              <span className="min-w-0">
                                <span className="block truncate text-[0.8125rem] font-semibold text-ink transition-colors group-hover:text-[var(--accent)]">
                                  {u.shortName}
                                </span>
                                <span className="block truncate text-[0.6875rem] text-ink-muted">
                                  {u.city}
                                  {u.totalExpenseInr ? ` · ${inrShort(u.totalExpenseInr)}` : ""}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-[var(--navy-900)] p-6 text-white">
        <p className="t-eyebrow text-[var(--gold-300)]">Every partner</p>
        <p className="mt-3 text-[1.375rem] leading-[1.2] tracking-[-0.018em]">
          {UNIVERSITIES.length} universities, {COUNTRIES.length} countries.
        </p>
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-on-dark-secondary">
          Every one NMC-eligible or WHO-recognized, taught in English, with no IELTS requirement.
        </p>
        <Button href="/universities" variant="gold" size="sm" className="mt-5" fullWidth>
          Browse Universities
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */

function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* A modal task pairs the surface with a dimming scrim */}
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--navy-950)]/45 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={EASE_OUT}
            onClick={onClose}
          />
          {/* Enters from the right, exits to the right — same path */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col bg-[var(--bg-elevated)] shadow-[var(--shadow-xl)] lg:hidden"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={reduced ? { duration: 0.2 } : SPRING_SHEET}
          >
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <Logo compact />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="tap grid size-10 place-items-center rounded-full border border-line text-ink"
              >
                <X className="size-[18px]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-5" aria-label="Mobile">
              <ul className="flex flex-col gap-0.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-[var(--radius)] px-3.5 py-3 text-[0.9375rem] font-semibold transition-colors",
                        isActive(item.href)
                          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "text-ink hover:bg-[var(--bg-sunken)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="t-eyebrow mt-8 mb-3 px-3.5 text-ink-muted">Destinations</p>
              <ul className="flex flex-col gap-0.5">
                {COUNTRIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/destinations/${c.slug}`}
                      className="flex items-center gap-3 rounded-[var(--radius)] px-3.5 py-2.5 text-[0.875rem] text-ink-secondary hover:bg-[var(--bg-sunken)]"
                    >
                      <Flag country={c.slug} className="h-4 w-6" />
                      MBBS in {c.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Grouped under a country heading rather than 19 rows
                  each repeating the same six flags — on a phone that
                  list was the same flag six or eight times running,
                  which reads as noise and tells you nothing. */}
              <p className="t-eyebrow mt-8 mb-3 px-3.5 text-ink-muted">Universities</p>
              {COUNTRIES.map((c) => {
                const unis = UNIVERSITIES.filter((u) => u.countrySlug === c.slug);
                if (!unis.length) return null;
                return (
                  <div key={c.slug} className="mb-4">
                    <p className="mb-1 flex items-center gap-2 px-3.5 text-[0.75rem] font-bold text-ink">
                      <Flag country={c.slug} className="h-3.5 w-5" />
                      {c.name}
                    </p>
                    <ul className="flex flex-col gap-0.5">
                      {unis.map((u) => (
                        <li key={u.slug}>
                          <Link
                            href={`/universities/${u.slug}`}
                            className="flex items-center gap-3 rounded-[var(--radius)] px-3.5 py-2.5 text-[0.875rem] text-ink-secondary hover:bg-[var(--bg-sunken)]"
                          >
                            <UniversityLogo slug={u.slug} shortName={u.shortName} size={26} />
                            <span className="truncate">{u.shortName}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2.5 border-t border-hairline p-5">
              <div className="flex items-center justify-between">
                <span className="t-small">Appearance</span>
                <ThemeToggle />
              </div>
              <Button href={whatsappLink()} external variant="whatsapp" fullWidth>
                Chat on WhatsApp
              </Button>
              <Button href={telLink()} external variant="outline" fullWidth>
                <Phone className="size-4" />
                {SITE.phoneDisplay}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
