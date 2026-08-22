/* ============================================================
   SOURCE OF TRUTH — universities and fee data.

   TWO GENERATIONS OF CLIENT MATERIAL SIT IN THIS FILE.

   1. "Global MBBS Admission Portfolio 2026-27" (earlier)
      Carries full fee tables. Six universities from it survive
      into the current lineup and keep their verified figures:
      GEOMEDI, Kemerovo, North Caucasian and Ingush, plus
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

   ---- FINAL MASTER UPDATE ----------------------------------
   UZBEKISTAN was removed in full at the client's instruction —
   the country, Fergana Medical Institute of Public Health, and
   every image, fee, FAQ and SEO reference attached to them.

   The Russian lineup was cut to the client's final four, in their
   exact order: North Caucasian State Academy, Ingush State
   University, Kemerovo State Medical University, Kazan State
   Medical University. Bashkir State (BSMU), Kazan Federal,
   Ulyanovsk State, Chuvash State and Kabardino-Balkarian State
   were removed. Old URLs redirect — see public/_redirects.ts.

   NEPAL was reinstated with a single college, Chitwan Medical
   College in Bharatpur. KIST was never published.

   Kazan State Medical University and Chitwan Medical College were
   written from official and authoritative sources, not from the
   client brochure, so they carry no fee table and no pass-rate,
   enrolment or safety figure. `hasPublishedFees: false`.

   NOTE ON SEMESTER SCHEDULES (portfolio universities only): the
   printed 6-row semester table reconciles exactly to the stated
   total for GEOMEDI and University of South Asia. For Kemerovo,
   North Caucasian and Ingush the printed rows sum to
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

  /* ---- Long-form sections, 2026 rewrite ---- */

  /** Living in the university's city. Written per city, shared by
   *  the universities that sit in it. */
  cityLife: { name: string; body: string };
  /** Campus facilities. Country-level defaults where the client's
   *  material describes the country rather than the institution. */
  facilities: string[];
  /** Hostel and accommodation, as the client's material sets it out. */
  hostel: string[];
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


/* ------------------------------------------------------------------
   CITY COPY, 2026 REWRITE

   Rewritten from the client's own city material where they publish
   it (Tbilisi, Batumi, Ufa, Almaty, Bishkek) and written fresh in
   the same voice where they do not. Descriptive geography only —
   no enrolment counts, no cost figures beyond those already
   verified elsewhere in this file.
   ------------------------------------------------------------------ */

const CITY_TBILISI = {
  name: "Tbilisi",
  body:
    "Georgia's capital sits on the banks of the Kura, and it is where almost all of Georgian medical education happens. It is a genuinely old city — Persian and Russian layers, Eastern Orthodox churches, art nouveau facades and Soviet modernist blocks, with the reconstructed Narikala fortress and the Kartlis Deda statue above it all. The climate is humid subtropical shading into continental: moderately cold winters, warm summers, rain spread across the year and an annual average around 13°C, which is a mild adjustment rather than a shock. For a student it means the largest Indian community in the country, a metro and cheap ride-hailing, Indian restaurants and messes, and a safe, walkable centre.",
};

const CITY_BATUMI = {
  name: "Batumi",
  body:
    "Georgia's second city and its principal Black Sea port. The climate here is subtropical rather than continental — milder winters, heavier rain and a coastline that shapes the whole feel of the place. Batumi is compact enough to walk, cheaper than the capital, and quieter, with a smaller but growing Indian student presence. It suits students who want Georgia's advantages without a capital-city pace.",
};

const CITY_KAZAN = {
  name: "Kazan",
  body:
    "The capital of Tatarstan, on the Volga, and one of Russia's great university cities — its academic tradition runs back more than two centuries. It is a genuinely mixed city, Tatar and Russian, with a preserved kremlin, a large student population and a milder climate than the Russian stereotype suggests. Living costs sit well below Moscow or St Petersburg.",
};




const CITY_KEMEROVO = {
  name: "Kemerovo",
  body:
    "The administrative centre of the Kuzbass region in western Siberia, and the coldest posting in our Russian lineup. It is an industrial city with a substantial regional hospital network attached to the university, and the costs are among the lowest we publish. The winter is the real thing and demands proper clothing — but it is a serious teaching institution, and the students who choose it know what they are choosing.",
};

const CITY_CHERKESSK = {
  name: "Cherkessk",
  body:
    "The capital of Karachay-Cherkessia in the northern Caucasus, set in the foothills of the mountains. Winters here are markedly milder than in northern or Siberian Russia and the summers are pleasant. It is a small, quiet city with a low cost base — one of the reasons this group carries the lowest total cost in the portfolio.",
};


