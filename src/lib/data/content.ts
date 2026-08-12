/* ============================================================
   Services, USPs, support pillars, process, offices and
   testimonials. Content sourced from the client's brochure and
   Admission Portfolio, expanded into full page copy.
   ============================================================ */

export interface Service {
  slug: string;
  title: string;
  icon: string;
  short: string;
  body: string;
  points: string[];
}

/** The ten services listed on the client's brochure. */
export const SERVICES: Service[] = [
  {
    slug: "career-counselling",
    title: "Career Counselling",
    icon: "Compass",
    short: "Doctor-led guidance before you commit to anything.",
    body: "Every enquiry starts with a conversation, not a sales pitch. Our counsellors — including practising doctors who have been through this exact path — assess your NEET score, your academic record, your family's budget and your long-term ambitions before recommending a single university.",
    points: [
      "One-to-one session with a qualified counsellor",
      "Honest NEET score assessment against real admission cut-offs",
      "Budget planning across the full six years, not just year one",
      "Clear explanation of the FMGE / NExT pathway before you commit",
    ],
  },
  {
    slug: "university-selection",
    title: "University Selection",
    icon: "Building2",
    short: "A shortlist built around you, not around our commissions.",
    body: "We shortlist universities against your profile: NEET score, budget, preferred climate, food requirements, family proximity and FMGE outcomes. You receive a comparison of real options with real numbers, and we explain the trade-offs of each one plainly.",
    points: [
      "Personalized shortlist of three to five matched universities",
      "Side-by-side comparison of fees, duration, intake and FMGE rates",
      "Honest assessment of climate, food and safety for each option",
      "No pressure to choose a particular institution",
    ],
  },
  {
    slug: "application-guidance",
    title: "Application Guidance",
    icon: "FileText",
    short: "Applications submitted correctly, the first time.",
    body: "A rejected or delayed application costs a full intake cycle. We prepare and submit your application to each shortlisted university, track its progress, and handle every follow-up with the international admissions office directly.",
    points: [
      "Application form preparation and review",
      "Direct submission to university admissions offices",
      "Progress tracking with regular updates to you and your family",
      "Follow-up handled by us, not left to you",
    ],
  },
  {
    slug: "admission-support",
    title: "Admission Support",
    icon: "ClipboardCheck",
    short: "From invitation letter to confirmed seat.",
    body: "Once a university issues an offer, we manage the entire confirmation process — invitation letter, admission letter, fee payment routing and seat confirmation — so that nothing is left ambiguous at the point where it matters most.",
    points: [
      "Invitation and admission letter processing",
      "Guidance on official fee payment channels only",
      "Seat confirmation and enrolment documentation",
      "Written confirmation at every milestone",
    ],
  },
  {
    slug: "documentation-support",
    title: "Documentation Support",
    icon: "FolderCheck",
    short: "Every document, attested and in order.",
    body: "Overseas medical admission involves apostille, notarisation, ministry attestation and translation. We produce a complete checklist for your specific destination and walk your family through each step so nothing is discovered missing at the embassy.",
    points: [
      "Destination-specific document checklist",
      "Apostille and attestation guidance",
      "Certified translation coordination where required",
      "Document verification before submission",
    ],
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    icon: "Stamp",
    short: "A high visa success rate, built on preparation.",
    body: "We prepare your complete visa file, brief you for the interview where one is required, and coordinate directly with the embassy or consulate. Our visa success rate is high because we do not submit files that are not ready.",
    points: [
      "Complete visa file preparation",
      "Embassy appointment scheduling",
      "Interview briefing and mock questions",
      "Status tracking through to visa issuance",
    ],
  },
  {
    slug: "travel-assistance",
    title: "Travel Assistance",
    icon: "Plane",
    short: "Flights, forex and a familiar face at the airport.",
    body: "We book and coordinate your travel, arrange group departures where possible so that students fly together, guide you on forex and baggage, and ensure someone from the university receives you at the destination airport.",
    points: [
      "Flight booking and group departure coordination",
      "Forex and baggage guidance",
      "Airport pickup arranged at the destination",
      "Emergency contact available throughout transit",
    ],
  },
  {
    slug: "pre-departure-briefing",
    title: "Pre-Departure Briefing",
    icon: "Presentation",
    short: "Nobody flies without knowing exactly what to expect.",
    body: "Before departure, students and parents attend a full briefing covering campus life, hostel arrangements, food, weather, what to pack, local customs, banking, SIM cards and the academic calendar of the first semester.",
    points: [
      "Joint session for students and parents",
      "Detailed packing and weather guidance",
      "Banking, SIM and local logistics walkthrough",
      "Introduction to seniors already on campus",
    ],
  },
  {
    slug: "post-arrival-support",
    title: "Post-Arrival Support",
    icon: "HeartHandshake",
    short: "Our responsibility does not end at the airport.",
    body: "On arrival we assist with hostel allotment, university registration, residence permit and medical registration, local SIM and bank account setup — and our team remains reachable for the full duration of the course.",
    points: [
      "Hostel allotment and settling-in assistance",
      "University registration and residence permit filing",
      "Local SIM, bank account and medical check coordination",
      "24×7 contact for the entire six years",
    ],
  },
  {
    slug: "fmge-next-guidance",
    title: "FMGE / NExT Guidance",
    icon: "GraduationCap",
    short: "The degree is the middle of the journey, not the end.",
    body: "An MBBS abroad is only valuable if you clear FMGE or NExT and practise in India. We provide structured preparation guidance from the third year onwards, connect students with coaching partners, and keep families informed of NMC regulation changes.",
    points: [
      "Structured preparation planning from year three",
      "Coaching partner access alongside coursework",
      "NMC regulation updates as they are issued",
      "Internship and registration guidance on return to India",
    ],
  },
];

