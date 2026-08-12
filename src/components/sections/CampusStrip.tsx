import { MARQUEE_TOP, MARQUEE_BOTTOM, MARQUEE_CAPTIONS } from "@/lib/data/media-map";
import { MediaMarquee } from "@/components/ui/MediaMotion";

/** Two bands of photography rolling in opposite directions. Pauses on
 *  hover, and holds still entirely under prefers-reduced-motion. */
export function CampusStrip() {
  return (
    <section
      aria-label="Photographs of our destinations and campus life"
      className="relative overflow-hidden border-y border-hairline bg-[var(--bg-sunken)] py-10 lg:py-14"
    >
      <div className="shell mb-8 flex flex-col items-center gap-3 text-center">
        <span className="t-eyebrow inline-flex items-center gap-3 text-[var(--accent)]">
          <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--gold-500))]" />
          Where Your Degree Happens
          <span aria-hidden className="h-px w-8 bg-[linear-gradient(270deg,transparent,var(--gold-500))]" />
        </span>
        <p className="t-lead max-w-[54ch]">
          Seven countries, seven universities, and six years that decide the rest of your career.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <MediaMarquee ids={MARQUEE_TOP} captions={MARQUEE_CAPTIONS} speed={64} />
        <MediaMarquee ids={MARQUEE_BOTTOM} captions={MARQUEE_CAPTIONS} speed={78} reverse />
      </div>
    </section>
  );
}
