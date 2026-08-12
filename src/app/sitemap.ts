// Required for `output: export` — these are emitted as static files.
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/data/countries";
import { UNIVERSITIES } from "@/lib/data/universities";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/apply", priority: 0.95, freq: "weekly" },
    { path: "/fee-comparison", priority: 0.95, freq: "weekly" },
    { path: "/universities", priority: 0.9, freq: "weekly" },
    { path: "/destinations", priority: 0.9, freq: "weekly" },
    { path: "/contact", priority: 0.85, freq: "monthly" },
    { path: "/faq", priority: 0.8, freq: "monthly" },
    { path: "/services", priority: 0.75, freq: "monthly" },
    { path: "/why-us", priority: 0.7, freq: "monthly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/privacy-policy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE.url}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...COUNTRIES.map((c) => ({
      url: `${SITE.url}/destinations/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: c.featured ? 0.9 : 0.6,
    })),
    ...UNIVERSITIES.map((u) => ({
      url: `${SITE.url}/universities/${u.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
