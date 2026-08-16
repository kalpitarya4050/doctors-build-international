import type { Metadata } from "next";
import { Check, Clock3, ShieldCheck, Phone } from "lucide-react";
import { PROCESS } from "@/lib/data/content";
import { SITE, telLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: `Apply for MBBS Abroad ${SITE.admissionYear} — Free Counselling`,
  description: `Apply for MBBS admission abroad ${SITE.admissionYear}. Two-minute application, free doctor-led counselling, response within two hours. NMC-eligible universities in Georgia, Russia, Kazakhstan, China, Uzbekistan and Kyrgyzstan.`,
  alternates: { canonical: "/apply" },
  robots: { index: true, follow: true },
};

const ASSURANCES = [
  { icon: Clock3, label: "Response within two hours", note: "Every day, including weekends" },
  { icon: ShieldCheck, label: "No obligation whatsoever", note: "Counselling is free and non-binding" },
  { icon: Check, label: "Doctor-led assessment", note: "Honest, including when the answer is no" },
];

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow={`Admissions Open ${SITE.admissionYear}`}
        title="Two minutes now. A decade of difference."
        highlight={["decade"]}
        crumbs={[{ label: "Apply" }]}
        image="graduation"
        lead="Tell us who you are, what you scored and what your family can spend. A doctor-led counsellor will call you back within two hours with two or three genuine options — or an honest explanation of why none of them fit."
      />

      <section className="section pt-0" aria-label="Application form">
        <div className="shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal direction="up">
            <ApplyForm />
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal direction="left" delay={0.06}>
              <div className="material-card rounded-[var(--radius-lg)] p-7">
                <p className="t-eyebrow text-[var(--accent)]">What happens next</p>
                <ol className="mt-5 flex flex-col gap-5">
                  {PROCESS.map((p) => (
                    <li key={p.step} className="flex gap-4">
                      <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon name={p.icon} className="size-4" />
                      </span>
                      <span>
                        <span className="block text-[0.875rem] font-bold text-brand">
                          {p.title}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] font-medium text-[var(--accent)]">
                          {p.duration}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.12}>
              <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-[var(--bg-sunken)] p-7">
                {ASSURANCES.map((a) => (
                  <div key={a.label} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--green-600)]/12 text-[var(--green-600)]">
                      <a.icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-[0.875rem] font-bold text-brand">{a.label}</span>
                      <span className="block text-[0.75rem] text-ink-muted">{a.note}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.18}>
              <a
                href={telLink()}
                className="flex items-center gap-4 rounded-[var(--radius-lg)] bg-[var(--navy-900)] p-6 text-white transition-transform duration-200 active:scale-[0.99]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--gold-500)] text-[var(--navy-950)]">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.75rem] font-semibold tracking-[0.06em] text-white/60 uppercase">
                    Rather just call?
                  </span>
                  <span className="t-num mt-0.5 block text-[1.25rem] font-bold">
                    {SITE.phoneDisplay}
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