const CITY_MAGAS = {
  name: "Magas",
  body:
    "The purpose-built capital of Ingushetia in the northern Caucasus — one of the newest cities in Russia, small, planned and quiet, in the mountainous south where winters are far milder than the Russian north. It is the lowest-cost posting in the entire portfolio, and the calm suits students who want a distraction-free six years.",
};

const CITY_BHARATPUR = {
  name: "Bharatpur",
  body:
    "Bharatpur is the largest city in the Chitwan district of south-central Nepal, on the banks of the Narayani river in the Terai lowlands, and it has grown into the medical hub of the region — the city carries several major hospitals as well as the college's own teaching hospital. It sits roughly midway between Kathmandu and the Indian border, with its own domestic airport and a good road connection south, which makes it one of the shortest journeys home of anywhere we place students. The climate is subtropical: hot summers, a monsoon from June to September, and mild dry winters that require nothing heavier than a jacket. Chitwan National Park, a UNESCO World Heritage site, is directly to the south.",
};

const NEPAL_FACILITIES = [
  "Teaching hospital on the college campus, with the clinical departments attached to it",
  "Anatomy, physiology, biochemistry, pathology and microbiology laboratories",
  "Central library with physical and digital medical resources",
  "Lecture theatres, tutorial rooms and skills-training facilities",
  "Campus canteen — Nepali and Indian food are effectively the same cuisine here",
  "On-campus student health services",
  "Sports and recreational facilities",
  "Internet access across academic and residential areas",
];

const NEPAL_HOSTEL = [
  "Separate hostel accommodation for male and female students",
  "Furnished rooms on a sharing basis, with study desks and storage",
  "Mess facilities serving vegetarian and non-vegetarian food",
  "Laundry and common-room facilities",
  "Internet access in the residential blocks",
  "Campus security with controlled entry",
  "No language barrier in daily life — Hindi is widely understood across Nepal",
  "Private accommodation in Bharatpur is available and affordable from the later years",
];

const NEPAL_WHY = [
  {
    title: "The shortest journey home in the portfolio",
    body: "Bharatpur is a short flight or an overland journey from the Indian border. No other destination we place into is this close, and across five and a half years that changes how often families actually visit.",
  },
  {
    title: "No language adjustment",
    body: "Teaching is in English, and Hindi is widely understood in daily life and on the ward. Of every destination in the portfolio this is the one where a student can take a patient history in a language they already speak.",
  },
  {
    title: "Curriculum close to the Indian syllabus",
    body: "Nepali MBBS curricula are structured similarly to Indian ones, which is directly relevant to how the FMGE or NExT preparation goes later.",
  },
  {
    title: "Regulated, published fee ceilings",
    body: "MBBS fees at Nepali colleges are capped by the Medical Education Commission rather than set freely by each institution — an unusual degree of price regulation for a private medical college.",
  },
];

const CITY_ALMATY = {
  name: "Almaty",
  body:
    "Kazakhstan's largest city and its commercial capital, set directly against the Tian Shan range — the mountains are visible from most of the city and they shape both the weather and the weekends. The name comes from the apple trees the region is known for. Almaty holds most of the country's financial sector and is the centre of Kazakh higher education, and its climate is genuinely extreme in both directions: hot summers, cold winters, sharpened by the mountainous terrain. For students it means a real city with a metro, a short direct flight home, and established Indian food supply.",
};

const CITY_NANJING = {
  name: "Nanjing",
  body:
    "A historic city on the Yangtze in Jiangsu province and a former capital of China, now one of the country's major academic centres. Summers are humid and winters cool. It has an established international student presence, a comprehensive metro system and high-speed rail links to Shanghai and Beijing.",
};

const CITY_GUANGZHOU = {
  name: "Guangzhou",
  body:
    "The commercial capital of southern China on the Pearl River, subtropical and warm through most of the year — by some distance the mildest winter in our Chinese lineup. It has one of the largest expatriate populations in the country, strong direct connectivity to India, and a food culture that students tend to enjoy rather than tolerate.",
};

const CITY_CHONGQING = {
  name: "Chongqing",
  body:
    "One of the largest municipalities in the world, in the mountainous southwest where the Jialing meets the Yangtze. It is humid subtropical, built vertically across steep terrain, and famous nationally for its food. The scale of the city is matched by the scale of the hospital network attached to the university.",
};

