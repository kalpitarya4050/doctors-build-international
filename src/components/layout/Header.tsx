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
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn, inrShort } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<"destinations" | "universities" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 12);
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
                <div className="material-chrome overflow-hidden rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-xl)]">
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

/** Grouped by country. A flat list of 23 overflows the viewport and
 *  loses the brochure's own structure; the columns mirror the
 *  priority bands a student is actually choosing between. */
function UniversitiesMega() {
  const groups = COUNTRIES.map((c) => ({
    country: c,
    unis: UNIVERSITIES.filter((u) => u.countrySlug === c.slug),
  })).filter((g) => g.unis.length > 0);

  return (
    <div className="p-7">
      <div className="mb-5 flex items-baseline justify-between">
        <p className="t-eyebrow text-ink-muted">Partner Universities {SITE.admissionYear}</p>
        <Link
          href="/universities"
          className="text-[0.8125rem] font-semibold text-[var(--accent)] hover:underline"
        >
          View all {UNIVERSITIES.length} →
        </Link>
      </div>

      <div className="grid max-h-[min(30rem,65vh)] gap-x-6 gap-y-5 overflow-y-auto md:grid-cols-2 xl:grid-cols-3">
        {groups.map(({ country, unis }) => (
          <div key={country.slug}>
            <Link
              href={`/destinations/${country.slug}`}
              className="mb-2 flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-1.5 transition-colors hover:bg-[var(--bg-sunken)]"
            >
              <Flag country={country.slug} className="h-4 w-6 shrink-0" />
              <span className="text-[0.8125rem] font-bold text-ink">{country.name}</span>
              <span className="text-[0.6875rem] text-ink-muted">
                {unis.length} {unis.length === 1 ? "university" : "universities"}
              </span>
            </Link>
            <ul className="flex flex-col gap-0.5">
              {unis.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/universities/${u.slug}`}
                    className="group block rounded-[var(--radius-sm)] px-3 py-2 transition-colors duration-200 hover:bg-[var(--bg-sunken)]"
                  >
                    <span className="block truncate text-[0.8125rem] font-semibold text-ink transition-colors group-hover:text-[var(--accent)]">
                      {u.shortName}
                    </span>
                    <span className="block truncate text-[0.6875rem] text-ink-muted">
                      {u.city}
                      {u.totalExpenseInr ? ` · ${inrShort(u.totalExpenseInr)}` : ""}
                      {u.fmgePassRate ? ` · ${u.fmgePassRate} FMGE` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
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

              <p className="t-eyebrow mt-8 mb-3 px-3.5 text-ink-muted">Universities</p>
              <ul className="flex flex-col gap-0.5">
                {UNIVERSITIES.map((u) => (
                  <li key={u.slug}>
                    <Link
                      href={`/universities/${u.slug}`}
                      className="flex items-center gap-3 rounded-[var(--radius)] px-3.5 py-2.5 text-[0.875rem] text-ink-secondary hover:bg-[var(--bg-sunken)]"
                    >
                      <Flag country={u.countrySlug} className="h-4 w-6" />
                      <span className="truncate">{u.shortName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
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
