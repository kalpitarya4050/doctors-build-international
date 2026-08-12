export interface Country {
  slug: string;
  name: string;
  flag: string;
  /** Approximate map coordinates for the hero globe arcs. */
  lat: number;
  lng: number;
  accent: string;
  tagline: string;
  startingFrom: string;
  duration: string;
  intake: string;
  recognition: string[];
  neetRequired: boolean;
  ieltsRequired: boolean;
  order: number;
  featured: boolean;
  intro: string[];
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
    tagline: "European standards. Asian affordability.",
    startingFrom: "USD 36,150",
    duration: "5 + 1 Years",
    intake: "Feb / Sept",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 1,
    featured: true,
    intro: [
      "Georgia sits at the crossroads of Europe and Asia, and its medical universities follow European education standards while charging a fraction of Western European fees. For Indian students, it has become one of the most reliable routes to a recognized medical degree.",
      "All programmes are taught entirely in English, no IELTS or TOEFL is required, and Georgian medical degrees are recognized by the National Medical Commission of India and the World Health Organization — meaning graduates are eligible to sit FMGE and NExT and practise in India.",
      "Georgia consistently produces the strongest FMGE outcomes in our portfolio. GEOMEDI University alone posts a pass rate above 65%, well ahead of the national average for Indian students studying abroad.",
    ],
    advantages: [
      {
        title: "Highest FMGE success rate",
        body: "Georgian universities in our portfolio return 65%+ FMGE pass rates — the strongest of any destination we place into.",
      },
      {
        title: "European curriculum",
        body: "Georgia is part of the Bologna Process, so the degree structure and credit system align with European higher education.",
      },
      {
        title: "No entrance exam beyond NEET",
        body: "A qualifying NEET score is all that is required. No IELTS, no TOEFL, no university entrance test.",
      },
      {
        title: "Safe and welcoming",
        body: "Georgia ranks among the safest countries in the region, with a large and well-settled Indian student community in Tbilisi.",
      },
      {
        title: "Simple visa process",
        body: "A straightforward student visa with a high approval rate and a short processing window.",
      },
      {
        title: "Gateway to Europe",
        body: "Georgian degrees open pathways to postgraduate training across Europe as well as back home in India.",
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
    tagline: "Government universities. Seventy years of Indian graduates.",
    startingFrom: "₹15.91 Lakh",
    duration: "6 Years",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    neetRequired: true,
    ieltsRequired: false,
    order: 2,
    featured: true,
    intro: [
      "Russia has been the single largest destination for Indian medical students for over five decades. Its government medical universities are state-funded, state-regulated and charge no donation or capitation fee whatsoever — the published tuition is the entire tuition.",
      "Doctors Build International places students into three Russian government universities: Kemerovo State Medical University, North Caucasian State Medical Academy and Ingush State University. All three are recognized by the National Medical Commission of India and approved by the World Health Organization.",
      "Russian medical education is six years including a one-year clinical internship, delivered in English for international students. Combined with living costs of USD 100 – 150 a month, Russia remains the most cost-effective route to a globally recognized MBBS.",
    ],
    advantages: [
      {
        title: "Zero donation, zero capitation",
        body: "Government universities charge only regulated tuition. There is no under-the-table payment at any stage.",
      },
      {
        title: "Lowest total cost",
        body: "Ingush State University completes at approximately ₹15.91 lakh for the full six years including living expenses.",
      },
      {
        title: "Largest Indian community",
        body: "Thousands of Indian students across Russian campuses, with established Indian mess facilities and senior networks.",
      },
      {
        title: "Strong clinical exposure",
        body: "Large state hospital networks give students high patient volume and broad case variety during rotations.",
      },
      {
        title: "Seventy years of precedent",
        body: "Indian doctors have graduated from Russian universities since the 1950s — this is a proven, well-trodden pathway.",
      },
      {
        title: "WDOMS listed",
        body: "Listing in the World Directory of Medical Schools supports licensure applications well beyond India.",
      },
    ],
    livingCost: "USD 100 – 150 / month",
    climate: "Cold winters; southern campuses are considerably milder",
    language: "English medium; basic Russian taught in first year",
    visaNote: "Student visa via invitation letter from the Ministry of Education. Typically 3 – 5 weeks.",
  },
  {
    slug: "uzbekistan",
    name: "Uzbekistan",
    flag: "🇺🇿",
    lat: 41.31,
    lng: 69.24,
    accent: "#0E7C7B",
    tagline: "Central Asia's fastest-rising medical destination.",
    startingFrom: "USD 25,850",
    duration: "5 + 1 Years",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    neetRequired: true,
    ieltsRequired: false,
    order: 3,
    featured: true,
    intro: [
      "Uzbekistan has invested heavily in its medical education infrastructure over the past decade, and its universities now attract Indian students in growing numbers. Fees are denominated in US dollars, which removes the exchange-rate risk that affects programmes priced in volatile local currencies.",
      "Fergana Medical Institute of Public Health is recognized by the National Medical Commission of India, approved by the World Health Organization, and listed in the World Directory of Medical Schools. The programme runs five academic years plus a one-year internship, entirely in English.",
      "Of all our destinations, Uzbekistan is the closest to India culturally. The food, the spices, the hospitality and the moderate climate mean the adjustment period is genuinely shorter than anywhere else outside Nepal.",
    ],
    advantages: [
      {
        title: "USD-denominated fees",
        body: "Your six-year budget is fixed in dollars — no rouble volatility to plan around.",
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
    duration: "5.5 Years",
    intake: "Feb / Sept",
    recognition: ["ECFMG", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 4,
    featured: true,
    intro: [
      "Kyrgyzstan offers the lowest-cost route to a recognized medical degree in our entire portfolio. The University of South Asia in Bishkek completes at USD 20,400 total — less than a third of most Indian private medical colleges, with no donation at any stage.",
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
  {
    slug: "nepal",
    name: "Nepal",
    flag: "🇳🇵",
    lat: 27.72,
    lng: 85.32,
    accent: "#8C3A5E",
    tagline: "No visa. No language barrier. No culture shock.",
    startingFrom: "As per University",
    duration: "5.5 Years",
    intake: "Sept / Nov",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 5,
    featured: true,
    intro: [
      "Nepal is the closest destination to India in every meaningful sense — geographically, culturally and linguistically. Indian nationals require no visa, Hindi is widely understood, and the food, festivals and climate are entirely familiar.",
      "Nepali medical universities recognized by the National Medical Commission of India and the World Health Organization are spread across Kathmandu, Pokhara, Chitwan and Biratnagar. Doctors Build International shortlists the specific institution that best fits each student's NEET score and budget.",
      "The most significant academic advantage is syllabus alignment: Nepal's medical curriculum tracks the Indian syllabus closely, which shows directly in a consistent 60%+ FMGE pass rate across the 2500+ Indian students studying there.",
    ],
    advantages: [
      {
        title: "No visa required",
        body: "Indian nationals travel to Nepal without a visa — the simplest entry of any destination.",
      },
      {
        title: "Syllabus alignment",
        body: "The curriculum tracks the Indian medical syllabus closely, directly supporting FMGE and NExT preparation.",
      },
      {
        title: "No language barrier",
        body: "Teaching is in English and Hindi is widely understood — including with patients during clinical postings.",
      },
      {
        title: "Familiar food and culture",
        body: "Indian food is standard, not an accommodation. Festivals, climate and customs are the ones you grew up with.",
      },
      {
        title: "Easy family visits",
        body: "Parents can visit for a fraction of the cost and time of any other destination.",
      },
      {
        title: "60%+ FMGE rate",
        body: "Among the strongest pass rates in the portfolio, driven by curriculum alignment and clinical familiarity.",
      },
    ],
    livingCost: "USD 120 – 180 / month",
    climate: "Moderate — very similar to northern India",
    language: "English medium; Hindi and Nepali widely spoken",
    visaNote: "No visa required for Indian nationals.",
  },
  {
    slug: "china",
    name: "China",
    flag: "🇨🇳",
    lat: 39.9,
    lng: 116.4,
    accent: "#C7332B",
    tagline: "World-ranked universities. Advanced clinical infrastructure.",
    startingFrom: "On Request",
    duration: "6 Years",
    intake: "Sept",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 6,
    featured: false,
    intro: [
      "China hosts a number of medical universities that appear in global university rankings, with clinical infrastructure and research funding on a scale few other destinations can match. Several are approved by the National Medical Commission of India and the World Health Organization for English-medium MBBS programmes.",
      "Programmes run six years including internship and are delivered in English, with Mandarin taught alongside so that students can communicate during clinical rotations — an important practical requirement in Chinese teaching hospitals.",
      "Doctors Build International advises on Chinese admissions on a case-by-case basis. Speak to our counsellors for current university availability, fee structures and intake timelines for the 2026-27 session.",
    ],
    advantages: [
      {
        title: "Globally ranked institutions",
        body: "Several Chinese medical universities appear in international rankings, with corresponding research output.",
      },
      {
        title: "Advanced hospital infrastructure",
        body: "Very large teaching hospitals with high patient volumes and modern diagnostic technology.",
      },
      {
        title: "Substantial research funding",
        body: "Well-funded departments give students genuine exposure to clinical and laboratory research.",
      },
      {
        title: "English-medium programmes",
        body: "MBBS delivered in English with Mandarin taught alongside for clinical communication.",
      },
    ],
    livingCost: "USD 200 – 350 / month",
    climate: "Varies widely by region",
    language: "English medium; Mandarin taught for clinical practice",
    visaNote: "X1 student visa. Requires JW202 form and admission letter.",
  },
  {
    slug: "kazakhstan",
    name: "Kazakhstan",
    flag: "🇰🇿",
    lat: 51.16,
    lng: 71.47,
    accent: "#1D8FBE",
    tagline: "Modern campuses. Central Asian value.",
    startingFrom: "On Request",
    duration: "5 + 1 Years",
    intake: "Sept",
    recognition: ["NMC", "WHO"],
    neetRequired: true,
    ieltsRequired: false,
    order: 7,
    featured: false,
    intro: [
      "Kazakhstan is Central Asia's largest economy and has invested substantially in higher education, producing modern medical university campuses with contemporary teaching facilities. Several institutions are recognized by the National Medical Commission of India and approved by the World Health Organization.",
      "MBBS programmes run five years plus a one-year internship and are taught in English. Living costs sit comfortably in the Central Asian range, and the country's strong Indian diaspora makes settling in straightforward.",
      "Doctors Build International advises on Kazakh admissions on request. Contact our counsellors for current university options, fee structures and the 2026-27 intake calendar.",
    ],
    advantages: [
      {
        title: "Modern campuses",
        body: "Recent state investment has produced contemporary teaching and laboratory facilities.",
      },
      {
        title: "Strong economy, stable environment",
        body: "Central Asia's largest economy, with correspondingly stable infrastructure and services.",
      },
      {
        title: "Affordable living",
        body: "Costs comparable to the rest of Central Asia — well below European or Chinese equivalents.",
      },
      {
        title: "Established Indian diaspora",
        body: "An existing Indian community makes food, accommodation and social settling considerably easier.",
      },
    ],
    livingCost: "USD 150 – 250 / month",
    climate: "Continental — cold winters, warm summers",
    language: "English medium; Kazakh and Russian spoken locally",
    visaNote: "Student visa on invitation letter. Typically 3 – 4 weeks.",
  },
];

export const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug);

export function getCountry(slug: string): Country | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export const FEATURED_COUNTRIES = COUNTRIES.filter((c) => c.featured);

/** Origin point for the hero globe's flight arcs. */
export const ORIGIN = { name: "India", lat: 20.59, lng: 78.96 };
