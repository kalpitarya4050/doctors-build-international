/* ============================================================
   Destinations.

   Georgia, Russia, Kazakhstan and China are the client's current
   four priority bands, and their copy is taken from the "Top MBBS
   Universities for Indian Students" brochure — highlights and
   "Why <country>?" points are the client's own wording.

   Uzbekistan and Kyrgyzstan are retained from the earlier
   2026-27 portfolio at the client's instruction; they keep their
   verified fee data but sit outside the priority bands.

   NEPAL was removed — the client no longer places students there.
   ============================================================ */

export interface Country {
  slug: string;
  name: string;
  flag: string;
  /** Approximate map coordinates for the hero globe arcs. */
  lat: number;
  lng: number;
  accent: string;
  tagline: string;
  /** Lowest PUBLISHED total for this country, or "On request"
   *  where the current brochure prints no fee table. */
  startingFrom: string;
  feeStatus: "published" | "on-request";
  duration: string;
  intake: string;
  recognition: string[];
  neetRequired: boolean;
  ieltsRequired: boolean;
  order: number;
  featured: boolean;
  /** Brochure priority band. 5 = retained, outside the bands. */
  priority: number;
  /** The band's own strapline, as printed. */
  priorityLabel: string;
  intro: string[];
  /** The brochure's HIGHLIGHTS block, verbatim. */
  brochureHighlights: string[];
  advantages: { title: string; body: string }[];
  livingCost: string;
  climate: string;
  language: string;
  visaNote: string;
}

