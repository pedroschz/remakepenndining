// Static data powering the site. All claims cite the public record;
// sources listed in the research dossier and petition text.

export type TimelineEvent = {
  date: string;
  year: number;
  title: string;
  detail: string;
  facility?: string;
  category: "sanitation" | "pest" | "food-safety" | "labor" | "policy";
  sourceUrl?: string;
};

export const timelineEvents: TimelineEvent[] = [
  {
    date: "Dec 2013",
    year: 2013,
    title: "Three critical violations logged across dining halls",
    detail:
      "Fruit unprotected from contamination at Kings Court English; creamer urns at improper temperature and not sanitized every 4 hours at Einstein Bagels.",
    category: "food-safety",
    sourceUrl:
      "https://www.thedp.com/article/2013/12/bon-appetit-dining-halls-critical-violations-food-safety-office-of-food-protection",
  },
  {
    date: "Oct 2014",
    year: 2014,
    title: "Live cockroaches at 1920 Commons",
    detail:
      "Inspectors observed live roaches at the breakfast and ice cream stations.",
    facility: "1920 Commons",
    category: "pest",
    sourceUrl:
      "https://www.thedp.com/article/2015/02/cockroaches-commons-food-safety",
  },
  {
    date: "Dec 2014",
    year: 2014,
    title: "Mouse droppings at Falk/Hillel main kitchen",
    facility: "Falk Kosher",
    detail: "Observed by Philadelphia Office of Food Protection inspectors.",
    category: "pest",
  },
  {
    date: "Aug 2014",
    year: 2014,
    title: "Student hospitalized after mislabeled vegan meal",
    facility: "1920 Commons",
    detail:
      "Victoria Greene was hospitalized after eating food labeled vegan that contained dairy.",
    category: "food-safety",
    sourceUrl:
      "https://www.thedp.com/article/2015/03/penn-vegan-food-mislabeled",
  },
  {
    date: "Feb 2020",
    year: 2020,
    title: "~30 students report food poisoning from undercooked chicken",
    facility: "Hill House",
    detail:
      "DP column based on a first-year Facebook thread documented ~30 affected students during reading days.",
    category: "food-safety",
    sourceUrl:
      "https://www.thedp.com/article/2020/02/alfredo-pratico-bon-appetit-upenn-dining",
  },
  {
    date: "Mar 2020",
    year: 2020,
    title: "BAMCO plans to lay off 140 workers without pay",
    detail:
      "Penn Student Labor Action Project petition draws 8,322 signatures; Penn reverses the decision.",
    category: "labor",
    sourceUrl:
      "https://www.thedp.com/article/2020/03/penn-dining-bon-appetit-laid-off-workers-coronavirus",
  },
  {
    date: "Winter 2022–23",
    year: 2023,
    title: "100 health code observations across Penn Dining",
    detail:
      "Two facilities found non-compliant. Hill House logs 16 violations and 38 points of concern; 1920 Commons logs 8 violations and 21 points of concern.",
    category: "sanitation",
    sourceUrl:
      "https://www.thedp.com/article/2023/03/penn-dining-health-code-violations-response",
  },
  {
    date: "Jan 2023",
    year: 2023,
    title: "Six separate sightings of mouse droppings at Hill",
    facility: "Hill House",
    detail:
      "Two were in direct contact with pans and containers of ingredients. A fruit-fly infestation was traced to the biodigester.",
    category: "pest",
  },
  {
    date: "Mar 2023",
    year: 2023,
    title: "1920 Commons fails re-inspection",
    facility: "1920 Commons",
    detail:
      "Second non-compliance finding within the same year for new and repeated violations.",
    category: "sanitation",
    sourceUrl:
      "https://www.thedp.com/article/2023/04/penn-dining-hill-college-house-passes-reinspection",
  },
  {
    date: "Jan 2024",
    year: 2024,
    title: "Cockroach, glass, and maggot in student meals",
    detail:
      "Cockroach at 1920 Commons (Jan 14), piece of glass in pasta at Penn Pi (Jan 18), maggot on broccoli at 1920 Commons (Jan 23).",
    facility: "1920 Commons",
    category: "food-safety",
    sourceUrl:
      "https://www.thedp.com/article/2024/01/roach-glass-maggot-penn-dining-halls-sighting",
  },
  {
    date: "Oct 2024",
    year: 2024,
    title: "Hair in sugar cookie, mold on Gourmet Grocer sandwich",
    detail:
      "Columnist Elo Esalomi documents both on the same day.",
    category: "food-safety",
    sourceUrl:
      "https://www.thedp.com/article/2024/11/penn-dining-restaurant-philly-food-quality",
  },
  {
    date: "Jan 2026",
    year: 2026,
    title: "Dead mouse in canned food storage; repeat Cat. 53 violation",
    facility: "1920 Commons",
    detail:
      "Found on a sticky trap in the canned food storage room. Cited explicitly as a repeat violation, contradicting Penn Dining's 2023 assurance of no repeat uncorrected findings.",
    category: "pest",
    sourceUrl:
      "https://www.thedp.com/article/2026/02/penn-dining-hall-health-inspections-actions-mouse-1920-commons",
  },
  {
    date: "Feb 2026",
    year: 2026,
    title: "Ten violations at Houston Market in a single visit",
    facility: "Houston Market",
    detail:
      "Cooked eggs held overnight at improper temperature were discarded by the inspector. Improperly stored sauces, an uncovered container of cooked pork, and a missing refrigerator thermometer at Penn Pi.",
    category: "food-safety",
    sourceUrl:
      "https://www.thedp.com/article/2026/02/penn-dining-hall-health-inspections-actions-mouse-1920-commons",
  },
  {
    date: "Mar 2026",
    year: 2026,
    title: "Meal plan priced raised to $6,960 / year",
    detail:
      "Penn Board of Trustees approves the increase for 2026–27, up from $6,744.",
    category: "policy",
    sourceUrl:
      "https://www.thedp.com/article/2026/03/penn-trustees-undergraduate-tuition-increase-2026",
  },
];

