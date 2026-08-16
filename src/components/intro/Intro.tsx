"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";
import { INTRO_SEEN_KEY, INTRO_T0 } from "./keys";

/* ============================================================
   THE OPENING SEQUENCE.

   A navy panel fills the viewport with the mark centred in gold,
   holds for a beat, then slides straight up and off — taking the
   mark with it — while the hero begins underneath. Roughly the
   shape of the reference: hold, wipe up, hand over mid-wipe.

   Three constraints shaped the implementation:

   1. It must be in the FIRST painted frame, and it must move on
      its own clock. Both the panel and the lockup are animated in
      CSS (see #intro-curtain in globals.css), so the sequence
      starts at first paint rather than at hydration. An earlier
      version drove it with the motion library and, on a cold load,
      the panel sat still for nearly four seconds waiting for JS.

   2. It must not re-play on every navigation. Session-scoped, same
      pattern as the lead modal's "dbi-lead-modal-seen".

   3. The hero must not animate behind it. The hero holds at
      `initial` and is released by `ready`. Because the panel is on
      a CSS clock that started at first paint, `ready` is scheduled
      against that same origin — so if hydration was slow, the hero
      is released immediately rather than a second after the panel
      has already gone.
   ============================================================ */

/** Panel is clear of the viewport (matches the CSS animation). */
const CURTAIN_MS = 1600;
/** Hero is released mid-wipe, so the two overlap. */
const RELEASE_MS = 1150;

type IntroValue = {
  /** True once the hero is clear to animate in. */
  ready: boolean;
};

const IntroContext = createContext<IntroValue>({ ready: true });

/** Read by the hero (and anything else that must wait for the
 *  curtain). Returns `{ ready: true }` outside a provider, so a
 *  component used on an inner page animates normally. */
export function useIntro() {
  return useContext(IntroContext);
}

/** SSR and the first client render must agree, so both assume the
 *  curtain plays. `useLayoutEffect` corrects it before paint on the
 *  runs where it should not — repeat visits, reduced motion, and
 *  every route that is not the homepage. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Milliseconds since the pre-paint script ran, i.e. how far into
 *  the CSS timeline we already are by the time React wakes up. */
function elapsed(): number {
  const t0 = (window as unknown as Record<string, number | undefined>)[INTRO_T0];
  return typeof t0 === "number" ? Date.now() - t0 : 0;
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";

  const [playing, setPlaying] = useState(isHome);
  const [ready, setReady] = useState(!isHome);

  useIsoLayoutEffect(() => {
    if (!isHome) {
      setPlaying(false);
      setReady(true);
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      /* Private mode / storage disabled — treat as unseen. The
         curtain is decorative, so failing open is correct. */
    }

    if (seen || reduced) {
      setPlaying(false);
      setReady(true);
      return;
    }

    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }

    // Scheduled against first paint, not against mount.
    const since = elapsed();
    const timers = [
      setTimeout(() => setReady(true), Math.max(0, RELEASE_MS - since)),
      setTimeout(() => setPlaying(false), Math.max(0, CURTAIN_MS - since) + 60),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isHome, reduced]);

  return (
    <IntroContext.Provider value={{ ready }}>
      {playing && <Curtain />}
      {children}
    </IntroContext.Provider>
  );
}

function Curtain() {
  return (
    <div id="intro-curtain" aria-hidden>
      {/* A faint gold bloom behind the mark, so the panel is not a
          dead flat rectangle for the second it is on screen. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(201,162,39,0.4), transparent 68%)" }}
      />

      <div className="intro-lockup relative flex flex-col items-center gap-5">
        <LogoMark id="intro" tone="onNavy" className="size-24 sm:size-32" />

        <div className="text-center">
          <p className="font-accent text-[2.5rem] leading-none tracking-tight text-white sm:text-[3.5rem]">
            Doctors <span className="gold-text">Build</span>
          </p>
          <p className="t-eyebrow mt-2.5 text-[0.625rem] text-[var(--gold-300)] sm:text-[0.75rem]">
            International
          </p>
        </div>

        <div className="intro-rule gold-rule w-52 origin-center sm:w-72" />

        <p className="intro-tagline t-micro tracking-[0.24em] text-[var(--on-dark-secondary)]">
          FROM DREAMS TO WHITE COAT
        </p>
      </div>
    </div>
  );
}