/** "Why Choose DoctorsBuild?" — the seven points from the
 *  Admission Portfolio sidebar. */
export const USPS = [
  {
    title: "10+ Years of Experience",
    body: "A decade of placing Indian students into medical universities abroad, and a decade of watching them qualify.",
    icon: "Award",
    stat: "10+",
    statLabel: "Years",
  },
  {
    title: "100% Transparency Guaranteed",
    body: "Every fee, every deadline and every risk is written down before you pay anything. No hidden charges appear later.",
    icon: "Eye",
    stat: "100%",
    statLabel: "Transparent",
  },
  {
    title: "Personalized University Shortlisting",
    body: "Your shortlist is built from your NEET score, budget and preferences — not from whichever university pays us most.",
    icon: "ListFilter",
    stat: "1:1",
    statLabel: "Shortlisting",
  },
  {
    title: "End-to-End Admission Support",
    body: "Counselling, application, documentation, visa, travel and arrival — handled as one continuous process by one team.",
    icon: "Route",
    stat: "A – Z",
    statLabel: "Coverage",
  },
  {
    title: "Post Arrival Assistance",
    body: "Hostel, registration, residence permit, banking and everyday problems — we are reachable after you land, not just before.",
    icon: "LifeBuoy",
    stat: "On",
    statLabel: "Ground",
  },
  {
    title: "Indian Mentors & 24×7 Support",
    body: "Indian mentors already on campus, and a support line that answers regardless of the time zone you are calling from.",
    icon: "Headphones",
    stat: "24×7",
    statLabel: "Support",
  },
  {
    title: "Trusted by 5000+ Students & Parents",
    body: "Five thousand families have made this decision with us. Most of our enquiries now come from their referrals.",
    icon: "Users",
    stat: "5000+",
    statLabel: "Families",
  },
] as const;

/** Support pillars from the portfolio footer strip. */
export const PILLARS = [
  { title: "Global Exposure", body: "An international cohort and a degree recognized across multiple jurisdictions.", icon: "Globe2" },
  { title: "Modern Infrastructure", body: "Contemporary laboratories, simulation facilities and teaching hospitals.", icon: "Building" },
  { title: "Clinical Training", body: "Hands-on hospital rotations with genuine patient contact, not observation alone.", icon: "Stethoscope" },
  { title: "Indian Food Available", body: "Indian mess facilities and vegetarian options on or near every campus we place into.", icon: "UtensilsCrossed" },
  { title: "Safe & Secure Environment", body: "Secure campuses in cities with established, settled Indian student communities.", icon: "ShieldCheck" },
  { title: "Affordable Tuition Fees", body: "Government and state-regulated fees with no donation and no capitation at any stage.", icon: "Wallet" },
  { title: "Experienced Faculty", body: "Senior faculty with years of experience teaching international and Indian cohorts.", icon: "UserCog" },
] as const;

/** Brochure "Why Choose Us?" list. */
export const WHY_POINTS = [
  "100% Transparent Process",
  "Trusted by Students & Parents",
  "High Visa Success Rate",
  "Affordable & Budget Friendly",
  "Personalized Guidance",
  "Scholarship Assistance Available",
] as const;

