"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Loader2, MessageCircle, AlertCircle } from "lucide-react";
import { SPRING_UI, EASE_OUT } from "@/lib/motion";
import { INTEREST_OPTIONS, whatsappFromLead, type LeadInput } from "@/lib/lead";
import { deliverLead } from "@/lib/lead-delivery";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<keyof LeadInput, string[]>>;

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  neetScore: "",
  interest: "",
  city: "",
  message: "",
  website: "",
};

export function LeadForm({
  source = "website",
  compact = false,
  defaultInterest,
  className,
  title,
  subtitle,
}: {
  source?: string;
  compact?: boolean;
  defaultInterest?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const reduced = useReducedMotion();
  const [values, setValues] = useState({
    ...EMPTY,
    interest: defaultInterest ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const set = (key: keyof typeof EMPTY, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Inline validation clears as the user fixes it — never wait
    // until submit to tell them what is wrong.
    if (errors[key as keyof LeadInput]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  /** Client-side check so errors surface without a round trip. */
  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) next.name = ["Please enter your full name"];
    if (!/^[+\d][\d\s-]{8,17}$/.test(values.phone.trim()))
      next.phone = ["Please enter a valid phone number"];
    if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
      next.email = ["Please enter a valid email"];
    if (!values.interest) next.interest = ["Please choose a destination"];
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setState("sending");

    const payload = { ...values, source };

    // Logs to the Google Sheet if one is configured, then hands off to
    // WhatsApp. Neither step can fail in a way that loses the enquiry.
    const { whatsappUrl } = await deliverLead(payload);

    setState("done");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (state === "done") {
    return (
      <motion.div
        className={cn(
          "material-card flex flex-col items-center justify-center gap-4 p-10 text-center",
          className,
        )}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_UI}
      >
        <motion.span
          className="grid size-14 place-items-center rounded-full bg-[var(--green-600)] text-white"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_UI, delay: 0.06 }}
        >
          <Check className="size-7" strokeWidth={3} />
        </motion.span>
        <div>
          <h3 className="t-h3 text-brand">Request received.</h3>
          <p className="t-body mt-2 max-w-[42ch]">
            A counsellor will call you within two hours. We have also opened WhatsApp with your
            details so you can start the conversation right away.
          </p>
        </div>
        <Button
          href={whatsappFromLead({ ...values, source })}
          external
          variant="whatsapp"
          size="sm"
        >
          <MessageCircle className="size-4" />
          Open WhatsApp again
        </Button>
        <button
          type="button"
          onClick={() => {
            setValues({ ...EMPTY, interest: defaultInterest ?? "" });
            setState("idle");
          }}
          className="t-small underline hover:text-[var(--accent)]"
        >
          Submit another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("material-card p-6 sm:p-8", className)}
      noValidate
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="t-h3 text-brand">{title}</h3>}
          {subtitle && <p className="t-small mt-2">{subtitle}</p>}
        </div>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field
          label="Full name"
          name="name"
          required
          value={values.name}
          onChange={(v) => set("name", v)}
          error={errors.name?.[0]}
          placeholder="e.g. Rahul Sharma"
          autoComplete="name"
        />
        <Field
          label="Phone / WhatsApp"
          name="phone"
          type="tel"
          required
          value={values.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone?.[0]}
          placeholder="e.g. +91 98765 43210"
          autoComplete="tel"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(v) => set("email", v)}
          error={errors.email?.[0]}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          label="NEET score"
          name="neetScore"
          value={values.neetScore}
          onChange={(v) => set("neetScore", v)}
          placeholder="e.g. 420"
          hint="Optional — helps us shortlist accurately"
        />

        <div className={cn(!compact && "sm:col-span-2")}>
          <SelectField
            label="Interested in"
            name="interest"
            required
            value={values.interest}
            onChange={(v) => set("interest", v)}
            error={errors.interest?.[0]}
            options={INTEREST_OPTIONS as unknown as string[]}
            placeholder="Choose a destination"
          />
        </div>

        {!compact && (
          <div className="sm:col-span-2">
            <Field
              label="Your question"
              name="message"
              value={values.message}
              onChange={(v) => set("message", v)}
              placeholder="Anything specific you would like to ask?"
              textarea
            />
          </div>
        )}
      </div>

      {/* Honeypot — off-screen, never announced, never tabbable */}
      <div aria-hidden className="offscreen">
        <label htmlFor="website">Leave this empty</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <AnimatePresence>
        {formError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={EASE_OUT}
            className="mt-4 flex items-center gap-2 text-[0.8125rem] font-medium text-[var(--red-600)]"
          >
            <AlertCircle className="size-4 shrink-0" />
            {formError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-col gap-3">
        <Button type="submit" variant="gold" size="lg" fullWidth disabled={state === "sending"}>
          {state === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>Get Free Counselling</>
          )}
        </Button>
        <p className="t-small text-center leading-relaxed">
          No obligation. We will call you within two hours, or reach us directly on{" "}
          <a href={`tel:${SITE.phone}`} className="font-semibold text-[var(--accent)] hover:underline">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------- */

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  hint,
  type = "text",
  required,
  textarea,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const base = cn(
    "w-full rounded-[var(--radius-sm)] border bg-[var(--bg-elevated)] px-3.5 py-3",
    "text-[0.9375rem] text-ink placeholder:text-ink-muted/70",
    "transition-colors duration-200 outline-none",
    "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]",
    error ? "border-[var(--red-600)]" : "border-line-strong",
  );

  return (
    /* `min-w-0` is what stops the field overflowing its grid track.
       An <input>/<select> carries an intrinsic min-content width from
       its default `size`, and a grid item's `min-width: auto` refuses
       to shrink below it — so `w-full` alone does not save you.
       Without this the form runs ~14px past the viewport on phones. */
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={name} className="text-[0.8125rem] font-semibold text-ink-secondary">
        {label}
        {required && <span className="ml-1 text-[var(--red-600)]">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          className={cn(base, "resize-y")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          className={base}
        />
      )}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.span
            key="error"
            id={`${name}-error`}
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
          <span id={`${name}-hint`} className="text-[0.75rem] text-ink-muted">
            {hint}
          </span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    /* `min-w-0` is what stops the field overflowing its grid track.
       An <input>/<select> carries an intrinsic min-content width from
       its default `size`, and a grid item's `min-width: auto` refuses
       to shrink below it — so `w-full` alone does not save you.
       Without this the form runs ~14px past the viewport on phones. */
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={name} className="text-[0.8125rem] font-semibold text-ink-secondary">
        {label}
        {required && <span className="ml-1 text-[var(--red-600)]">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full appearance-none rounded-[var(--radius-sm)] border bg-[var(--bg-elevated)] px-3.5 py-3",
          "text-[0.9375rem] text-ink outline-none transition-colors duration-200",
          "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7789%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.875rem_center] bg-no-repeat pr-11",
          error ? "border-[var(--red-600)]" : "border-line-strong",
          !value && "text-ink-muted",
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
        <span id={`${name}-error`} role="alert" className="text-[0.75rem] font-medium text-[var(--red-600)]">
          {error}
        </span>
      )}
    </div>
  );
}
