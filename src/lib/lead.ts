import { z } from "zod";
import { SITE } from "./site";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .max(18)
    .regex(/^[+\d][\d\s-]{8,17}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").max(120).or(z.literal("")),
  neetScore: z.string().trim().max(6).optional().or(z.literal("")),
  interest: z.string().trim().min(1, "Please choose a destination").max(80),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  /** Honeypot — must stay empty. Bots fill it, humans never see it.
   *  Deliberately NOT constrained here: a schema rejection would
   *  return a 400 and tell the bot exactly which field caught it.
   *  The route accepts the submission and silently discards it. */
  website: z.string().max(400).optional().or(z.literal("")),
  source: z.string().max(120).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Build the pre-filled WhatsApp message. This is the path that
 *  works with zero configuration, so it is always available
 *  regardless of whether the Sheets/email env vars are set. */
export function buildWhatsAppMessage(lead: Partial<LeadInput>): string {
  const lines = [
    `Hi ${SITE.name},`,
    "",
    "I would like free counselling for MBBS abroad.",
    "",
    `Name: ${lead.name ?? "-"}`,
    `Phone: ${lead.phone ?? "-"}`,
  ];
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.city) lines.push(`City: ${lead.city}`);
  if (lead.neetScore) lines.push(`NEET Score: ${lead.neetScore}`);
  lines.push(`Interested in: ${lead.interest ?? "-"}`);
  if (lead.message) lines.push("", `Message: ${lead.message}`);
  lines.push("", `(Sent from ${SITE.domain})`);
  return lines.join("\n");
}

export function whatsappFromLead(lead: Partial<LeadInput>): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(buildWhatsAppMessage(lead))}`;
}

/** Destination options for the interest dropdown. */
export const INTEREST_OPTIONS = [
  "MBBS in Georgia",
  "MBBS in Russia",
  "MBBS in Uzbekistan",
  "MBBS in Kyrgyzstan",
  "MBBS in Nepal",
  "MBBS in China",
  "MBBS in Kazakhstan",
  "Not sure — please advise me",
] as const;
