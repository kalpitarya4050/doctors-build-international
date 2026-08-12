import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export function LegalBody({
  sections,
  updated,
}: {
  sections: { h: string; p: string[] }[];
  updated: string;
}) {
  return (
    <section className="section pt-0">
      <div className="shell max-w-[52rem]">
        <Reveal>
          <p className="t-small border-b border-hairline pb-6">Last updated: {updated}</p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {sections.map((s, i) => (
            <Reveal key={s.h} direction="up" delay={(i % 4) * 0.04}>
              <section>
                <h2 className="t-h3 text-brand">{s.h}</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {s.p.map((para, j) => (
                    <p key={j} className="t-body">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="mt-14 flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-line bg-[var(--bg-sunken)] p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-body">
              Anything here that is not clear? Ask us directly — we will answer plainly.
            </p>
            <Button href="/contact" variant="primary" size="md" className="shrink-0">
              Contact {SITE.shortName}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
