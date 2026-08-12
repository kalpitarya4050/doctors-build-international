# Hosting

## The demo is live, permanently

**https://lytevoice.github.io/doctors-build-international/**

Hosted on GitHub Pages. It stays up whether or not any machine here is
switched on — nothing runs locally any more. Free, no card, no expiry.

Repo: https://github.com/lytevoice/doctors-build-international

### Updating it

```bash
git add -A
git commit -m "what changed"
git push
```

That's it. A GitHub Actions workflow builds and republishes on every
push to `main` — roughly 60 seconds. Watch it with `gh run watch`.

To rebuild without a code change: **Actions → Deploy to GitHub Pages →
Run workflow**.

---

## How it is built

`npm run build` produces a normal Next.js server build. With
`STATIC_EXPORT=1` it instead emits a folder of plain HTML/CSS/JS to
`out/`, which is what Pages serves. Both modes are kept working, so
moving to real hosting later is a config change, not a rewrite.

Three things the static mode has to handle, all done:

| | |
|---|---|
| **No server code** | The lead form posts to Google Sheets and hands off to WhatsApp directly from the browser (`src/lib/lead-delivery.ts`). |
| **No image optimiser** | `npm run images:compress` caps images at 1600px first — 46MB → 25MB. |
| **Served from a sub-path** | `BASE_PATH` prefixes routes; `NEXT_PUBLIC_BASE_PATH` prefixes image `src` (see below). |

> **The basePath trap.** `next/image` applies `basePath` to its own
> `/_next/image` URLs, but with `unoptimized: true` — which a static
> export requires — it uses `src` verbatim. Every `/images/...` path
> silently 404s. `src/lib/images.ts` prefixes centrally so components
> never need to know. If you ever see alt text instead of photos, this
> is why.

---

## Enquiries

**WhatsApp works right now**, with no configuration — the form opens
`wa.me/917746000015` pre-filled.

To also log every enquiry to a Google Sheet:

1. Deploy [`scripts/google-apps-script.gs`](scripts/google-apps-script.gs)
   as a Web App (*Execute as: Me · Who has access: Anyone*).
2. Copy the `/exec` URL.
3. Repo → **Settings → Secrets and variables → Actions → New secret**
   - Name: `SHEETS_WEBHOOK_URL`
   - Value: that URL
4. Re-run the workflow.

The browser posts `no-cors`, so the row is written even though the
reply can't be read. Email notification is the one channel that needs
a server — it returns when the client moves to real hosting.

---

## When the client buys hosting

The site is a standard Next.js app; nothing here is locked to Pages.

**Any Node host** (cPanel with Node, VPS, Railway, Render):

```bash
npm ci
npm run build     # no STATIC_EXPORT — full server build
npm start         # serves on :3000
```

Then re-mount the lead API: [`docs/api-lead-route.ts.reference`](docs/api-lead-route.ts.reference)
is the original route handler, preserved intact. Drop it back at
`src/app/api/lead/route.ts`, point the forms at `/api/lead`, and set
`RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` to restore email notifications.

**Static hosting** (most cPanel plans, Netlify, Cloudflare Pages):

```bash
STATIC_EXPORT=1 npm run build     # no BASE_PATH when served from a root domain
```

Upload the contents of `out/`.

### Pointing doctorsbuild.com at it

GitHub Pages supports custom domains free, including HTTPS:

1. Repo → **Settings → Pages → Custom domain** → `doctorsbuild.com`
2. At the registrar, add:
   - `A` on `@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
   - `CNAME` on `www` → `lytevoice.github.io`
3. Tick **Enforce HTTPS** once the certificate is issued.

With a custom domain there is no sub-path, so drop `BASE_PATH` and
`NEXT_PUBLIC_BASE_PATH` from the workflow and set
`NEXT_PUBLIC_SITE_URL` to `https://doctorsbuild.com` — canonicals, the
sitemap and JSON-LD all follow it.

---

## Two things worth knowing

**The repo is public.** GitHub Pages is paid-only on private repos.
No credentials are in it — `.env.local` is gitignored and I checked the
committed content for the Pexels key before the first push. But the
source is readable by anyone with the URL.

**`npm run share` still exists** for showing work-in-progress before
committing. It builds, serves, and opens a Cloudflare tunnel. That link
dies when you close the terminal — the Pages URL above does not.
