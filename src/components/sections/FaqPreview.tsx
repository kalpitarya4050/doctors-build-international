import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURED_FAQS } from "@/lib/data/faq";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function FaqPreview() {
  return (
    <section className="section relative bg-[var(--bg-sunken)]" aria-labelledby="faq-title">
      <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Questions & Answers"
            title={
              <>
                The questions parents <span className="gold-text">actually</span> ask.
              </>
            }
            lead="Straight answers on NEET, FMGE, total cost, safety and recognition — including the ones other consultancies avoid."
          />
          <Reveal direction="up" delay={0.12}>
            <Link
              href="/faq"
              className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[var(--accent)] hover:underline"
            >
              Read all 30 questions
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.08}>
          <Accordion
            items={FEATURED_FAQS.map((f) => ({ q: f.q, a: f.a }))}
            defaultOpen={0}
          />
        </Reveal>
      </div>
    </section>
  );
}
