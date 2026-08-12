import { STATS } from "@/lib/data/content";
import { Counter } from "@/components/ui/Counter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="section relative" aria-label="Key figures">
      <div className="shell">
        <RevealGroup className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4" stagger={0.09}>
          {STATS.map((s) => (
            <RevealItem key={s.label} className="relative text-center lg:text-left">
              {/* Hairline separator, desktop only */}
              <span
                aria-hidden
                className="absolute -left-3 top-1 hidden h-full w-px bg-[var(--hairline)] lg:block"
              />
              <p className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,5.5vw,3.75rem)] font-bold leading-none tracking-[-0.03em] text-brand">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  decimal={"decimal" in s ? s.decimal : false}
                />
              </p>
              <p className="mt-3 text-[0.9375rem] font-semibold tracking-[-0.005em] text-ink">
                {s.label}
              </p>
              <p className="mt-1 text-[0.8125rem] text-ink-muted">{s.sub}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
