import { PROCESS } from "@/lib/data/content";
import { UNIVERSITIES } from "@/lib/data/universities";
import { COUNTRIES } from "@/lib/data/countries";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Terminal, type ConsoleLine } from "@/components/ui/Terminal";
import { AnimatedArrow, NumberOrb } from "@/components/ui/Bits";
import { OrbField } from "@/components/ui/Decor";

/* ============================================================
   THE ADMISSION CONSOLE.

   The five-step process, rendered as a console that resolves each
   step in turn. It is a diagram — there is no input, nothing runs,
   and every line is the same PROCESS data Process.tsx renders as
   cards. It earns its place by showing the pipeline as a sequence
   of things that either resolved or did not, which is closer to
   how the work actually feels than five equal boxes.
   ============================================================ */

const LINES: ConsoleLine[] = [
  { kind: "cmd", text: "dbi admissions --year 2026-27 --neet qualified" },
  ...PROCESS.map(
    (p): ConsoleLine => ({
      kind: "ok",
      text: p.title,
      meta: p.duration,
    }),
  ),
  {
    kind: "note",
    text: `matched against ${UNIVERSITIES.length} universities across ${COUNTRIES.length} countries`,
  },
  { kind: "ok", text: "Admission letter issued — 6 to 8 weeks from first call" },
];

export function AdmissionConsole() {
  return (
    <section className="section relative isolate overflow-hidden" data-ground="navy" aria-labelledby="console-title">
      <OrbField tone="gold" count={2} intensity={0.28} />

      <div className="shell">
        <SectionHeading
          eyebrow="⚙️ The Pipeline"
          title={
            <>
              Five steps, <em>start to boarding pass</em>.
            </>
          }
          lead="No stage of this is a black box. You can ask where your file is on any given day and get a straight answer."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal direction="up">
            <Terminal lines={LINES} />
          </Reveal>

          <Reveal direction="left" delay={0.12}>
            <ol className="space-y-6">
              {PROCESS.map((p) => (
                <li key={p.step} className="flex gap-4">
                  <NumberOrb n={p.step} tone="gold" />
                  <div className="min-w-0">
                    <p className="t-eyebrow text-[var(--gold-300)]">{p.duration}</p>
                    <p className="t-h4 mt-1 text-on-dark">{p.title}</p>
                    <p className="t-small mt-1.5 !text-on-dark-secondary">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Button href="/apply" variant="gold" size="lg" className="group mt-9 w-full sm:w-auto">
              Start step one
              <AnimatedArrow />
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
