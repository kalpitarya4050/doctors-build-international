/* ============================================================
   SOURCE OF TRUTH — universities and fee data.

   TWO GENERATIONS OF CLIENT MATERIAL SIT IN THIS FILE.

   1. "Global MBBS Admission Portfolio 2026-27" (earlier)
      Carries full fee tables. Six universities from it survive
      into the current lineup and keep their verified figures:
      GEOMEDI, Kemerovo, North Caucasian, Ingush, Fergana and
      University of South Asia. Marked `hasPublishedFees: true`.

   2. "Top MBBS Universities for Indian Students" (current)
      The client's new lineup — 21 universities across Georgia,
      Russia, Kazakhstan and China, grouped into four priority
      tiers. It publishes NO fee data at all: the China
      comparison sheet prints the tuition, hostel, living and
      total rows as blank dashes. It also gives no FMGE pass
      rates, Indian student counts or safety ratings.

      Those fields are therefore `null` on the seventeen new
      records, and the UI must render "on request" rather than
      imply a figure. DO NOT fill them in from memory or from a
      general web search — on a site whose entire proposition is
      published, verifiable numbers, an invented pass rate is the
      one thing that would actually damage the client.

   NEPAL was removed at the client's instruction — they no longer
   place students there.

   NOTE ON SEMESTER SCHEDULES (portfolio universities only): the
   printed 6-row semester table reconciles exactly to the stated
   total for GEOMEDI and University of South Asia. For Kemerovo,
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

  /** Priority tier from the client's current brochure. 1–4 are the
   *  brochure's own bands; 5 marks a destination retained from the
   *  earlier portfolio that the new sheet does not cover. */
  priority: number;

  airport: string | null;
  airportCode: string | null;
  airportDistance: string | null;
  /** Drive time, published only on the China comparison sheet. */
  airportDrive: string | null;

  course: string;
  duration: string | null;
  durationYears: number | null;
  medium: string;
  intake: string | null;

  recognition: string[];
  recognitionText: string;
  /** Affiliated teaching hospitals, published only for China. */
  affiliatedHospitals: string | null;

  fmgePassRate: string | null;
  indianStudents: string | null;
  safetyRating: number | null;
  climate: string | null;
  livingCost: string | null;

  currency: Currency;
  tuitionTotal: number | null;
  tuitionInr: number | null;
  totalExpense: number | null;
  totalExpenseInr: number | null;
  /** As printed in the brochure — 6 rows. All null where unpublished. */
  semesterSchedule: (number | null)[];

  /** True only where we hold a client brochure with the actual fee
   *  table. Gates every figure the UI would otherwise imply. */
  hasPublishedFees: boolean;

  established?: string;
  accent: string;
  blurb: string;
  about: string[];
  highlights: string[];
  whyStudy: { title: string; body: string }[];
}

/** The brochure prints "NMC Eligible*" throughout, and the China
 *  sheet footnotes it explicitly. We carry that caveat rather than
 *  flattening it into a bare claim of recognition. */
export const NMC_VERIFY_NOTE =
  "NMC eligibility is stated as per the latest available regulations. Students must verify a university's current NMC status before taking admission — we confirm this in writing during counselling.";

/** The four priority bands, in the client's own words. */
export const PRIORITY_TIERS: Record<number, { label: string; sub: string }> = {
  1: { label: "Priority 1", sub: "Best for Easy Adaptation" },
  2: { label: "Priority 2", sub: "Best for Clinical Experience & Value" },
  3: { label: "Priority 3", sub: "Affordable & Emerging Choice" },
  4: { label: "Priority 4", sub: "Best for Infrastructure & Technology" },
  5: { label: "Also available", sub: "Retained from our 2026-27 portfolio" },
};

/* ------------------------------------------------------------------
   Shared copy. The brochure states these at country level, so every
   university in that country inherits them rather than each record
   inventing its own variation.
   ------------------------------------------------------------------ */

const GEORGIA_WHY = [
  {
    title: "Easy visa, light documentation",
    body: "Georgia runs one of the most straightforward student visa processes of any destination we place into, with a short documentation list and a high approval rate.",
  },
  {
    title: "Low cost of living",
    body: "Day-to-day costs sit well below Western Europe, which is a large part of why Georgia has become one of the most preferred destinations for Indian students.",
  },
  {
    title: "Indian food and cultural familiarity",
    body: "Tbilisi and Batumi both have established Indian restaurants and grocery supply, and a settled Indian student community to arrive into.",
  },
  {
    title: "Close to home",
    body: "Three to four hours' flying time from India — the shortest of any European-standard destination, and it matters when families want to visit.",
  },
];

