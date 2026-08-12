/* ============================================================
   SOURCE OF TRUTH — all fee and program data below is
   transcribed field-by-field from the client's own
   "Global MBBS Admission Portfolio 2026-27".
   Do not edit these numbers without the updated brochure.

   NOTE ON SEMESTER SCHEDULES: in the printed brochure the
   6-row semester table reconciles exactly to the stated total
   for GEOMEDI and University of South Asia. For Kemerovo,
   North Caucasian, Ingush and Fergana the printed rows sum to
   one annual instalment less than the stated total (the first
   year is split across two semester rows, which needs 7 rows in
   a 6-year course). The STATED TOTAL is authoritative and is
   what we display as the total; the schedule is rendered
   separately as "payment schedule as per official brochure"
   rather than as a column that claims to sum to the total.
   ============================================================ */

export type Currency = "USD" | "RUB" | "VARIES";

export interface FeeLine {
  label: string;
  amount: number | null;
  note?: string;
}

export interface University {
  slug: string;
  rank: number;
  name: string;
  shortName: string;
  country: string;
  countrySlug: string;
  flag: string;
  city: string;

  airport: string;
  airportCode: string;
  airportDistance: string;

  course: string;
  duration: string;
  durationYears: number;
  medium: string;
  intake: string;

  recognition: string[];
  recognitionText: string;

  fmgePassRate: string;
  indianStudents: string;
  safetyRating: number;
  climate: string;
  livingCost: string;

  currency: Currency;
  tuitionTotal: number | null;
  tuitionInr: number | null;
  totalExpense: number | null;
  totalExpenseInr: number | null;
  /** As printed in the brochure — 6 rows. */
  semesterSchedule: (number | null)[];

  established?: string;
  accent: string;
  blurb: string;
  about: string[];
  highlights: string[];
  whyStudy: { title: string; body: string }[];
}

