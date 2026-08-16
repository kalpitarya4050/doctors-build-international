"use client";

import { UNIVERSITIES } from "@/lib/data/universities";
import { DragCarousel } from "@/components/ui/DragCarousel";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FeaturedUniversities() {
  return (
    <section className="section relative overflow-hidden" aria-labelledby="universities-title">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Partner Universities"
            title={
              <>
                {UNIVERSITIES.length} universities.{" "}
                <span className="gold-text">Every number</span> we hold.
              </>
            }
            lead="Fees, duration, intake, FMGE pass rates, Indian student numbers and safety ratings — exactly as published in our official brochures, and marked “on request” where a university has not published them. Drag to explore."
            className="max-w-3xl"
          />
          <Reveal direction="up" delay={0.1}>
            <Button href="/universities" variant="outline" size="md">
              View all universities
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed track so cards run to the viewport edge */}
      <div className="mt-14 pl-[max(1.125rem,calc((100vw-80rem)/2+2.5rem))]">
        <DragCarousel
          ariaLabel="Partner universities"
          gap={20}
          itemClassName="w-[19.5rem] sm:w-[21.5rem]"
          className="pr-[max(1.125rem,calc((100vw-80rem)/2+2.5rem))]"
        >
          {UNIVERSITIES.map((u) => (
            <UniversityCard key={u.slug} university={u} showRank className="h-full" />
          ))}
        </DragCarousel>
      </div>
    </section>
  );
}
