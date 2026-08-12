import { buildWhatsAppMessage, type LeadInput } from "./lead";
import { SITE } from "./site";

/* ============================================================
   Lead delivery, client-side.

   The demo is hosted on a static host (GitHub Pages), which runs no
   server code — so there is no API route to post to. That turns out
   to cost almost nothing, because the two channels that matter both
   work from the browser:

     1. WhatsApp  — a wa.me deep link. Always worked client-side.
     2. Sheets    — Apps Script Web Apps accept a cross-origin POST.
                    We send it `no-cors`, so the row is written even
                    though the browser will not let us read the reply.

   Email is the one channel that genuinely needs a server, because it
   needs an API key that must not ship to the browser. When the client
   moves to real hosting, re-mount `postLeadToSheets` and an email call
   inside an app/api route and point the form at it — the shape of the
   payload is unchanged.
   ============================================================ */

/** Set in .env.local / CI as NEXT_PUBLIC_SHEETS_WEBHOOK_URL.
 *  Safe to expose: an Apps Script Web App URL only accepts writes to
 *  the sheet it belongs to, and holds no credential. */
const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL ?? "";

export interface DeliveryResult {
  whatsappUrl: string;
  sheetsAttempted: boolean;
}

/** Fire-and-forget write to the Google Sheet. Never throws, never
 *  blocks the user — a logging failure must not cost us the enquiry. */
export async function postLeadToSheets(lead: Partial<LeadInput>): Promise<boolean> {
  if (!SHEETS_URL) return false;
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        ...lead,
        receivedAt: new Date().toISOString(),
        userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent,
      }),
    });
    return true;
  } catch (err) {
    console.warn("[lead] sheets write failed (enquiry still went to WhatsApp):", err);
    return false;
  }
}

/** Submits a lead through every channel available in the browser and
 *  returns the WhatsApp URL for the caller to open. */
export async function deliverLead(lead: Partial<LeadInput>): Promise<DeliveryResult> {
  const sheetsAttempted = await postLeadToSheets(lead);
  return {
    whatsappUrl: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
      buildWhatsAppMessage(lead),
    )}`,
    sheetsAttempted,
  };
}
