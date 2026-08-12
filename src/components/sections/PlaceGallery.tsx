import type { GalleryTile } from "@/lib/data/media-map";
import { Gallery } from "@/components/ui/Gallery";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/** Location-specific gallery for a university or destination page.
 *  Falls back to nothing when a place has no photography yet, so a
 *  new country can be added to the data without breaking its page. */
export function PlaceGallery({
  items,
  eyebrow,
  title,
  lead,
  note,
  tone = "default",
}: {
  items: GalleryTile[];
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  note?: string;
  tone?: "default" | "sunken";
}) {
  if (items.length === 0) return null;

  return (
    <section
      className={`section relative ${tone === "sunken" ? "bg-[var(--bg-sunken)]" : ""}`}
      aria-labelledby="place-gallery"
    >
      <div className="shell">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />

        <Reveal direction="up" className="mt-14">
          <Gallery items={items} />
        </Reveal>

        {note && (
          <Reveal direction="up" delay={0.12}>
            <p className="t-small mt-8 text-center">{note}</p>
          </Reveal>
        )}

        <Reveal direction="up" delay={0.16}>
          <div className="mt-10 flex justify-center">
            <Button href="#counselling" variant="outline" size="lg">
              Ask for campus photos & video
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