const RUSSIA_WHY = [
  {
    title: "Large teaching hospital networks",
    body: "Russian medical universities are attached to substantial state hospital systems, which is what produces the patient volume and case variety behind the clinical training.",
  },
  {
    title: "Quality education at affordable fees",
    body: "State-regulated tuition with no donation and no capitation at any stage — the published fee is the entire fee.",
  },
  {
    title: "Experienced faculty, practical training",
    body: "Long-established MBBS programmes with faculty used to teaching international cohorts, and practical training weighted heavily through the later years.",
  },
  {
    title: "Strong global recognition",
    body: "WHO listing and World Directory of Medical Schools entries support licensure pathways well beyond India alone.",
  },
];

const KAZAKHSTAN_WHY = [
  {
    title: "Very economical",
    body: "Kazakhstan is among the most economical routes to a medical degree for Indian students, on both tuition and day-to-day living.",
  },
  {
    title: "Shorter flight time from India",
    body: "Direct connectivity and a short flight make both arrival and family visits considerably easier than the Siberian or East Asian options.",
  },
  {
    title: "Comfortable climate, Indian food available",
    body: "A more temperate climate than northern Russia, with Indian food available and a student community used to receiving international arrivals.",
  },
  {
    title: "Peaceful and student-friendly",
    body: "A stable, peaceful country with a reputation for being welcoming to international students — a genuine consideration over a six-year course.",
  },
];

const CHINA_WHY = [
  {
    title: "Advanced facilities and simulation",
    body: "World-class campuses with advanced simulation laboratories — infrastructure on a scale few other destinations in this price range can match.",
  },
  {
    title: "Globally ranked institutions",
    body: "Several Chinese medical universities appear in international rankings, with the research output and funding that go with that.",
  },
  {
    title: "Clinical training in major hospitals",
    body: "Internationally affiliated teaching hospitals with very high patient volumes and modern diagnostic technology.",
  },
  {
    title: "Global career exposure",
    body: "A degree from a globally recognised institution, in a smart-city environment with strong international connectivity.",
  },
];

/** Standard closing paragraph for a record with no published fee
 *  table. Says plainly that we do not have the figure rather than
 *  dressing the gap up as a feature. */
function feesOnRequest(name: string): string {
  return `Tuition, hostel and living costs for ${name} are confirmed directly with the university for each intake, and are not published in our current brochure. A counsellor will give you the complete written cost breakdown — including everything payable beyond tuition — before you commit to anything.`;
}