const CITY_TIANJIN = {
  name: "Tianjin",
  body:
    "A major northern port city half an hour from Beijing by high-speed rail, with a long history of international education and a visible European architectural legacy in its old concession districts. The climate is close to the capital's — hot summers, cold dry winters — at a noticeably lower cost of living.",
};

const CITY_BEIJING = {
  name: "Beijing",
  body:
    "China's capital and the centre of its medical research and health policy. Winters are cold and dry, summers hot, and the public transport system is among the best anywhere. For a medical student it means proximity to the largest teaching hospital networks in the country and to the institutions that set national clinical standards.",
};


const CITY_BISHKEK = {
  name: "Bishkek",
  body:
    "The capital of Kyrgyzstan and by a wide margin its largest city, laid out on a Soviet grid at the foot of the Tien Shan. It has a reputation as one of the safest capitals in Central Asia, with a low crime rate and petty theft as the main practical concern, and it is compact and walkable. Winters are snowy and drop to around -10°C, spring is mild and summers are warm and sunny. Osh and Dordoy bazaars, Panfilov and Dubovy parks, Erkindik boulevard and the historical museum are ordinary student life; Ala Archa national park, Lake Issyk-Kul and the Burana Tower are the weekends.",
};

/* ------------------------------------------------------------------
   FACILITIES AND HOSTEL COPY

   Stated at country level where the client's material describes the
   country rather than the institution, and overridden per university
   where they publish something specific.
   ------------------------------------------------------------------ */

const GEORGIA_FACILITIES = [
  "Modern lecture halls and seminar rooms built for interactive teaching",
  "Fully equipped practical laboratories and clinical skills rooms",
  "Central library with physical and digital access, and extended study hours",
  "Campus canteen with affordable meals, and Indian food available in the city",
  "On-campus medical centre for routine student healthcare",
  "Sports facilities and open recreational grounds",
  "Round-the-clock internet across academic and residential areas",
  "24/7 campus security with controlled entry and surveillance",
];

const GEORGIA_HOSTEL = [
  "Hostel accommodation on or adjacent to campus, maintained by dedicated staff",
  "Separate blocks for male and female students",
  "Twin and triple sharing, furnished with beds, study desks, wardrobes and storage",
  "Centralised heating and uninterrupted water supply for the local winter",
  "High-speed internet throughout the residential areas",
  "Laundry facilities on site or within the residential complex",
  "24/7 security with controlled entry and monitoring",
  "Food arrangements vary by residence — Indian messes, self-cooking and nearby Indian restaurants are all available",
];

const RUSSIA_FACILITIES = [
  "Well-equipped laboratories, smart classrooms and simulation facilities",
  "Attached research centres and institutes, open to students during the degree",
  "Library and reading rooms with extended access",
  "Campus canteen and dining hall, with Indian food at negligible extra cost",
  "On-campus medical centre and pharmacy point",
  "Gymnasium and sports facilities, plus organised cultural and sporting events",
  "24/7 internet access across campus and dormitories",
  "International Relations Office handling registration, visa extension and student support",
];

const RUSSIA_HOSTEL = [
  "Dormitory accommodation available to all international students",
  "Double and triple sharing, with separate blocks for men and women",
  "Rooms furnished with bed, mattress, bedding, blanket, desk, chair and wardrobe",
  "Centralised heating, uninterrupted water and electricity",
  "Communal kitchen and washing machines on the premises",
  "Dedicated Indian mess serving vegetarian and non-vegetarian meals",
  "24/7 CCTV surveillance, controlled entry, fire alarms and marked emergency exits",
  "Grocery shops and a medical point within the hostel's immediate vicinity",
];

const KAZAKHSTAN_FACILITIES = [
  "Trained faculty and teaching staff, supplemented by a visiting guest-faculty programme",
  "Modern laboratories and clinical training facilities",
  "Library and study spaces with extended hours",
  "Campus canteen, with Indian food available in Almaty",
  "On-campus medical support and student services",
  "Sports halls, swimming facilities and organised co-curricular activities",
  "Round-the-clock internet across campus",
  "A straightforward, documented admission process with no entrance examination",
];

const KAZAKHSTAN_HOSTEL = [
  "Several dormitory blocks per university, sited inside the campus so there is no daily commute",
  "Lodging, mess and laundry facilities within each block",
  "Rooms with built-in furniture, beds, bedsheets, quilts, mattresses and blankets",
  "Separate accommodation arrangements for male and female students",
  "Mess arrangements covering three meals a day",
  "Centralised heating for the Almaty winter, and uninterrupted water supply",
  "Internet access throughout the residential blocks",
  "Campus security with controlled entry",
];

