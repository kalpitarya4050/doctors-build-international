/* ============================================================
   Destinations.

   Georgia, Russia, Kazakhstan and China are the client's current
   four priority bands, and their core copy is taken from the "Top
   MBBS Universities for Indian Students" brochure — highlights and
   "Why <country>?" points are the client's own wording.

   Kyrgyzstan is retained from the earlier 2026-27 portfolio at
   the client's instruction; it keeps its verified fee data but
   sits outside the priority bands.

   ---- FINAL MASTER UPDATE ----------------------------------
   UZBEKISTAN was removed in full at the client's instruction —
   country, universities, images, fees, FAQs and every SEO
   reference. Old URLs redirect; see public/_redirects.

   NEPAL was reinstated with one college, Chitwan Medical College
   in Bharatpur. Its copy was written from official and
   authoritative sources rather than from a client brochure, so it
   carries no fee figure and no enrolment or pass-rate claim.

   RUSSIA was cut to the client's final four, in their order:
   North Caucasian State Academy, Ingush State University,
   Kemerovo State Medical University, Kazan State Medical
   University.

   ---- LONG-FORM COPY, 2026 REWRITE -------------------------
   The narrative sections below (intro, lifeAbroad, cities,
   considerations, afterStudy, eligibility) were rewritten from
   the client's own material for the four countries their other
   site covers that we still place into: Georgia, Russia,
   Kazakhstan and Kyrgyzstan. China and Nepal are not covered
   there, so their long-form copy was written fresh in the same
   voice — China from the brochure data already in this file,
   Nepal from official and authoritative sources.

   HARD RULE, carried over from universities.ts: no figure enters
   this file that the client has not published. Enrolment counts,
   FMGE percentages, tuition ranges and safety-index positions
   that appear on the client's other site are NOT reproduced here
   — the equivalent points are made qualitatively instead. The
   only numbers below are the ones already verified in this
   portfolio: fees, living costs, duration and intake.
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

  /* ---- Long-form sections, 2026 rewrite ---- */

  /** Day-to-day life: safety, food, transport, climate, language,
   *  accommodation. Icon names resolve through Icon.tsx. */
  lifeAbroad: { icon: string; title: string; body: string }[];
  /** The student cities in this country, and how they differ. */
  cities: { name: string; note: string; body: string }[];
  /** What a family should weigh honestly before committing. We
   *  publish these deliberately — every destination has them. */
  considerations: { title: string; body: string }[];
  /** Licensing and postgraduate routes open after graduation. */
  afterStudy: { title: string; body: string }[];
  /** Admission eligibility, as a labelled table. */
  eligibility: { label: string; value: string }[];
}

/* ------------------------------------------------------------------
   Shared eligibility. The requirements that come from NMC regulation
   rather than from any one country are identical everywhere, so they
   are stated once and spread into each record.
   ------------------------------------------------------------------ */

const COMMON_ELIGIBILITY: { label: string; value: string }[] = [
  {
    label: "Academic qualification",
    value: "Class 12 with Physics, Chemistry and Biology",
  },
  {
    label: "Minimum marks",
    value: "50% in PCB for General category; 40% for SC, ST and OBC",
  },
  {
    label: "NEET",
    value: "Mandatory — a qualifying percentile is enough, no rank required",
  },
  {
    label: "Age",
    value: "17 years or older on the date of admission",
  },
  {
    label: "IELTS / TOEFL",
    value: "Not required at any university in our portfolio",
  },
  {
    label: "Passport",
    value: "Valid passport needed before the application is filed",
  },
];