export const UNIVERSITIES: University[] = [
  {
    slug: "geomedi-university-georgia",
    rank: 1,
    name: "GEOMEDI University",
    shortName: "GEOMEDI",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Tbilisi",
    airport: "Tbilisi International Airport",
    airportCode: "TBS",
    airportDistance: "~20 – 25 km",
    course: "MBBS",
    duration: "5 + 1 Years (MD Program)",
    durationYears: 6,
    medium: "English",
    intake: "Feb / Sept",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India), WHO Recognized",
    fmgePassRate: "65%+",
    indianStudents: "1500+",
    safetyRating: 4.5,
    climate: "Moderate",
    livingCost: "USD 150 – 200",
    currency: "USD",
    tuitionTotal: 33000,
    tuitionInr: 2788500,
    totalExpense: 36150,
    totalExpenseInr: 3053000,
    semesterSchedule: [2750, 2750, 5500, 5500, 5500, 5500],
    established: "2003",
    accent: "#1E7A4C",
    blurb:
      "Georgia's flagship English-medium medical university and our highest FMGE performer — European standards, an Indian-friendly capital city, and the strongest pass rate in the portfolio.",
    about: [
      "GEOMEDI University is a private medical institution in Tbilisi, Georgia, offering undergraduate and postgraduate programmes in medicine, dentistry and nursing. It is accredited by Georgia's National Center for Educational Quality Enhancement and is recognized by the World Health Organization and the National Medical Commission of India.",
      "The MD (equivalent to MBBS) programme runs for five academic years followed by a one-year clinical internship, delivered entirely in English. Georgia's position at the crossroads of Europe and Asia gives students a European-standard curriculum with a cost of living far below Western Europe.",
      "For Indian students, GEOMEDI is consistently the strongest performer in our portfolio on FMGE outcomes, with a pass rate above 65% — a direct result of a curriculum that maps closely onto the Indian syllabus and dedicated FMGE/NExT coaching alongside regular coursework.",
    ],
    highlights: [
      "Highest FMGE pass rate in our portfolio — 65%+",
      "European-standard curriculum, fully in English",
      "Tbilisi is an established, Indian-friendly student city",
      "No donation, no capitation fee",
      "Indian mess and hostel support on campus",
      "Two intakes a year — February and September",
    ],
    whyStudy: [
      {
        title: "Faculty & teaching quality",
        body: "Highly qualified faculty, many with international training, teaching in modern lecture halls and fully-equipped laboratories with small-group clinical tutorials.",
      },
      {
        title: "Clinical exposure from year three",
        body: "Affiliated teaching hospitals across Tbilisi give students hands-on rotations well before graduation, not just observation.",
      },
      {
        title: "Research culture",
        body: "An active research programme and international academic partnerships give students opportunities to publish and present during the degree.",
      },
      {
        title: "Life in Tbilisi",
        body: "A safe, affordable, culturally rich capital with a large Indian student community, Indian restaurants, and direct connectivity to India.",
      },
    ],
  },
  {
    slug: "kemerovo-state-medical-university",
    rank: 2,
    name: "Kemerovo State Medical University",
    shortName: "Kemerovo State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Kemerovo",
    airport: "Kemerovo International Airport",
    airportCode: "KEJ",
    airportDistance: "~15 – 20 km",
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India) Recognized, WHO Approved",
    fmgePassRate: "58%+",
    indianStudents: "2500+",
    safetyRating: 4.2,
    climate: "Cold",
    livingCost: "USD 100 – 150",
    currency: "RUB",
    tuitionTotal: 2010000,
    tuitionInr: 2050500,
    totalExpense: 2795000,
    totalExpenseInr: 2855000,
    semesterSchedule: [167500, 167500, 335000, 335000, 335000, 335000],
    established: "1955",
    accent: "#B33636",
    blurb:
      "A large Russian government medical university with the biggest Indian student community in our portfolio — 2500+ students, established Indian mess facilities and a well-worn admission pathway.",
    about: [
      "Kemerovo State Medical University is a Russian government medical university in the Siberian city of Kemerovo, founded in 1955. It is recognized by the National Medical Commission of India and approved by the World Health Organization, and is listed in the World Directory of Medical Schools.",
      "The MBBS programme runs six years including a one-year internship, taught in English for international students. As a state university it charges no donation or capitation fee — the published tuition is the tuition.",
      "With over 2500 Indian students on campus, Kemerovo has among the most established Indian support infrastructure of any university we work with: Indian mess facilities, Indian senior networks, and faculty long experienced in teaching Indian cohorts.",
    ],
    highlights: [
      "Government university — zero donation, zero capitation",
      "2500+ Indian students already on campus",
      "Established Indian mess and hostel facilities",
      "Recognized by NMC (India) and WHO",
      "Airport only 15 – 20 km from campus",
      "Full six-year programme including internship",
    ],
    whyStudy: [
      {
        title: "Government-backed stability",
        body: "A state university with seventy years of continuous operation, state-regulated fees and a curriculum aligned to Russia's federal medical education standard.",
      },
      {
        title: "Large Indian cohort",
        body: "2500+ Indian students means an existing support network from day one — seniors, societies, and food you recognise.",
      },
      {
        title: "Clinical infrastructure",
        body: "Affiliated regional and city hospitals across Kemerovo provide broad clinical exposure across specialties.",
      },
      {
        title: "Cost efficiency",
        body: "Living costs of USD 100 – 150 a month make Kemerovo one of the most economical routes to a recognized medical degree.",
      },
    ],
  },
  {
    slug: "north-caucasian-state-medical-academy",
    rank: 3,
    name: "North Caucasian State Medical Academy",
    shortName: "North Caucasian",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Cherkessk",
    airport: "Mineralnye Vody Airport",
    airportCode: "MRV",
    airportDistance: "~120 – 150 km",
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India) Recognized, WHO Approved",
    fmgePassRate: "55%+",
    indianStudents: "1800+",
    safetyRating: 4.2,
    climate: "Cold",
    livingCost: "USD 120 – 180",
    currency: "RUB",
    tuitionTotal: 2100000,
    tuitionInr: 2142000,
    totalExpense: 2827000,
    totalExpenseInr: 2579000,
    semesterSchedule: [175000, 175000, 350000, 350000, 350000, 350000],
    accent: "#2B4F86",
    blurb:
      "A focused medical academy in the North Caucasus with strong clinical training, a 1800-strong Indian cohort and a milder southern-Russian climate than Siberia.",
    about: [
      "North Caucasian State Medical Academy is located in Cherkessk in southern Russia. It is recognized by the National Medical Commission of India and approved by the World Health Organization, delivering its MBBS programme in English to international students.",
      "The six-year programme includes a one-year internship. As a dedicated medical academy rather than a general university, teaching resources are concentrated entirely on medical training — anatomy, physiology and clinical skills laboratories are the institution's core investment.",
      "Southern Russia offers a more temperate climate than the Siberian universities, and the region has a substantial Muslim and multi-ethnic population, which many Indian students find makes food and cultural adjustment easier.",
    ],
    highlights: [
      "Dedicated medical academy — medicine is the entire focus",
      "1800+ Indian students on campus",
      "Milder southern-Russian climate",
      "NMC (India) recognized, WHO approved",
      "Halal and vegetarian food widely available",
      "No donation or capitation fee",
    ],
    whyStudy: [
      {
        title: "Specialist institution",
        body: "A dedicated medical academy concentrates its entire budget and faculty on medical education rather than spreading across unrelated departments.",
      },
      {
        title: "Regional teaching hospitals",
        body: "Clinical rotations across the Karachay-Cherkess Republic's hospital network give exposure to a broad and varied caseload.",
      },
      {
        title: "Cultural fit",
        body: "A multi-ethnic region where halal and vegetarian food is standard, easing the transition considerably for Indian students.",
      },
      {
        title: "Climate",
        body: "Southern Russia is markedly warmer than the Siberian options — a genuine consideration over six years.",
      },
    ],
  },
  {
    slug: "ingush-state-university",
    rank: 4,
    name: "Ingush State University",
    shortName: "Ingush State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Magas",
    airport: "Magas Airport",
    airportCode: "IGS",
    airportDistance: "~5 – 10 km",
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC (India), WHO & WDOMS Recognized",
    fmgePassRate: "62%+",
    indianStudents: "1200+",
    safetyRating: 4.5,
    climate: "Moderate",
    livingCost: "USD 100 – 150",
    currency: "RUB",
    tuitionTotal: 1200000,
    tuitionInr: 1244000,
    totalExpense: 1560500,
    totalExpenseInr: 1591000,
    semesterSchedule: [100000, 100000, 200000, 200000, 200000, 200000],
    established: "1994",
    accent: "#1F7A6B",
    blurb:
      "The best value in the portfolio — the lowest total cost of any Russian option at ₹15.91 lakh for six years, paired with a 62%+ FMGE rate and a 4.5/5 safety rating.",
    about: [
      "Ingush State University is a Russian government university in Magas, the capital of the Republic of Ingushetia, established in 1994. Its medical faculty is recognized by the National Medical Commission of India, approved by the World Health Organization, and listed in the World Directory of Medical Schools.",
      "The six-year MBBS programme, including a one-year internship, is delivered in English. At approximately ₹15.91 lakh for the entire six years including living costs, Ingush State represents the lowest total cost of any option in our portfolio while maintaining a 62%+ FMGE pass rate.",
      "Magas is a modern, purpose-built capital city with a very low crime rate — reflected in its 4.5/5 safety rating — and the airport sits only 5 to 10 km from campus, the shortest transfer of any university we work with.",
    ],
    highlights: [
      "Lowest total six-year cost in the portfolio — ₹15.91 lakh",
      "62%+ FMGE pass rate",
      "4.5/5 safety rating — one of the safest options",
      "Airport just 5 – 10 km from campus",
      "NMC, WHO and WDOMS recognized",
      "Moderate climate, not Siberian cold",
    ],
    whyStudy: [
      {
        title: "Unmatched value",
        body: "At roughly ₹15.91 lakh all-in for six years, Ingush State costs less than half of most Indian private medical colleges — with no donation whatsoever.",
      },
      {
        title: "Safety",
        body: "Magas is a modern, planned capital with a very low crime rate, earning it our highest safety band alongside GEOMEDI.",
      },
      {
        title: "Triple recognition",
        body: "NMC, WHO and WDOMS listing means the degree is recognized for FMGE/NExT in India and for licensure pathways abroad.",
      },
      {
        title: "Short transfer",
        body: "Magas Airport is 5 – 10 km away — the easiest arrival and the cheapest travel logistics in the portfolio.",
      },
    ],
  },
  {
    slug: "fergana-medical-institute-of-public-health",
    rank: 5,
    name: "Fergana Medical Institute of Public Health",
    shortName: "Fergana Medical",
    country: "Uzbekistan",
    countrySlug: "uzbekistan",
    flag: "🇺🇿",
    city: "Fergana",
    airport: "Fergana International Airport",
    airportCode: "FEG",
    airportDistance: "~10 – 15 km",
    course: "MBBS",
    duration: "5 + 1 Years",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "Recognized by NMC (India), WHO & WDOMS",
    fmgePassRate: "55%+",
    indianStudents: "1000+",
    safetyRating: 4.2,
    climate: "Moderate",
    livingCost: "USD 120 – 180",
    currency: "USD",
    tuitionTotal: 21600,
    tuitionInr: 1825200,
    totalExpense: 25850,
    totalExpenseInr: 2180000,
    semesterSchedule: [1800, 1800, 3600, 3600, 3600, 3600],
    accent: "#0E7C7B",
    blurb:
      "Central Asia's fast-rising medical destination — USD-denominated fees that shield you from rouble volatility, a moderate climate, and food and culture close to home.",
    about: [
      "Fergana Medical Institute of Public Health is located in the Fergana Valley in eastern Uzbekistan. It is recognized by the National Medical Commission of India, approved by the World Health Organization, and listed in the World Directory of Medical Schools.",
      "The programme runs five academic years plus a one-year internship, taught in English. Fees are denominated in US dollars rather than local currency, which removes the exchange-rate uncertainty that affects rouble-denominated programmes over a six-year horizon.",
      "Uzbekistan has invested heavily in its medical education sector over the past decade, and the Fergana Valley offers a warm, moderate climate and a food culture — plov, breads, kebabs, extensive vegetarian options — that Indian students adapt to quickly.",
    ],
    highlights: [
      "Fees in USD — no rouble exchange-rate exposure",
      "NMC, WHO and WDOMS recognized",
      "Moderate climate year-round",
      "Culturally close to India — food, spices, hospitality",
      "Rapidly modernising medical infrastructure",
      "Direct flight connectivity via Tashkent",
    ],
    whyStudy: [
      {
        title: "Currency stability",
        body: "USD-denominated tuition means your six-year budget is predictable, unlike programmes priced in a volatile local currency.",
      },
      {
        title: "Cultural proximity",
        body: "Uzbek cuisine, climate and hospitality are the closest to India of any destination in the portfolio — the adjustment is genuinely easier.",
      },
      {
        title: "New infrastructure",
        body: "Significant recent state investment means modern laboratories, simulation facilities and teaching hospitals.",
      },
      {
        title: "Growing recognition",
        body: "Uzbek medical degrees are increasingly recognized internationally as the country expands its higher-education partnerships.",
      },
    ],
  },
  {
    slug: "university-of-south-asia-kyrgyzstan",
    rank: 6,
    name: "University of South Asia",
    shortName: "University of South Asia",
    country: "Kyrgyzstan",
    countrySlug: "kyrgyzstan",
    flag: "🇰🇬",
    city: "Bishkek",
    airport: "Manas International Airport",
    airportCode: "FRU",
    airportDistance: "~25 – 30 km",
    course: "MBBS",
    duration: "5.5 Years (Incl. 1 Year Internship)",
    durationYears: 5.5,
    medium: "English",
    intake: "Feb / Sept",
    recognition: ["ECFMG", "WHO"],
    recognitionText: "ECFMG & WHO Approved",
    fmgePassRate: "58%+",
    indianStudents: "800+",
    safetyRating: 4.0,
    climate: "Cold",
    livingCost: "USD 100 – 150",
    currency: "USD",
    tuitionTotal: 17500,
    tuitionInr: 1478750,
    totalExpense: 20400,
    totalExpenseInr: 1724000,
    semesterSchedule: [1750, 1750, 3500, 3500, 3500, 3500],
    accent: "#C1512E",
    blurb:
      "The most affordable route to a medical degree in the portfolio — USD 20,400 total, ECFMG approved, with a shorter 5.5-year course and two intakes a year.",
    about: [
      "The University of South Asia is located in Bishkek, the capital of Kyrgyzstan. It is approved by the World Health Organization and recognized by the Educational Commission for Foreign Medical Graduates (ECFMG), which is the gateway body for US medical licensure.",
      "The MBBS programme runs 5.5 years including a one-year internship — a shorter path to graduation than the six-year Russian programmes — and is taught entirely in English. At USD 20,400 total for the full course, it is the most affordable option in our portfolio.",
      "Bishkek has one of the largest Indian student populations in Central Asia, with a well-developed ecosystem of Indian restaurants, grocery stores and student communities built up over two decades.",
    ],
    highlights: [
      "Lowest total fee in the portfolio — USD 20,400",
      "ECFMG approved — supports the USMLE pathway",
      "Shorter 5.5-year programme",
      "Two intakes per year — February and September",
      "Large established Indian community in Bishkek",
      "Living costs from just USD 100 a month",
    ],
    whyStudy: [
      {
        title: "Lowest cost of entry",
        body: "USD 20,400 total makes this the most accessible medical degree we place students into, without compromising on recognition.",
      },
      {
        title: "ECFMG pathway",
        body: "ECFMG recognition keeps the door open to USMLE and a US residency, not only the Indian FMGE/NExT route.",
      },
      {
        title: "Shorter programme",
        body: "Graduating in 5.5 years instead of 6 means a full extra half-year of earning or postgraduate preparation.",
      },
      {
        title: "Established Indian ecosystem",
        body: "Two decades of Indian students in Bishkek means Indian food, community and senior support are readily available.",
      },
    ],
  },
  {
    slug: "nepal-mbbs-universities",
    rank: 7,
    name: "Nepal MBBS Universities",
    shortName: "Nepal Universities",
    country: "Nepal",
    countrySlug: "nepal",
    flag: "🇳🇵",
    city: "Various Cities",
    airport: "Tribhuvan International Airport",
    airportCode: "KTM",
    airportDistance: "10 – 20 km (depends on city)",
    course: "MBBS",
    duration: "5.5 Years (Incl. 1 Year Internship)",
    durationYears: 5.5,
    medium: "English",
    intake: "Sept / Nov (depends on university)",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India) & WHO Recognized (Various)",
    fmgePassRate: "60%+",
    indianStudents: "2500+",
    safetyRating: 4.3,
    climate: "Moderate",
    livingCost: "USD 120 – 180",
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    accent: "#8C3A5E",
    blurb:
      "The closest option to home — no language barrier, an Indian-aligned curriculum, familiar food and climate, and a 60%+ FMGE rate across 2500+ Indian students.",
    about: [
      "Nepal hosts a number of medical universities recognized by the National Medical Commission of India and the World Health Organization, spread across Kathmandu, Pokhara, Chitwan, Biratnagar and other cities. Doctors Build International shortlists the specific institution that best matches each student's profile and budget.",
      "The MBBS programme runs 5.5 years including a one-year internship and is taught in English. Nepal's medical curriculum is closely aligned with the Indian syllabus, which is a substantial advantage when preparing for FMGE or NExT.",
      "Nepal is the closest destination to India in every sense — geographically, culturally and linguistically. Hindi is widely understood, the food is familiar, no visa is required for Indian nationals, and families can visit easily. This combination produces a consistent 60%+ FMGE pass rate.",
    ],
    highlights: [
      "No visa required for Indian nationals",
      "Curriculum closely aligned with the Indian syllabus",
      "Hindi widely spoken — no language barrier",
      "Familiar food, climate and culture",
      "2500+ Indian students across Nepali universities",
      "Families can visit easily and inexpensively",
    ],
    whyStudy: [
      {
        title: "Closest to home",
        body: "A short flight or an overland journey, no visa requirement for Indian nationals, and family visits that cost a fraction of any other destination.",
      },
      {
        title: "Syllabus alignment",
        body: "Nepal's medical curriculum tracks the Indian syllabus closely, which shows directly in the 60%+ FMGE pass rate.",
      },
      {
        title: "No language barrier",
        body: "Teaching is in English and Hindi is widely understood in daily life — clinical postings involve patients you can actually talk to.",
      },
      {
        title: "Cultural continuity",
        body: "Familiar food, festivals and climate mean minimal adjustment shock and far lower dropout risk.",
      },
    ],
  },
];

