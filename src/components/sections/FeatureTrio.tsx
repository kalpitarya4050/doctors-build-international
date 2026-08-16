import { SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { CheckList } from "@/components/ui/Bits";
import { DotGrid } from "@/components/ui/Decor";
import { tint, type PastelTint } from "@/lib/utils";

/* ============================================================
   THREE FEATURE CARDS.

   The shape the reference uses for its leadership block, and the
   shape the client's own poster uses for "WHY GEORGIA / WHY
   RUSSIA / WHY CHINA": a gradient icon badge, a short claim, and
   a checkmark list under a rule.

   Content is the three support pillars families actually ask
   about first — recognition, money, and whether their child will
   be alone. Each point below is already stated elsewhere on the
   site; nothing here is a new promise.
   ============================================================ */

const FEATURES: {
  icon: string;
  title: string;
  body: string;
  points: string[];
  tint: PastelTint;
  hue: string;
}[] = [
  {
    icon: "ShieldCheck",
    title: "Recognised where it counts",
    body: "Every university we place into is listed with the bodies that decide whether your degree is worth anything back home.",
    points: [
      "NMC-eligible, checked against the current list",
      "WHO and WDOMS directory listed",
      "ECFMG / FAIMER where the university qualifies",
      "Recognition re-verified before you pay",
    ],
    tint: "mint",
    hue: "var(--dest-georgia)",
  },
  {
    icon: "Wallet",
    title: "Costed to the last rupee",
    body: "The number we give you on day one is the number you pay across six years — or we tell you plainly that we do not hold it yet.",
    points: [
      "Six-year total, not the first instalment",
      "Hostel, food and living costs included",
      "Zero donation, zero capitation, in writing",
      "Education loan documentation assistance",
    ],
    tint: "gold",
    hue: "var(--dest-kyrgyzstan)",
  },
  {
    icon: "HeartHandshake",
    title: "Support that lands with you",
    body: "Between 800 and 2,500 Indian students are already on every campus we place into, and our people are on the ground when you arrive.",
    points: [
      "Airport pickup and hostel allotment",
      "Indian mess and food support",
      "Residence permit and local paperwork",
      "FMGE / NExT preparation from year three",
    ],
    tint: "sky",
    hue: "var(--dest-russia)",
  },
];

export function FeatureTrio() {
  return (
    <section className="section relative isolate" aria-labelledby="trio-title">
      <DotGrid gap={26} opacity={0.7} />

      <div className="shell">
        <SectionHeading
          eyebrow="✨ What You Actually Get"
          title={
            <>
              Three things families ask <em>before anything else</em>.
            </>
          }
          lead="Recognition, cost and what happens after the plane lands. Everything else follows from these."
        />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3" stagger={0.09}>
          {FEATURES.map((f) => (
            <RevealItem key={f.title}>
              {/* Hard offset shadow rather than a blur: these are the
                  printed panels from the client's poster, and a plate
                  behind the card reads closer to ink on paper than a
                  soft drop shadow does. `hover-lift` knows to press
                  the card into its own plate instead of floating. */}
              <article
                className="hard-shadow hover-lift group flex h-full flex-col rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] p-8"
                style={tint(f.tint)}
              >
                {/* Gradient icon badge — the poster's circular
                    pictogram, carried over. */}
                <span
                  aria-hidden
                  className="grid size-14 shrink-0 place-items-center rounded-full text-white shadow-[var(--shadow-md)] transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(140deg, var(--navy-900), ${f.hue} 70%, var(--gold-500))`,
                  }}
                >
                  <Icon name={f.icon} className="size-6" strokeWidth={1.9} />
                </span>

                <h3 className="t-h3 mt-6 text-brand">{f.title}</h3>
                <p className="t-body mt-3 text-ink-secondary">{f.body}</p>

                <div className="mt-6 border-t border-line pt-6">
                  <CheckList items={f.points} tone="green" />
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
