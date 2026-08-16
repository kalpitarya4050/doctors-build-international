import { TRUST_BADGES, ACCREDITORS } from "@/lib/site";
import { Marquee } from "@/components/ui/Marquee";
import { Icon } from "@/components/ui/Icon";

export function TrustBar() {
  return (
    <section
      aria-label="Accreditations and included services"
      className="relative border-y border-hairline bg-[var(--bg-sunken)] py-8"
    >
      {/* Recognition bodies */}
      <Marquee speed={38} className="mb-6">
        {ACCREDITORS.map((a) => (
          <div key={a.code} className="flex shrink-0 items-center gap-3 px-9">
            <span className="t-figure text-[1.5rem] font-bold tracking-[-0.02em] text-brand/85">
              {a.code}
            </span>
            <span className="hidden max-w-[15rem] text-[0.6875rem] leading-tight text-ink-muted sm:block">
              {a.full}
            </span>
            <span aria-hidden className="ml-6 size-1 rounded-full bg-[var(--gold-500)]" />
          </div>
        ))}
      </Marquee>

      {/* Included services, from the portfolio header strip */}
      <Marquee speed={54} reverse>
        {TRUST_BADGES.map((b) => (
          <div
            key={b.label}
            className="mx-2 flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-[var(--bg-elevated)] px-4 py-2"
          >
            <Icon name={b.icon} className="size-4 text-[var(--accent)]" strokeWidth={2} />
            <span className="whitespace-nowrap text-[0.8125rem] font-medium text-ink-secondary">
              {b.label}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
