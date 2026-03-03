// ==========================================================
// ATS RESUME ANALYZER (ROLE-AWARE + PRONOUN CHECK INCLUDED)
// ==========================================================

/**
 * Detect resume profile type
 */
const detectProfileType = (text) => {
  const techSignals = [
    "javascript","react","node","api","mongodb","sql",
    "python","java","developer","engineer","frontend","backend"
  ];

  const nonTechSignals = [
    "manager","operations","sales","marketing","hr","recruiter",
    "account","business","client","communication","strategy"
  ];  

  let techScore = 0;
  let nonTechScore = 0;

  techSignals.forEach(k => text.includes(k) && techScore++);
  nonTechSignals.forEach(k => text.includes(k) && nonTechScore++);

  if (techScore >= 2 && techScore >= nonTechScore) return "tech";
  if (nonTechScore > techScore) return "non-tech";
  return "general";
};


// ==========================================================
// MAIN ATS ANALYZER
// ==========================================================

export const analyzeATSCompatibility = (
  text,
  extractedData = {},
  fileType = ""
) => {

  console.log("===== ATS FUNCTION STARTED =====");

  const analysis = {
    overallScore: 0,
    profileType: "general",
    sectionScores: [],
    matchedKeywords: [],
    missingKeywords: [],
    suggestions: [],   // 🔴 keep global suggestions for compatibility
    pronounDetails: [],
    metrics: {}
  };

  const textLower = text.toLowerCase();

  const profileType = detectProfileType(textLower);
  analysis.profileType = profileType;

  // =====================================================
  // 1️⃣ FILE FORMAT
  // =====================================================

  const validFormats = ["pdf", "doc", "docx"];
  let fileScore = 0;
  let fileSuggestions = [];

  let resolvedFileType = fileType;
  if (!resolvedFileType && extractedData?.originalName) {
    resolvedFileType = extractedData.originalName.split(".").pop();
  }

  if (resolvedFileType && validFormats.includes(resolvedFileType.toLowerCase())) {
    fileScore = 10;
  } else {
    const msg = "Upload resume in PDF or DOC/DOCX format.";
    fileSuggestions.push(msg);
    analysis.suggestions.push(msg);
  }

  analysis.sectionScores.push({
    sectionName: "File Format Compatibility",
    score: fileScore,
    maxScore: 10,
    status: fileScore === 10 ? "ok" : "error",
    suggestions: fileSuggestions
  });

  analysis.overallScore += fileScore;

  // =====================================================
  // 2️⃣ CONTACT INFO
  // =====================================================

 // =====================================================
// 2️⃣ CONTACT INFO (DYNAMIC)
// =====================================================
// =====================================================
// 2️⃣ CONTACT INFO (TEXT-BASED DYNAMIC DETECTION)
// =====================================================

let contactScore = 0;
let contactSuggestions = [];
let missingContacts = [];

// Detect Email
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const hasEmail = emailRegex.test(text);

// Detect Phone
const phoneRegex = /\b\d{10}\b|\+\d{1,3}\s?\d{6,14}/;
const hasPhone = phoneRegex.test(text);

// Detect LinkedIn
const linkedinRegex = /linkedin\.com\/in\/[A-Za-z0-9_-]+/i;
const hasLinkedIn = linkedinRegex.test(text);

// Detect GitHub (for tech profile)
const githubRegex = /github\.com\/[A-Za-z0-9_-]+/i;
const hasGitHub = githubRegex.test(text);

if (hasEmail) contactScore += 4;
else missingContacts.push("Email");

if (hasPhone) contactScore += 3;
else missingContacts.push("Phone number");

if (hasLinkedIn) contactScore += 2;
else missingContacts.push("LinkedIn");

if (profileType === "tech") {
  if (hasGitHub) contactScore += 1;
  else missingContacts.push("GitHub");
}

if (missingContacts.length > 0) {
  const msg = `Missing contact details: ${missingContacts.join(", ")}.`;
  contactSuggestions.push(msg);
  analysis.suggestions.push(msg);
}

analysis.sectionScores.push({
  sectionName: "Contact Information",
  score: contactScore,
  maxScore: 10,
  status: contactScore >= 8 ? "ok" : "warn",
  suggestions: contactSuggestions
});

analysis.overallScore += contactScore;
  // =====================================================
  // 3️⃣ KEYWORDS
  // =====================================================

  const KEYWORDS = {
    tech: [
      "html","css","javascript","react","node","express",
      "mongodb","api","git","testing","deployment","performance"
    ],
    "non-tech": [
      "communication","leadership","operations","planning",
      "client","strategy","process","analysis"
    ],
    general: [
      "team","collaboration","problem solving",
      "adaptability","communication"
    ]
  };

  const relevantKeywords = KEYWORDS[profileType];
  let keywordScore = 0;
  let keywordSuggestions = [];

  relevantKeywords.forEach(keyword => {
    const matches = textLower.match(new RegExp(`\\b${keyword}\\b`, "gi")) || [];

    if (matches.length > 0) {
      keywordScore += Math.min(3, matches.length);
      analysis.matchedKeywords.push({ keyword });
    } else {
      analysis.missingKeywords.push({ keyword });
    }
  });

  keywordScore = Math.min(20, keywordScore);

  if (keywordScore < 14) {
    const msg = "Increase role-specific keywords naturally.";
    keywordSuggestions.push(msg);
    analysis.suggestions.push(msg);
  }

  analysis.sectionScores.push({
    sectionName: "Keyword Optimization",
    score: keywordScore,
    maxScore: 20,
    status: keywordScore >= 14 ? "ok" : "warn",
    suggestions: keywordSuggestions
  });

  analysis.overallScore += keywordScore;

  // =====================================================
  // 4️⃣ HEADINGS
  // =====================================================

  const headings = ["experience","education","skills","projects"];
  let headingScore = 0;
  let headingSuggestions = [];

  headings.forEach(h => {
    if (new RegExp(`\\b${h}\\b`, "i").test(textLower)) {
      headingScore += 4;
    }
  });

  if (headingScore < 12) {
    const msg = "Use standard headings like Experience, Skills, Education.";
    headingSuggestions.push(msg);
    analysis.suggestions.push(msg);
  }

  analysis.sectionScores.push({
    sectionName: "Section Structure",
    score: headingScore,
    maxScore: 16,
    status: headingScore >= 12 ? "ok" : "warn",
    suggestions: headingSuggestions
  });

  analysis.overallScore += headingScore;

  // =====================================================
  // 5️⃣ MEASURABLE RESULTS
  // =====================================================

  const measurableRegex =
    /\b\d+%|\b\d+\s*(users|clients|projects|years)|increased|improved|reduced|optimized|led|built|developed|implemented/gi;

  const measurableMatches = text.match(measurableRegex) || [];
  const uniqueMatches = new Set(measurableMatches.map(m => m.toLowerCase()));
  const measurableScore = Math.min(14, uniqueMatches.size * 3);

  let measurableSuggestions = [];

  if (measurableScore < 9) {
    const msg = "Add measurable achievements with numbers and impact.";
    measurableSuggestions.push(msg);
    analysis.suggestions.push(msg);
  }

  analysis.sectionScores.push({
    sectionName: "Measurable Achievements",
    score: measurableScore,
    maxScore: 14,
    status: measurableScore >= 9 ? "ok" : "warn",
    suggestions: measurableSuggestions
  });

  analysis.overallScore += measurableScore;

  // =====================================================
  // 6️⃣ PRONOUN CHECK
  // =====================================================


const pronouns = ["i", "we", "us", "our"];
let pronounMatches = [];

pronouns.forEach((word) => {
  const matches = textLower.match(new RegExp(`\\b${word}\\b`, "gi")) || [];
  matches.forEach(() => pronounMatches.push(word));
});


const pronounCount = pronounMatches.length;

let pronounScore = 20;
let pronounSuggestions = [];

if (pronounCount > 0) {
  pronounScore = Math.max(0, 20 - pronounCount * 5);

  const grouped = {};
  pronounMatches.forEach(p => {
    grouped[p] = (grouped[p] || 0) + 1;
  });

  const breakdown = Object.entries(grouped)
    .map(([k, v]) => `${k.toUpperCase()} (${v})`)
    .join(", ");

  pronounSuggestions.push(
    `Detected ${pronounCount} personal pronoun(s): ${breakdown}.`
  );

  pronounSuggestions.push(
    "Avoid using personal pronouns in resumes."
  );

  pronounSuggestions.push(
    "Start bullet points with strong action verbs instead."
  );
}

analysis.sectionScores.push({
  sectionName: "Personal Pronoun Usage",
  score: pronounScore,
  status: pronounScore === 20 ? "ok" : "warn",
  suggestions: pronounSuggestions,
});

analysis.overallScore += pronounScore;


  // =====================================================
  // FINAL SCORE
  // =====================================================

  analysis.overallScore = Math.min(100, Math.round(analysis.overallScore));

  console.log("===== FINAL ATS ANALYSIS =====");
  console.log(analysis);

  return analysis;
};


// ==========================================================
// 🔹 KEEP THESE EXPORTS (FOR YOUR CONTROLLER)
// ==========================================================

export const generateRecommendations = (analysis) => {
  return analysis.suggestions.map((text, index) => ({
    id: index + 1,
    priority: "high",
    description: text,
  }));
};

export const passesATSThreshold = (score) => {
  return score >= 70;
};