export type PeerSchool = {
  name: string;
  model: "self-op" | "contracted" | "hybrid";
  contractor?: string;
  unlimitedPlanYear?: number;
  princetonReviewRank?: number | "—";
  notes?: string;
};

export const peerSchools: PeerSchool[] = [
  {
    name: "Penn",
    model: "contracted",
    contractor: "Bon Appétit (Compass Group)",
    unlimitedPlanYear: 6960,
    princetonReviewRank: "—",
    notes: "No Princeton Review ranking. No public contract rebid since 2009.",
  },
  {
    name: "UMass Amherst",
    model: "self-op",
    unlimitedPlanYear: 8472,
    princetonReviewRank: 1,
    notes: "#1 for 9 consecutive years (2018–2026).",
  },
  {
    name: "Yale",
    model: "self-op",
    unlimitedPlanYear: 9100,
    princetonReviewRank: 24,
    notes: "Self-operated residential dining.",
  },
  {
    name: "Princeton",
    model: "self-op",
    unlimitedPlanYear: 4500,
    princetonReviewRank: 23,
    notes: "Self-operated; roughly $4,500/yr unlimited.",
  },
  {
    name: "Cornell",
    model: "self-op",
    unlimitedPlanYear: 7328,
    princetonReviewRank: 9,
    notes: "23,000 meals/day across 30+ eateries.",
  },
  {
    name: "Johns Hopkins",
    model: "self-op",
    unlimitedPlanYear: undefined,
    princetonReviewRank: "—",
    notes:
      "Ended BAMCO in 2022. Rehired all hourly workers. Starting wage $19.88/hr.",
  },
  {
    name: "Washington U.",
    model: "contracted",
    contractor: "Sodexo (post-BAMCO)",
    unlimitedPlanYear: undefined,
    princetonReviewRank: 8,
    notes: "BAMCO walked away after workers unionized with UFCW Local 655.",
  },
  {
    name: "Harvard",
    model: "self-op",
    unlimitedPlanYear: undefined,
    princetonReviewRank: "—",
    notes: "Self-operated.",
  },
];

export const headlineStats = [
  {
    value: "100+",
    label: "Health code observations",
    context: "Across Penn Dining in a single 2023 inspection cycle.",
  },
  {
    value: "13",
    label: "Years of documented pattern",
    context: "From 2013 through Feb 2026, including repeat violations.",
  },
  {
    value: "$6,960",
    label: "Cost per year, 2026–27",
    context: "Up from $6,744. Required for all first-years.",
  },
  {
    value: "4.9%",
    label: "Student satisfaction",
    context: "December 2022 Class of 2025 GroupMe poll (n=82).",
  },
  {
    value: "8,322",
    label: "Signed the 2020 petition",
    context: "When BAMCO tried to lay off 140 Penn workers without pay.",
  },
  {
    value: "$41.9M",
    label: "Compass Group penalties",
    context: "Documented regulatory settlements since 2000.",
  },
];

export const communityGuidelines = [
  "Focus on experiences and observable conditions. No personal attacks on individual workers.",
  "Do not share identifying information; names, photos of faces, student IDs, or private contact details.",
  "Be specific. 'A meal at 1920 Commons in October' is more useful than 'Penn food is bad.'",
  "If you upload an image, make sure you personally took it and have the right to share it.",
  "No slurs, harassment, or targeted hate.",
  "Reports from at least three readers will auto-hide a post pending review.",
];
