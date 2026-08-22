import { UNI_IMAGE, countryImage } from "@/lib/data/media-map";
import { COUNTRIES } from "@/lib/data/countries";
import { UNIVERSITIES } from "@/lib/data/universities";
import { MediaMarquee, type MarqueeTile } from "@/components/ui/MediaMotion";
import { ScrollExpand } from "@/components/ui/ScrollExpand";
import { SpectrumRule } from "@/components/ui/Decor";

/* ============================================================
   Two bands of photography rolling in opposite directions.

   The rows are not a mood board. The top row is the six countries
   we place into, the bottom row is the universities inside them,
   and every tile navigates to the page it depicts — a photograph of
   somewhere a family could send their child is an invitation, and
   an invitation that does not click is a dead end.

   Both rows pause on hover and on focus-within, because a tile you
   cannot catch is a tile you cannot click.

   The pair also widens from inset to full bleed as the section
   crosses the viewport, which is what makes this read as an opening
   rather than a filmstrip.
   ============================================================ */

/** The six destinations, in the order the site lists them. */
const DESTINATIONS: MarqueeTile[] = COUNTRIES.map((c) => ({
  id: countryImage(c.slug),
  caption: `MBBS in ${c.name}`,
  meta: `${c.startingFrom} · ${c.duration}`,
  href: `/destinations/${c.slug}`,
}));

/* Where we hold a genuine photograph of the campus, show it. UNI_IMAGE
   still points NCSA at regional landscape because the university
   page's hero caption reads "photograph of the region, not of the
   campus" — true there, needlessly modest here, where the tile is
   captioned with the university's own name. */
const REAL_CAMPUS: Record<string, string> = {
  "north-caucasian-state-academy": "uni-ncsa-campus",
};

/** Every university, grouped so it follows the destination row's
 *  country order — the two bands scroll at different speeds and in
 *  opposite directions, so they can never line up tile-for-tile, but
 *  reading them together should still feel like one list. */
const CAMPUSES: MarqueeTile[] = COUNTRIES.flatMap((c) =>
  UNIVERSITIES.filter((u) => u.countrySlug === c.slug).map((u) => ({
    id: REAL_CAMPUS[u.slug] ?? UNI_IMAGE[u.slug] ?? countryImage(c.slug),
    caption: u.shortName,
    meta: `${u.city}, ${c.name}`,
    href: `/universities/${u.slug}`,
  })),
);

export function CampusStrip() {
  return (
    <section
      data-ground="linen"
      aria-label="Our destinations and partner universities"
      className="relative overflow-hidden border-y border-hairline py-10 lg:py-14"
    >
      <div className="shell mb-8 flex flex-col items-center gap-3 text-center">
        <span className="t-eyebrow inline-flex items-center gap-3 text-[var(--accent)]">
          <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--gold-500))]" />
          Where Your Degree Happens
          <span aria-hidden className="h-px w-8 bg-[linear-gradient(270deg,transparent,var(--gold-500))]" />
        </span>
        <p className="t-lead max-w-[54ch]">
          {COUNTRIES.length} countries, {UNIVERSITIES.length} universities, and six years that decide
          the rest of your career.
        </p>
      </div>

      <ScrollExpand from={9}>
        <div className="flex flex-col gap-3">
          <MediaMarquee items={DESTINATIONS} label="Study destinations" speed={64} />
          <MediaMarquee
            items={CAMPUSES}
            label="Partner universities"
            speed={78}
            reverse
          />
        </div>
      </ScrollExpand>

      <SpectrumRule className="mt-10 opacity-60" />
    </section>
  );
}
