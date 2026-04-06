import mammoth from "mammoth";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/* ================= PDF PARSER ================= */

export const parsePDF = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    return {
      success: true,
      text: data.text,
      numPages: data.numpages
    };
  } catch (err) {
    console.error("PDF parse error:", err);
    return { success: false, error: err.message };
  }
};

/* ================= DOCX PARSER ================= */

export const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });

    return {
      success: true,
      text: result.value
    };
  } catch (err) {
    console.error("DOCX parse error:", err);
    return { success: false, error: err.message };
  }
};

/* ================= FILE ROUTER ================= */

export const parseResume = async (file) => {
  const filePath = file.path;
  const type = file.mimetype;

  if (type === "application/pdf") return parsePDF(filePath);

  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return parseDOCX(filePath);
  }

  return { success: false, error: "Unsupported file type" };
};

/* ================= SECTION SPLITTER ================= */

/**
 * Improved section splitter that detects standard resume headings
 * and splits the text into corresponding sections.
 * 
 * Handles all common heading variations people use across resume formats:
 *  - Resume Builder uses "Work" tab → resume might say "Experience" or "Work Experience"
 *  - Resume Builder uses "Personal" tab → resume might say "Summary", "Objective", "Profile"
 *  - Resume Builder uses "Certifications" tab → resume might say "Awards", "Training", "Courses"
 */
