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
    a: "No. None of the universities in our portfolio require IELTS or TOEFL for admission to their English-medium MBBS programmes. This applies to Georgia, Russia, Kazakhstan, China, Nepal and Kyrgyzstan. Some Western destinations do require English proficiency tests, which is one reason these destinations are more accessible for Indian students.",
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
    a: "Where we hold verified figures: GEOMEDI University in Georgia leads at 65%+, followed by Ingush State University at 62%+, Kemerovo State and University of South Asia at 58%+, and North Caucasian State Academy at 55%+. These are materially above the national average for Indian students studying abroad. For the universities added to our lineup more recently we do not yet publish a pass rate, and we would rather tell you that than quote a number we cannot stand behind — ask a counsellor and we will share whatever verified outcome data the university itself provides.",
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
    a: "All teaching is in English across every university in our portfolio. For clinical rotations you will need conversational ability in the local language — Russian, Georgian, Kazakh or Mandarin depending on where you study, and in Nepal effectively none, since Hindi is widely understood — and each university teaches this as a compulsory subject in the early years specifically for that purpose. In China this matters more than most students expect, which is why Mandarin runs alongside the English-medium curriculum there.",
  },
  {
    category: "Life Abroad",
    q: "How cold does it actually get?",
    a: "It varies considerably and it is worth taking seriously over six years. Kemerovo in Siberia has genuinely severe winters. North Caucasian and Ingush in southern Russia are markedly milder, and Kazan on the Volga sits between the two. Georgia has a moderate continental climate with warm summers, and Batumi on its Black Sea coast is mild year-round. Nepal's Terai is subtropical — no winter clothing needed at all, but a real monsoon from June to September. In China, Nanjing and Guangzhou are humid subtropical with mild winters, while Beijing and Tianjin get properly cold. Our counsellors flag this explicitly during shortlisting because it matters more than most students expect.",
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

/* ============================================================
   COUNTRY-SPECIFIC FAQ BANKS

   Rewritten from the client's own country material. These are
   kept out of the global FAQS list on purpose: /faq stays a
   single readable page, and each destination page pulls only
   the questions that are actually about that destination.

   Same rule as countries.ts — no figure appears here that the
   client has not published. Where their other site quotes an
   enrolment count, a tuition range or an FMGE percentage, the
   answer below makes the point qualitatively or points the
   reader at counselling instead.
   ============================================================ */

export const COUNTRY_FAQS: Record<string, FaqItem[]> = {
  georgia: [
    {
      category: "Recognition & Licensing",
      q: "Is an MBBS from Georgia valid in India?",
      a: "Yes, provided two things hold. You must graduate from a university that is NMC-compliant at the time you take admission and at the time you graduate, and you must then clear FMGE or NExT on your return. The degree awarded in Georgia is an MD, which is treated as the equivalent of MBBS for Indian licensing purposes once those requirements are met. We confirm a specific university's current NMC status in writing before you pay anything.",
    },
    {
      category: "Eligibility",
      q: "Is NEET required for MBBS in Georgia?",
      a: "Yes. Every Indian student who intends to practise in India after studying medicine abroad must have qualified NEET-UG. You need the qualifying percentile, not a rank high enough for an Indian government seat. Without it the NMC will not issue an Eligibility Certificate, and you will not be permitted to sit FMGE or NExT.",
    },
    {
      category: "Eligibility",
      q: "Is there a separate entrance exam for Georgian universities?",
      a: "No. The universities in our Georgian lineup do not set their own entrance examination. Admission runs on your Class 12 marks in Physics, Chemistry and Biology, your NEET qualification and your documents. Some universities hold a short English-language interview rather than an exam.",
    },
    {
      category: "Eligibility",
      q: "Do I need IELTS or TOEFL for Georgia?",
      a: "No. No university in our Georgian lineup requires IELTS or TOEFL. The programmes are taught entirely in English, and English competence is assessed — where it is assessed at all — through a brief university interview.",
    },
    {
      category: "Process & Visa",
      q: "What is the D3 student visa process for Georgia?",
      a: "You receive the university's admission letter, pay the initial tuition instalment, get your academic documents apostilled through the MEA-authorised process in India, then apply for the D3 student visa with your passport, admission letter, NEET scorecard, Class 10 and 12 marksheets, photographs, medical documents and proof of funds. After arrival you apply for a temporary residence permit where required. Processing typically runs two to four weeks from the admission letter.",
    },
    {
      category: "Process & Visa",
      q: "Which documents need to be apostilled?",
      a: "Generally your Class 10 and Class 12 marksheets, your birth certificate and, where it is asked for, a police clearance certificate. Apostille is what makes an Indian academic document valid abroad, and it is needed at three separate points — university verification, the visa application and the residence permit. We handle that chain rather than leaving it with you.",
    },
    {
      category: "Life Abroad",
      q: "Is Georgia safe for Indian students?",
      a: "Georgia is consistently rated among the safest countries in its region, and it is the point Indian parents raise most often on the first call. Students report moving around Tbilisi and Batumi comfortably at ordinary hours, and campuses run controlled entry with round-the-clock security in the residential blocks.",
    },
    {
      category: "Life Abroad",
      q: "Will I be able to get Indian food?",
      a: "Yes. Tbilisi has an established set of Indian restaurants and dedicated student messes with vegetarian options, plus grocery shops stocking Indian provisions. Most hostels allow self-cooking. Batumi's Indian food scene is smaller than the capital's, but it is growing.",
    },
    {
      category: "Eligibility",
      q: "Do I need to learn Georgian?",
      a: "Not to study. The entire degree is delivered in English and no Georgian is required for admission. You will pick up working Georgian over time, and it is genuinely useful from the clinical years, when you are taking histories from local patients on the ward.",
    },
    {
      category: "Recognition & Licensing",
      q: "Can I go on to the USA, UK or Canada after Georgia?",
      a: "Graduates of Georgian universities listed in the World Directory of Medical Schools can pursue ECFMG certification and USMLE for the United States, PLAB and GMC registration for the United Kingdom, and MCCQE for Canada. Each of those routes is governed by that regulator's own current rules, which we go through with you rather than summarising away.",
    },
    {
      category: "Recognition & Licensing",
      q: "Are Georgia's public universities still open to Indian students?",
      a: "Several Georgian public medical universities have reduced or restricted new international admissions, and Indian applicants have moved towards NMC-compliant private universities — which is where our lineup sits. Availability can move mid-cycle, so we confirm a specific university's current admission status in writing before any payment.",
    },
    {
      category: "Fees & Funding",
      q: "Is there a donation or capitation fee in Georgia?",
      a: "No. There is no donation or capitation at any stage. The published tuition is the tuition, and our fee tables show the complete six-year picture including hostel and living costs wherever our portfolio publishes them.",
    },
  ],
  russia: [
    {
      category: "Recognition & Licensing",
      q: "Is an MBBS from Russia valid in India?",
      a: "Yes, from an NMC-recognized university and once you clear FMGE or NExT on your return. Russian government medical universities are WHO-listed and carry World Directory of Medical Schools entries, which also supports licensure routes beyond India. We confirm the current recognition position for the specific university you are considering, in writing, before you pay.",
    },
    {
      category: "Eligibility",
      q: "Is the entire course really taught in English?",
      a: "At the universities we place into, yes — for all six years. This is the single most misrepresented point in the Russia market. Some Russian medical colleges run bilingual programmes where the early years are English and clinical subjects then move into Russian. Ask any consultant, including us, for the medium of instruction year by year in writing before you pay anything.",
    },
    {
      category: "Eligibility",
      q: "Then why is Russian taught at all?",
      a: "Because you will be taking histories from Russian-speaking patients during clinical rotations. Russian language classes run alongside the medical curriculum from the first year, and they are not decoration — students who take them seriously get considerably more out of their hospital time.",
    },
    {
      category: "Eligibility",
      q: "Is there an age limit for MBBS in Russia?",
      a: "You must be at least 17 on the date of admission. Most Russian universities also apply an upper limit around 25, though this varies by institution — we confirm the exact position for the university you are applying to.",
    },
    {
      category: "Fees & Funding",
      q: "Is there any donation or capitation fee in Russia?",
      a: "No. Russian government medical universities are state-funded and state-regulated, and the published tuition is the entire tuition. This is the structural reason Russia carries the lowest total six-year cost in our portfolio — Ingush State completes at approximately ₹15.91 lakh including living costs.",
    },
    {
      category: "Life Abroad",
      q: "How cold is it really?",
      a: "It depends entirely on where you are placed, and Russia is not one climate. The Volga cities and the northern Caucasus campuses are far milder than the Siberian stereotype and have genuinely warm summers. Kemerovo is the cold end of our lineup. The first winter is a real physical adjustment wherever you land, and warm clothing is a first-month purchase rather than an optional one.",
    },
    {
      category: "Life Abroad",
      q: "What are the hostels like?",
      a: "University dormitories with double or triple sharing, furnished with bed, mattress, bedding, desk, chair and wardrobe, plus centralised heating, a communal kitchen, laundry and a reading area. Most campuses have a medical point and a shop in the block, 24-hour security, surveillance and marked emergency exits, and are inspected on a routine cycle.",
    },
    {
      category: "Life Abroad",
      q: "Will there be Indian food?",
      a: "Most of the universities in our Russian lineup run a dedicated Indian mess for their Indian cohort, serving vegetarian and non-vegetarian meals. Where a mess is not on campus, Indian eateries sit within walking distance and hostel kitchens let students cook their own.",
    },
    {
      category: "Recognition & Licensing",
      q: "What are my postgraduate options after Russia?",
      a: "You can continue directly into ordinatura — Russian clinical residency — or into a research track, at fees in the same affordable band as the undergraduate degree. You can also return to India and take the domestic PG entrance route after clearing NExT, or move to another country after clearing its screening examination.",
    },
    {
      category: "Process & Visa",
      q: "How does the Russian student visa work?",
      a: "The university applies for an official invitation letter through the Ministry of Education once your admission is confirmed. That invitation is what supports your student visa application. Processing typically runs three to five weeks. After arrival you complete migration registration, which the university's international office handles with you.",
    },
    {
      category: "Life Abroad",
      q: "How does the academic year run?",
      a: "Two semesters — September to January, then February to June — with a winter break in January and a long summer vacation. Most students fly home once a year, and the route is direct from most Indian metros.",
    },
  ],
  kazakhstan: [
    {
      category: "Recognition & Licensing",
      q: "Is an MBBS from Kazakhstan valid in India?",
      a: "Yes, from an NMC-eligible university and once you clear FMGE or NExT on your return. Kazakhstan is an emerging destination and university-level recognition status can move, so we confirm the current NMC position for the specific university you are considering, in writing, before any payment is made.",
    },
    {
      category: "Fees & Funding",
      q: "What does MBBS in Kazakhstan cost?",
      a: "Our current admission portfolio prints no Kazakhstan fee table, so we do not publish one. You get the actual tuition, hostel and living figures for a specific university in writing during counselling — not an indicative range that shifts once you have committed. What we can say is that Kazakhstan is among the most economical destinations in the portfolio on both tuition and day-to-day living.",
    },
    {
      category: "Eligibility",
      q: "Do I need NEET, IELTS or an entrance exam for Kazakhstan?",
      a: "NEET yes, the other two no. NEET qualification is mandatory for any Indian student who intends to practise in India. There is no IELTS or TOEFL requirement and no university-level entrance examination — admission runs on your Class 12 marks, NEET qualification and documents.",
    },
    {
      category: "Life Abroad",
      q: "Where exactly would I be studying?",
      a: "Almaty, for both of the universities in our Kazakh lineup. It is the country's largest city and commercial capital, set directly against the Tian Shan range, with a metro, an extensive bus network, an international airport with short direct routes to India, and established Indian food supply.",
    },
    {
      category: "Life Abroad",
      q: "Is Kazakhstan safe for Indian students?",
      a: "Kazakhstan is one of the more secure countries in the region, and international students on campus fall under both university and state protection arrangements. Almaty is a large city, so ordinary urban caution applies as it would anywhere, but students report settling quickly.",
    },
    {
      category: "Life Abroad",
      q: "What are the hostels like?",
      a: "Kazakh medical universities run several dormitory blocks each, sited inside the campus so there is no daily commute to pay for. Rooms come with built-in furniture, bedding and quilts, and each block carries mess and laundry facilities. Mess arrangements cover three meals a day.",
    },
    {
      category: "Life Abroad",
      q: "How cold does it get?",
      a: "Continental — genuinely hot summers and cold winters, sharpened by the mountainous terrain around Almaty. Spring and autumn are the most comfortable stretches. It is milder than Siberia and shorter than the Russian north, but warm winter clothing is a first-month purchase.",
    },
    {
      category: "Eligibility",
      q: "Will I face a language barrier?",
      a: "Not academically. The programmes are taught in English throughout and no language test is required to enter. Kazakh and Russian are the languages of the street and the hospital ward, and picking up working Russian pays off during clinical rotations.",
    },
    {
      category: "Recognition & Licensing",
      q: "What can I do after graduating from Kazakhstan?",
      a: "Clear FMGE or NExT and practise in India with the domestic PG entrance route fully open, or move into postgraduate programmes in Europe and elsewhere in Asia — the universities hold exchange arrangements that help here. World Directory of Medical Schools listing also supports ECFMG certification and the USMLE pathway, subject to that body's current requirements.",
    },
    {
      category: "Fees & Funding",
      q: "Is there a donation or capitation fee?",
      a: "No. No capitation or donation is charged at any point in the Kazakh admission process.",
    },
  ],
  china: [
    {
      category: "Process & Visa",
      q: "When do I need to apply for China?",
      a: "Earlier than for anywhere else in the portfolio. China runs a single September intake with no February fallback, so a missed deadline costs a full year. We start China applications well ahead of the other destinations for exactly this reason.",
    },
    {
      category: "Process & Visa",
      q: "What is the X1 visa and the JW202 form?",
      a: "The university issues an admission letter together with a JW202 form once your admission is confirmed. Those two documents together support your X1 student visa application. The X1 is the long-stay student category; after arrival you convert it to a residence permit, which the university's international office handles with you.",
    },
    {
      category: "Eligibility",
      q: "Is the course taught in English?",
      a: "Yes, entirely, at all five universities in our Chinese lineup. Mandarin is taught alongside it — not as a substitute for the English medium, but because clinical rotations put you in front of Chinese-speaking patients from the later years. Students who deprioritise the language classes get materially less out of the hospital years.",
    },
    {
      category: "Fees & Funding",
      q: "What does MBBS in China cost?",
      a: "Our China comparison sheet prints the tuition, hostel, living and total rows blank, and we will not fill them in with an estimate. You get the actual figures for a specific university in writing during counselling. Costs do vary substantially between Beijing and the other four cities, so this is worth an explicit conversation rather than a headline number.",
    },
    {
      category: "Recognition & Licensing",
      q: "Why choose China over a cheaper destination?",
      a: "The affiliated hospital networks. Nanjing Medical and Capital Medical carry 30+ teaching hospitals each and the other three carry 20+, with very high patient volumes and current diagnostic technology. That is what determines how many specialities you rotate through and how much you actually see — and it is difficult to match at this cost anywhere else.",
    },
    {
      category: "Life Abroad",
      q: "Which city should I pick?",
      a: "Weather is the honest differentiator across six years. Guangzhou is subtropical and by some distance the mildest winter in the lineup. Beijing and Tianjin have hot summers and genuinely cold, dry winters. Nanjing and Chongqing sit in between with humid summers. Tianjin gives you a Beijing-adjacent education at a noticeably lower cost of living.",
    },
    {
      category: "Life Abroad",
      q: "What is the food situation?",
      a: "Campus canteens run multiple counters including halal and vegetarian options, and all five cities have Indian restaurants. Self-catering is common from the later years. Food is one of the bigger adjustments in China, and it is worth being realistic about that rather than being told it is nothing.",
    },
    {
      category: "Life Abroad",
      q: "Is China safe, and how do I get around?",
      a: "The five cities in our lineup are among the most secure large cities anywhere, with low street crime and campuses that run controlled access. Every one of them has a metro system, high-speed rail connections and a major international airport, so intercity travel is fast and cheap and no campus requires a car.",
    },
    {
      category: "Recognition & Licensing",
      q: "Is a Chinese MBBS valid in India?",
      a: "Yes, from an NMC-eligible, WHO-listed university, and once you clear FMGE or NExT on your return. As with every destination, the degree qualifies you to sit the Indian licensing exam rather than to skip it — build that preparation in from the early years.",
    },
    {
      category: "Life Abroad",
      q: "How often will I realistically get home?",
      a: "China is the furthest destination in the portfolio, and flight time and cost from India are higher than for Georgia or Central Asia. That genuinely affects how often families visit across six years, and it is worth planning for honestly at the outset rather than discovering in the second year.",
    },
  ],
  nepal: [
    {
      category: "Process & Visa",
      q: "Do Indian students need a visa for Nepal?",
      a: "No. India and Nepal maintain a long-standing free-movement arrangement, so Indian nationals do not need a student visa to study there. A valid passport or voter ID is enough to enter and to stay for the length of the course. There is no embassy appointment, no invitation letter and no residence permit to renew each year — an entire category of paperwork, cost and risk that every other destination on this site carries simply does not apply.",
    },
    {
      category: "Recognition & Licensing",
      q: "Is an MBBS from Nepal valid in India?",
      a: "Eligibility to sit FMGE or NExT is governed by the National Medical Commission's regulations as they stand when you take admission and when you graduate — including requirements on course length, the internship and the medium of instruction. Chitwan Medical College is affiliated to Tribhuvan University, recognized by the Nepal Medical Council and listed in the World Directory of Medical Schools. We put the current NMC position in writing before any payment is made, and we would rather lose the application than have you find out in the final year.",
    },
    {
      category: "Eligibility",
      q: "Is NEET required for MBBS in Nepal?",
      a: "Yes. Every Indian student who intends to practise in India after studying medicine abroad must have qualified NEET-UG, and Nepal is no exception. You need the qualifying percentile rather than a rank high enough for an Indian government seat.",
    },
    {
      category: "Eligibility",
      q: "How long is the MBBS programme in Nepal?",
      a: "Four and a half academic years followed by a one-year compulsory rotating internship — five and a half years in total, taught entirely in English. That is half a year shorter than the Russian and Chinese routes.",
    },
    {
      category: "Fees & Funding",
      q: "How are fees set for MBBS in Nepal?",
      a: "Unusually, they are capped. Nepal's Medical Education Commission publishes a national fee ceiling for MBBS which colleges cannot price above, and the ceiling is higher outside the Kathmandu Valley than inside it. That is a rare degree of price regulation for private medical education. We confirm the current figure for Chitwan in writing during counselling rather than printing an estimate that moves between cycles.",
    },
    {
      category: "Fees & Funding",
      q: "Is Nepal the cheapest option you offer?",
      a: "No, and we would rather say so plainly. Russia and Kyrgyzstan both complete at a materially lower total cost. What Nepal offers instead is proximity, no visa, no language adjustment and a curriculum built close to the one FMGE and NExT are written against. Whether that is worth the difference is a decision for you, not for us.",
    },
    {
      category: "Life Abroad",
      q: "Will I face a language barrier?",
      a: "Effectively none. Teaching is in English throughout, and Hindi is widely understood across Nepal including on the ward. Of every destination in this portfolio, Nepal is the only one where you can take a patient history in a language you already speak from the earliest rotations, rather than after two years of compulsory language classes.",
    },
    {
      category: "Life Abroad",
      q: "What is Bharatpur like?",
      a: "Bharatpur is the largest city in Chitwan district, in Nepal's Terai lowlands on the Narayani river, and it has grown into the medical hub of the region. It sits roughly midway between Kathmandu and the Indian border and has its own domestic airport. The climate is subtropical — hot summers, a monsoon from June to September, and mild dry winters that need nothing heavier than a jacket. Chitwan National Park is directly to the south.",
    },
    {
      category: "Life Abroad",
      q: "What clinical exposure will I get?",
      a: "Chitwan Medical College runs its own 750-bed teaching hospital on campus, with MD, MS and DM/MCh super-speciality programmes attached to it. That makes it a genuine tertiary referral centre rather than a teaching annexe, so the caseload passing through it is broader than primary presentations. It is still a smaller health system than Russia's or China's, and case volume is correspondingly narrower than at the largest teaching hospitals elsewhere in the portfolio.",
    },
    {
      category: "Process & Visa",
      q: "How does admission work?",
      a: "Admission to MBBS in Nepal runs through the Medical Education Commission's own centralised process and calendar rather than through each college independently. Seats are limited and competition is real, so timing matters more here than at most of our destinations — we plan Nepal applications against the MEC calendar rather than a college deadline.",
    },
  ],
  kyrgyzstan: [
    {
      category: "Recognition & Licensing",
      q: "Is our Kyrgyz listing NMC recognized?",
      a: "This is the most important question on this page, so here is the direct answer: our Kyrgyz listing carries ECFMG and WHO recognition, not NMC. If your plan is to return to India and practise, NMC eligibility governs whether you can sit FMGE or NExT at all. You must confirm the current NMC position for this specific university, in writing, before you pay anything — we will do that with you, and if it does not clear we will say so and point you at Georgia or Russia instead.",
    },
    {
      category: "Fees & Funding",
      q: "Is this really the cheapest option?",
      a: "Yes, on published cost. The University of South Asia in Bishkek completes at USD 20,400 total — less than a third of most Indian private medical colleges, with no donation at any stage, and living costs of USD 100 – 150 a month. But the lowest fee is not automatically the best value: you are buying six years of teaching that determines how a licensing exam goes, so weigh price against clinical exposure rather than instead of it.",
    },
    {
      category: "Recognition & Licensing",
      q: "What does ECFMG recognition actually give me?",
      a: "It is the reason this listing is in the portfolio. ECFMG governs entry to US medical licensure, so recognition supports ECFMG certification, the USMLE sequence and the US residency match — subject to that body's own current rules, which change and which we go through with you rather than summarising away.",
    },
    {
      category: "Eligibility",
      q: "How long is the programme?",
      a: "5.5 years including a one-year internship — half a year shorter than the Russian route, taught entirely in English. There are two intakes a year, in February and September, so you are never waiting a full cycle for the next opportunity.",
    },
    {
      category: "Life Abroad",
      q: "What is Bishkek like to live in?",
      a: "The capital and by a wide margin the largest city in Kyrgyzstan, laid out on a Soviet grid at the foot of the Tien Shan. It has a reputation as one of the safest capitals in Central Asia — a low crime rate, with petty theft as the main practical concern — and it is compact and walkable. Ala Archa national park and Lake Issyk-Kul are weekend distance.",
    },
    {
      category: "Life Abroad",
      q: "Will I find Indian food and community?",
      a: "Yes, and this is one of Kyrgyzstan's real strengths. Bishkek has hosted Indian medical students for over two decades, so Indian restaurants, grocery stores stocking Indian provisions, hostel messes serving Indian food, student associations and senior support are all long established before you arrive.",
    },
    {
      category: "Life Abroad",
      q: "How cold are the winters?",
      a: "Genuinely cold — well below freezing, with real snow, and long. It is a physical adjustment in the first year and warm clothing is a first-month purchase rather than optional. Spring is mild and summers are warm and sunny rather than oppressive.",
    },
    {
      category: "Life Abroad",
      q: "What are the trade-offs I should think about?",
      a: "Bishkek is a capital but it is not a metro. Variety of experience, hospital scale and case volume are smaller than in the large Russian or Chinese university cities. The cost saving is real and so is that trade-off, and you should decide with both in view.",
    },
    {
      category: "Recognition & Licensing",
      q: "What postgraduate options do I have?",
      a: "You can continue directly into an MD specialisation at Kyrgyz universities, or into a doctoral programme if you are on an academic track. Graduates also move to postgraduate programmes in other countries after clearing the relevant screening examination for that jurisdiction.",
    },
  ],
};

/** FAQs written specifically for a destination page. Falls back to
 *  the featured global set where a country has no bank of its own. */
export function faqsForCountry(slug: string): FaqItem[] {
  return COUNTRY_FAQS[slug] ?? FEATURED_FAQS.slice(0, 8);
}