const CHINA_FACILITIES = [
  "Advanced simulation laboratories and clinical skills centres",
  "Large affiliated teaching hospitals with current diagnostic technology",
  "Funded research laboratories, open to students during the degree",
  "Extensive libraries with digital and international journal access",
  "Campus canteens with multiple counters, including halal and vegetarian options",
  "On-campus medical centre and student health services",
  "Sports complexes, gymnasiums and organised student activities",
  "High-speed internet across academic and residential areas",
];

const CHINA_HOSTEL = [
  "University residences on or adjacent to campus, reserved for international students",
  "Typically twin sharing, furnished with beds, desks, wardrobes and storage",
  "Air conditioning and heating appropriate to the city's climate",
  "Private or shared bathrooms depending on the residence",
  "High-speed internet in every room",
  "Laundry facilities within the residential block",
  "24-hour security with controlled campus and building access",
  "Self-catering common from the later years, alongside campus canteen access",
];



const KYRGYZSTAN_FACILITIES = [
  "Well-equipped classrooms, laboratories and surgical training rooms",
  "Library and study spaces",
  "Campus canteen, with long-established Indian food supply across Bishkek",
  "On-campus medical support",
  "Sports and recreational facilities",
  "Round-the-clock internet access",
  "Campus security with controlled entry",
  "An established international student office used to Indian cohorts",
];