const splitSections = (text) => {
  const sections = {
    header: "",
    summary: "",
    experience: "",
    education: "",
    certifications: "",
    skills: "",
    projects: ""
  };

  // Section heading patterns — order matters!
  // MORE SPECIFIC patterns must come FIRST to avoid greedy matching.
  // E.g. "Career Objective" must match summary before "career" could match experience.
  const sectionMap = [
    // PROJECTS — builder tab: "Projects"
    { key: "projects", patterns: [
      /\b(projects?|personal\s+projects?|academic\s+projects?|key\s+projects?|notable\s+projects?|selected\s+projects?|side\s+projects?|relevant\s+projects?|portfolio)\b/i
    ]},

    // CERTIFICATIONS — builder tab: "Certifications"
    { key: "certifications", patterns: [
      /\b(certifications?|licenses?\s*(?:&|and)?\s*certifications?|certificates?|professional\s+certifications?|awards?\s*(?:&|and)\s*certifications?|awards?\s*(?:&|and)\s*achievements?|awards?|achievements?|honors?\s*(?:&|and)?\s*awards?|honors?|training|professional\s+development|courses?|achievements?\s*(?:&|and)\s*awards?)\b/i
    ]},

    // SUMMARY — MUST come BEFORE experience so "Career Objective" matches here, not as "career" in experience
    { key: "summary", patterns: [
      /\b(career\s+objective|career\s+summary|career\s+profile|professional\s+summary|executive\s+summary|professional\s+profile|professional\s+overview|personal\s+statement|personal\s+profile|summary|profile|objective|about\s+me|introduction|overview|bio|biography)\b/i
    ]},

    // EXPERIENCE — builder tab: "Work"
    // NOTE: "career" alone removed — too greedy, matches "Career Objective" etc.
    { key: "experience", patterns: [
      /\b(work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history|internships?|work|career\s+history|professional\s+background|relevant\s+experience|career\s+experience|positions?\s+held|job\s+experience|industry\s+experience|employment|job\s+history|professional\s+history)\b/i
    ]},

    // EDUCATION — builder tab: "Education"
    { key: "education", patterns: [
      /\b(education|academic\s+background|academic\s+qualifications?|educational\s+background|academics?|academic\s+details?|educational\s+qualifications?|schooling|qualifications?)\b/i
    ]},

    // SKILLS — builder tab: "Skills"
    { key: "skills", patterns: [
      /\b(skills|technical\s+skills|core\s+competencies|competencies|key\s+skills|areas?\s+of\s+expertise|tools?\s*(?:&|and)\s*technologies|technologies|tech\s+stack|expertise|proficiencies|abilities|technical\s+proficiencies|relevant\s+skills|professional\s+skills|software\s+skills|hard\s+skills|soft\s+skills|skills?\s*(?:&|and)\s*abilities|tools?\s*(?:&|and)\s*frameworks?|programming\s+languages?|languages?\s*(?:&|and)\s*tools?)\b/i
    ]},
  ];

  const lines = text.split("\n");
  let current = "header"; // start collecting into header (name, contact info at top)

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      sections[current] += "\n";
      return;
    }

    // Strip common heading decorators before testing
    const stripped = trimmed
      .replace(/^#+\s*/, "")          // Markdown "## Heading"
      .replace(/^[\u2022\u25CF\u25CB\u25AA\u25BA]\s*/, "") // Bullet chars ● ○ ▪ ►
      .replace(/^\d+[.)]\s*/, "")     // Numbered "1. Heading" or "1) Heading"
      .replace(/[:：]\s*$/, "")        // Trailing colon "Skills:" or "Skills："
      .replace(/^[-–—=_]{2,}\s*/, "") // Underline/separator "--- Heading"
      .replace(/[-–—=_]{2,}\s*$/, "") // Trailing separator
      .trim();

    // Check if this line is a section heading
    // A heading line should be primarily the heading text itself, not a content line
    // that happens to contain a heading keyword somewhere in it.
    const isLikelyHeading =
      stripped.length < 80 &&
      stripped.length > 1 &&
      (
        stripped === stripped.toUpperCase() ||           // ALL CAPS: "EXPERIENCE"
        /^#{1,3}\s/.test(trimmed) ||                     // Markdown: "## Experience"
        /^[A-Z][A-Z\s&/,]+$/.test(stripped) ||           // TITLE CASE: "WORK EXPERIENCE"
        /^[A-Z][a-z]+(\s+[A-Z&][a-z]*)*\s*$/.test(stripped) || // Title Case: "Work Experience"
        /^[A-Za-z\s&/,]+:\s*$/.test(trimmed) ||          // Colon suffix: "Skills:"
        /^[-•*·\u2022\u2023\u25E6\u2043\u2219\u22c5]/.test(trimmed)                     // Preceded by line separator
        // REMOVED: trimmed !== trimmed.toLowerCase() — too greedy, matched content lines
      );

    let matched = false;
    for (const section of sectionMap) {
      for (const pattern of section.patterns) {
        // Test against both the original trimmed text and the stripped version
        const patternMatches = pattern.test(trimmed) || pattern.test(stripped);
        if (!patternMatches) continue;

        // Extract what the pattern actually matched to verify it covers the heading
        const match = stripped.match(pattern) || trimmed.match(pattern);
        const matchedText = match ? match[0] : "";

        // The matched heading keyword must cover at least 60% of the stripped line
        // This prevents content like "Best Performer Award | Infosys | 2022" from
        // being treated as a heading just because it contains the word "Award"
        const coverageRatio = matchedText.length / stripped.length;
        const isSubstantialMatch = coverageRatio >= 0.6;

        if (isSubstantialMatch && (isLikelyHeading || stripped.length < 40)) {
          current = section.key;
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      sections[current] += line + "\n";
    }
  });

  return sections;
};

/* ================= HELPER: Clean text ================= */

const cleanText = (str) => (str || "").replace(/\s+/g, " ").trim();

/* ================= HELPER: Extract dates ================= */

const DATE_PATTERNS = [
  // "Jun 2020 – Mar 2022", "November 2021 - Present"
  /(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\s*[-–—]\s*(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|[Pp]resent|[Cc]urrent|[Nn]ow)/i,
  // "2020 – 2022", "2020 - Present"
  /(\b\d{4})\s*[-–—]\s*(\d{4}|[Pp]resent|[Cc]urrent|[Nn]ow)/i,
  // "01/2020 – 03/2022"
  /(\d{1,2}\/\d{4})\s*[-–—]\s*(\d{1,2}\/\d{4}|[Pp]resent|[Cc]urrent|[Nn]ow)/i,
];

const extractDates = (line) => {
  for (const pattern of DATE_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      return { startDate: match[1], endDate: match[2], fullMatch: match[0] };
    }
  }
  return null;
};

/* ================= MAIN DATA EXTRACTION ================= */

