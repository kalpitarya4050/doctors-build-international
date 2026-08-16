/** Session key for the opening sequence.
 *
 *  Lives in its own module with no "use client" directive because
 *  the root layout — a server component — inlines it into the
 *  pre-paint script. Importing a constant from a "use client"
 *  module on the server yields a client reference, not the value,
 *  and it silently serialises as `undefined`. */
export const INTRO_SEEN_KEY = "dbi-intro-seen";

/** Window property holding the timestamp of the pre-paint script.
 *  The curtain animates on a CSS clock that starts at first paint;
 *  React schedules the hand-off to the hero against this same
 *  origin, so a slow hydration shortens the wait instead of
 *  delaying everything behind it. */
export const INTRO_T0 = "__dbiIntroT0";
