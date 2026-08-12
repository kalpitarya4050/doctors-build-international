import Link from "next/link";
import { COUNTRIES } from "@/lib/data/countries";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Flag } from "@/components/ui/Flag";
import { SITE, whatsappLink } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="section relative isolate overflow-hidden grain">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[38rem] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gold-500) 22%, transparent), transparent 68%)",
        }}
      />

      <div className="shell flex max-w-3xl flex-col items-center text-center">
        <LogoMark className="size-16" id="nf" />
        <p className="t-eyebrow mt-8 text-[var(--accent)]">Error 404</p>
        <h1 className="t-h1 mt-4 text-brand">
          This page took a <span className="gold-text">different route</span>.
        </h1>
        <p className="t-lead mt-5 max-w-[52ch]">
          The page you were looking for does not exist, or has moved. Here are the places most people
          are heading.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/" variant="gold" size="lg">
            Back to home
          </Button>
          <Button href={whatsappLink()} external variant="whatsapp" size="lg">
            Ask us on WhatsApp
          </Button>
        </div>

        <div className="mt-14 w-full">
          <p className="t-eyebrow mb-5 text-ink-muted">Popular destinations</p>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {COUNTRIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/destinations/${c.slug}`}
                  className="flex items-center gap-2 rounded-full border border-line bg-[var(--bg-elevated)] px-4 py-2.5 text-[0.875rem] font-medium text-ink-secondary transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <Flag country={c.slug} className="h-3.5 w-[1.3125rem]" />
                  MBBS in {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="t-small mt-12">
          Or call us directly on{" "}
          <a href={`tel:${SITE.phone}`} className="font-semibold text-[var(--accent)] hover:underline">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
