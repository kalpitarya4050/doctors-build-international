# Doctors Build International

Marketing and lead-generation website for **Doctors Build International** — an Indian consultancy placing students into MBBS programmes at NMC-approved medical universities abroad.

*From Dreams to White Coat.*

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build — must pass clean
npm start          # serve the production build
```

## Check it on phones

```bash
npm run audit:mobile          # every route x 4 viewports
```

Reports horizontal overflow (and which element causes it), tap targets
under Apple's 44x44pt minimum, and text below 12px. It emulates a
coarse pointer, so touch-only rules are actually exercised — a plain
headless screenshot does not do this and will mislead you.

```bash
node scripts/shot-mobile.mjs / /apply --out=./shots --w=393 --full
```

True mobile screenshots. `chrome --headless --window-size=390` only
crops a desktop layout; this uses real viewport emulation.

## Show it to someone

```bash
npm run share      # prints a public HTTPS link, no account needed
```

Builds, serves, and opens a Cloudflare tunnel. Send the printed link to the
client — it works on any device while the terminal stays open.

For a permanent URL that survives closing the laptop, and for going live on
`doctorsbuild.com`, see **[DEPLOY.md](DEPLOY.md)**.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind v4, CSS custom properties |
| Motion | Motion (Framer Motion) — Apple spring model |
| Fonts | Playfair Display (display) + Inter (UI) |
| Icons | lucide-react, plus inlined brand marks |

## Structure

```
src/
  app/
    page.tsx                      home — 12 sections
    destinations/[country]/       template → 7 country pages
    universities/[slug]/          template → 7 university pages
    fee-comparison/               the Admission Portfolio, interactive
    about/ services/ why-us/ faq/ contact/ apply/
    privacy-policy/ terms/
    api/lead/route.ts             lead fan-out
    sitemap.ts  robots.ts
  components/
    layout/                       Header, Footer, PageHero, floating CTAs
    sections/                     homepage sections
    ui/                           motion primitives + shared UI
    forms/                        LeadForm, ApplyForm
  lib/
    data/universities.ts          ← SOURCE OF TRUTH for all fee data
    data/countries.ts  content.ts  faq.ts
    motion.ts                     spring constants, projection, rubber-band
    site.ts  lead.ts  utils.ts
```

### Editing content

Everything is data-driven. To change a fee, a pass rate or an intake, edit
`src/lib/data/universities.ts` — every page that shows it updates. Do not
hard-code figures into components.

## Lead capture

Three independent channels. **Each is optional**; the form always works.

1. **WhatsApp** — always on, no configuration. On submit the browser opens
   `wa.me/917746000015` with the enquiry pre-filled.
2. **Google Sheets** — set `SHEETS_WEBHOOK_URL`. See
   [`scripts/google-apps-script.gs`](scripts/google-apps-script.gs) for the
   five-minute setup.
3. **Email** — set `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL`.

Copy `.env.example` to `.env.local` and fill in what you have. A missing key
no-ops silently; it never breaks the form for a student.

The API route validates with zod, carries a honeypot field (accepted silently,
so bots learn nothing), and rate-limits to 5 submissions per minute per IP.

## Design system

Colours, type scale and materials live in `src/app/globals.css`.

- **Light is the default ground.** Dark is redefined twice — under
  `prefers-color-scheme` (guarded so an explicit light choice wins) and under
  `[data-theme="dark"]` — so the toggle wins in both directions.
- **Motion follows Apple's model** (`src/lib/motion.ts`): critically damped
  springs by default (`bounce: 0`), bounce reserved for gestures that carried
  momentum, momentum projection for flick landing, rubber-banding at
  boundaries, and full interruptibility.
- **Accessibility preferences are honoured**: `prefers-reduced-motion`
  (cross-fades, no travel), `prefers-reduced-transparency` (glass becomes
  solid), `prefers-contrast` (stronger borders and text).

## SEO

Per-page metadata, canonical URLs, OG/Twitter cards, `sitemap.xml`,
`robots.txt`, and JSON-LD: `Organization`, `LocalBusiness` ×3 offices,
`WebSite`, `Course` per university, `FAQPage` and `BreadcrumbList`.

Set the live domain in `src/lib/site.ts` (`SITE.url`) before deploying —
canonicals and the sitemap are generated from it.

## Deploy

Vercel: import the repo, no configuration needed. Add the env vars above in
Project Settings if you are using Sheets or email.

Any Node host: `npm run build && npm start`.

## Fee data

All figures come from the client's **Global MBBS Admission Portfolio 2026-27**.

One note carried in `universities.ts`: the printed six-row semester table
reconciles exactly to the stated total for GEOMEDI and University of South Asia.
For Kemerovo, North Caucasian, Ingush and Fergana the printed rows sum to one
annual instalment less than the stated total — a six-year course needs seven
rows once year one is split across two semesters. The **stated total is
authoritative** and is what the site displays as the total; the schedule is
rendered separately as "payment schedule as per official brochure" rather than
as a column claiming to sum to it.
