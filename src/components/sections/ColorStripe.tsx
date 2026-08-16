import { Marquee } from "@/components/ui/Marquee";
import { Icon } from "@/components/ui/Icon";

/* ============================================================
   THE COLOUR STRIPE.

   Every printed piece the client puts out closes with the same
   device: a spectrum rule over a navy bar carrying the service
   list. This is that bar, and it does the same job here — it
   caps the hero and states the offer in five words before the
   page starts arguing for it.
   ============================================================ */

const PROMISES = [
  { label: "Personalized Guidance", icon: "Compass" },
  { label: "End-to-End Admission Support", icon: "Route" },
  { label: "Visa & Travel Assistance", icon: "Plane" },
  { label: "FMGE / NExT Guidance", icon: "GraduationCap" },
  { label: "Zero Donation, Zero Capitation", icon: "ShieldCheck" },
  { label: "24×7 Student Support", icon: "Headphones" },
] as const;

export function ColorStripe() {
  return (
    <section aria-label="What we do" data-ground="navy" className="relative">
      {/* The spectrum rule — one hue per destination. */}
      <div aria-hidden className="color-stripe" />

      <div className="py-3.5">
        <Marquee speed={46} fade pauseOnHover>
          {PROMISES.map((p) => (
            <span
              key={p.label}
              className="mx-6 inline-flex items-center gap-2.5 whitespace-nowrap text-[0.8125rem] font-semibold tracking-[0.04em] text-on-dark-secondary uppercase"
            >
              <Icon name={p.icon} className="size-4 text-[var(--gold-400)]" />
              {p.label}
              <span aria-hidden className="ml-4 text-[var(--gold-500)]">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div aria-hidden className="color-stripe" />
    </section>
  );
}
