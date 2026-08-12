"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import { SPRING_UI, EASE_OUT } from "@/lib/motion";
import { INTEREST_OPTIONS, whatsappFromLead } from "@/lib/lead";
import { deliverLead } from "@/lib/lead-delivery";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "About you", hint: "So we know who we are speaking to" },
  { id: 1, label: "Your academics", hint: "So we can shortlist accurately" },
  { id: 2, label: "Your preference", hint: "So we start in the right place" },
] as const;

const BUDGETS = [
  "Under ₹20 lakh (total, 6 years)",
  "₹20 – 25 lakh",
  "₹25 – 30 lakh",
  "Above ₹30 lakh",
  "Not sure yet",
];

const YEARS = ["2026 intake", "2027 intake", "As soon as possible", "Still deciding"];

export function ApplyForm() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  // Direction drives the slide axis, so back always mirrors forward
  // along the same path.
  const [dir, setDir] = useState<1 | -1>(1);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [v, setV] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    neetScore: "",
    neetYear: "",
    twelfthMarks: "",
    interest: "",
    budget: "",
    intakeYear: "",
    message: "",
    website: "",
  });

  const set = (k: keyof typeof v, val: string) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (v.name.trim().length < 2) e.name = "Please enter your full name";
      if (!/^[+\d][\d\s-]{8,17}$/.test(v.phone.trim()))
        e.phone = "Please enter a valid phone number";
      if (v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim()))
        e.email = "Please enter a valid email";
    }
    if (s === 2 && !v.interest) e.interest = "Please choose a destination";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setDir(1);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async () => {
    if (!validateStep(2)) return;
    setState("sending");

    const message = [
      v.message,
      v.neetScore && `NEET ${v.neetYear || ""}: ${v.neetScore}`,
      v.twelfthMarks && `Class 12: ${v.twelfthMarks}`,
      v.budget && `Budget: ${v.budget}`,
      v.intakeYear && `Intake: ${v.intakeYear}`,
    ]
      .filter(Boolean)
      .join(" · ");

    const payload = {
      name: v.name,
      phone: v.phone,
      email: v.email,
      city: v.city,
      neetScore: v.neetScore,
      interest: v.interest,
      message,
      website: v.website,
      source: "apply-page",
    };

    const { whatsappUrl } = await deliverLead(payload);

    setState("done");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (state === "done") {
    return (
      <motion.div
        className="material-card flex flex-col items-center gap-5 rounded-[var(--radius-xl)] p-10 text-center sm:p-14"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_UI}
      >
        <motion.span
          className="grid size-16 place-items-center rounded-full bg-[var(--green-600)] text-white"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_UI, delay: 0.06 }}
        >
          <Check className="size-8" strokeWidth={3} />
        </motion.span>
        <div>
          <h2 className="t-h2 text-brand">Application received.</h2>
          <p className="t-lead mx-auto mt-3 max-w-[48ch]">
            A doctor-led counsellor will call you within two hours to go through your options. We
            have also opened WhatsApp with your details so you can start the conversation now.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Button href={whatsappFromLead({ ...v, source: "apply-page" })} external variant="whatsapp">
            <MessageCircle className="size-4" />
            Open WhatsApp
          </Button>
          <Button href={`tel:${SITE.phone}`} external variant="outline">
            Call {SITE.phoneDisplay}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="material-card overflow-hidden rounded-[var(--radius-xl)]">
      {/* Progress */}
      <div className="border-b border-hairline px-7 py-6 sm:px-9">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <motion.span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold",
                  i <= step
                    ? "bg-[var(--accent-bright)] text-[var(--navy-950)]"
                    : "border border-line-strong text-ink-muted",
                )}
                animate={{ scale: i === step ? 1.06 : 1 }}
                transition={SPRING_UI}
              >
                {i < step ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </motion.span>
              {i < STEPS.length - 1 && (
                <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-[var(--accent-bright)]"
                    animate={{ width: i < step ? "100%" : "0%" }}
                    transition={SPRING_UI}
                  />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <p className="t-h3 text-brand">{STEPS[step].label}</p>
          <p className="t-small mt-1">{STEPS[step].hint}</p>
        </div>
      </div>

      {/* Panels — enter and exit along the same axis */}
      <div className="relative px-7 py-8 sm:px-9">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 36 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -36 }}
            transition={reduced ? { duration: 0.18 } : SPRING_UI}
          >
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" required value={v.name} onChange={(x) => set("name", x)} error={errors.name} placeholder="e.g. Rahul Sharma" autoComplete="name" />
                <Input label="Phone / WhatsApp" required type="tel" value={v.phone} onChange={(x) => set("phone", x)} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" />
                <Input label="Email" type="email" value={v.email} onChange={(x) => set("email", x)} error={errors.email} placeholder="you@example.com" autoComplete="email" />
                <Input label="City" value={v.city} onChange={(x) => set("city", x)} placeholder="e.g. Chandigarh" autoComplete="address-level2" />
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="NEET score" value={v.neetScore} onChange={(x) => set("neetScore", x)} placeholder="e.g. 420" hint="Leave blank if you have not appeared yet" />
                <Select label="NEET year" value={v.neetYear} onChange={(x) => set("neetYear", x)} options={["2026", "2025", "2024", "Not appeared yet"]} placeholder="Select year" />
                <Input label="Class 12 aggregate (PCB)" value={v.twelfthMarks} onChange={(x) => set("twelfthMarks", x)} placeholder="e.g. 78%" />
                <Select label="Preferred intake" value={v.intakeYear} onChange={(x) => set("intakeYear", x)} options={YEARS} placeholder="Select intake" />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <Select label="Interested in" required value={v.interest} onChange={(x) => set("interest", x)} options={INTEREST_OPTIONS as unknown as string[]} placeholder="Choose a destination" error={errors.interest} />
                <Select label="Family budget for the full course" value={v.budget} onChange={(x) => set("budget", x)} options={BUDGETS} placeholder="Select a range" />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[0.8125rem] font-semibold text-ink-secondary">
                    Anything you would like to ask?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={v.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="The more you tell us, the more useful the first call will be."
                    className="w-full resize-y rounded-[var(--radius-sm)] border border-line-strong bg-[var(--bg-elevated)] px-3.5 py-3 text-[0.9375rem] text-ink outline-none placeholder:text-ink-muted/70 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Honeypot */}
        <div aria-hidden className="offscreen">
          <label htmlFor="apply-website">Leave empty</label>
          <input id="apply-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 border-t border-hairline px-7 py-6 sm:px-9">
        {step > 0 ? (
          <Button variant="ghost" size="md" onClick={back} magnetic={false}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : (
          <span className="t-small">Takes under two minutes</span>
        )}

        {step < STEPS.length - 1 ? (
          <Button variant="primary" size="md" onClick={next}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button variant="gold" size="lg" onClick={submit} disabled={state === "sending"}>
            {state === "sending" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Submit application
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */

function Input({
  label,
  value,
  onChange,
  error,
  placeholder,
  hint,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.8125rem] font-semibold text-ink-secondary">
        {label}
        {required && <span className="ml-1 text-[var(--red-600)]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-[var(--radius-sm)] border bg-[var(--bg-elevated)] px-3.5 py-3 text-[0.9375rem] text-ink outline-none placeholder:text-ink-muted/70 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]",
          error ? "border-[var(--red-600)]" : "border-line-strong",
        )}
      />
      <AnimatePresence mode="wait">
        {error ? (
          <motion.span
            key="err"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={EASE_OUT}
            className="text-[0.75rem] font-medium text-[var(--red-600)]"
          >
            {error}
          </motion.span>
        ) : hint ? (
          <span className="text-[0.75rem] text-ink-muted">{hint}</span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.8125rem] font-semibold text-ink-secondary">
        {label}
        {required && <span className="ml-1 text-[var(--red-600)]">*</span>}
      </label>
      <select
        id={id}
        value={value}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-[var(--radius-sm)] border bg-[var(--bg-elevated)] px-3.5 py-3 pr-11 text-[0.9375rem] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7789%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.875rem_center] bg-no-repeat",
          error ? "border-[var(--red-600)]" : "border-line-strong",
          value ? "text-ink" : "text-ink-muted",
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="text-[0.75rem] font-medium text-[var(--red-600)]">
          {error}
        </span>
      )}
    </div>
  );
}