export const UNIVERSITIES: University[] = [
  /* ============================================================
     PRIORITY 1 — GEORGIA · Best for Easy Adaptation
     ============================================================ */
  {
    slug: "geomedi-university-georgia",
    rank: 1,
    name: "GEOMEDI University",
    shortName: "GEOMEDI",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Tbilisi",
    priority: 1,
    airport: "Tbilisi International Airport",
    airportCode: "TBS",
    airportDistance: "~20 – 25 km",
    airportDrive: null,
    course: "MBBS",
    duration: "5 + 1 Years (MD Program)",
    durationYears: 6,
    medium: "English",
    intake: "Feb / Sept",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India), WHO Recognized",
    affiliatedHospitals: null,
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
    hasPublishedFees: true,
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
    slug: "avicenna-batumi-medical-university",
    rank: 2,
    name: "Avicenna Batumi Medical University",
    shortName: "Avicenna Batumi",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Batumi",
    priority: 1,
    airport: "Batumi International Airport",
    airportCode: "BUS",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Subtropical — mild, coastal",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#1B6F55",
    blurb:
      "The only option in our Georgian lineup outside the capital — a Black Sea coastal city with a milder climate, a smaller student population and a lower cost base than Tbilisi.",
    about: [
      "Avicenna Batumi Medical University is located in Batumi, Georgia's principal Black Sea port and its second city. It delivers its medical programme in English to international students, and sits in the client's Priority 1 band — the group selected for how straightforward Indian students find the adjustment.",
      "Batumi is a markedly different proposition from Tbilisi: a coastal, subtropical climate rather than a continental one, a compact city that is quick to learn, and a cost base below the capital. Students who want Georgia's advantages without a capital-city environment tend to shortlist here.",
      feesOnRequest("Avicenna Batumi Medical University"),
    ],
    highlights: [
      "English-medium MBBS, European-style education",
      "Coastal Batumi — mild subtropical climate",
      "Lower cost base than the capital",
      "Easier adaptation for first-time travellers",
      "Three to four hours' flying time from India",
      "Modern infrastructure and growing hospital exposure",
    ],
    whyStudy: GEORGIA_WHY,
  },
  {
    slug: "georgian-american-university",
    rank: 3,
    name: "Georgian American University (GAU)",
    shortName: "GAU",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Tbilisi",
    priority: 1,
    airport: "Tbilisi International Airport",
    airportCode: "TBS",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Moderate",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#2A6E8F",
    blurb:
      "A Tbilisi university built on an American academic model — credit-based structure, English throughout, and a teaching culture oriented towards Western medical education.",
    about: [
      "Georgian American University is a private institution in Tbilisi delivering its medical programme in English. As the name indicates, its academic structure follows an American model, which shows in the credit system and the emphasis on continuous assessment rather than a small number of high-stakes examinations.",
      "It sits in the client's Priority 1 band alongside the other Georgian universities — the group selected for ease of adaptation, cost of living, and proximity to India. Tbilisi's established Indian student community, Indian food supply and direct flight connectivity all apply here.",
      feesOnRequest("Georgian American University"),
    ],
    highlights: [
      "American-model academic structure",
      "English-medium throughout the programme",
      "Central Tbilisi location",
      "European-style education standards",
      "Established Indian community in the city",
      "Easy visa process and light documentation",
    ],
    whyStudy: GEORGIA_WHY,
  },
  {
    slug: "georgian-national-university-seu",
    rank: 4,
    name: "Georgian National University (SEU)",
    shortName: "SEU",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Tbilisi",
    priority: 1,
    airport: "Tbilisi International Airport",
    airportCode: "TBS",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Moderate",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#1F5F8B",
    blurb:
      "One of Georgia's larger private universities, with a medical faculty taught in English and a modern Tbilisi campus.",
    about: [
      "Georgian National University, known as SEU, is a private university in Tbilisi with a medical faculty delivering its programme in English to international students. It is one of the larger private institutions in the country and has invested substantially in its campus infrastructure.",
      "SEU is part of the client's Priority 1 group — the Georgian universities selected because Indian students adapt to them most easily. That band is defined by pleasant climate, affordable living, a safer environment and a short flight home rather than by any single institutional feature.",
      feesOnRequest("Georgian National University (SEU)"),
    ],
    highlights: [
      "Modern campus infrastructure in Tbilisi",
      "English-medium medical faculty",
      "European-style education model",
      "Pleasant climate, affordable living",
      "Indian food availability across the city",
      "High student satisfaction and safety",
    ],
    whyStudy: GEORGIA_WHY,
  },
  {
    slug: "east-west-university-georgia",
    rank: 5,
    name: "East-West University (EWU)",
    shortName: "East-West",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Tbilisi",
    priority: 1,
    airport: "Tbilisi International Airport",
    airportCode: "TBS",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Moderate",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#2C6E63",
    blurb:
      "A Tbilisi university whose medical programme is built specifically around international cohorts, taught entirely in English.",
    about: [
      "East-West University is a private institution in Tbilisi delivering an English-medium medical programme. Its intake is oriented towards international students, which shapes how the teaching is organised — teaching and student support are designed for cohorts arriving from outside Georgia rather than adapted for them.",
      "It appears in the client's Priority 1 band: the Georgian group chosen for ease of adaptation. In practice that means a short flight from India, a familiar food supply in the city, low living costs and a straightforward visa process.",
      feesOnRequest("East-West University"),
    ],
    highlights: [
      "Programme built around international cohorts",
      "English-medium throughout",
      "Tbilisi — established Indian student city",
      "Low living cost compared to other destinations",
      "Easy visa process and light documentation",
      "Three to four hours from India",
    ],
    whyStudy: GEORGIA_WHY,
  },
  {
    slug: "david-tvildiani-medical-university",
    rank: 6,
    name: "David Tvildiani Medical University",
    shortName: "David Tvildiani",
    country: "Georgia",
    countrySlug: "georgia",
    flag: "🇬🇪",
    city: "Tbilisi",
    priority: 1,
    airport: "Tbilisi International Airport",
    airportCode: "TBS",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Moderate",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#14655A",
    blurb:
      "A dedicated medical university in Tbilisi — medicine is the entire institution rather than one faculty among many.",
    about: [
      "David Tvildiani Medical University is a specialist medical institution in Tbilisi, teaching its programme in English. Being a dedicated medical university rather than a general university with a medical faculty means teaching resources, laboratories and clinical partnerships are concentrated entirely on medical training.",
      "It is the sixth Georgian university in the client's Priority 1 band. As with the rest of that group, the case for it rests on how straightforward Georgia is for an Indian student — climate, cost, food, safety and a short journey home — rather than on any one distinguishing claim.",
      feesOnRequest("David Tvildiani Medical University"),
    ],
    highlights: [
      "Dedicated medical university — medicine is the whole focus",
      "English-medium programme",
      "Tbilisi location with established Indian community",
      "European-style education standards",
      "Affordable living and pleasant climate",
      "High student satisfaction and safety",
    ],
    whyStudy: GEORGIA_WHY,
  },

  /* ============================================================
     PRIORITY 2 — RUSSIA · Best for Clinical Experience & Value
     ============================================================ */
  {
    slug: "kazan-federal-university",
    rank: 7,
    name: "Kazan Federal University",
    shortName: "Kazan Federal",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Kazan",
    priority: 2,
    airport: "Kazan International Airport",
    airportCode: "KZN",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC Eligible · WHO Listed · WDOMS",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Continental — cold winters, warm summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#7C2D5E",
    blurb:
      "One of Russia's oldest and most internationally recognised universities, in Tatarstan's capital — the highest-profile institution in the client's Russian lineup.",
    about: [
      "Kazan Federal University is among the oldest universities in Russia and one of its most internationally recognised, with a medical institute delivering an English-medium programme to international students. It leads the client's Priority 2 band, the group selected for clinical experience and value.",
      "Kazan is the capital of Tatarstan and one of Russia's major cities, with a large student population and a substantial Muslim community alongside its Russian one — which many Indian students find makes food and cultural adjustment noticeably easier than elsewhere in the country.",
      feesOnRequest("Kazan Federal University"),
    ],
    highlights: [
      "Among Russia's oldest and best-known universities",
      "Strong international recognition",
      "Large teaching hospital network",
      "Kazan — a major city with a big student population",
      "Halal and vegetarian food widely available",
      "Research opportunities and a strong alumni network",
    ],
    whyStudy: RUSSIA_WHY,
  },
  {
    slug: "bashkir-state-medical-university",
    rank: 8,
    name: "Bashkir State Medical University (BSMU)",
    shortName: "Bashkir State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Ufa",
    priority: 2,
    airport: "Ufa International Airport",
    airportCode: "UFA",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC Eligible · WHO Listed · WDOMS",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Continental — cold winters, warm summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#9B3030",
    blurb:
      "A long-established state medical university in Bashkortostan, with the concentrated clinical focus of a dedicated medical institution.",
    about: [
      "Bashkir State Medical University is a Russian state medical university in Ufa, the capital of the Republic of Bashkortostan. As a dedicated medical university it concentrates its entire faculty and budget on medical education rather than spreading across unrelated departments.",
      "It sits in the client's Priority 2 band — the Russian group selected for clinical experience and value for money. Bashkortostan has a substantial Muslim population, which in practice means halal and vegetarian food are ordinary rather than something to hunt for.",
      feesOnRequest("Bashkir State Medical University"),
    ],
    highlights: [
      "Dedicated state medical university",
      "Extensive clinical exposure",
      "Experienced faculty with international cohorts",
      "Halal and vegetarian food widely available",
      "No donation or capitation fee",
      "WHO listed, NMC eligible",
    ],
    whyStudy: RUSSIA_WHY,
  },
  {
    slug: "ulyanovsk-state-university",
    rank: 9,
    name: "Ulyanovsk State University",
    shortName: "Ulyanovsk State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Ulyanovsk",
    priority: 2,
    airport: "Ulyanovsk Baratayevka Airport",
    airportCode: "ULY",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC Eligible · WHO Listed · WDOMS",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Continental — cold winters, warm summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#8E3A52",
    blurb:
      "A state university on the Volga with a long-running English-medium medical faculty and a well-worn admission pathway for Indian students.",
    about: [
      "Ulyanovsk State University is a Russian state university on the Volga, with a medical faculty that has taught international students in English for many years. It is one of the three Volga-region institutions in the client's Russian lineup.",
      "The Priority 2 band it belongs to is defined by clinical experience and value — large teaching hospital networks, experienced faculty, practical training weighted through the later years, and state-regulated tuition with nothing payable under the table.",
      feesOnRequest("Ulyanovsk State University"),
    ],
    highlights: [
      "Long-running English-medium medical faculty",
      "State university — regulated fees, no capitation",
      "Volga-region city with a large student population",
      "Extensive clinical exposure",
      "Experienced faculty and practical training",
      "WHO listed, NMC eligible",
    ],
    whyStudy: RUSSIA_WHY,
  },
  {
    slug: "chuvash-state-medical-university",
    rank: 10,
    name: "Chuvash State Medical University",
    shortName: "Chuvash State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Cheboksary",
    priority: 2,
    airport: "Cheboksary Airport",
    airportCode: "CSY",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC Eligible · WHO Listed · WDOMS",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Continental — cold winters, warm summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#A03A45",
    blurb:
      "A state medical university in the Chuvash Republic — a smaller, quieter city than the Volga's larger campuses, with correspondingly lower living costs.",
    about: [
      "Chuvash State Medical University is located in Cheboksary, capital of the Chuvash Republic on the Volga. It delivers its medical programme in English to international students, within the Russian federal medical education standard.",
      "Cheboksary is a smaller and quieter city than Kazan or Ufa, which students who prefer a calmer environment — and a lower cost base — tend to weigh in its favour. It belongs to the client's Priority 2 band for clinical experience and value.",
      feesOnRequest("Chuvash State Medical University"),
    ],
    highlights: [
      "Dedicated state medical university",
      "Smaller, quieter city than the larger Volga campuses",
      "Lower cost base",
      "Extensive clinical exposure",
      "Excellent infrastructure and teaching hospitals",
      "No donation or capitation fee",
    ],
    whyStudy: RUSSIA_WHY,
  },
  {
    slug: "kemerovo-state-medical-university",
    rank: 11,
    name: "Kemerovo State Medical University",
    shortName: "Kemerovo State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Kemerovo",
    priority: 2,
    airport: "Kemerovo International Airport",
    airportCode: "KEJ",
    airportDistance: "~15 – 20 km",
    airportDrive: null,
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India) Recognized, WHO Approved",
    affiliatedHospitals: null,
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
    hasPublishedFees: true,
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
    rank: 12,
    name: "North Caucasian State Medical Academy",
    shortName: "North Caucasian",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Cherkessk",
    priority: 2,
    airport: "Mineralnye Vody Airport",
    airportCode: "MRV",
    airportDistance: "~120 – 150 km",
    airportDrive: null,
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC (India) Recognized, WHO Approved",
    affiliatedHospitals: null,
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
    hasPublishedFees: true,
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
    slug: "kabardino-balkarian-state-university",
    rank: 13,
    name: "Kabardino-Balkarian State University",
    shortName: "Kabardino-Balkarian",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Nalchik",
    priority: 2,
    airport: "Nalchik Airport",
    airportCode: "NAL",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC Eligible · WHO Listed · WDOMS",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Moderate — southern Russia",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#356B8C",
    blurb:
      "A southern-Russian state university in the Caucasus foothills — a milder climate than Siberia, in a region where Indian students adapt comparatively easily.",
    about: [
      "Kabardino-Balkarian State University is a Russian state university in Nalchik, capital of the Kabardino-Balkarian Republic in the northern Caucasus. Its medical faculty teaches international students in English within the Russian federal medical education standard.",
      "Nalchik sits in the Caucasus foothills, giving it a considerably milder climate than the Siberian universities — a real factor across a six-year course. Like the region's other campuses, it has a substantial Muslim population, so halal and vegetarian food are ordinary rather than a special arrangement.",
      feesOnRequest("Kabardino-Balkarian State University"),
    ],
    highlights: [
      "Milder southern-Russian climate",
      "State university — regulated fees, no capitation",
      "Halal and vegetarian food widely available",
      "Large regional teaching hospital network",
      "Experienced faculty and practical training",
      "WHO listed, NMC eligible",
    ],
    whyStudy: RUSSIA_WHY,
  },
  {
    slug: "ingush-state-university",
    rank: 14,
    name: "Ingush State University",
    shortName: "Ingush State",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Magas",
    priority: 2,
    airport: "Magas Airport",
    airportCode: "IGS",
    airportDistance: "~5 – 10 km",
    airportDrive: null,
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "NMC (India), WHO & WDOMS Recognized",
    affiliatedHospitals: null,
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
    hasPublishedFees: true,
    established: "1994",
    accent: "#1F7A6B",
    blurb:
      "The best value in the portfolio — the lowest total cost of any option at ₹15.91 lakh for six years, paired with a 62%+ FMGE rate and a 4.5/5 safety rating.",
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

  /* ============================================================
     PRIORITY 3 — KAZAKHSTAN · Affordable & Emerging Choice
     ============================================================ */
  {
    slug: "kazakh-national-medical-university",
    rank: 15,
    name: "Kazakh National Medical University",
    shortName: "Kazakh National",
    country: "Kazakhstan",
    countrySlug: "kazakhstan",
    flag: "🇰🇿",
    city: "Almaty",
    priority: 3,
    airport: "Almaty International Airport",
    airportCode: "ALA",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Continental — comfortable summers, cold winters",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#1D8FBE",
    blurb:
      "Kazakhstan's leading national medical university, in Almaty — the country's largest city and the short-flight option in Central Asia.",
    about: [
      "Kazakh National Medical University is located in Almaty, Kazakhstan's largest city and its commercial centre. It delivers medical education to international students in English and heads the client's Priority 3 band — the destinations selected as affordable and emerging choices.",
      "Almaty sits against the Tian Shan mountains and has a continental climate that is comfortable through much of the year. Kazakhstan's proximity to India means a notably shorter flight than the Russian or Chinese options, which matters for both arrival and family visits.",
      feesOnRequest("Kazakh National Medical University"),
    ],
    highlights: [
      "Kazakhstan's leading national medical university",
      "Almaty — the country's largest city",
      "Very economical for Indian students",
      "Shorter flight time from India",
      "Indian food available",
      "Comfortable climate and modern curriculum",
    ],
    whyStudy: KAZAKHSTAN_WHY,
  },
  {
    slug: "kazakh-russian-medical-university",
    rank: 16,
    name: "Kazakh Russian Medical University",
    shortName: "Kazakh Russian",
    country: "Kazakhstan",
    countrySlug: "kazakhstan",
    flag: "🇰🇿",
    city: "Almaty",
    priority: 3,
    airport: "Almaty International Airport",
    airportCode: "ALA",
    airportDistance: null,
    airportDrive: null,
    course: "MBBS",
    duration: null,
    durationYears: null,
    medium: "English",
    intake: null,
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Continental — comfortable summers, cold winters",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#2578A0",
    blurb:
      "A medical university in Almaty teaching international cohorts in English, in the client's most economical destination band.",
    about: [
      "Kazakh Russian Medical University is based in Almaty and delivers its medical programme in English to international students. It is the second of the two Kazakh institutions in the client's current lineup.",
      "Kazakhstan sits in the Priority 3 band — the affordable and emerging choice. The case for it is economy without a long journey: modest tuition and living costs, a comfortable climate, Indian food available in the city, and a short flight from India.",
      feesOnRequest("Kazakh Russian Medical University"),
    ],
    highlights: [
      "English-medium programme for international cohorts",
      "Almaty location",
      "Very economical for Indian students",
      "Shorter flight time from India",
      "Safe, international-student-friendly environment",
      "Good clinical exposure",
    ],
    whyStudy: KAZAKHSTAN_WHY,
  },

  /* ============================================================
     PRIORITY 4 — CHINA · Best for Infrastructure & Technology
     Per-university facts below are transcribed from the client's
     "Top 5 Medical Universities in China" comparison sheet. Its
     fee rows are printed blank, hence hasPublishedFees: false.
     ============================================================ */
  {
    slug: "nanjing-medical-university",
    rank: 17,
    name: "Nanjing Medical University",
    shortName: "Nanjing Medical",
    country: "China",
    countrySlug: "china",
    flag: "🇨🇳",
    city: "Nanjing",
    priority: 4,
    airport: "Nanjing Lukou International Airport",
    airportCode: "NKG",
    airportDistance: "≈ 40 km",
    airportDrive: "45 – 60 mins",
    course: "MBBS",
    duration: "6 Years (5 Years + 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "September",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: "Multiple teaching hospitals (30+ affiliated)",
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Humid subtropical — hot summers, mild winters",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#C7332B",
    blurb:
      "Jiangsu's principal medical university, with the largest affiliated hospital network in the China lineup — 30+ teaching hospitals across the province.",
    about: [
      "Nanjing Medical University is located in Nanjing, capital of Jiangsu Province, and heads the client's China selection. It teaches its MBBS programme in English across six years — five academic years plus a one-year internship — with a September intake.",
      "Its clinical strength is the affiliated hospital network: more than thirty teaching hospitals, the largest of the five Chinese universities in the lineup. Nanjing itself is a major eastern city with a humid subtropical climate, hot summers and mild winters, roughly forty kilometres from Lukou International Airport.",
      feesOnRequest("Nanjing Medical University"),
    ],
    highlights: [
      "30+ affiliated teaching hospitals",
      "English-medium MBBS, September intake",
      "Six years including a one-year internship",
      "World-class campus and simulation laboratories",
      "Mild winters — humid subtropical climate",
      "40 km from Nanjing Lukou International Airport",
    ],
    whyStudy: CHINA_WHY,
  },
  {
    slug: "southern-medical-university",
    rank: 18,
    name: "Southern Medical University",
    shortName: "Southern Medical",
    country: "China",
    countrySlug: "china",
    flag: "🇨🇳",
    city: "Guangzhou",
    priority: 4,
    airport: "Guangzhou Baiyun International Airport",
    airportCode: "CAN",
    airportDistance: "≈ 45 km",
    airportDrive: "50 – 60 mins",
    course: "MBBS",
    duration: "6 Years (5 Years + 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "September",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: "Multiple teaching hospitals (20+ affiliated)",
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Humid subtropical — hot summers, mild winters",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#B82F32",
    blurb:
      "A Guangzhou university in the Pearl River Delta — southern China's commercial heartland, and the mildest winters of the five.",
    about: [
      "Southern Medical University is based in Guangzhou, capital of Guangdong Province and the centre of the Pearl River Delta. Its MBBS programme runs six years in English — five academic years plus a one-year internship — with a September intake and more than twenty affiliated teaching hospitals.",
      "Guangzhou is one of China's most internationally connected cities, with a long-established foreign resident community. The climate is humid subtropical with hot summers and mild winters, and Baiyun International Airport is roughly forty-five kilometres from campus.",
      feesOnRequest("Southern Medical University"),
    ],
    highlights: [
      "20+ affiliated teaching hospitals",
      "Guangzhou — highly internationally connected",
      "English-medium MBBS, September intake",
      "Six years including a one-year internship",
      "Mild winters, hot summers",
      "Advanced simulation laboratories",
    ],
    whyStudy: CHINA_WHY,
  },
  {
    slug: "chongqing-medical-university",
    rank: 19,
    name: "Chongqing Medical University",
    shortName: "Chongqing Medical",
    country: "China",
    countrySlug: "china",
    flag: "🇨🇳",
    city: "Chongqing",
    priority: 4,
    airport: "Chongqing Jiangbei International Airport",
    airportCode: "CKG",
    airportDistance: "≈ 30 km",
    airportDrive: "35 – 45 mins",
    course: "MBBS",
    duration: "6 Years (5 Years + 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "September",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: "Multiple teaching hospitals (20+ affiliated)",
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Subtropical monsoon — mild winters, hot summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#A82D3E",
    blurb:
      "A western-China university in one of the country's largest municipalities, with the shortest airport transfer of the five after Tianjin.",
    about: [
      "Chongqing Medical University is located in Chongqing, one of China's four direct-administered municipalities and the largest city in the country's west. Its MBBS programme is taught in English over six years, including a one-year internship, with a September intake.",
      "The university has more than twenty affiliated teaching hospitals. Chongqing's climate is subtropical monsoon — mild winters and hot summers — and Jiangbei International Airport is around thirty kilometres from campus, a thirty-five to forty-five minute transfer.",
      feesOnRequest("Chongqing Medical University"),
    ],
    highlights: [
      "20+ affiliated teaching hospitals",
      "Major direct-administered municipality",
      "English-medium MBBS, September intake",
      "Six years including a one-year internship",
      "Mild winters — subtropical monsoon climate",
      "30 km from Jiangbei International Airport",
    ],
    whyStudy: CHINA_WHY,
  },
  {
    slug: "tianjin-medical-university",
    rank: 20,
    name: "Tianjin Medical University",
    shortName: "Tianjin Medical",
    country: "China",
    countrySlug: "china",
    flag: "🇨🇳",
    city: "Tianjin",
    priority: 4,
    airport: "Tianjin Binhai International Airport",
    airportCode: "TSN",
    airportDistance: "≈ 20 km",
    airportDrive: "25 – 35 mins",
    course: "MBBS",
    duration: "6 Years (5 Years + 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "September",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: "Multiple teaching hospitals (20+ affiliated)",
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Temperate monsoon — cold winters, warm summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#8E2F44",
    blurb:
      "A northern-China university a short distance from Beijing, with the shortest airport transfer in the lineup — 20 km, under half an hour.",
    about: [
      "Tianjin Medical University is located in Tianjin, a direct-administered municipality on the northern coast and one of China's largest port cities, well connected to Beijing by high-speed rail. Its MBBS programme runs six years in English, including a one-year internship, with a September intake.",
      "The university has more than twenty affiliated teaching hospitals. Tianjin's climate is temperate monsoon — cold winters and warm summers — and Binhai International Airport is only about twenty kilometres from campus, the shortest transfer of the five Chinese universities.",
      feesOnRequest("Tianjin Medical University"),
    ],
    highlights: [
      "20+ affiliated teaching hospitals",
      "Shortest airport transfer — 20 km, 25 – 35 mins",
      "Close to Beijing by high-speed rail",
      "English-medium MBBS, September intake",
      "Six years including a one-year internship",
      "Modern transport and smart-city infrastructure",
    ],
    whyStudy: CHINA_WHY,
  },
  {
    slug: "capital-medical-university",
    rank: 21,
    name: "Capital Medical University",
    shortName: "Capital Medical",
    country: "China",
    countrySlug: "china",
    flag: "🇨🇳",
    city: "Beijing",
    priority: 4,
    airport: "Beijing Capital International Airport",
    airportCode: "PEK",
    airportDistance: "≈ 30 km",
    airportDrive: "40 – 50 mins",
    course: "MBBS",
    duration: "6 Years (5 Years + 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "September",
    recognition: ["NMC", "WHO"],
    recognitionText: "NMC Eligible · WHO Recognized",
    affiliatedHospitals: "Multiple teaching hospitals (30+ affiliated)",
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Temperate monsoon — cold winters, warm summers",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    accent: "#9E2B32",
    blurb:
      "Beijing's own medical university, with 30+ affiliated teaching hospitals in the capital — the largest clinical network in the lineup alongside Nanjing.",
    about: [
      "Capital Medical University is located in Beijing and is one of the principal medical institutions in the Chinese capital. Its MBBS programme is delivered in English over six years, five academic years plus a one-year internship, with a September intake.",
      "It has more than thirty affiliated teaching hospitals across Beijing — the joint-largest clinical network in the client's China selection. The climate is temperate monsoon, with cold winters and warm summers, and Capital International Airport is roughly thirty kilometres from campus.",
      feesOnRequest("Capital Medical University"),
    ],
    highlights: [
      "30+ affiliated teaching hospitals in Beijing",
      "Located in the Chinese capital",
      "English-medium MBBS, September intake",
      "Six years including a one-year internship",
      "Strong research ecosystem",
      "Excellent international connectivity",
    ],
    whyStudy: CHINA_WHY,
  },

  /* ============================================================
     RETAINED — destinations from the 2026-27 portfolio that the
     current brochure does not cover. Kept at the client's
     instruction; fee data is the verified portfolio figure.
     ============================================================ */
  {
    slug: "fergana-medical-institute-of-public-health",
    rank: 22,
    name: "Fergana Medical Institute of Public Health",
    shortName: "Fergana Medical",
    country: "Uzbekistan",
    countrySlug: "uzbekistan",
    flag: "🇺🇿",
    city: "Fergana",
    priority: 5,
    airport: "Fergana International Airport",
    airportCode: "FEG",
    airportDistance: "~10 – 15 km",
    airportDrive: null,
    course: "MBBS",
    duration: "5 + 1 Years",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText: "Recognized by NMC (India), WHO & WDOMS",
    affiliatedHospitals: null,
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
    hasPublishedFees: true,
    accent: "#0E7C7B",
    blurb:
      "Central Asia's fast-rising medical destination — USD-denominated fees that shield you from currency volatility, a moderate climate, and food and culture close to home.",
    about: [
      "Fergana Medical Institute of Public Health is located in the Fergana Valley in eastern Uzbekistan. It is recognized by the National Medical Commission of India, approved by the World Health Organization, and listed in the World Directory of Medical Schools.",
      "The programme runs five academic years plus a one-year internship, taught in English. Fees are denominated in US dollars rather than local currency, which removes the exchange-rate uncertainty that affects programmes priced in a volatile local currency over a six-year horizon.",
      "Uzbekistan has invested heavily in its medical education sector over the past decade, and the Fergana Valley offers a warm, moderate climate and a food culture — plov, breads, kebabs, extensive vegetarian options — that Indian students adapt to quickly.",
    ],
    highlights: [
      "Fees in USD — no local-currency exchange exposure",
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
        body: "Uzbek cuisine, climate and hospitality are among the closest to India of any destination in the portfolio — the adjustment is genuinely easier.",
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
    rank: 23,
    name: "University of South Asia",
    shortName: "University of South Asia",
    country: "Kyrgyzstan",
    countrySlug: "kyrgyzstan",
    flag: "🇰🇬",
    city: "Bishkek",
    priority: 5,
    airport: "Manas International Airport",
    airportCode: "FRU",
    airportDistance: "~25 – 30 km",
    airportDrive: null,
    course: "MBBS",
    duration: "5.5 Years (Incl. 1 Year Internship)",
    durationYears: 5.5,
    medium: "English",
    intake: "Feb / Sept",
    recognition: ["ECFMG", "WHO"],
    recognitionText: "ECFMG & WHO Approved",
    affiliatedHospitals: null,
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
    hasPublishedFees: true,
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
];

export const UNIVERSITY_SLUGS = UNIVERSITIES.map((u) => u.slug);

export function getUniversity(slug: string): University | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}

export function universitiesByCountry(countrySlug: string): University[] {
  return UNIVERSITIES.filter((u) => u.countrySlug === countrySlug);
}

/** Universities we hold a published fee table for. Everything that
 *  renders a price should read from this, not from UNIVERSITIES. */
export const PRICED_UNIVERSITIES = UNIVERSITIES.filter((u) => u.hasPublishedFees);

export function universitiesByPriority(priority: number): University[] {
  return UNIVERSITIES.filter((u) => u.priority === priority);
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
    note: "Payable locally, usually annually. Requirements vary by destination.",
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