const KYRGYZSTAN_HOSTEL = [
  "Shared hostel rooms, furnished and heated for the Bishkek winter",
  "Separate blocks for male and female students",
  "Hostel mess serving Indian food, alongside a common kitchen for self-cooking",
  "Laundry facilities on the premises",
  "24-hour internet and security",
  "Uninterrupted water supply and centralised heating",
  "Grocery shops and Indian restaurants within easy reach of campus",
  "Private flats near campus are affordable from the later years",
];


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
      "The university runs its own University Clinic on campus, which is where a large part of the clinical teaching happens and where graduates are sometimes taken on directly. Alongside the core curriculum it runs USMLE Step 1 and Step 2 preparation and, from the fourth year, German language classes for students weighing a European postgraduate route. GEOMEDI is a signatory to the Lisbon Recognition Convention, the instrument that makes an academic qualification portable across the European higher education area.",
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
    cityLife: CITY_TBILISI,
    facilities: GEORGIA_FACILITIES,
    hostel: GEORGIA_HOSTEL,
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
      "Avicenna Batumi Medical University is located in Batumi, Georgia's principal Black Sea port and its second city. It delivers its medical programme in English to international students, and sits in our Priority 1 band — the group selected for how straightforward Indian students find the adjustment.",
      "Batumi is a markedly different proposition from Tbilisi: a coastal, subtropical climate rather than a continental one, a compact city that is quick to learn, and a cost base below the capital. Students who want Georgia's advantages without a capital-city environment tend to shortlist here.",
      "Batumi's compactness works in a first-year student's favour in a way that is easy to underrate: campus, accommodation and the city centre sit within a short distance of one another, which removes a whole category of friction that larger cities create in the first term. The subtropical coast also means the winter adjustment most students brace for never really arrives.",
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
    cityLife: CITY_BATUMI,
    facilities: GEORGIA_FACILITIES,
    hostel: GEORGIA_HOSTEL,
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
      "It sits in our Priority 1 band alongside the other Georgian universities — the group selected for ease of adaptation, cost of living, and proximity to India. Tbilisi's established Indian student community, Indian food supply and direct flight connectivity all apply here.",
      "GAU was established in Tbilisi in 2001 and is accredited by the Ministry of Education and Science of Georgia. It runs student-exchange arrangements with partner institutions in Europe, the United States, Canada and Australia, which gives students a route to academic mobility during the degree rather than only after it. The campus is deliberately international in composition, and its facilities — library, information centre, computer laboratories, common room and cafeteria — are built around that mix. Student-run educational, sporting and charitable projects are a visible part of life there.",
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
    cityLife: CITY_TBILISI,
    facilities: GEORGIA_FACILITIES,
    hostel: GEORGIA_HOSTEL,
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
      "SEU is part of our Priority 1 group — the Georgian universities selected because Indian students adapt to them most easily. That band is defined by pleasant climate, affordable living, a safer environment and a short flight home rather than by any single institutional feature.",
      "SEU was established in 2001 and operates from a modern, purpose-built campus in Tbilisi with sustained investment in medical teaching infrastructure: simulation-based clinical laboratories, 3D anatomy and anatomage tables, and structured cadaver-assisted learning. The programme follows European higher education standards under the Bologna Process and the university is listed in the World Directory of Medical Schools. There is no IELTS or TOEFL requirement — English competence is assessed through a university interview — and the campus carries accessibility provision for students with disabilities. SEU also operates a merit-based co-financing scheme that reduces tuition in later semesters for students who meet defined academic thresholds; it is not an entry-level scholarship and is awarded at the university's discretion.",
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
    cityLife: CITY_TBILISI,
    facilities: GEORGIA_FACILITIES,
    hostel: GEORGIA_HOSTEL,
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
      "It appears in our Priority 1 band: the Georgian group chosen for ease of adaptation. In practice that means a short flight from India, a familiar food supply in the city, low living costs and a straightforward visa process.",
      "What distinguishes East-West within the Tbilisi group is scale rather than location. It is a smaller institution than SEU or GAU, and students who want a capital-city posting — with the Indian community, the food supply and the direct connectivity that Tbilisi provides — but would rather not be one of a very large cohort tend to shortlist it against the bigger Tbilisi options.",
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
    cityLife: CITY_TBILISI,
    facilities: GEORGIA_FACILITIES,
    hostel: GEORGIA_HOSTEL,
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
      "It is the sixth Georgian university in our Priority 1 band. As with the rest of that group, the case for it rests on how straightforward Georgia is for an Indian student — climate, cost, food, safety and a short journey home — rather than on any one distinguishing claim.",
      "DTMU was founded in 1989 by David and Dimitri Tvildiani and has grown to include the AIETI medical school, a nursing school and doctoral programmes alongside the undergraduate degree. Its alumni practise as physicians in universities and clinics across the United States and Europe, and the university's reputation among Indian students rests on how deliberately it prepares them for international licensing examinations. It is affiliated with the Association of Medical Schools in Europe, the Association for Medical Education in Europe, FAIMER, ORPHEUS and the Eurasian Universities Union.",
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
    cityLife: CITY_TBILISI,
    facilities: GEORGIA_FACILITIES,
    hostel: GEORGIA_HOSTEL,
  },
  {
    slug: "north-caucasian-state-academy",
    rank: 7,
    name: "North Caucasian State Academy",
    shortName: "NCSA",
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
      "North Caucasian State Academy (NCSA) is located in Cherkessk, the capital of the Karachay-Cherkess Republic in southern Russia. The medical programme is delivered by the academy's Medical Institute, which sits within the North Caucasian State Humanitarian and Technological Academy — the institution's full registered name, and the one to look for when you verify its status. Teaching is in English throughout, to an international cohort.",
      "The six-year programme includes a one-year internship. As a dedicated medical academy rather than a general university, teaching resources are concentrated entirely on medical training — anatomy, physiology and clinical skills laboratories are the institution's core investment.",
      "Southern Russia offers a more temperate climate than the Siberian universities, and the region has a substantial Muslim and multi-ethnic population, which many Indian students find makes food and cultural adjustment easier.",
      "NCSA sits in Cherkessk, in the foothills of the Caucasus mountains, where winters are markedly milder than anywhere north of it. It teaches in English to an international cohort and carries verified fee data in this portfolio. For families weighing Russia's value proposition but worried about the cold, this is the part of the country that answers the objection.",
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
        title: "A dedicated medical institute",
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
    cityLife: CITY_CHERKESSK,
    facilities: RUSSIA_FACILITIES,
    hostel: RUSSIA_HOSTEL,
  },
  {
    slug: "ingush-state-university",
    rank: 8,
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
      "Ingush State University is in Magas, the purpose-built capital of Ingushetia in Russia's mountainous south, where the winters are far milder than the Russian stereotype. It carries the lowest verified total cost in this entire portfolio — approximately ₹15.91 lakh across six years including living costs — with no donation or capitation at any stage. It is a small, calm posting, and that suits students who want six distraction-free years at the lowest possible cost.",
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
    cityLife: CITY_MAGAS,
    facilities: RUSSIA_FACILITIES,
    hostel: RUSSIA_HOSTEL,
  },
  {
    slug: "kemerovo-state-medical-university",
    rank: 9,
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
      "Kemerovo State Medical University serves the Kuzbass region of western Siberia and is attached to a substantial regional hospital system — which is what produces the patient volume behind its clinical teaching. It is a demanding posting on climate and an unusually strong one on value, and it carries verified fee data in this portfolio rather than a figure quoted on request. Students who choose it do so with the winter in full view, and the ones who prepare for it properly do well there.",
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
    cityLife: CITY_KEMEROVO,
    facilities: RUSSIA_FACILITIES,
    hostel: RUSSIA_HOSTEL,
  },
  {
    slug: "kazan-state-medical-university",
    rank: 10,
    name: "Kazan State Medical University",
    shortName: "KSMU",
    country: "Russia",
    countrySlug: "russia",
    flag: "🇷🇺",
    city: "Kazan",
    priority: 2,
    airport: "Kazan International Airport",
    airportCode: "KZN",
    airportDistance: "~25 km",
    airportDrive: null,
    course: "MBBS",
    duration: "6 Years (Incl. 1 Year Internship)",
    durationYears: 6,
    medium: "English",
    intake: "Sept / Oct",
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText:
      "Listed in the World Directory of Medical Schools · NMC eligibility to be verified against current regulations",
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
    established: "1814",
    accent: "#1B4A9C",
    blurb:
      "Founded in 1814 and the third-oldest medical school in Russia — a state university in Kazan with its clinical teaching spread across the city's major hospitals.",
    about: [
      "Kazan State Medical University traces its foundation to 14 May 1814, when a medical faculty was established at the Imperial Kazan University. It became an independent medical institute in 1930 and was granted full university status in April 1994. After Moscow and St Petersburg it is the third-oldest institution of medical education in Russia. It is a separate institution from the federal university in the same city, with which it is sometimes confused.",
      "The university runs faculties in general medicine, paediatrics, dentistry, pharmacy, nursing and social work, alongside preventive medicine, biomedical science and postgraduate education. A dedicated faculty for work with international students was created in 2014, and the English-medium programme for overseas students sits within it.",
      "Its clinical teaching is not confined to a single campus hospital. Departments are distributed across leading hospitals throughout Kazan, which is what gives students access to a wide caseload rather than to whatever one institution happens to admit. The university's own clinic dates back to 1840 and its anatomical theatre to 1837.",
      "Kazan itself is the capital of Tatarstan and one of Russia's principal university cities, with a settled international student population drawn from across Asia, Africa and the Middle East. The university is listed in the World Directory of Medical Schools.",
      feesOnRequest("Kazan State Medical University"),
    ],
    highlights: [
      "Founded 1814 — the third-oldest medical school in Russia",
      "Full university status since 1994; a state institution",
      "Clinical departments across Kazan's major hospitals, not one campus ward",
      "English-medium programme within a dedicated international faculty",
      "Listed in the World Directory of Medical Schools",
      "No donation or capitation fee at any stage",
    ],
    whyStudy: RUSSIA_WHY,
    cityLife: CITY_KAZAN,
    facilities: RUSSIA_FACILITIES,
    hostel: RUSSIA_HOSTEL,
  },

  /* ============================================================
     PRIORITY 3 — KAZAKHSTAN · Affordable & Emerging Choice
     ============================================================ */
  {
    slug: "kazakh-national-medical-university",
    rank: 11,
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
      "Kazakh National Medical University is located in Almaty, Kazakhstan's largest city and its commercial centre. It delivers medical education to international students in English and heads our Priority 3 band — the destinations selected as affordable and emerging choices.",
      "Almaty sits against the Tian Shan mountains and has a continental climate that is comfortable through much of the year. Kazakhstan's proximity to India means a notably shorter flight than the Russian or Chinese options, which matters for both arrival and family visits.",
      "Established in 1930 and granted national university status in 2001, KazNMU is the largest medical campus in Kazakhstan and is recognised by the Ministry of Education and Science of the Republic of Kazakhstan alongside the WHO and WFME. It is taught by a very large faculty of clinicians, scientists and award-winning academics, and it supplements them with a visiting guest-faculty programme. Semesters run to five months, and English is the medium of instruction throughout the international programme.",
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
    cityLife: CITY_ALMATY,
    facilities: KAZAKHSTAN_FACILITIES,
    hostel: KAZAKHSTAN_HOSTEL,
  },
  {
    slug: "kazakh-russian-medical-university",
    rank: 12,
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
      "A medical university in Almaty teaching international cohorts in English, in our most economical destination band.",
    about: [
      "Kazakh Russian Medical University is based in Almaty and delivers its medical programme in English to international students. It is the second of the two Kazakh institutions in our current lineup.",
      "Kazakhstan sits in the Priority 3 band — the affordable and emerging choice. The case for it is economy without a long journey: modest tuition and living costs, a comfortable climate, Indian food available in the city, and a short flight from India.",
      "Founded in 1992 as the Kazakhstan Medical University, KRMU was established under Dr Mukhtar Aliyev of the Academy of Sciences of Kazakhstan and is regarded as one of the country's premier private medical institutions. Its teaching staff includes foreign scientists and clinicians alongside Kazakh faculty, and it runs an academic mobility programme that lets students study and practise abroad during the degree. Indian teaching staff prepare Indian students specifically for the Indian screening examination, and admission follows the rules set by the Government of the Republic of Kazakhstan.",
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
    cityLife: CITY_ALMATY,
    facilities: KAZAKHSTAN_FACILITIES,
    hostel: KAZAKHSTAN_HOSTEL,
  },

  /* ============================================================
     PRIORITY 4 — CHINA · Best for Infrastructure & Technology
     Per-university facts below are transcribed from the client's
     "Top 5 Medical Universities in China" comparison sheet. Its
     fee rows are printed blank, hence hasPublishedFees: false.
     ============================================================ */
  {
    slug: "nanjing-medical-university",
    rank: 13,
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
      "Nanjing Medical University is located in Nanjing, capital of Jiangsu Province, and heads our China selection. It teaches its MBBS programme in English across six years — five academic years plus a one-year internship — with a September intake.",
      "Its clinical strength is the affiliated hospital network: more than thirty teaching hospitals, the largest of the five Chinese universities in the lineup. Nanjing itself is a major eastern city with a humid subtropical climate, hot summers and mild winters, roughly forty kilometres from Lukou International Airport.",
      "Nanjing Medical University's clinical case rests on the scale of its affiliated network — 30+ teaching hospitals, the largest in our Chinese lineup alongside Capital Medical. The six-year English-medium programme runs five academic years plus a one-year internship on a single September intake, and Mandarin is taught alongside it because the clinical years put students in front of Chinese-speaking patients. It is a research-intensive institution, and undergraduates who want laboratory work can get it during the degree.",
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
    cityLife: CITY_NANJING,
    facilities: CHINA_FACILITIES,
    hostel: CHINA_HOSTEL,
  },
  {
    slug: "southern-medical-university",
    rank: 14,
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
      "Southern Medical University in Guangzhou offers the mildest climate in our Chinese lineup — subtropical and warm through most of the year, which removes the winter adjustment that the northern campuses demand. Its 20+ affiliated teaching hospitals sit in one of China's largest and best-connected cities, with strong direct routes to India and a substantial international population already in place.",
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
    cityLife: CITY_GUANGZHOU,
    facilities: CHINA_FACILITIES,
    hostel: CHINA_HOSTEL,
  },
  {
    slug: "chongqing-medical-university",
    rank: 15,
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
      "Chongqing Medical University sits in one of the largest municipalities in the world, in the mountainous southwest where the Jialing meets the Yangtze. Its 20+ affiliated teaching hospitals serve an enormous urban population, which is precisely what produces the case variety the later years are chosen for. The six-year English-medium programme runs on a single September intake, with Mandarin taught alongside for clinical communication.",
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
    cityLife: CITY_CHONGQING,
    facilities: CHINA_FACILITIES,
    hostel: CHINA_HOSTEL,
  },
  {
    slug: "tianjin-medical-university",
    rank: 16,
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
      "Tianjin Medical University has one of the longer histories of international medical education in China, in a major northern port city half an hour from Beijing by high-speed rail. It offers something specific: a Beijing-adjacent education, with 20+ affiliated teaching hospitals and comparable climate, at a noticeably lower cost of living than the capital itself.",
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
    cityLife: CITY_TIANJIN,
    facilities: CHINA_FACILITIES,
    hostel: CHINA_HOSTEL,
  },
  {
    slug: "capital-medical-university",
    rank: 17,
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
      "It has more than thirty affiliated teaching hospitals across Beijing — the joint-largest clinical network in our China selection. The climate is temperate monsoon, with cold winters and warm summers, and Capital International Airport is roughly thirty kilometres from campus.",
      "Capital Medical University sits in Beijing at the centre of Chinese medical research and health policy, and it carries one of the largest affiliated teaching hospital networks in the country — 30+ institutions, including several that set national clinical standards. For students who want proximity to the research and policy end of medicine as well as to patient volume, this is the strongest position in the Chinese lineup.",
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
    cityLife: CITY_BEIJING,
    facilities: CHINA_FACILITIES,
    hostel: CHINA_HOSTEL,
  },
  {
    slug: "chitwan-medical-college",
    rank: 18,
    name: "Chitwan Medical College",
    shortName: "CMC",
    country: "Nepal",
    countrySlug: "nepal",
    flag: "🇳🇵",
    city: "Bharatpur",
    priority: 5,
    airport: "Bharatpur Airport",
    airportCode: "BHR",
    airportDistance: "~5 km",
    airportDrive: null,
    course: "MBBS",
    duration: "4.5 + 1 Years (Incl. 1 Year Internship)",
    durationYears: 5.5,
    medium: "English",
    intake: "Per the Medical Education Commission admission calendar",
    recognition: ["NMC", "WHO", "WDOMS"],
    recognitionText:
      "Affiliated to Tribhuvan University · Recognized by the Nepal Medical Council · Listed in the World Directory of Medical Schools · NMC (India) eligibility to be verified against current regulations",
    affiliatedHospitals: null,
    fmgePassRate: null,
    indianStudents: null,
    safetyRating: null,
    climate: "Subtropical — hot summers, monsoon, mild winters",
    livingCost: null,
    currency: "VARIES",
    tuitionTotal: null,
    tuitionInr: null,
    totalExpense: null,
    totalExpenseInr: null,
    semesterSchedule: [null, null, null, null, null, null],
    hasPublishedFees: false,
    established: "2006",
    accent: "#A62B36",
    blurb:
      "Nepal's closest thing to studying at home — a Tribhuvan University-affiliated college in Bharatpur with its own 750-bed teaching hospital, taught in English, a short journey from the Indian border.",
    about: [
      "Chitwan Medical College was established in 2006 in Bharatpur, in Nepal's Chitwan district, and is affiliated to Tribhuvan University — Nepal's oldest and largest university, whose Institute of Medicine is the country's principal producer of medical graduates. The MBBS programme runs four and a half academic years followed by a one-year compulsory rotating internship.",
      "The college operates its own 750-bed teaching hospital on site, which is where the clinical years are spent. Alongside MBBS it runs undergraduate programmes in nursing, pharmacy and public health, and a substantial postgraduate portfolio including MD and MS specialities and DM/MCh super-speciality programmes — which means the teaching hospital functions as a genuine tertiary referral centre rather than a teaching annexe.",
      "It is recognized by the Nepal Medical Council, listed in the World Directory of Medical Schools, and holds quality-assurance accreditation from the University Grants Commission of Nepal. For Indian students, eligibility to sit FMGE or NExT on return is governed by the National Medical Commission's regulations as they stand at the time of admission and graduation — we confirm the current position in writing before anything is paid.",
      "Two things make Nepal genuinely different from every other destination in this portfolio. Teaching is in English and Hindi is widely understood, so there is effectively no language adjustment on the ward. And MBBS fees at Nepali colleges are capped by the Medical Education Commission rather than set by each college, with a published ceiling that is higher outside the Kathmandu Valley than inside it.",
      feesOnRequest("Chitwan Medical College"),
    ],
    highlights: [
      "Affiliated to Tribhuvan University, Nepal",
      "Its own 750-bed teaching hospital on campus",
      "MD, MS and DM/MCh programmes alongside the MBBS",
      "Recognized by the Nepal Medical Council; WDOMS listed",
      "English-medium teaching, with Hindi widely understood in daily life",
      "Fees regulated by Nepal's Medical Education Commission",
    ],
    whyStudy: NEPAL_WHY,
    cityLife: CITY_BHARATPUR,
    facilities: NEPAL_FACILITIES,
    hostel: NEPAL_HOSTEL,
  },
  {
    slug: "university-of-south-asia-kyrgyzstan",
    rank: 19,
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
      "The University of South Asia sits in Bishkek, which has hosted Indian medical students for over two decades — long enough that Indian restaurants, grocery supply, hostel messes, student associations and senior guidance are all settled before a new student arrives. The programme runs 5.5 years including a one-year internship, half a year shorter than the Russian route, with intakes in both February and September. One thing must be read before anything else on this page: this listing carries ECFMG and WHO recognition, not NMC. If the intention is to return to India and practise, confirm the current NMC position for this university in writing before committing to anything.",
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
    cityLife: CITY_BISHKEK,
    facilities: KYRGYZSTAN_FACILITIES,
    hostel: KYRGYZSTAN_HOSTEL,
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