export const extractResumeData = (text) => {
  console.log("🔍 Starting resume parsing with text length:", text.length);

  const data = {
    email: null,
    phone: null,
    name: null,
    fullName: null,
    summary: "",
    skills: { technical: [], soft: [] },
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    location: null,
    linkedin: null,
    website: null
  };

  /* ===== CONTACT INFORMATION ===== */

  // Extract email
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (email) data.email = email[0];

  // Extract phone — support international formats
  const phone = text.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/);
  if (phone) data.phone = phone[0].trim();

  // Extract LinkedIn
  const linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedin) data.linkedin = linkedin[0];

  // Extract website/portfolio (skip linkedin/github)
  // Ensure it matches a full domain with explicit TLD or scheme to avoid false positives like Name.LastName
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin\.com|github\.com)[a-zA-Z0-9-]+\.(com|org|net|io|dev|co|me|in|app|site|tech)(?:\/[^\s]*)?/i);
  if (websiteMatch) {
    const url = websiteMatch[0];
    // Exclude email domains
    if (!url.includes("@") && !url.match(/gmail|yahoo|outlook|hotmail/i)) {
      data.website = url.startsWith("http") ? url : `https://${url}`;
    }
  }

  /* ===== SECTION SPLITTING ===== */

  const sections = splitSections(text);

  /* ===== NAME EXTRACTION ===== */
  // The name is usually at the very top (header section), first non-empty line
  const headerLines = sections.header.split("\n").filter(l => l.trim());
  for (const line of headerLines) {
    const trimmed = line.trim();
    // A likely name line: contains only letters, spaces, dots, hyphens; no numbers, no @
    if (
      /^[A-Za-z\s.\-']+$/.test(trimmed) &&
      trimmed.length >= 3 &&
      trimmed.length < 60 &&
      !/@/.test(trimmed) &&
      !/\b(summary|experience|education|skills|projects|certifications)\b/i.test(trimmed)
    ) {
      data.name = trimmed;
      data.fullName = trimmed;
      break;
    }
  }

  // Fallback: try from the first lines of the full text
  if (!data.name) {
    const firstLines = text.split("\n").filter(l => l.trim()).slice(0, 5);
    for (const line of firstLines) {
      const trimmed = line.trim();
      if (
        /^[A-Za-z\s.\-']+$/.test(trimmed) &&
        trimmed.length >= 3 &&
        trimmed.length < 60 &&
        !/@/.test(trimmed) &&
        !/\b(summary|experience|education|skills|projects|certifications)\b/i.test(trimmed)
      ) {
        data.name = trimmed;
        data.fullName = trimmed;
        break;
      }
    }
  }

  /* ===== LOCATION ===== */
  // Try to find location from header (city, state format)
  const headerText = sections.header;
  const locationMatch = headerText.match(/([A-Za-z\s]+),\s*([A-Za-z\s]{2,})/);
  if (locationMatch) {
    // Make sure it's not the name or email
    let potentialLoc = locationMatch[0].trim();
    // Pre-emptively remove the candidate's name if they were mistakenly bundled together
    if (data.name && potentialLoc.toLowerCase().includes(data.name.toLowerCase())) {
      potentialLoc = potentialLoc.replace(new RegExp(data.name, 'i'), '').trim();
    }
    // Clean leading non-alphabetic chars
    potentialLoc = potentialLoc.replace(/^[^a-zA-Z]+/, '').trim();

    if (
      potentialLoc !== data.name &&
      !potentialLoc.includes("@") &&
      potentialLoc.length > 2 &&
      potentialLoc.length < 60
    ) {
      data.location = potentialLoc;
    }
  }

  /* ===== SUMMARY/PROFILE ===== */

  if (sections.summary) {
    const summaryLines = sections.summary
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 10);

    if (summaryLines.length > 0) {
      let summaryText = summaryLines.join(" ");

      // Remove contact info that may have leaked into summary
      summaryText = summaryText.replace(/[\w.-]+@[\w.-]+\.\w+/g, "");
      summaryText = summaryText.replace(/\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/g, "");
      summaryText = summaryText.replace(/linkedin\.com\/in\/[\w-]+/gi, "");
      summaryText = summaryText.replace(/github\.com\/[\w-]+/gi, "");

      // Clean up pipes and extra whitespace
      summaryText = summaryText.replace(/\s*\|\s*/g, " ");
      summaryText = summaryText.replace(/\s+/g, " ").trim();

      if (summaryText.length > 10) {
        data.summary = summaryText.slice(0, 500);
      }
    }
  }

  /* ===== EXPERIENCE ===== */

  const experienceText = sections.experience;
  if (experienceText) {
    const expLines = experienceText.split("\n");
    let currentExperience = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect bullet point descriptions
      const isBullet = /^[-•*·\u2022\u2023\u25E6\u2043\u2219]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);

      if (isBullet && currentExperience) {
        const bulletText = trimmed.replace(/^[-•*\d.]+\s*/, "").trim();
        if (bulletText.length > 5) {
          currentExperience.description += (currentExperience.description ? " " : "") + bulletText;
        }
        continue;
      }

      // Try to detect a job title/company line
      const dates = extractDates(trimmed);

      // Check if this line is PURELY a date range (e.g. "Jan 2022 - Present", "2020 - 2022")
      // If so, DON'T try separator matching — it would incorrectly split "Jan 2022" / "Present"
      const isPureDateLine = dates && trimmed.replace(dates.fullMatch, "").trim().length < 5;

      // Job lines typically use separators: | – - , @
      const separatorPatterns = [
        /^(.+?)\s*\|\s*(.+)$/,           // "Title | Company"
        /^(.+?)\s+[-–—]\s+(.+)$/,         // "Title - Company" (but not date ranges, required spaces)
        /^(.+?)\s*@\s*(.+)$/,             // "Title @ Company"
      ];

      // Check if line looks like a new job entry (has separator AND is not just a description line)
      let titleCompanyMatch = null;
      if (!isBullet && !isPureDateLine && trimmed.length < 150) {
        for (const pattern of separatorPatterns) {
          const match = trimmed.match(pattern);
          if (match) {
            // Make sure the first part isn't a date
            const firstPart = match[1].trim();
            const secondPart = match[2].trim();

            // Skip if first part looks like a date (year, month+year, or mm/yyyy)
            if (/^\d{4}$/.test(firstPart) || /^\d{1,2}\/\d{4}$/.test(firstPart)) continue;
            if (/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}$/i.test(firstPart)) continue;

            // Skip if second part is just "Present" or "Current" (a date endpoint)
            if (/^(Present|Current|Now)$/i.test(secondPart)) continue;

            // Also check that it's not super long (probably a description then)
            if (firstPart.length < 80 && secondPart.length < 80) {
              titleCompanyMatch = { title: firstPart, company: secondPart };
              break;
            }
          }
        }
      }

      // Check for job keywords (helps identify job title lines)
      const jobKeywords = /\b(intern|internship|developer|engineer|manager|analyst|specialist|coordinator|designer|consultant|associate|executive|lead|senior|junior|architect|administrator|officer|director|trainee)\b/i;
      const hasJobKeyword = jobKeywords.test(trimmed);

      if (titleCompanyMatch || (hasJobKeyword && !isBullet && trimmed.length < 120)) {
        // Save previous experience if exists
        if (currentExperience) {
          data.experience.push(currentExperience);
        }

        let title, company;
        if (titleCompanyMatch) {
          title = titleCompanyMatch.title;
          company = titleCompanyMatch.company;
        } else {
          title = trimmed;
          company = "";
        }

        // Remove dates from title/company
        if (dates) {
          title = title.replace(dates.fullMatch, "").trim();
          company = company.replace(dates.fullMatch, "").trim();
        }

        // Clean up trailing separators
        title = title.replace(/[\s|,\-–—]+$/, "").trim();
        company = company.replace(/[\s|,\-–—]+$/, "").trim();

        currentExperience = {
          id: Math.random().toString(36).slice(2),
          title: title || "Position",
          company: company || "",
          location: "",
          startDate: dates?.startDate || "",
          endDate: dates?.endDate || "",
          description: ""
        };
      } else if (dates && currentExperience) {
        // Date line after an existing experience entry — assign dates to it
        if (!currentExperience.startDate) {
          currentExperience.startDate = dates.startDate;
          currentExperience.endDate = dates.endDate;
        }
        // If there's also text alongside the dates, add as description
        const remainingText = trimmed.replace(dates.fullMatch, "").trim();
        if (remainingText.length > 10) {
          currentExperience.description += (currentExperience.description ? " " : "") + remainingText;
        }
      } else if (dates && !currentExperience) {
        // A date line without a preceding experience entry — create from remaining text
        const titleText = trimmed.replace(dates.fullMatch, "").trim();
        if (titleText.length > 3) {
          currentExperience = {
            id: Math.random().toString(36).slice(2),
            title: titleText,
            company: "",
            location: "",
            startDate: dates.startDate,
            endDate: dates.endDate,
            description: ""
          };
        }
      } else if (currentExperience && !isBullet && trimmed.length > 5 && trimmed.length < 200) {
        // Check if this is a location line (City, State format) — check first as it's very specific
        if (!currentExperience.location && /^[A-Za-z\s]+,\s*[A-Za-z\s]{2,}$/.test(trimmed) && trimmed.length < 60) {
          currentExperience.location = trimmed;
        }
        // Check if this line is a company name (short, no company yet, no bullet, no dates)
        else if (!currentExperience.company && trimmed.length < 80 && !dates) {
          currentExperience.company = trimmed.replace(/[,|]+$/, "").trim();
        }
        // Otherwise add as description text (only if long enough to be meaningful)
        else if (trimmed.length > 15) {
          currentExperience.description += (currentExperience.description ? " " : "") + trimmed;
        }
      }
    }

    // Push last experience
    if (currentExperience) {
      data.experience.push(currentExperience);
    }
  }

  /* ===== EDUCATION ===== */

  const educationText = sections.education;
  if (educationText) {
    const eduLines = educationText.split("\n").filter(l => l.trim());
    let currentEducation = null;

    for (const line of eduLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect degree patterns
      const degreePatterns = [
        /(Bachelor(?:'s)?|Master(?:'s)?|B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|B\.?E|M\.?E|B\.?A|M\.?A|Ph\.?D|Diploma|Associate|B\.?Com|M\.?Com|B\.?B\.?A|M\.?B\.?A)/i,
        /(Computer Science|Information Technology|Information Science|Engineering|Business Administration|Arts|Science|Artificial Intelligence|Machine Learning|Data Science|Electronics|Mechanical|Civil|Electrical)/i
      ];

      let hasDegree = false;
      let degreeText = "";
      for (const pattern of degreePatterns) {
        const match = trimmed.match(pattern);
        if (match) {
          hasDegree = true;
          degreeText = match[0];
          break;
        }
      }

      // Detect school/institution patterns
      const schoolPatterns = [
        /(University|College|Institute|School|Academy)/i
      ];
      let hasSchool = schoolPatterns.some(p => p.test(trimmed));

      const dates = extractDates(trimmed);

      // GPA extraction
      const gpaMatch = trimmed.match(/(?:GPA|CGPA|Grade)\s*[:\s]*(\d+\.?\d*)\s*(?:\/\s*(\d+\.?\d*))?/i);

      if (hasDegree || hasSchool) {
        // If we already have a pending education, save it first
        if (currentEducation) {
          data.education.push(currentEducation);
        }

        // Try to split "Degree in Subject - School" or "Degree | School"
        let degree = "";
        let school = "";

        // Try separator-based split
        const eduSeparatorPatterns = [
          /^(.+?)\s*\|\s*(.+)$/,
          /^(.+?)\s+[-–—]\s+(.+)$/,
          /^(.+?),\s*(.+)$/,
        ];

        let matched = false;
        for (const pattern of eduSeparatorPatterns) {
          const match = trimmed.match(pattern);
          if (match) {
            const part1 = match[1].trim();
            const part2 = match[2].trim();

            // Determine which part is degree and which is school
            if (/(University|College|Institute|School|Academy)/i.test(part1)) {
              school = part1;
              degree = part2;
            } else {
              degree = part1;
              school = part2;
            }
            matched = true;
            break;
          }
        }

        if (!matched) {
          // Try to extract school name from the line
          if (hasSchool) {
            school = trimmed;
            degree = degreeText;
          } else {
            degree = trimmed;
          }
        }

        // Remove dates from degree/school strings
        if (dates) {
          degree = degree.replace(dates.fullMatch, "").trim();
          school = school.replace(dates.fullMatch, "").trim();
        }

        // Remove GPA from degree/school
        if (gpaMatch) {
          degree = degree.replace(gpaMatch[0], "").trim();
          school = school.replace(gpaMatch[0], "").trim();
        }

        // Clean trailing separators
        degree = degree.replace(/[\s|,\-–—:]+$/, "").trim();
        school = school.replace(/[\s|,\-–—:]+$/, "").trim();

        currentEducation = {
          id: Math.random().toString(36).slice(2),
          school: school || "",
          degree: degree || "",
          location: "",
          startDate: dates?.startDate || "",
          graduationDate: dates?.endDate || "",
          gpa: gpaMatch ? gpaMatch[1] : ""
        };
      } else if (dates && currentEducation && !currentEducation.startDate) {
        // Date line for current education
        currentEducation.startDate = dates.startDate;
        currentEducation.graduationDate = dates.endDate;
      } else if (gpaMatch && currentEducation) {
        currentEducation.gpa = gpaMatch[1];
      } else if (currentEducation && trimmed.length > 5) {
        // Location or additional info
        const locMatch = trimmed.match(/^([A-Za-z\s]+),\s*([A-Za-z\s]{2,})$/);
        if (locMatch && !currentEducation.location) {
          currentEducation.location = trimmed;
        } else if (!currentEducation.degree && hasDegree) {
          currentEducation.degree = trimmed;
        }
      }
    }

    // Push last education entry
    if (currentEducation) {
      data.education.push(currentEducation);
    }
  }

  /* ===== PROJECTS ===== */

  const projectsText = sections.projects;
  if (projectsText) {
    const projLines = projectsText.split("\n");
    let currentProject = null;

    for (const line of projLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isBullet = /^[-•*·\u2022\u2023\u25E6\u2043\u2219]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);

      if (isBullet && currentProject) {
        // Add as description
        const bulletText = trimmed.replace(/^[-•*\d.]+\s*/, "").trim();
        if (bulletText.length > 5) {
          currentProject.description += (currentProject.description ? " " : "") + bulletText;
        }
        continue;
      }

      // Non-bullet line that's not too long → likely a project title
      // NEW HEURISTIC: A project title should NOT end with a period unless it's very short.
      // If it ends with a period and we already have a project, it's likely a description continuation.
      const endsWithPeriod = /[.!?]$/.test(trimmed);
      const startsWithCapital = /^[A-Z0-9]/.test(trimmed);
      // Project title should be short, start with capital/number, and NOT end with a period unless it's very short.
      const isLikelyTitle = !isBullet && startsWithCapital && trimmed.length > 3 && trimmed.length < 150 && (!endsWithPeriod || (trimmed.length < 30 && !currentProject));

      if (isLikelyTitle) {
        // Save previous project
        if (currentProject) {
          data.projects.push(currentProject);
        }

        // Try to split "Project Name | Technologies" or "Project Name - Description"
        let projectName = trimmed;
        let technologies = "";
        let description = "";
        const dates = extractDates(trimmed);

        const projSeparatorPatterns = [
          /^(.+?)\s*\|\s*(.+)$/,
          /^(.+?)\s+[-–—]\s+(.+)$/,
        ];

        for (const pattern of projSeparatorPatterns) {
          const match = trimmed.match(pattern);
          if (match) {
            projectName = match[1].trim();
            const secondPart = match[2].trim();

            // Check if second part looks like technologies
            const techKeywords = /\b(react|node|javascript|python|java|html|css|mongodb|sql|aws|angular|vue|django|flask|express|typescript|c\+\+|c#|php|ruby|go|rust|docker|kubernetes|firebase|tailwind|bootstrap|nextjs|graphql|postgresql|mysql|redis|spring|laravel|flutter|swift|kotlin)\b/i;
            if (techKeywords.test(secondPart)) {
              technologies = secondPart;
            } else {
              description = secondPart;
            }
            break;
          }
        }

        // Remove dates from project name
        if (dates) {
          projectName = projectName.replace(dates.fullMatch, "").trim();
        }

        // Clean link text like "Link" or "GitHub" at the end
        projectName = projectName.replace(/\s*\bLink\b\s*$/i, "").trim();

        currentProject = {
          id: Math.random().toString(36).slice(2),
          name: projectName,
          description: description,
          technologies: technologies,
          link: { github: "", liveLink: "", other: "" }
        };
      } else if (currentProject && trimmed.length > 0) {
        // Not a title, not a bullet, but we have an active project → append to description
        const cleanPart = trimmed.replace(/^[-•*\d.]+\s*/, "").trim();
        if (cleanPart.length > 0) {
          currentProject.description += (currentProject.description ? " " : "") + cleanPart;
        }
      }
    }

    // Push last project
    if (currentProject) {
      data.projects.push(currentProject);
    }
  }

  /* ===== CERTIFICATIONS ===== */

  const certsText = sections.certifications;
  if (certsText) {
    const certLines = certsText.split("\n").filter(l => l.trim());

    for (const line of certLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 5) continue;

      // Skip if it's just a heading
      if (/^(certifications?|licenses?|awards?)\s*:?\s*$/i.test(trimmed)) continue;

      // Clean bullet points
      const cleanLine = trimmed.replace(/^[-•*·\u2022\u2023\u25E6\u2043\u2219]\s*/, "").trim();
      if (cleanLine.length < 5) continue;

      // Try to extract issuer and date
      const dateMatch = cleanLine.match(/(\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i);

      // Split by | or -
      const issuerMatch = cleanLine.match(/^(.+?)\s*\|\s*(.+)$/);

      if (issuerMatch) {
        let name = issuerMatch[1].trim();
        let issuerAndDate = issuerMatch[2].trim();
        let issuer = issuerAndDate;
        let date = "";

        if (dateMatch) {
          date = dateMatch[1];
          issuer = issuerAndDate.replace(dateMatch[0], "").replace(/[\s|,\-–—]+$/, "").trim();
        }

        data.certifications.push({
          id: Math.random().toString(36).slice(2),
          name,
          issuer,
          date,
          link: ""
        });
      } else {
        data.certifications.push({
          id: Math.random().toString(36).slice(2),
          name: cleanLine.replace(dateMatch?.[0] || "", "").replace(/[\s|,\-–—]+$/, "").trim(),
          issuer: "",
          date: dateMatch ? dateMatch[1] : "",
          link: ""
        });
      }
    }
  }

  /* ===== SKILLS ===== */

  // Comprehensive skill lists (match against full text)
  const technicalSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
    "Swift", "Kotlin", "Dart", "R", "Scala", "Perl", "MATLAB", "Objective-C",
    "React", "Vue", "Angular", "Next.js", "Nuxt.js", "Svelte", "Gatsby",
    "Node.js", "Express", "Django", "Flask", "Spring", "Laravel", "ASP.NET",
    "Ruby on Rails", "FastAPI", "NestJS",
    "HTML", "CSS", "Sass", "SCSS", "Less", "Tailwind", "Bootstrap", "Material UI", "Chakra UI",
    "MongoDB", "MySQL", "PostgreSQL", "SQL", "NoSQL", "Redis", "Firebase", "Supabase",
    "SQLite", "Oracle", "DynamoDB", "Cassandra", "Elasticsearch",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "Terraform",
    "Git", "GitHub", "GitLab", "Bitbucket",
    "REST API", "GraphQL", "API", "Microservices", "DevOps", "CI/CD",
    "Linux", "Ubuntu", "Windows Server",
    "Machine Learning", "Deep Learning", "AI", "Data Science",
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "NLP",
    "Tableau", "Power BI", "Pandas", "NumPy",
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
    "Flutter", "React Native", "Ionic",
    "Webpack", "Vite", "Babel", "ESLint", "Prettier",
    "Jest", "Mocha", "Cypress", "Selenium", "Pytest",
    "Jira", "Confluence", "Slack", "Trello",
    "Nginx", "Apache", "Cloudflare", "Heroku", "Vercel", "Netlify",
    "RabbitMQ", "Kafka", "gRPC", "WebSocket",
    "Blockchain", "Solidity", "Web3",
    "Unity", "Unreal Engine",
    "OpenCV", "CUDA",
  ];

  const softSkills = [
    "Leadership", "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
    "Time Management", "Project Management", "Agile", "Scrum", "Collaboration",
    "Creativity", "Innovation", "Analytical Skills", "Decision Making", "Adaptability",
    "Attention to Detail", "Multitasking", "Customer Service", "Presentation Skills",
    "Negotiation", "Conflict Resolution", "Strategic Planning", "Mentoring",
    "Cross-functional", "Stakeholder Management", "Public Speaking",
  ];

  const escapeRegex = (str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Also check the skills section specifically for comma/pipe-separated skill lists
  const skillsSection = sections.skills || "";
  const fullSearchText = text + "\n" + skillsSection;

  // Extract skills from dedicated skills section (comma/pipe-separated lists)
  if (skillsSection) {
    const skillLines = skillsSection.split("\n").filter(l => l.trim());
    for (const line of skillLines) {
      const trimmed = line.trim();
      // Extract comma or pipe-separated skills
      if (trimmed.includes(",") || trimmed.includes("|")) {
        const items = trimmed.split(/[,|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40);
        for (const item of items) {
          // Check if it matches known technical skills
          const matchedTech = technicalSkills.find(ts => {
            const skillLower = ts.toLowerCase();
            const itemLower = item.toLowerCase();
            if (skillLower.length <= 2) {
              // Exact match or surrounded by non-word chars for short skills
              const skillRegex = new RegExp(`(^|[^a-z0-9])${escapeRegex(skillLower)}($|[^a-z0-9])`, 'i');
              return skillRegex.test(itemLower);
            }
            return skillLower === itemLower || itemLower.includes(skillLower);
          });
          if (matchedTech) {
            const normalizedSkill = matchedTech;
            if (!data.skills.technical.includes(normalizedSkill)) {
              data.skills.technical.push(normalizedSkill);
            }
          }
        }
      }
    }
  }

  // Extract technical skills from full text
  technicalSkills.forEach((skill) => {
    // Only extract very short skills (1-2 chars) if they are in a skills-heavy section
    // or specifically context-checked to avoid false positives (like "R" in "Sandip University, Nashik | Expected 2026")
    const isFragileSkill = skill.length <= 2 || skill.toLowerCase() === "go";
    
    const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, (isFragileSkill ? "" : "i")); // Use case-sensitive for fragile skills
    
    // For fragile skills, also ensure it's not just a stray character by checking if it's in the skills section primarily
    if (isFragileSkill) {
      const skillsSectionSearch = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
      if (skillsSectionSearch.test(skillsSection)) {
        if (!data.skills.technical.includes(skill)) {
          data.skills.technical.push(skill);
        }
      }
    } else {
      const regexInsensitive = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
      if (regexInsensitive.test(fullSearchText)) {
        if (!data.skills.technical.includes(skill)) {
          data.skills.technical.push(skill);
        }
      }
    }
  });

  // Extract soft skills from full text
  softSkills.forEach((skill) => {
    const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
    if (regex.test(fullSearchText)) {
      if (!data.skills.soft.includes(skill)) {
        data.skills.soft.push(skill);
      }
    }
  });

  // Deduplicate and remove redundant entries
  data.experience = deduplicateById(data.experience);
  data.education = deduplicateById(data.education);
  data.projects = deduplicateById(data.projects);
  data.certifications = deduplicateById(data.certifications);

  console.log("✅ Final extracted data:", JSON.stringify(data, null, 2));
  return data;
};

/* ================= HELPER: Deduplicate ================= */

function deduplicateById(arr) {
  const seen = new Set();
  return arr.filter(item => {
    // Use a key based on the primary identifier of each type
    const key = (item.name || item.title || item.school || item.degree || "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}