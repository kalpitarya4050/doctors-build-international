# Getting the site in front of the client

Three options, in the order you'll probably want them.

> **On Google Apps Script:** it can't host this. Apps Script runs small
> server-side scripts and serves simple HTML — it has no Node runtime, so a
> Next.js app cannot run on it. We *do* use it for one thing: catching lead-form
> submissions into a Google Sheet (`scripts/google-apps-script.gs`). For hosting
> the site itself, use one of the options below.

---

## 1. Right now — a public link in 30 seconds

```bash
npm run share
```

Prints a live HTTPS link, something like:

```
https://reaction-gold-testing-republican.trycloudflare.com
```

Send it to the client. It opens on any phone or laptop, anywhere.

**What it does:** builds the site, serves it locally, and opens a Cloudflare
tunnel in front of it. The `cloudflared` binary downloads once (~50MB) into
`.tools/` and is reused after that.

**Limits — worth knowing before you send it:**

| | |
|---|---|
| Works while | this terminal window stays open and the PC is awake |
| URL changes | every time you restart it |
| Speed | routed through your home internet, so a little slower |
| Good for | "have a look and tell me what to change" |
| Not for | printing on a card, or sending to twenty people over a week |

Press `Ctrl-C` to stop.

---

## 2. Proper demo link — Vercel, ~3 minutes, free

Gives a permanent URL like `doctors-build.vercel.app` that works when your
laptop is closed. This is what you want once the client is happy enough to share
it internally.

```bash
npx vercel login      # opens the browser once
npx vercel            # preview deploy
npx vercel --prod     # production deploy
```

Accept the defaults — it detects Next.js on its own.

**If you use the lead integrations,** add the env vars in the Vercel dashboard
under *Project → Settings → Environment Variables*:

```
PEXELS_API_KEY        (only needed to re-run `npm run images`, not at runtime)
SHEETS_WEBHOOK_URL    (optional)
RESEND_API_KEY        (optional)
LEAD_NOTIFY_EMAIL     (optional)
```

The WhatsApp handoff needs none of these — it works on a fresh deploy.

---

## 3. Live on doctorsbuild.com

Once the client signs off:

1. Deploy to Vercel as above.
2. In Vercel: *Project → Settings → Domains → Add* → `doctorsbuild.com`.
3. Vercel shows the DNS records to add. At the registrar, set:
   - `A` record on `@` → the IP Vercel gives you
   - `CNAME` on `www` → `cname.vercel-dns.com`
4. Wait for DNS to propagate (usually minutes, up to a few hours).

**Before going live**, in [src/lib/site.ts](src/lib/site.ts):

- confirm `SITE.url` is `https://doctorsbuild.com` — canonical URLs, the
  sitemap and all JSON-LD are generated from it
- replace the placeholder `SITE.email` and `SITE.social` handles with the real
  ones

Then submit `https://doctorsbuild.com/sitemap.xml` in Google Search Console.

---

## Any other host

It's a standard Next.js app:

```bash
npm ci
npm run build
npm run start      # serves on :3000
```

Point a reverse proxy at port 3000. Needs Node 20+.