/** The admission journey, five steps. */
export const PROCESS = [
  {
    step: 1,
    title: "Talk to an Expert",
    body: "A free, no-obligation counselling session with a doctor-led advisor. We assess your NEET score, budget and goals honestly — including telling you if going abroad is the wrong call for you.",
    icon: "MessageCircle",
    duration: "Day 1",
  },
  {
    step: 2,
    title: "Pick the Right University",
    body: "You receive a personalized shortlist with a full side-by-side comparison of fees, duration, intake, FMGE outcomes, climate and safety. You choose; we advise.",
    icon: "Building2",
    duration: "Day 2 – 5",
  },
  {
    step: 3,
    title: "We Handle All the Paperwork",
    body: "Application, invitation letter, admission letter, apostille, attestation, translation and the complete visa file — prepared, checked and submitted by our team.",
    icon: "FileCheck2",
    duration: "Week 2 – 5",
  },
  {
    step: 4,
    title: "Your Seat is Confirmed",
    body: "Fees paid through official university channels only, seat confirmed in writing, travel booked and a full pre-departure briefing delivered to you and your parents together.",
    icon: "BadgeCheck",
    duration: "Week 6 – 8",
  },
  {
    step: 5,
    title: "You Land — And We Are Still There",
    body: "Airport pickup, hostel allotment, university registration, residence permit and a 24×7 line that stays open for the entire six years of your degree.",
    icon: "PlaneLanding",
    duration: "Ongoing",
  },
] as const;

export const OFFICES = [
  {
    city: "Shimla",
    region: "Himachal Pradesh",
    address: "Shimla, Himachal Pradesh, India",
    isHQ: true,
  },
  {
    city: "Chandigarh",
    region: "Punjab / Haryana",
    address: "Chandigarh, UT, India",
    isHQ: false,
  },
  {
    city: "Vadodara",
    region: "Gujarat",
    address: "Vadodara, Gujarat, India",
    isHQ: false,
  },
] as const;

export interface Testimonial {
  name: string;
  course: string;
  university: string;
  country: string;
  flag: string;
  quote: string;
  rating: number;
  year: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ananya Sharma",
    course: "MBBS",
    university: "GEOMEDI University",
    country: "Georgia",
    flag: "🇬🇪",
    quote:
      "I had a NEET score that would not have got me a government seat in India, and my family could not afford a private college. Doctors Build sat with my parents for two hours and explained every rupee of the six-year cost before we paid anything. I am now in my third year at GEOMEDI and my clinical postings started last semester.",
    rating: 5,
    year: "2023 Batch",
  },
  {
    name: "Rohit Verma",
    course: "MBBS",
    university: "Kemerovo State Medical University",
    country: "Russia",
    flag: "🇷🇺",
    quote:
      "What convinced my father was that they never once asked for a donation or a cash payment. Every rupee went directly to the university's official account and we have receipts for all of it. The Indian mess at Kemerovo means I have never once missed home food.",
    rating: 5,
    year: "2022 Batch",
  },
  {
    name: "Priya Nair",
    course: "MBBS",
    university: "University of South Asia",
    country: "Kyrgyzstan",
    flag: "🇰🇬",
    quote:
      "I was worried about being alone in a new country. Their team picked me up at Manas airport, took me to the hostel, helped me open a bank account and get a SIM, and introduced me to seniors from Kerala on the first day. I never felt stranded for even an hour.",
    rating: 5,
    year: "2023 Batch",
  },
  {
    name: "Aditya Patel",
    course: "MBBS",
    university: "Ingush State University",
    country: "Russia",
    flag: "🇷🇺",
    quote:
      "The total cost was the deciding factor for us. Ingush State works out to roughly fifteen lakh for the entire six years including living expenses — less than one year at the private college we had been quoted in Gujarat. And it is NMC recognized, which was non-negotiable for my parents.",
    rating: 5,
    year: "2024 Batch",
  },
  {
    name: "Sneha Kulkarni",
    course: "MBBS",
    university: "Fergana Medical Institute",
    country: "Uzbekistan",
    flag: "🇺🇿",
    quote:
      "The FMGE guidance is what sets them apart. From my third year they have been sending preparation material and connected me with a coaching partner. They understood that clearing FMGE is the actual goal — the degree is only halfway there.",
    rating: 5,
    year: "2022 Batch",
  },
  {
    name: "Karan Thakur",
    course: "MBBS",
    university: "North Caucasian State Medical Academy",
    country: "Russia",
    flag: "🇷🇺",
    quote:
      "I applied through two other consultancies first and both went quiet once the fee was paid. Doctors Build still calls my mother every few months to check how I am doing, two years after I left. That is the difference.",
    rating: 5,
    year: "2023 Batch",
  },
];

/** Headline counters. */
export const STATS = [
  { value: 10, suffix: "+", label: "Years of Experience", sub: "In medical education" },
  { value: 5000, suffix: "+", label: "Students & Parents", sub: "Trust Doctors Build" },
  { value: 7, suffix: "", label: "Countries Served", sub: "Across Europe & Asia" },
  { value: 4.5, suffix: "/5", label: "Average Rating", sub: "From student families", decimal: true },
] as const;
