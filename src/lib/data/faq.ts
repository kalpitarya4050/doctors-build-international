export interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
  /** Surfaced in the homepage preview block. */
  featured?: boolean;
}

export type FaqCategory =
  | "Eligibility"
  | "Fees & Funding"
  | "Recognition & Licensing"
  | "Life Abroad"
  | "Process & Visa";

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Eligibility",
  "Fees & Funding",
  "Recognition & Licensing",
  "Life Abroad",
  "Process & Visa",
];

export const FAQS: FaqItem[] = [
  /* ---------------- Eligibility ---------------- */
  {
    category: "Eligibility",
    featured: true,
    q: "Is NEET compulsory for MBBS abroad?",
    a: "Yes. Since the National Medical Commission's 2018 regulations, every Indian student who wishes to study medicine abroad and practise in India must qualify NEET-UG. You need only to clear the qualifying percentile — you do not need a rank high enough for an Indian government seat. Without a valid NEET qualification you will not receive an Eligibility Certificate from the NMC, and you will not be permitted to sit FMGE or NExT on your return.",
  },
  {
    category: "Eligibility",
    featured: true,
    q: "What NEET score do I actually need?",
    a: "You need to meet the qualifying percentile, which is the 50th percentile for General category and the 40th percentile for SC, ST and OBC candidates. In recent years this has translated to roughly 160 – 165 marks for General and around 125 – 130 for reserved categories, though the exact cut-off is set fresh each year. A qualifying score is sufficient for admission to every university in our portfolio.",
  },
  {
    category: "Eligibility",
    q: "What are the academic requirements from Class 12?",
    a: "You must have passed Class 12 with Physics, Chemistry, Biology and English. General category candidates need a minimum aggregate of 50% in PCB; SC, ST and OBC candidates need 40%. Persons with benchmark disabilities need 45%. These are the NMC's own minimums and apply regardless of destination country.",
  },
  {
    category: "Eligibility",
    q: "Is there an age limit?",
    a: "You must have completed 17 years of age on or before 31 December of the year of admission. There is no upper age limit for admission to the universities in our portfolio, and we have successfully placed students taking a second or third attempt at NEET.",
  },
  {
    category: "Eligibility",
    q: "Do I need IELTS or TOEFL?",
    a: "No. None of the universities in our portfolio require IELTS or TOEFL for admission to their English-medium MBBS programmes. This applies to Georgia, Russia, Kazakhstan, China, Uzbekistan and Kyrgyzstan. Some Western destinations do require English proficiency tests, which is one reason these destinations are more accessible for Indian students.",
  },
  {
    category: "Eligibility",
    q: "I have a gap year — will that affect my admission?",
    a: "No. Gap years are accepted by all the universities we work with, and multiple NEET attempts are entirely normal among students we place. You will need to submit a gap certificate as part of your documentation, which we help you prepare.",
  },

  /* ---------------- Fees & Funding ---------------- */
  {
    category: "Fees & Funding",
    featured: true,
    q: "What is the total cost of MBBS abroad, honestly?",
    a: "For the universities where we hold a published fee table, the complete six-year cost including tuition and living expenses ranges from approximately ₹15.91 lakh at Ingush State University in Russia to around ₹30.53 lakh at GEOMEDI University in Georgia. Our Fee Comparison page shows those side by side with tuition, total expense and the semester-wise payment schedule from the official brochure. For the newer universities in our lineup the fee table is confirmed directly with the institution for each intake — we will send it to you in writing rather than publish an estimate. Budget separately in every case for airfare, personal spending, medical insurance and the annual residence permit.",
  },
  {
    category: "Fees & Funding",
    featured: true,
    q: "Are there any donation or capitation fees?",
    a: "No — and this is the single largest financial advantage of studying abroad. The government and state universities in our portfolio charge only their published, regulated tuition. There is no donation, no capitation and no cash component at any stage. Every payment is made directly to the university's official account and you receive a receipt for all of it. If any consultant asks you for a cash donation, walk away.",
  },
  {
    category: "Fees & Funding",
    q: "Can I get an education loan for MBBS abroad?",
    a: "Yes. Most nationalised and private Indian banks offer education loans for overseas medical study at NMC-recognized universities. We provide the documentation banks require — admission letter, fee structure on university letterhead, and the course duration certificate — and guide your family through the application. Loans above ₹7.5 lakh generally require collateral.",
  },
  {
    category: "Fees & Funding",
    q: "Are scholarships available?",
    a: "Merit-based scholarships and partial fee concessions are available at several universities in our portfolio, typically awarded on Class 12 and NEET performance. Availability varies by university and by intake. Our counsellors will tell you exactly which scholarships you are realistically eligible for during your shortlisting session.",
  },
  {
    category: "Fees & Funding",
    q: "How and when do I pay the fees?",
    a: "Fees are paid directly to the university, generally in semester or annual instalments rather than as a single upfront payment. Payments are made by bank transfer to the university's official account only. We never accept tuition fees on a university's behalf, and you should be extremely cautious of any agent who offers to.",
  },
  {
    category: "Fees & Funding",
    q: "What does the monthly living cost actually cover?",
    a: "The USD 100 – 200 monthly range quoted for most destinations covers hostel accommodation and food. It does not include personal spending, mobile and internet, clothing, travel within the country, or trips home. We advise families to budget an additional USD 5,000 – 10,000 across the full six years for these.",
  },

  /* ---------------- Recognition & Licensing ---------------- */
  {
    category: "Recognition & Licensing",
    featured: true,
    q: "Will my degree be valid in India?",
    a: "Yes, provided you study at an NMC-recognized university, qualify NEET before admission, and complete the full course including the internship. Every university in our portfolio is recognized by the National Medical Commission of India and listed by the World Health Organization. On returning to India you must clear the Foreign Medical Graduate Examination (FMGE), or NExT once it replaces FMGE, to obtain registration and practise.",
  },
  {
    category: "Recognition & Licensing",
    featured: true,
    q: "What is FMGE and what is NExT?",
    a: "The Foreign Medical Graduate Examination is the screening test every Indian citizen with a foreign medical degree must clear to register and practise in India. It is conducted twice a year by the National Board of Examinations, and the pass mark is 50%. The National Exit Test (NExT) is designed to replace FMGE and will serve as a single common exit examination for both Indian and foreign medical graduates. We provide structured preparation guidance for both from your third year onwards.",
  },
  {
    category: "Recognition & Licensing",
    q: "What FMGE pass rates do your universities achieve?",
    a: "Where we hold verified figures: GEOMEDI University in Georgia leads at 65%+, followed by Ingush State University at 62%+, Kemerovo State and University of South Asia at 58%+, and North Caucasian State Medical Academy and Fergana Medical Institute at 55%+. These are materially above the national average for Indian students studying abroad. For the universities added to our lineup more recently we do not yet publish a pass rate, and we would rather tell you that than quote a number we cannot stand behind — ask a counsellor and we will share whatever verified outcome data the university itself provides.",
  },
  {
    category: "Recognition & Licensing",
    q: "What are the NMC 2021 regulations I keep hearing about?",
    a: "The NMC's Foreign Medical Graduate Licentiate Regulations of 2021 require that the foreign course be a minimum of 54 months, followed by a 12-month internship in the same foreign institution, taught entirely in English, and covering the same subjects as the Indian MBBS curriculum. Every programme in our portfolio is structured to comply with these requirements — we will not place a student into a course that does not.",
  },
  {
    category: "Recognition & Licensing",
    q: "Can I practise outside India with this degree?",
    a: "Yes, subject to the licensing requirements of the country concerned. Universities listed in the World Directory of Medical Schools and recognized by ECFMG support the USMLE pathway to US residency. The University of South Asia in Kyrgyzstan holds ECFMG recognition specifically. For the UK you would sit PLAB, and for Australia the AMC examinations. Our counsellors will explain which doors each university keeps open.",
  },
  {
    category: "Recognition & Licensing",
    q: "Do I have to do an internship abroad as well as in India?",
    a: "Under the 2021 NMC regulations you must complete a 12-month internship at the same foreign institution where you studied — this is why our programmes are described as 5+1 or 6 years including internship. After clearing FMGE or NExT in India, you then complete a further one-year rotating internship at an Indian institution before permanent registration.",
  },

  /* ---------------- Life Abroad ---------------- */
  {
    category: "Life Abroad",
    featured: true,
    q: "Will I get Indian food?",
    a: "Yes. Every university in our portfolio has either an Indian mess on campus or established Indian food options nearby, and vegetarian and Jain requirements are catered for. Cities like Tbilisi, Bishkek and Kathmandu have substantial Indian restaurant and grocery scenes built up over two decades of Indian student presence. Many students also cook for themselves in hostel kitchens.",
  },
  {
    category: "Life Abroad",
    q: "Is it safe for girls to study in these countries?",
    a: "Yes. All our destinations maintain safety ratings between 4.0 and 4.5 out of 5, with Georgia and Ingushetia rating highest. Campuses have secure, separate girls' hostels with 24-hour security and warden supervision. We place a large number of female students every year and maintain direct contact with their families throughout the course.",
  },
  {
    category: "Life Abroad",
    q: "What is the language of instruction, and will I struggle with patients?",
    a: "All teaching is in English across every university in our portfolio. For clinical rotations you will need conversational ability in the local language — Russian, Georgian, Kazakh, Mandarin or Uzbek depending on where you study — and each university teaches this as a compulsory subject in the early years specifically for that purpose. In China this matters more than most students expect, which is why Mandarin runs alongside the English-medium curriculum there.",
  },
  {
    category: "Life Abroad",
    q: "How cold does it actually get?",
    a: "It varies considerably and it is worth taking seriously over six years. Kemerovo in Siberia has genuinely severe winters. North Caucasian, Kabardino-Balkarian and Ingush in southern Russia are markedly milder. Georgia and Uzbekistan have moderate continental climates with warm summers, and Batumi on Georgia's Black Sea coast is mild year-round. In China, Nanjing and Guangzhou are humid subtropical with mild winters, while Beijing and Tianjin get properly cold. Our counsellors flag this explicitly during shortlisting because it matters more than most students expect.",
  },
  {
    category: "Life Abroad",
    q: "Can my parents visit me?",
    a: "Yes. All our destinations issue tourist visas to Indian nationals, and many families visit during the summer break. Georgia and Kazakhstan are the easiest to reach on a short flight. We assist with invitation letters from the university where these are needed for the visa application.",
  },
  {
    category: "Life Abroad",
    q: "What is the hostel like?",
    a: "University hostels typically offer two or three-sharing rooms with attached or shared bathrooms, heating, internet, a common kitchen and laundry facilities. Rooms are allotted on arrival and we assist with the process. Private apartments are also available near most campuses for students who prefer them, usually at moderately higher cost.",
  },

  /* ---------------- Process & Visa ---------------- */
  {
    category: "Process & Visa",
    featured: true,
    q: "How long does the whole admission process take?",
    a: "From your first counselling session to boarding the flight typically takes six to eight weeks. Counselling and shortlisting take the first week, application and admission letter roughly three to four weeks, and visa processing a further two to four weeks depending on destination. Applying early in the intake cycle matters — seats at the strongest universities close first.",
  },
  {
    category: "Process & Visa",
    q: "What documents will I need?",
    a: "The core set is: Class 10 and 12 mark sheets and certificates, NEET scorecard, a passport valid for at least two years, passport-size photographs, a birth certificate, a medical fitness certificate, an HIV-negative report, and a gap certificate if applicable. Documents generally require apostille or ministry attestation, and some destinations require certified translation. We issue a destination-specific checklist and verify every document before submission.",
  },
  {
    category: "Process & Visa",
    q: "What is your visa success rate?",
    a: "Our visa success rate is high because we do not submit incomplete files. Every application is verified internally before it goes to the embassy, students are briefed for interviews where they are required, and we track each file through to issuance. Georgia has the lightest documentation requirement of our destinations; China's X1 visa needs the JW202 form alongside the admission letter and takes the longest to prepare.",
  },
  {
    category: "Process & Visa",
    q: "When are the intakes?",
    a: "Most universities have a September/October intake, which is the main cycle — all five Chinese universities admit in September only. GEOMEDI University in Georgia and the University of South Asia in Kyrgyzstan additionally offer a February intake. We recommend beginning the process at least three months before your target intake, and earlier for China because the visa file takes longest to assemble.",
  },
  {
    category: "Process & Visa",
    q: "What happens if my visa is rejected?",
    a: "Visa rejections are uncommon when the file is properly prepared, and are usually the result of a documentation gap that can be corrected and resubmitted. If a rejection cannot be resolved for the current intake, we work with you to secure admission in the next available cycle or at an alternative university. We will explain the specific position honestly rather than making promises we cannot keep.",
  },
  {
    category: "Process & Visa",
    q: "Do you charge students a consultancy fee?",
    a: "Our counselling and shortlisting sessions are free and carry no obligation. Service charges, where they apply, are disclosed in writing before you commit to anything, and are separate from and additional to the university tuition. You will never encounter a charge you were not told about in advance — that is what 100% transparency means in practice.",
  },
  {
    category: "Process & Visa",
    q: "Why should I go through a consultancy at all?",
    a: "You are not obliged to. But overseas medical admission involves NMC eligibility rules, apostille and attestation chains, embassy requirements, university-specific application windows and payment routing — and a single error costs an entire intake cycle. Our value is that we have done this several thousand times, we are on the ground at the destination when you land, and we remain reachable for the full six years rather than disappearing once the fee clears.",
  },
];

export const FEATURED_FAQS = FAQS.filter((f) => f.featured);

export function faqsByCategory(category: FaqCategory): FaqItem[] {
  return FAQS.filter((f) => f.category === category);
}