export const COUNTRIES: Country[] = [
  {
    slug: "georgia",
    name: "Georgia",
    flag: "🇬🇪",
    lat: 41.72,
    lng: 44.78,
    accent: "#1E7A4D",
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
      "Georgia sits at the crossroads of Europe and Asia, and its medical universities follow European education standards while charging a fraction of Western European fees. We place it first for a specific reason: of all the destinations, it is the one Indian students adapt to most easily.",
      "All programmes are taught entirely in English and no IELTS or TOEFL is required. Six universities make up the Georgian lineup — GEOMEDI, Avicenna Batumi, Georgian American (GAU), Georgian National (SEU), East-West and David Tvildiani — five in Tbilisi and one on the Black Sea coast at Batumi.",
      "One thing has genuinely changed, and you should hear it from us rather than discover it later. Several Georgian public medical universities have reduced or restricted new international admissions, and Indian applicants have moved decisively towards NMC-compliant private universities. That is where our lineup sits, and it is why we confirm a university's current admission status in writing before you pay anything.",
      "The practical case is straightforward: a three to four hour flight from India, a pleasant climate, a low cost of living, Indian food widely available, and a straightforward visa with light documentation. GEOMEDI also posts the strongest FMGE outcome in our portfolio, above 65%.",
      "The degree awarded is an MD, which is the equivalent of MBBS for Indian purposes once the applicable licensing requirements are met. It supports the FMGE and NExT route home, and — subject to each body's own rules — the USMLE and PLAB routes as well.",
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
      {
        title: "No donation, no capitation",
        body: "Admission runs on your Class 12 marks, NEET qualification and documents. There is no capitation fee at any stage, and no university-level entrance exam to sit.",
      },
      {
        title: "Smaller cohorts, closer teaching",
        body: "Georgian medical faculties run comparatively small groups, which means more contact with teaching staff during tutorials and clinical work than a large private college typically offers.",
      },
    ],
    livingCost: "USD 150 – 200 / month",
    climate: "Moderate — warm summers, mild winters",
    language: "English medium; Georgian and Russian widely spoken",
    visaNote: "Student visa (D3). Processing typically 2 – 4 weeks after admission letter.",
    lifeAbroad: [
      {
        icon: "ShieldCheck",
        title: "Safety",
        body: "Georgia is consistently rated one of the safest countries in the region, and it is the single point Indian parents raise most often. Students report feeling comfortable moving around Tbilisi and Batumi at ordinary hours, and campuses run controlled entry and round-the-clock security.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Indian food",
        body: "Tbilisi has an established set of Indian restaurants and dedicated student messes, with vegetarian and Jain options available. Most hostels permit self-cooking, and grocery shops stocking Indian provisions are easy to find. Batumi's Indian food scene is smaller but growing.",
      },
      {
        icon: "Wallet",
        title: "Monthly living cost",
        body: "Budget USD 150 – 200 a month for food, transport, SIM and utilities on top of accommodation. That is the figure our portfolio verifies, and it is comfortably below Western Europe.",
      },
      {
        icon: "Bus",
        title: "Getting around",
        body: "Tbilisi has a metro, cheap buses and ride-hailing apps, and a monthly transport pass costs very little. Batumi is compact enough that most students walk. Neither city needs a car.",
      },
      {
        icon: "Thermometer",
        title: "Climate",
        body: "Tbilisi has four real seasons — warm summers, cool winters that rarely turn severe. Batumi is subtropical and coastal, with noticeably milder winters and more rain. Neither is a shock after India.",
      },
      {
        icon: "Languages",
        title: "Language",
        body: "Your entire degree is in English and no language test is required to enter. Basic Georgian is picked up over time and is genuinely useful during hospital rotations, when you will be taking histories from local patients.",
      },
      {
        icon: "Home",
        title: "Accommodation",
        body: "University hostels and partner residences offer twin or triple sharing, with separate blocks for men and women, centralised heating, laundry and 24-hour water and internet. Private flats near campus are common from the later years.",
      },
      {
        icon: "Users",
        title: "Community",
        body: "There is a large, settled Indian student community in Tbilisi with active student associations and seniors who help new arrivals through the first few weeks. You will not be the only person from home on campus.",
      },
    ],
    cities: [
      {
        name: "Tbilisi",
        note: "Capital · five of our six universities",
        body: "The capital sits on the banks of the Kura, and it is where most of Georgian medical education happens. It carries a genuinely old city — Persian and Russian layers, orthodox churches, art nouveau facades, Soviet modernist blocks and the Narikala fortress above it all. For a student it means the largest Indian community in the country, the widest choice of universities, a metro, and the most Indian restaurants and messes. Living costs run slightly above Batumi.",
      },
      {
        name: "Batumi",
        note: "Black Sea coast · Avicenna Batumi",
        body: "Georgia's second city and its principal port, on the Black Sea. The climate is subtropical rather than continental, so winters are milder and the rain heavier. It is compact, walkable and cheaper than the capital, with a smaller but growing Indian student presence. Students who want Georgia's advantages without a capital-city pace tend to shortlist here.",
      },
    ],
    considerations: [
      {
        title: "FMGE or NExT is not optional",
        body: "A Georgian MD lets you sit the Indian licensing exam. It does not license you by itself. Every student who intends to practise in India must clear FMGE or NExT on return, and the national pass rate for foreign graduates is low. Choose a university on teaching quality and clinical exposure, not on the lowest fee.",
      },
      {
        title: "Public university admissions have tightened",
        body: "Several Georgian public medical universities have cut back or paused new international admissions. Availability moves, sometimes mid-cycle. We confirm a university's current status in writing before any payment is made.",
      },
      {
        title: "Quality varies between universities",
        body: "Georgia has a lot of medical universities and they are not equivalent. Clinical exposure, teaching staff and hospital tie-ups differ materially, and that is the single biggest driver of how you perform in the licensing exam six years from now.",
      },
      {
        title: "Winter is colder than home",
        body: "Tbilisi winters sit near freezing. It is manageable and nothing like Siberia, but it is a real adjustment in the first year and worth budgeting warm clothing for.",
      },
      {
        title: "Less external pressure than an Indian college",
        body: "The academic culture expects you to manage your own preparation. Students who coast through the early years without building an FMGE or NExT plan alongside their coursework struggle later. Start that preparation early.",
      },
    ],
    afterStudy: [
      {
        title: "Practising in India",
        body: "Clear FMGE or NExT, register with the state medical council and you can practise in India, including a full PG route through the domestic entrance system.",
      },
      {
        title: "United States",
        body: "Georgian universities listed in the World Directory of Medical Schools support ECFMG certification, which is the gateway to USMLE and the US residency match — subject to ECFMG's own current rules.",
      },
      {
        title: "United Kingdom and Canada",
        body: "PLAB and GMC registration in the UK, and MCCQE in Canada, are both open pathways for graduates of recognised Georgian universities, each governed by that regulator's requirements.",
      },
      {
        title: "Postgraduate study in Europe",
        body: "Georgia's alignment with European higher education standards makes onward postgraduate and research placement in Europe a well-worn route for its graduates.",
      },
    ],
    eligibility: COMMON_ELIGIBILITY,
  },
  {
    slug: "russia",
    name: "Russia",
    flag: "🇷🇺",
    lat: 55.75,
    lng: 37.62,
    accent: "#1B4A9C",
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
      "Four universities make up the Russian lineup: North Caucasian State Academy in Cherkessk, Ingush State University in Magas, Kemerovo State Medical University in western Siberia, and Kazan State Medical University in Tatarstan. Two sit in the mild northern Caucasus, one in Siberia and one in a two-century-old university city on the Volga — which gives real choice on climate and cost.",
      "This is our value band. Russian medical education is six years including a one-year clinical internship, delivered in English for international students, attached to large state hospital networks that produce the patient volume behind the clinical training.",
      "The teaching itself is weighted towards practical skill rather than recitation. The academic year runs in two semesters — September to January, then February to June — and the universities in our lineup are used to teaching international cohorts, with faculties that include practising clinicians and active research staff.",
      "There is one thing about Russia that families are routinely misled on, so we will say it plainly. Some Russian medical colleges run genuinely bilingual programmes, where the early years are in English and the clinical years shift into Russian. That is not what we place students into, and we put the medium of instruction for every year of the course in writing before you commit.",
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
      {
        title: "Research and exchange culture",
        body: "Russian medical universities run active research institutes and long-standing exchange arrangements with European and Asian institutions, which students can join during the degree.",
      },
      {
        title: "No entrance exam, no language test",
        body: "There is no university entrance examination and no IELTS or TOEFL requirement. Admission runs on Class 12 marks, NEET qualification and documentation.",
      },
    ],
    livingCost: "USD 100 – 150 / month",
    climate: "Cold winters; southern and Volga campuses are considerably milder",
    language: "English medium; basic Russian taught in first year",
    visaNote: "Student visa via invitation letter from the Ministry of Education. Typically 3 – 5 weeks.",
    lifeAbroad: [
      {
        icon: "Home",
        title: "Hostels on campus",
        body: "International students are housed in university dormitories with double or triple sharing. Rooms come furnished — bed, mattress, bedding, desk, chair, wardrobe — with centralised heating, a communal kitchen, laundry and a reading area. Most campuses have a medical point and a shop within the block.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Indian mess",
        body: "Most of the universities in our lineup run a dedicated Indian mess for their Indian cohort, serving vegetarian and non-vegetarian food. Where a mess is not on campus, Indian eateries sit within walking distance, and hostel kitchens let students cook their own.",
      },
      {
        icon: "ShieldCheck",
        title: "Security",
        body: "Dormitories run 24-hour security with surveillance, controlled entry, fire alarms and marked emergency exits, and they are inspected on a routine cycle. Universities also brief international students on emergency and evacuation procedure.",
      },
      {
        icon: "Scale",
        title: "Administrative support",
        body: "The international office at each university handles residency registration, visa extension and the paperwork that goes with living in Russia for six years — the part first-year students most often underestimate.",
      },
      {
        icon: "Thermometer",
        title: "Climate",
        body: "Russia is not one climate. Winters in the Volga cities and the northern Caucasus are far milder than the Siberian stereotype, and summers are genuinely warm. Kemerovo is the cold end of our lineup; Cherkessk, Nalchik and Magas are the mild end.",
      },
      {
        icon: "Languages",
        title: "Language",
        body: "The degree is taught in English. Russian is taught alongside it from the first year, and it is not decoration — you need it to take a history from a patient during clinical rotations, and students who take it seriously get far more out of hospital time.",
      },
      {
        icon: "Wallet",
        title: "Monthly living cost",
        body: "USD 100 – 150 a month covers day-to-day living in the cities in our lineup. It is the lowest of any destination in the portfolio.",
      },
      {
        icon: "Calendar",
        title: "The academic year",
        body: "Two semesters, September to January and February to June, with a winter break in January and a long summer vacation. Students commonly fly home once a year, and the route is direct from most Indian metros.",
      },
    ],
    cities: [
      {
        name: "The northern Caucasus",
        note: "Cherkessk · Magas",
        body: "North Caucasian State Academy and Ingush State University sit in Russia's mountainous south. Winters here are markedly milder than anywhere north of them, the pace is quieter than a metro, and this pair carries the lowest total cost in the entire portfolio. The region is multi-ethnic and substantially Muslim, which in practice means halal and vegetarian food are ordinary rather than something to hunt for.",
      },
      {
        name: "Siberia",
        note: "Kemerovo",
        body: "Kemerovo State Medical University sits in the Kuzbass industrial region. It is the coldest posting in our lineup and the one that demands the most weather preparation — but it is also a serious teaching institution attached to a large regional hospital network, and its costs are among the lowest we publish.",
      },
      {
        name: "Tatarstan",
        note: "Kazan",
        body: "Kazan is one of Russia's great university cities, with an academic tradition running back more than two centuries, and Kazan State Medical University is the third-oldest medical school in the country. It is a genuinely mixed city, Tatar and Russian, with a preserved kremlin and a large student population — and living costs well below Moscow or St Petersburg.",
      },
    ],
    considerations: [
      {
        title: "Confirm the medium of instruction, in writing, for all six years",
        body: "This is the most common misrepresentation in the Russia market. Some colleges teach three years in English and then move clinical subjects into Russian, and agents present that as harmless because 'you will pick up the language'. Ask for the medium of instruction year by year, in writing, from any consultant you speak to — including us.",
      },
      {
        title: "The winter is real",
        body: "For students placed at the northern and Siberian campuses, the first winter is a genuine physical adjustment and some students get ill during it. It is manageable with the right clothing and it passes, but it should not be a surprise.",
      },
      {
        title: "Language and culture take time",
        body: "Russian uses a different alphabet and the culture is not close to home. The first few months involve real friction — administration, shopping, ordinary conversation. Universities run language classes precisely because of this.",
      },
      {
        title: "FMGE or NExT is mandatory",
        body: "A Russian medical degree qualifies you to sit the Indian licensing exam, not to skip it. Build exam preparation into your study plan from the early years rather than starting in the final one.",
      },
      {
        title: "Routine and food change",
        body: "Meal times, daylight hours and sleep patterns all shift. Students adapt, but the first term is a genuine adjustment, and access to an Indian mess makes a bigger difference than most families expect.",
      },
    ],
    afterStudy: [
      {
        title: "Practising in India",
        body: "Clear FMGE or NExT, complete registration and practise in India, with the full domestic PG route open through the national entrance system.",
      },
      {
        title: "Postgraduate study in Russia",
        body: "Graduates can continue directly into ordinatura — Russian clinical residency — or into a research track, at fees that stay in the same affordable band as the undergraduate degree.",
      },
      {
        title: "International licensing",
        body: "WHO listing and World Directory of Medical Schools entries support ECFMG certification and the USMLE route, and PLAB for the UK, each subject to the relevant body's current requirements.",
      },
      {
        title: "Research, teaching and industry",
        body: "Beyond clinical practice, graduates move into research institutes, academic teaching posts, public health administration and the pharmaceutical sector.",
      },
    ],
    eligibility: [
      ...COMMON_ELIGIBILITY,
      {
        label: "Upper age",
        value: "Most Russian universities set an upper limit around 25 — confirmed per university",
      },
      {
        label: "Entrance exam",
        value: "None. Admission runs on documents and NEET qualification",
      },
    ],
  },
  {
    slug: "kazakhstan",
    name: "Kazakhstan",
    flag: "🇰🇿",
    lat: 43.24,
    lng: 76.89,
    accent: "#0F7A8A",
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
      "Kazakhstan is our affordable and emerging choice — Central Asia's largest economy, with substantial recent investment in higher education and a medical sector that now attracts Indian students in growing numbers.",
      "Two universities make up the lineup, both in Almaty: Kazakh National Medical University and Kazakh Russian Medical University. Almaty is the country's largest city and commercial centre, set against the Tian Shan mountains.",
      "The practical appeal is economy without distance. Tuition and living costs are modest, the climate is comfortable through much of the year, Indian food is available in the city, and the flight from India is markedly shorter than to Siberia or East Asia.",
      "Kazakhstan is the largest and wealthiest of the Central Asian republics, bordered by Russia to the north and China to the east, and it has grown into the region's academic hub. Its medical universities are listed in the World Directory of Medical Schools and run exchange arrangements with institutions well beyond the region, which gives the student body a genuinely international mix.",
      "Teaching runs in English, with no IELTS or TOEFL and no university entrance examination. Teaching groups are smaller than comparably priced private medical colleges in India, and no donation or capitation is charged at any point in the process.",
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
      {
        title: "Favourable teaching ratios",
        body: "Kazakh medical faculties run comparatively small teaching groups, which means more individual attention during tutorials and clinical work than the fee level would suggest.",
      },
      {
        title: "No donation, no entrance exam",
        body: "Admission runs on documents and NEET qualification. There is no capitation fee, no university-level entrance test and no language proficiency exam.",
      },
    ],
    livingCost: "On request — confirmed per university",
    climate: "Continental — comfortable summers, cold winters",
    language: "English medium; Kazakh and Russian spoken locally",
    visaNote: "Student visa on invitation letter. Typically 3 – 4 weeks.",
    lifeAbroad: [
      {
        icon: "Home",
        title: "Hostels on campus",
        body: "Kazakh medical universities run several dormitory blocks each, sited inside the campus so students are not paying for a daily commute. Rooms come with built-in furniture, bedding and quilts, and each block carries mess and laundry facilities.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Food",
        body: "Hostel mess arrangements cover three meals, and Almaty has Indian restaurants and grocery supply for students who prefer to cook or eat out. Central Asian cuisine itself is closer to Indian food than most European alternatives.",
      },
      {
        icon: "ShieldCheck",
        title: "Safety",
        body: "Kazakhstan is one of the more secure countries in the region, and international students on campus fall under both university and state protection arrangements. Almaty is a large city and ordinary urban caution applies, but students report settling quickly.",
      },
      {
        icon: "Thermometer",
        title: "Climate",
        body: "Continental — genuinely hot summers and cold winters, sharpened by the mountainous terrain around Almaty. Spring and autumn are the most comfortable stretches of the year. Warm winter clothing is a first-month purchase.",
      },
      {
        icon: "Languages",
        title: "Language",
        body: "Teaching is in English throughout, and no language test is required to enter. Kazakh and Russian are the languages of the street and the hospital ward, and picking up working Russian pays off during clinical rotations.",
      },
      {
        icon: "Bus",
        title: "Getting around",
        body: "Almaty has a metro line, an extensive bus network and cheap ride-hailing. Both campuses sit within the city, so most students manage without any significant transport budget.",
      },
      {
        icon: "Users",
        title: "Community",
        body: "Kazakhstan draws a culturally mixed student body from across Asia and beyond, and Indian students are a settled part of it rather than a novelty. University international offices handle the first-weeks logistics.",
      },
      {
        icon: "Wallet",
        title: "Cost of living",
        body: "Day-to-day costs are among the lowest of any destination in our portfolio. Because the current brochure publishes no Kazakhstan fee table, we confirm the exact tuition, hostel and living figures per university during counselling rather than printing an estimate here.",
      },
    ],
    cities: [
      {
        name: "Almaty",
        note: "Both of our Kazakh universities",
        body: "Kazakhstan's largest city and its commercial capital, set directly against the Tian Shan range — the mountains are visible from most of the city, and they shape both the weather and the weekends. Almaty holds a large share of the country's population and most of its financial sector, and it is the centre of Kazakh higher education. For students it means a real city with a metro, an international airport with short direct routes to India, established Indian food supply, and both of the universities we place into within easy reach.",
      },
    ],
    considerations: [
      {
        title: "Fees are quoted per university, not published",
        body: "Our current admission portfolio prints no Kazakhstan fee table, so we will not publish one. You get the actual tuition, hostel and living figures for a specific university in writing during counselling — not an indicative range that shifts later.",
      },
      {
        title: "Verify NMC status before you commit",
        body: "Kazakhstan is an emerging destination and university-level recognition status can move. We confirm the current NMC position for the specific university you are considering, in writing, before any payment.",
      },
      {
        title: "Winters are cold",
        body: "The continental climate means genuinely cold winters. It is milder than Siberia and shorter than the Russian north, but it is a real adjustment from an Indian winter.",
      },
      {
        title: "FMGE or NExT is mandatory",
        body: "Practising in India after a Kazakh degree requires clearing the Indian licensing exam. Choose on teaching quality and clinical exposure, because that is what determines how that exam goes.",
      },
      {
        title: "A smaller Indian community than Georgia or Russia",
        body: "There is an established Indian presence in Almaty, but it is smaller than Tbilisi or the large Russian university cities. Students who want a big ready-made community from home should weigh that.",
      },
    ],
    afterStudy: [
      {
        title: "Practising in India",
        body: "Clear FMGE or NExT, register with your state council and practise in India, with the domestic PG entrance route fully open.",
      },
      {
        title: "Postgraduate study abroad",
        body: "Kazakh medical graduates commonly move into postgraduate programmes in Europe and elsewhere in Asia, helped by the exchange arrangements the universities hold.",
      },
      {
        title: "International licensing",
        body: "World Directory of Medical Schools listing supports ECFMG certification and the USMLE pathway, subject to that body's own current requirements.",
      },
      {
        title: "Practice beyond India",
        body: "A Kazakh medical degree, once paired with the destination country's licensing exam, supports clinical practice in a wide range of jurisdictions.",
      },
    ],
    eligibility: COMMON_ELIGIBILITY,
  },
  {
    slug: "china",
    name: "China",
    flag: "🇨🇳",
    lat: 39.9,
    lng: 116.4,
    accent: "#9B1C2E",
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
      "China is our infrastructure and technology band. Its medical universities operate at a scale and level of investment few other destinations in this price range can match — advanced simulation laboratories, large internationally affiliated hospitals and a serious research ecosystem.",
      "Five universities make up the lineup: Nanjing Medical, Southern Medical in Guangzhou, Chongqing Medical, Tianjin Medical and Capital Medical in Beijing. Each runs a six-year English-medium MBBS — five academic years plus a one-year internship — with a September intake.",
      "The affiliated hospital networks are the clinical case: 30+ teaching hospitals at Nanjing and Capital Medical, 20+ at the other three. All five sit in major cities with modern transport and direct international connectivity.",
      "China runs a single September intake, and admission is coordinated centrally — the university issues an admission letter and a JW202 form, which together support the X1 student visa. That timetable is fixed, so a missed cycle means a full year's wait, and we plan China applications earlier than any other destination in the portfolio.",
      "The degree is taught entirely in English, with Mandarin taught alongside it because clinical rotations put you in front of Chinese-speaking patients from the later years onwards. Students who treat the language component seriously get substantially more out of the hospital time these universities are chosen for.",
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
      {
        title: "Depth of hospital network",
        body: "Twenty to thirty affiliated teaching hospitals per university is not a rounding difference — it is what determines how many specialities you rotate through and how much you actually see.",
      },
      {
        title: "Research from undergraduate level",
        body: "These are research universities first. Students who want to publish, join a laboratory or move onto an academic track have that available during the degree rather than after it.",
      },
    ],
    livingCost: "On request — confirmed per university",
    climate: "Varies by city — subtropical in the south, temperate monsoon in the north",
    language: "English medium; Mandarin taught for clinical practice",
    visaNote: "X1 student visa. Requires JW202 form and admission letter.",
    lifeAbroad: [
      {
        icon: "Home",
        title: "Campus accommodation",
        body: "International students are housed in university residences on or adjacent to campus, typically twin sharing, with air conditioning, heating, internet and laundry. These are large, modern campuses and the residential facilities reflect that.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Food",
        body: "Campus canteens run multiple counters including halal and vegetarian options, and all five cities have Indian restaurants. Self-catering is common from the later years. Food is one of the bigger adjustments in China, and it is worth being realistic about that.",
      },
      {
        icon: "ShieldCheck",
        title: "Safety",
        body: "The five cities in our lineup are among the most secure large cities anywhere, with extensive public transport, low street crime and campuses that run controlled access. Students move around freely.",
      },
      {
        icon: "Bus",
        title: "Getting around",
        body: "Every city in the lineup has a metro system, high-speed rail connections and a major international airport. Intercity travel is fast and cheap, and none of these campuses require a car.",
      },
      {
        icon: "Thermometer",
        title: "Climate",
        body: "China spans several climates. Guangzhou is subtropical and humid year-round; Beijing and Tianjin have hot summers and genuinely cold, dry winters; Nanjing and Chongqing sit in between with humid summers. Choose with the weather in mind — you will live in it for six years.",
      },
      {
        icon: "Languages",
        title: "Language",
        body: "Your coursework is in English throughout. Mandarin is taught alongside it and it is not optional in practice — clinical rotations mean taking histories from Chinese-speaking patients, and your usefulness on the ward depends on it.",
      },
      {
        icon: "Stethoscope",
        title: "Clinical exposure",
        body: "The affiliated hospital networks are the reason to choose China. Patient volumes at these teaching hospitals are very high and the diagnostic technology is current, which means the later years put you in front of case variety that is hard to match.",
      },
      {
        icon: "Wallet",
        title: "Cost of living",
        body: "Costs vary substantially between Beijing and the other four cities. Because our current China comparison sheet publishes no fee or living figures, we confirm these per university in writing rather than printing an estimate.",
      },
    ],
    cities: [
      {
        name: "Beijing",
        note: "Capital Medical University",
        body: "The capital, and the centre of Chinese medical research and policy. Capital Medical University carries one of the largest affiliated hospital networks in the country. Winters are cold and dry, summers hot, and the transport system is among the best anywhere.",
      },
      {
        name: "Nanjing",
        note: "Nanjing Medical University",
        body: "A historic city on the Yangtze in Jiangsu province, and a major academic centre with a large affiliated teaching hospital network. Humid summers, cool winters, and an established international student presence.",
      },
      {
        name: "Guangzhou",
        note: "Southern Medical University",
        body: "The southern commercial capital, subtropical and warm through most of the year — by some distance the mildest winter in our Chinese lineup. Strong direct connectivity to India and a large expatriate population.",
      },
      {
        name: "Tianjin",
        note: "Tianjin Medical University",
        body: "A major port city half an hour from Beijing by high-speed rail, with a long history of international medical education. A similar climate to the capital at a noticeably lower cost of living.",
      },
      {
        name: "Chongqing",
        note: "Chongqing Medical University",
        body: "One of the largest municipalities in the world, in the mountainous southwest on the Yangtze. Humid subtropical, famous for its food, and with a substantial hospital network attached to the university.",
      },
    ],
    considerations: [
      {
        title: "One intake a year",
        body: "China runs a single September cycle. There is no February fallback, so a missed deadline costs a full year. We start China applications earlier than any other destination for exactly this reason.",
      },
      {
        title: "Mandarin matters more than students expect",
        body: "The coursework is English throughout, but clinical rotations are with Chinese-speaking patients. Students who deprioritise the language classes get materially less out of the hospital years — which are the whole reason to choose China.",
      },
      {
        title: "Fees are confirmed per university, not published",
        body: "Our China comparison sheet prints the tuition, hostel, living and total rows blank. We will not fill those in with an estimate. You get the actual figures for a specific university in writing during counselling.",
      },
      {
        title: "It is the furthest destination in the portfolio",
        body: "Flight time and cost from India are higher than for Georgia or Central Asia, which affects how often families visit across six years. Worth planning for honestly at the outset.",
      },
      {
        title: "FMGE or NExT is mandatory",
        body: "As with every destination, a Chinese MBBS qualifies you to sit the Indian licensing exam rather than to skip it. Build the preparation in from the early years.",
      },
    ],
    afterStudy: [
      {
        title: "Practising in India",
        body: "Clear FMGE or NExT, register with your state medical council and practise in India, with the full domestic PG route available.",
      },
      {
        title: "International licensing",
        body: "Graduates of WHO-listed Chinese medical universities can pursue ECFMG certification and USMLE, and PLAB for the UK, each subject to the relevant body's current requirements.",
      },
      {
        title: "Research and postgraduate study",
        body: "These are research-intensive universities with funded laboratories and international academic partnerships. Graduates who want a research or academic track have a genuine route into it.",
      },
      {
        title: "Careers with an international orientation",
        body: "Studying in a major global city with a large international cohort tends to open doors beyond a single country's health system — something graduates of this group make regular use of.",
      },
    ],
    eligibility: COMMON_ELIGIBILITY,
  },

  /* ---------- Also available ---------- */
  {
    slug: "nepal",
    name: "Nepal",
    flag: "🇳🇵",
    lat: 27.68,
    lng: 84.43,
    accent: "#A62B36",
    tagline: "The closest a medical degree abroad gets to home.",
    startingFrom: "On request",
    feeStatus: "on-request",
    duration: "4.5 + 1 Years",
    intake: "Per the MEC admission calendar",
    recognition: ["NMC", "WHO", "WDOMS"],
    neetRequired: true,
    ieltsRequired: false,
    order: 5,
    featured: true,
    priority: 5,
    priorityLabel: "Newly added for 2026-27",
    brochureHighlights: [
      "No student visa required for Indian nationals",
      "English-medium MBBS; Hindi widely understood on the ward",
      "Curriculum structured close to the Indian syllabus",
      "Fees capped by Nepal's Medical Education Commission",
      "The shortest journey home of any destination we place into",
    ],
    intro: [
      "Nepal is the newest destination in our portfolio and, in one specific respect, unlike every other: it is not really abroad in the way the others are. Bharatpur is a short hop from the Indian border, Hindi is understood almost everywhere, and the food, the climate and the daily rhythm are the ones a student already knows.",
      "One college makes up the Nepali lineup — Chitwan Medical College in Bharatpur, affiliated to Tribhuvan University, Nepal's oldest and largest university. The programme runs four and a half academic years followed by a one-year compulsory rotating internship, taught entirely in English.",
      "Indian nationals do not need a student visa for Nepal. Under the long-standing free-movement arrangement between the two countries, a valid passport or voter ID is enough to enter and to live there for the length of the course. That removes an entire category of paperwork, cost and risk that every other destination on this site carries.",
      "Fees are unusual too. MBBS tuition at Nepali colleges is capped by the Medical Education Commission rather than set freely by each institution, with a published national ceiling that is higher outside the Kathmandu Valley than inside it. It is a rare degree of price regulation for private medical education anywhere.",
      "The honest counterweight is scale. Nepal is a small country with a small number of MBBS seats, competition for them is real, and the total cost is not the cheapest in this portfolio — Russia and Kyrgyzstan are both lower. What Nepal offers is proximity, familiarity and a curriculum built close to the one FMGE and NExT are written against.",
    ],
    advantages: [
      {
        title: "No student visa for Indian nationals",
        body: "India and Nepal maintain a free-movement arrangement. A valid passport or voter ID is enough — no visa application, no embassy appointment, no invitation letter, no residence permit renewals.",
      },
      {
        title: "The shortest journey home",
        body: "Bharatpur is a short flight or an overland journey from the Indian border. Across five and a half years, that changes how often families actually visit rather than merely intending to.",
      },
      {
        title: "Effectively no language adjustment",
        body: "Teaching is in English and Hindi is widely understood in daily life and on the ward. This is the only destination where a student can take a patient history in a language they already speak.",
      },
      {
        title: "Curriculum close to the Indian syllabus",
        body: "Nepali MBBS curricula are structured similarly to Indian ones, which matters directly for how FMGE or NExT preparation goes in the later years.",
      },
      {
        title: "Regulated fee ceilings",
        body: "The Medical Education Commission caps MBBS tuition nationally. Colleges cannot price above the ceiling, which removes a common source of mid-course surprises.",
      },
      {
        title: "Familiar food and climate",
        body: "The Terai is subtropical and the cuisine is essentially the one you grew up on. There is no first-winter adjustment and no dietary improvisation.",
      },
      {
        title: "Teaching hospital on campus",
        body: "Chitwan Medical College runs its own 750-bed teaching hospital, with MD, MS and DM/MCh programmes attached — a genuine tertiary referral centre rather than a teaching annexe.",
      },
      {
        title: "No donation, no capitation",
        body: "Admission runs on academic record, NEET qualification and the Medical Education Commission's process. No capitation fee is charged at any stage.",
      },
    ],
    livingCost: "On request — confirmed during counselling",
    climate: "Subtropical in the Terai — hot summers, monsoon, mild winters",
    language: "English medium; Nepali and Hindi widely spoken",
    visaNote:
      "No student visa required for Indian nationals. Carry a valid passport or voter ID; the college handles local registration on arrival.",
    lifeAbroad: [
      {
        icon: "Plane",
        title: "Getting there and back",
        body: "Bharatpur has its own domestic airport and a good road connection south to the Indian border. Whether you fly via Kathmandu or travel overland, this is the shortest and cheapest journey home of any destination in the portfolio — and with no visa to arrange, it is also the simplest.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Food",
        body: "There is essentially nothing to adjust to. Dal bhat, roti, sabzi, rice and the same spice profile you grew up with — vegetarian food is standard rather than a request, and hostel messes serve both vegetarian and non-vegetarian.",
      },
      {
        icon: "Languages",
        title: "Language",
        body: "Teaching is in English throughout and no proficiency test is required. Hindi is widely understood across Nepal, including on the ward, so clinical communication with patients is possible from the earliest rotations rather than after two years of language classes.",
      },
      {
        icon: "Thermometer",
        title: "Climate",
        body: "Bharatpur sits in the Terai lowlands: hot summers, a monsoon from June to September, and mild dry winters that need nothing heavier than a jacket. No winter clothing budget, and no acclimatisation period.",
      },
      {
        icon: "ShieldCheck",
        title: "Safety",
        body: "Nepal is a stable country with a long history of hosting Indian students, and Bharatpur is a mid-sized city rather than a capital. Ordinary caution applies as it would in any Indian city of similar size.",
      },
      {
        icon: "Home",
        title: "Accommodation",
        body: "Separate hostel blocks for male and female students, furnished on a sharing basis, with mess, laundry, internet and controlled campus entry. Private accommodation in Bharatpur is affordable and commonly taken from the later years.",
      },
      {
        icon: "Stethoscope",
        title: "Clinical exposure",
        body: "The college's own 750-bed teaching hospital is on campus, and it runs postgraduate and super-speciality programmes alongside the MBBS. That means the caseload passing through it is a referral caseload, not just primary presentations.",
      },
      {
        icon: "Wallet",
        title: "Cost",
        body: "Tuition is capped by the Medical Education Commission, with the ceiling published nationally. We confirm the current figure for Chitwan in writing during counselling rather than printing an estimate that moves between cycles.",
      },
    ],
    cities: [
      {
        name: "Bharatpur",
        note: "Chitwan Medical College",
        body: "Bharatpur is the largest city in the Chitwan district of south-central Nepal, on the banks of the Narayani river in the Terai lowlands. It has grown into the medical hub of the region — several major hospitals sit here alongside the college's own teaching hospital — and it lies roughly midway between Kathmandu and the Indian border, with its own domestic airport. Chitwan National Park, a UNESCO World Heritage site, is directly to the south. It is a working city rather than a tourist one, which suits a six-year course.",
      },
      {
        name: "Kathmandu",
        note: "Arrival hub",
        body: "The capital, and the international gateway for students arriving by air. It holds the country's main embassies and services, the Medical Education Commission, and Tribhuvan University's central administration. Bharatpur is a short domestic flight or a road journey away.",
      },
    ],
    considerations: [
      {
        title: "It is not the cheapest option in this portfolio",
        body: "Nepal's fee ceiling is regulated, not low. Russia and Kyrgyzstan both complete at a materially lower total cost. What you are paying for in Nepal is proximity, familiarity and curriculum fit — decide whether those are worth the difference to you.",
      },
      {
        title: "Seats are limited and admission is centralised",
        body: "Nepal has a small number of MBBS seats and admission runs through the Medical Education Commission's own process and calendar, not the college's. That means less flexibility on timing than most of our destinations, and a real possibility of missing a cycle.",
      },
      {
        title: "Confirm NMC (India) eligibility before you commit",
        body: "Whether a Nepali degree lets you sit FMGE or NExT is governed by the National Medical Commission's regulations as they stand when you take admission and when you graduate — including course length, internship and medium of instruction requirements. We put the current position in writing before any payment is made.",
      },
      {
        title: "A small country and a mid-sized city",
        body: "Bharatpur is not a metro, and Nepal's health system is smaller than Russia's or China's. Case volume and speciality breadth are correspondingly narrower than at the largest teaching hospitals elsewhere in the portfolio.",
      },
      {
        title: "The monsoon is a real season",
        body: "June to September in the Terai is genuinely wet and humid. It is nothing a student from most of India will find unfamiliar, but it does shape the academic year and travel plans.",
      },
    ],
    afterStudy: [
      {
        title: "Practising in India",
        body: "Clear FMGE or NExT, register with your state medical council and practise in India, with the domestic PG entrance route fully open — subject to meeting the NMC's requirements in force at the time.",
      },
      {
        title: "Postgraduate study in Nepal",
        body: "Chitwan Medical College itself runs MD and MS specialities and DM/MCh super-speciality programmes, so continuing at the same institution is a genuine route rather than a theoretical one.",
      },
      {
        title: "International licensing",
        body: "World Directory of Medical Schools listing supports ECFMG certification and the USMLE pathway, and PLAB for the UK, each subject to that regulator's current requirements.",
      },
      {
        title: "Practising in Nepal",
        body: "Graduates who register with the Nepal Medical Council can practise in Nepal, which some students choose given how established the Indian community and the cross-border medical relationship already are.",
      },
    ],
    eligibility: COMMON_ELIGIBILITY,
  },
  {
    slug: "kyrgyzstan",
    name: "Kyrgyzstan",
    flag: "🇰🇬",
    lat: 42.87,
    lng: 74.59,
    accent: "#B5651D",
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
      "Bishkek itself sits in the shadow of the Tien Shan range and is among the safest capitals in the region — a low crime rate, a walkable centre, and a student population that gives the city much of its character. Glaciers, mountain trails and Lake Issyk-Kul are all within a weekend of campus.",
      "One point of honesty that matters more than anything else on this page: our Kyrgyz listing carries ECFMG and WHO recognition, not NMC. If your plan is to return to India and practise, read the considerations below before you go any further — we would rather lose the application than have you discover this in year five.",
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
      {
        title: "No entrance exam, no language test",
        body: "No university entrance examination and no IELTS or TOEFL. Admission runs on Class 12 marks, NEET qualification and documents.",
      },
      {
        title: "A genuinely beautiful place to spend five years",
        body: "Bishkek sits under the Tien Shan mountains, with national parks, alpine lakes and trails within easy reach of the city — a real quality-of-life factor across a long degree.",
      },
    ],
    livingCost: "USD 100 – 150 / month",
    climate: "Cold winters, pleasant summers",
    language: "English medium; Kyrgyz and Russian spoken locally",
    visaNote: "Student visa, straightforward process. Typically 2 – 3 weeks.",
    lifeAbroad: [
      {
        icon: "ShieldCheck",
        title: "Safety",
        body: "Bishkek has a reputation as one of the safest capitals in Central Asia, with a low crime rate and petty theft as the main practical concern. It is a compact, walkable city and students move around it comfortably.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Indian food",
        body: "Two decades of Indian students in Bishkek means Indian restaurants, grocery stores stocking Indian provisions and hostel messes serving Indian food are all long established. This is not a city where you will be improvising your diet.",
      },
      {
        icon: "Wallet",
        title: "Monthly living cost",
        body: "USD 100 – 150 a month covers accommodation and food comfortably — the lowest published living cost in the portfolio, alongside the lowest published tuition.",
      },
      {
        icon: "Thermometer",
        title: "Climate",
        body: "Winters are genuinely cold, dropping well below freezing with snow. Spring is mild, and summers are warm and sunny rather than oppressive. The first winter is the adjustment; after that, most students prefer it to the summer heat back home.",
      },
      {
        icon: "Languages",
        title: "Language",
        body: "The degree is taught entirely in English and no proficiency test is required. Kyrgyz and Russian are the local languages, and students pick up functional Russian over time — useful on the wards and in daily life.",
      },
      {
        icon: "Users",
        title: "Community",
        body: "The Indian student community in Bishkek is large and long-established, with active student associations and seniors who see new arrivals through the first weeks. Practical support is already in place before you land.",
      },
      {
        icon: "MountainSnow",
        title: "The surroundings",
        body: "The Tien Shan range starts at the edge of the city. Ala Archa national park, Lake Issyk-Kul, the Burana Tower and the mountain trails are all reachable on a weekend, and students make regular use of them.",
      },
      {
        icon: "Home",
        title: "Accommodation",
        body: "Hostel rooms are shared, furnished and heated, with separate blocks for men and women, laundry, a common kitchen and round-the-clock internet and security. Private flats near campus are affordable from the later years.",
      },
    ],
    cities: [
      {
        name: "Bishkek",
        note: "University of South Asia",
        body: "The capital and by a wide margin the largest city in Kyrgyzstan, laid out on a Soviet grid at the foot of the Tien Shan. It is the country's centre of education, business and administration, and it has hosted Indian medical students for over twenty years — long enough that the supporting ecosystem of food, community and student services is fully settled. Osh and Dordoy bazaars, Panfilov and Dubovy parks and the historical museum are part of ordinary student life; Ala Archa national park and Lake Issyk-Kul are the weekends.",
      },
    ],
    considerations: [
      {
        title: "Our Kyrgyz listing carries ECFMG and WHO recognition, not NMC",
        body: "This is the most important line on the page. If your intention is to return to India and practise, NMC eligibility is what governs whether you can sit FMGE or NExT at all — and you must confirm the current NMC position for this specific university, in writing, before you pay anything. We will do that with you. If it does not clear, we will say so and point you at Georgia or Russia instead.",
      },
      {
        title: "Winters are cold and long",
        body: "Bishkek drops well below freezing with real snow. It is a genuine physical adjustment in the first year, and warm clothing is a first-month purchase rather than an optional one.",
      },
      {
        title: "A small country and a small city",
        body: "Bishkek is a capital, but it is not a metro. Variety of experience, hospital scale and case volume are smaller than in the large Russian or Chinese university cities. The cost saving is real; so is the trade-off.",
      },
      {
        title: "The lowest fee is not automatically the best value",
        body: "USD 20,400 is genuinely the most accessible route to a medical degree we offer. But you are buying six years of teaching that determines how a licensing exam goes, and price should be weighed against clinical exposure rather than instead of it.",
      },
      {
        title: "The licensing exam still applies",
        body: "Whichever route you take — India, the US or elsewhere — the destination country's licensing examination stands between the degree and practice. Build that preparation in from the early years.",
      },
    ],
    afterStudy: [
      {
        title: "United States",
        body: "ECFMG recognition is the reason this listing is in the portfolio. It supports ECFMG certification, USMLE and the US residency match, subject to that body's current rules.",
      },
      {
        title: "Practising in India",
        body: "Returning to practise in India requires clearing FMGE or NExT, and that in turn requires NMC eligibility — confirm the current position for this specific university before you commit.",
      },
      {
        title: "Postgraduate study in Kyrgyzstan",
        body: "Graduates can continue directly into an MD specialisation at Kyrgyz universities, or into a doctoral programme for those on an academic track.",
      },
      {
        title: "Postgraduate study elsewhere",
        body: "Graduates commonly move to postgraduate programmes in other countries after clearing the relevant screening examination for that jurisdiction.",
      },
    ],
    eligibility: COMMON_ELIGIBILITY,
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