export const UNIVERSITY_SLUGS = UNIVERSITIES.map((u) => u.slug);

export function getUniversity(slug: string): University | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}

export function universitiesByCountry(countrySlug: string): University[] {
  return UNIVERSITIES.filter((u) => u.countrySlug === countrySlug);
}

/** Standard line items included in every admission package.
 *  Consistent across universities per the client's service model. */
export const PACKAGE_INCLUDES = [
  "University application & registration",
  "Admission / invitation letter processing",
  "Complete student documentation",
  "Visa assistance & embassy guidance",
  "Airport pickup on arrival",
  "Immigration & residence-permit support",
  "Hostel allotment assistance",
  "Pre-departure briefing",
] as const;

/** Costs a student pays beyond the quoted package. Being explicit
 *  about these is the transparency the brand is built on. */
export const ADDITIONAL_COSTS = [
  {
    label: "Hostel & food",
    amount: "USD 100 – 300 / month",
    note: "Varies by university and room type. Indian mess available at most campuses.",
  },
  {
    label: "Personal expenses",
    amount: "USD 5,000 – 10,000 (6 years)",
    note: "Phone, travel, clothing, books and day-to-day spending across the full course.",
  },
  {
    label: "Residence permit (TRC)",
    amount: "USD 300 – 400",
    note: "Payable locally, usually annually. Not applicable for Nepal.",
  },
  {
    label: "Air travel",
    amount: "As per actuals",
    note: "Return airfare India ↔ destination, typically once or twice a year.",
  },
  {
    label: "Medical insurance",
    amount: "USD 100 – 250 / year",
    note: "Mandatory in most destinations; often bundled with the residence permit.",
  },
] as const;
