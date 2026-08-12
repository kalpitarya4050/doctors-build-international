import { LIFE_GALLERY } from "@/lib/data/media-map";
import { Gallery } from "@/components/ui/Gallery";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function LifeAbroad() {
  return (
    <section className="section relative" aria-labelledby="life-abroad">
      <div className="shell">
        <SectionHeading
          eyebrow="Life As A Student"
          title={
            <>
              Six years is a long time. <span className="gold-text">Know what it looks like.</span>
            </>
          }
          lead="Lectures in English, clinical rotations from year three, an Indian mess on or near every campus, and a community of Indian students already there when you arrive."
        />

        <Reveal direction="up" className="mt-14">
          <Gallery items={[...LIFE_GALLERY]} />
        </Reveal>

        <Reveal direction="up" delay={0.12}>
          <p className="t-small mt-8 text-center">
            Photographs are illustrative of student life abroad.{" "}
            <a href="#counselling" className="font-semibold text-[var(--accent)] hover:underline">
              Ask a counsellor
            </a>{" "}
            for current photographs and video from any specific campus.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <div className="mt-10 flex justify-center">
            <Button href="/universities" variant="outline" size="lg">
              Explore all seven universities
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