export const COUNTRIES: Country[] = [
  {
    slug: "georgia",
    name: "Georgia",
    flag: "🇬🇪",
    lat: 41.72,
    lng: 44.78,
    accent: "#1E7A4C",
    tagline: "The Perfect Start for Your Medical Journey",
    startingFrom: "USD 36,150",
    feeStatus: "published",
    duration: "5 + 1 Years",
    intake: "Feb / Sept",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 1,
    featured: true,
    priority: 1,
    priorityLabel: "Best for Easy Adaptation",
    brochureHighlights: [
      "English-medium MBBS, European-style education",
      "Pleasant climate, affordable living",
      "Safer environment, easier adaptation",
      "Modern infrastructure & growing hospital exposure",
      "NMC-compliant universities (where applicable)",
      "One of the most preferred destinations for Indian students",
    ],
    intro: [
      "Georgia sits at the crossroads of Europe and Asia, and its medical universities follow European education standards while charging a fraction of Western European fees. The client places it first for a specific reason: of all the destinations, it is the one Indian students adapt to most easily.",
      "All programmes are taught entirely in English and no IELTS or TOEFL is required. Six universities make up the Georgian lineup — GEOMEDI, Avicenna Batumi, Georgian American (GAU), Georgian National (SEU), East-West and David Tvildiani — five in Tbilisi and one on the Black Sea coast at Batumi.",
      "The practical case is straightforward: a three to four hour flight from India, a pleasant climate, a low cost of living, Indian food widely available, and a straightforward visa with light documentation. GEOMEDI also posts the strongest FMGE outcome in our portfolio, above 65%.",
    ],
    advantages: [
      {
        title: "Easy visa process & low documentation",
        body: "One of the most straightforward student visa routes of any destination we place into, with a short document list and a high approval rate.",
      },
      {
        title: "Low living cost",
        body: "Day-to-day costs sit well below Western Europe, which is a large part of why Georgia has become so heavily preferred by Indian families.",
      },
      {
        title: "Indian food & cultural similarity",
        body: "Tbilisi and Batumi both have established Indian restaurants, grocery supply and a settled Indian student community to arrive into.",
      },
      {
        title: "Closer to India",
        body: "Three to four hours' flying time — the shortest of any European-standard destination, and it matters when families want to visit.",
      },
      {
        title: "High student satisfaction & safety",
        body: "Georgia ranks among the safest countries in the region, and student feedback consistently reflects that.",
      },
      {
        title: "A beautiful country with rich culture",
        body: "Mountains, a Black Sea coast and a food and wine culture that students genuinely enjoy living in for six years.",
      },
    ],
    livingCost: "USD 150 – 200 / month",
    climate: "Moderate — warm summers, mild winters",
    language: "English medium; Georgian and Russian widely spoken",
    visaNote: "Student visa (D3). Processing typically 2 – 4 weeks after admission letter.",
  },
  {
    slug: "russia",
    name: "Russia",
    flag: "🇷🇺",
    lat: 55.75,
    lng: 37.62,
    accent: "#B33636",
    tagline: "Tradition. Quality. Excellence.",
    startingFrom: "₹15.91 Lakh",
    feeStatus: "published",
    duration: "6 Years",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    neetRequired: true,
    ieltsRequired: false,
    order: 2,
    featured: true,
    priority: 2,
    priorityLabel: "Best for Clinical Experience & Value",
    brochureHighlights: [
      "Globally reputed medical education",
      "Extensive clinical exposure & experienced faculty",
      "Research opportunities & strong alumni network",
      "Affordable tuition & living",
      "WHO listed, NMC-recognized universities",
      "Excellent infrastructure & large teaching hospitals",
    ],
    intro: [
      "Russia has been the single largest destination for Indian medical students for over five decades. Its government medical universities are state-funded, state-regulated and charge no donation or capitation fee whatsoever — the published tuition is the entire tuition.",
      "Eight universities make up the Russian lineup: Kazan Federal, Bashkir State (BSMU), Ulyanovsk State, Chuvash State, Kemerovo State, North Caucasian State Medical Academy, Kabardino-Balkarian State and Ingush State. They span the Volga region, Siberia and the northern Caucasus, which gives real choice on climate and cost.",
      "This is the client's value band. Russian medical education is six years including a one-year clinical internship, delivered in English for international students, attached to large state hospital networks that produce the patient volume behind the clinical training.",
    ],
    advantages: [
      {
        title: "Large number of teaching hospitals",
        body: "Substantial state hospital systems attached to each university — this is what produces the patient volume and case variety.",
      },
      {
        title: "High quality education at affordable fees",
        body: "State-regulated tuition with no donation and no capitation at any stage. Ingush State completes at approximately ₹15.91 lakh across six years including living costs.",
      },
      {
        title: "Experienced faculty & practical training",
        body: "Long-established MBBS programmes with faculty used to teaching international cohorts, weighted towards practical training in the later years.",
      },
      {
        title: "Safe & student-friendly environment",
        body: "Secure campuses in cities with established Indian student communities and Indian mess facilities.",
      },
      {
        title: "Great value for money",
        body: "The lowest total six-year cost of any destination in the portfolio sits in this group.",
      },
      {
        title: "Strong global recognition",
        body: "WHO listing and World Directory of Medical Schools entries support licensure pathways well beyond India.",
      },
    ],
    livingCost: "USD 100 – 150 / month",
    climate: "Cold winters; southern and Volga campuses are considerably milder",
    language: "English medium; basic Russian taught in first year",
    visaNote: "Student visa via invitation letter from the Ministry of Education. Typically 3 – 5 weeks.",
  },
  {
    slug: "kazakhstan",
    name: "Kazakhstan",
    flag: "🇰🇿",
    lat: 43.24,
    lng: 76.89,
    accent: "#1D8FBE",
    tagline: "Quality Education. Affordable Future.",
    startingFrom: "On request",
    feeStatus: "on-request",
    duration: "5 + 1 Years",
    intake: "Sept",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 3,
    featured: true,
    priority: 3,
    priorityLabel: "Affordable & Emerging Choice",
    brochureHighlights: [
      "Affordable tuition & living, modern curriculum",
      "NMC eligible universities, comfortable climate",
      "Good clinical exposure, Indian food available",
      "Safe environment, international student friendly, proximity to India",
    ],
    intro: [
      "Kazakhstan is the client's affordable and emerging choice — Central Asia's largest economy, with substantial recent investment in higher education and a medical sector that now attracts Indian students in growing numbers.",
      "Two universities make up the lineup, both in Almaty: Kazakh National Medical University and Kazakh Russian Medical University. Almaty is the country's largest city and commercial centre, set against the Tian Shan mountains.",
      "The practical appeal is economy without distance. Tuition and living costs are modest, the climate is comfortable through much of the year, Indian food is available in the city, and the flight from India is markedly shorter than to Siberia or East Asia.",
    ],
    advantages: [
      {
        title: "Very economical for Indian students",
        body: "Among the most economical routes to a medical degree, on both tuition and day-to-day living.",
      },
      {
        title: "High-quality medical education",
        body: "A modern curriculum with good clinical exposure, backed by substantial state investment in the sector.",
      },
      {
        title: "Recognized by NMC & WHO",
        body: "NMC eligible and WHO recognized — confirm the current status of any specific university before you apply, as we do in writing during counselling.",
      },
      {
        title: "Shorter flight time from India",
        body: "A genuinely short journey, which makes both arrival and family visits considerably easier.",
      },
      {
        title: "Peaceful & student-friendly country",
        body: "A stable country with a reputation for being welcoming to international students — worth weighing across a six-year course.",
      },
      {
        title: "Indian food available",
        body: "Almaty has Indian food supply and a student community used to receiving international arrivals.",
      },
    ],
    livingCost: "On request — confirmed per university",
    climate: "Continental — comfortable summers, cold winters",
    language: "English medium; Kazakh and Russian spoken locally",
    visaNote: "Student visa on invitation letter. Typically 3 – 4 weeks.",
  },
  {
    slug: "china",
    name: "China",
    flag: "🇨🇳",
    lat: 39.9,
    lng: 116.4,
    accent: "#C7332B",
    tagline: "Innovation. Technology. Future.",
    startingFrom: "On request",
    feeStatus: "on-request",
    duration: "6 Years (5 + 1)",
    intake: "September",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 4,
    featured: true,
    priority: 4,
    priorityLabel: "Best for Infrastructure & Technology",
    brochureHighlights: [
      "World-class campuses & advanced simulation labs",
      "Internationally affiliated hospitals",
      "Strong research ecosystem & smart cities",
      "English-medium MBBS & modern infrastructure",
      "Global exposure & high-quality clinical training",
    ],
    intro: [
      "China is the client's infrastructure and technology band. Its medical universities operate at a scale and level of investment few other destinations in this price range can match — advanced simulation laboratories, large internationally affiliated hospitals and a serious research ecosystem.",
      "Five universities make up the lineup: Nanjing Medical, Southern Medical in Guangzhou, Chongqing Medical, Tianjin Medical and Capital Medical in Beijing. Each runs a six-year English-medium MBBS — five academic years plus a one-year internship — with a September intake.",
      "The affiliated hospital networks are the clinical case: 30+ teaching hospitals at Nanjing and Capital Medical, 20+ at the other three. All five sit in major cities with modern transport and direct international connectivity.",
    ],
    advantages: [
      {
        title: "Advanced technology & modern facilities",
        body: "World-class campuses with advanced simulation laboratories — infrastructure on a scale that is genuinely difficult to match elsewhere at this cost.",
      },
      {
        title: "High global ranking universities",
        body: "Several Chinese medical universities appear in international rankings, with the research output and funding that go with that.",
      },
      {
        title: "Great clinical training in top hospitals",
        body: "Internationally affiliated teaching hospitals with very high patient volumes and modern diagnostic technology.",
      },
      {
        title: "Safe environment with global exposure",
        body: "Secure campuses in major smart cities, with international student communities and strong connectivity.",
      },
      {
        title: "Bright future career opportunities",
        body: "A degree from a globally recognised institution, in an environment oriented towards international careers.",
      },
      {
        title: "English-medium MBBS",
        body: "Taught entirely in English, with Mandarin alongside for clinical communication during hospital rotations.",
      },
    ],
    livingCost: "On request — confirmed per university",
    climate: "Varies by city — subtropical in the south, temperate monsoon in the north",
    language: "English medium; Mandarin taught for clinical practice",
    visaNote: "X1 student visa. Requires JW202 form and admission letter.",
  },

  /* ---------- Retained from the 2026-27 portfolio ---------- */
  {
    slug: "uzbekistan",
    name: "Uzbekistan",
    flag: "🇺🇿",
    lat: 41.31,
    lng: 69.24,
    accent: "#0E7C7B",
    tagline: "Central Asia's fastest-rising medical destination.",
    startingFrom: "USD 25,850",
    feeStatus: "published",
    duration: "5 + 1 Years",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    neetRequired: true,
    ieltsRequired: false,
    order: 5,
    featured: true,
    priority: 5,
    priorityLabel: "Retained from our 2026-27 portfolio",
    brochureHighlights: [
      "USD-denominated fees — no local-currency exposure",
      "NMC, WHO and WDOMS recognized",
      "Moderate climate year-round",
      "Culturally close to India",
      "Rapidly modernising medical infrastructure",
    ],
    intro: [
      "Uzbekistan has invested heavily in its medical education infrastructure over the past decade. Fees are denominated in US dollars, which removes the exchange-rate risk that affects programmes priced in volatile local currencies over a six-year horizon.",
      "Fergana Medical Institute of Public Health is recognized by the National Medical Commission of India, approved by the World Health Organization, and listed in the World Directory of Medical Schools. The programme runs five academic years plus a one-year internship, entirely in English.",
      "Of all our destinations, Uzbekistan is among the closest to India culturally. The food, the spices, the hospitality and the moderate climate mean the adjustment period is genuinely shorter than most alternatives.",
    ],
    advantages: [
      {
        title: "USD-denominated fees",
        body: "Your six-year budget is fixed in dollars — no local-currency volatility to plan around.",
      },
      {
        title: "Culturally close to India",
        body: "Uzbek cuisine, climate and hospitality are the most familiar of any Central Asian destination.",
      },
      {
        title: "Triple recognition",
        body: "NMC, WHO and WDOMS recognition covers both the Indian FMGE/NExT route and international licensure.",
      },
      {
        title: "New infrastructure",
        body: "Recent state investment has delivered modern laboratories, simulation centres and teaching hospitals.",
      },
      {
        title: "Moderate climate",
        body: "Warm summers and manageable winters — no Siberian conditions to contend with.",
      },
      {
        title: "Direct connectivity",
        body: "Regular flights to Tashkent from Delhi and Mumbai make travel simple and affordable.",
      },
    ],
    livingCost: "USD 120 – 180 / month",
    climate: "Moderate — continental, warm summers",
    language: "English medium; Uzbek and Russian spoken locally",
    visaNote: "Student visa on invitation. Processing typically 2 – 4 weeks.",
  },
  {
    slug: "kyrgyzstan",
    name: "Kyrgyzstan",
    flag: "🇰🇬",
    lat: 42.87,
    lng: 74.59,
    accent: "#C1512E",
    tagline: "The most affordable path to a medical degree.",
    startingFrom: "USD 20,400",
    feeStatus: "published",
    duration: "5.5 Years",
    intake: "Feb / Sept",
    recognition: ["ECFMG", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 6,
    featured: true,
    priority: 5,
    priorityLabel: "Retained from our 2026-27 portfolio",
    brochureHighlights: [
      "Lowest total published fee in the portfolio",
      "ECFMG approved — supports the USMLE pathway",
      "Shorter 5.5-year programme",
      "Two intakes a year",
      "Large established Indian community in Bishkek",
    ],
    intro: [
      "Kyrgyzstan offers the lowest published cost of any option in our portfolio. The University of South Asia in Bishkek completes at USD 20,400 total — less than a third of most Indian private medical colleges, with no donation at any stage.",
      "The university is approved by the World Health Organization and recognized by the Educational Commission for Foreign Medical Graduates, the body that governs entry to US medical licensure. The programme runs 5.5 years including a one-year internship, taught entirely in English.",
      "Bishkek has hosted Indian medical students for over two decades, which means an established ecosystem of Indian restaurants, grocery stores, student associations and senior support is already in place when you arrive.",
    ],
    advantages: [
      {
        title: "Lowest total fee",
        body: "USD 20,400 for the complete programme — the most accessible medical degree we place students into.",
      },
      {
        title: "ECFMG recognition",
        body: "Keeps the USMLE and US residency pathway open alongside the Indian FMGE/NExT route.",
      },
      {
        title: "Shorter programme",
        body: "5.5 years rather than 6 — you graduate half a year earlier than the Russian route.",
      },
      {
        title: "Two intakes a year",
        body: "February and September admissions mean you are never waiting a full year for the next cycle.",
      },
      {
        title: "Established Indian community",
        body: "Twenty years of Indian students in Bishkek: food, community and senior guidance are all readily available.",
      },
      {
        title: "Very low living costs",
        body: "USD 100 – 150 a month covers accommodation and food comfortably.",
      },
    ],
    livingCost: "USD 100 – 150 / month",
    climate: "Cold winters, pleasant summers",
    language: "English medium; Kyrgyz and Russian spoken locally",
    visaNote: "Student visa, straightforward process. Typically 2 – 3 weeks.",
  },
];

export const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug);

export function getCountry(slug: string): Country | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export const FEATURED_COUNTRIES = COUNTRIES.filter((c) => c.featured);

/** The four brochure priority bands, in order. */
export const PRIORITY_COUNTRIES = COUNTRIES.filter((c) => c.priority <= 4).sort(
  (a, b) => a.priority - b.priority,
);

/** Origin point for the hero globe's flight arcs. */
export const ORIGIN = { name: "India", lat: 20.59, lng: 78.96 };
