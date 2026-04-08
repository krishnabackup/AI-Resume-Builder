import { pool } from "../config/postgresdb.js";
import DocumentParser from "../services/DocumentParser.service.js";
// AI Service
import {
  generateResumeAI,
  generateCoverLetterAI,
  refineExperienceDescription,
  refineProjectDescription,
  generateJobRecommendationsAI,
  extractResumeData as extractResumeDataAI
} from "../ai/aiService.js";

// Resume Parsing Services
import {
  parseResume,
  extractResumeData,
} from "../service/ResumeParser.service.js";

// ATS Analyzer Services
import {
  analyzeATSCompatibility,
  generateRecommendations,
  passesATSThreshold,
} from "../service/AtsAnalyzer.service.js";

import SpellChecker from "simple-spellchecker";
import nlp from "compromise";

// ADD THIS WHITELIST AT MODULE LEVEL (outside function)
const SPELL_WHITELIST = new Set([
  // Technical terms & acronyms
  'api', 'apis', 'http', 'https', 'html', 'css', 'javascript', 'js', 'jsx', 'ts', 'tsx',
  'react', 'vue', 'angular', 'node', 'nodejs', 'express', 'mongodb', 'mongo', 'mysql',
  'sql', 'nosql', 'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'firebase',
  'cloudinary', 'razorpay', 'stripe', 'tailwindcss', 'bootstrap', 'sass', 'webpack', 'babel',
  'npm', 'yarn', 'jest', 'typescript', 'graphql', 'apollo', 'prisma', 'mongoose', 'odm',
  'orm', 'jwt', 'oauth', 'ssl', 'tls', 'cdn', 'seo', 'rest', 'json', 'xml', 'yaml', 'regex',
  'async', 'middleware', 'mern', 'mean', 'mevn', 'readme', 'cgpa', 'gpa', 'btech', 'mtech',
  'frontend', 'backend', 'fullstack', 'devops', 'agile', 'scrum', 'ci', 'cd', 'ui', 'ux',
  // Common locations & institutions (expand based on your user base)
  'noida', 'gurgaon', 'gurugram', 'bangalore', 'bengaluru', 'hyderabad', 'pune', 'mumbai',
  'delhi', 'chennai', 'kolkata', 'ggsipu', 'ipu', 'dtu', 'nsit', 'iit', 'nit', 'iiit',
  'bits', 'vit', 'manipal', 'thapar', 'lpu', 'linkedin', 'gmail', 'reactjs', 'php', 'oop', 'handson', 'ubuntu',
  'expressjs',
  'serverside',
  'eventdriven',
  'techstack',
  'signup',
  'userspecific',
  'realworld',
  'utilityfirst',
  'nonproduction',
  'asyncawait', 'annes', 'admin', 'impactful'  // Add more as needed from your false positive logs
]);

function segmentWord(word, dictionary) {
  const results = [];

  for (let i = 3; i < word.length - 3; i++) {
    const left = word.slice(0, i);
    const right = word.slice(i);

    if (
      dictionary.spellCheck(left) &&
      dictionary.spellCheck(right)
    ) {
      results.push([left, right]);
    }
  }

  return results.length ? results[0] : null;
}

const getMisspelledWords = (text) =>
  new Promise((resolve, reject) => {

    SpellChecker.getDictionary("en-US", (err, dictionary) => {
      if (err) return reject(err);

      const doc = nlp(text);

      const entities = new Set([
        ...doc.people().out("array"),
        ...doc.organizations().out("array"),
        ...doc.places().out("array")
      ].map(e => e.toLowerCase()));

      const tokens = text.split(/\s+/);
      const mistakes = new Set();

      for (const original of tokens) {

        if (!original) continue;

        // Clean token
        const word = original.replace(/[^a-zA-Z]/g, "").toLowerCase();
        if (!word) continue;

        // ========= SKIPS =========

        // URLs / emails
        if (/https?|www|\.com|@/i.test(original)) continue;

        // CamelCase tech words
        if (/[a-z][A-Z]/.test(original)) continue;

        // Acronyms
        if (/^[A-Z]{2,}$/.test(original)) continue;

        // Skip capitalized resume header names
        if (/^[A-Z][a-z]+$/.test(original))
          continue;

        // Too short
        if (word.length <= 2) continue;

        // Named entities
        if (entities.has(word)) continue;

        // Whitelist
        if (SPELL_WHITELIST.has(word)) continue;

        // Accept UK spelling
        if (word.endsWith("elling")) continue;

        // ========= SPELL CHECK =========
        // ========= SPELL CHECK =========
        if (!dictionary.spellCheck(word)) {

          const segmented = segmentWord(word, dictionary);

          // Accept if valid compound
          if (!segmented) {
            mistakes.add(word);
          }

        }


      }

      resolve([...mistakes]);
    });

  });


// File Storage Services
import {
  saveFileMetadata, // for future use
  deleteFile,
  getFile,
} from "../service/FileStorage.service.js";

/* =====================================================
   HELPER: Flatten JSON data to text
===================================================== */
const flattenResumeData = (data) => {
  let parts = [];
  try {
    if (data.personalInfo) parts.push(Object.values(data.personalInfo).filter(Boolean).join(" "));
    if (data.summary) parts.push(typeof data.summary === 'string' ? data.summary : "");
    if (data.experience && Array.isArray(data.experience)) {
      data.experience.forEach(e => parts.push(Object.values(e).filter(Boolean).join(" ")));
    }
    if (data.education && Array.isArray(data.education)) {
      data.education.forEach(e => parts.push(Object.values(e).filter(Boolean).join(" ")));
    }
    if (data.skills && Array.isArray(data.skills)) {
      data.skills.forEach(s => parts.push(s.name || s));
    }
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach(p => parts.push(Object.values(p).filter(Boolean).join(" ")));
    }
  } catch (e) {
    console.error("Error flattening resume data: ", e);
  }
  return parts.join(" ");
};

/* =====================================================
   SAVE NORMAL RESUME (Manual Save)
   Saves a resume document to PostgreSQL
===================================================== */
export const saveResume = async (req, res) => {
  try {
    const data = req.body;
    let userId = req.userId;
    if (!userId && data.user) userId = data.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: user id missing",
      });
    }
    
    const dataWithoutUser = { ...data };
    delete dataWithoutUser.user;

    const result = await pool.query(
      `INSERT INTO resumes (user_id, data, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, 
      [userId, JSON.stringify(dataWithoutUser)]
    );
    const cvId = result.rows[0].id;

    // --- Automatic ATS Parsing ---
    try {
      const flattenedText = flattenResumeData(dataWithoutUser);
      const extractedData = Object.keys(dataWithoutUser).length > 0 ? extractResumeData(flattenedText) : {};
      
      const analysis = analyzeATSCompatibility(flattenedText, extractedData, "json");
      const misspelledWords = await getMisspelledWords(flattenedText);
      analysis.misspelledWords = misspelledWords;
      const passes = passesATSThreshold(analysis.overallScore);
      const recommendations = generateRecommendations(analysis);

      if (analysis.sectionScores && Array.isArray(analysis.sectionScores)) {
        const totalEarned = analysis.sectionScores.reduce(
          (sum, s) => sum + (typeof s.score === 'number' ? s.score : 0),
          0
        );
        const totalPossible = analysis.sectionScores.reduce(
          (sum, s) => sum + (typeof s.maxScore === 'number' ? s.maxScore : 0),
          0
        );
        analysis.overallScore = totalPossible > 0 
          ? Math.round((totalEarned / totalPossible) * 100) 
          : 0;
      }

      const scanData = {
        filename: "web-builder-resume",
        originalName: dataWithoutUser.personalInfo?.firstName || dataWithoutUser.title || "Resume",
        filePath: "",
        fileSize: 0,
        fileType: "application/json",
        sectionScores: analysis.sectionScores,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions,
        extractedText: flattenedText,
        extractedData: extractedData,
        passThreshold: passes,
        metrics: analysis.metrics,
        misspelledWords: analysis.misspelledWords
      };

      await pool.query(`
        INSERT INTO ats_scores (user_id, cv_id, template_id, job_title, score, feedback, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [
        userId, 
        cvId, 
        null, 
        dataWithoutUser.personalInfo?.jobTitle || "Web Application Resume", 
        analysis.overallScore, 
        JSON.stringify(scanData)
      ]);
      console.log("Automatic ATS score generated and saved via Web Builder.");
    } catch (atsError) {
      console.error("Failed to compute ATS Score in background:", atsError);
    }

    res.json({
      success: true,
      message: "Resume saved to database",
      cvId: cvId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* =====================================================
   GET ALL USER RESUMES
===================================================== */
export const getAllUserResumes = async (req, res) => {
  try {
    const hr = await pool.query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    const formatted = hr.rows.map(r => ({ _id: r.id, user: r.user_id, ...r.data, createdAt: r.created_at, updatedAt: r.updated_at }));
    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =====================================================
   GET USER RESUME (Latest)
===================================================== */
export const getUserResume = async (req, res) => {
  try {
    const hr = await pool.query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.userId]);
    if (hr.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    const r = hr.rows[0];
    res.status(200).json({ success: true, data: { _id: r.id, user: r.user_id, ...r.data, createdAt: r.created_at, updatedAt: r.updated_at } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =====================================================
   GENERATE AI RESUME + OPTIONAL SAVE TO DB
   Uses AI to generate a resume summary and optionally saves it
===================================================== */
export const generateAIResume = async (req, res) => {
  try {
    console.log("📥 AI Resume request received");

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: user id missing",
      });
    }

    // Generate AI summary
    const aiText = await generateResumeAI(req.body);
    console.log("✅ AI Summary generated");

    // Save AI-generated resume to DB (optional)
    try {
      const dataWithoutUser = { ...req.body, summary: aiText };
      delete dataWithoutUser.user;

      await pool.query(
        `INSERT INTO resumes (user_id, data, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())`, 
        [req.userId, JSON.stringify(dataWithoutUser)]
      );
      console.log("💾 AI Resume saved to DB");
    } catch (dbError) {
      console.log("⚠️ DB save skipped", dbError.message);
    }

    // Send response
    res.json({
      success: true,
      message: "AI Resume generated successfully",
      aiResume: aiText,
    });
  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({
      success: false,
      error: "AI generation failed: " + error.message,
    });
  }
};

/* =====================================================
   GENERATE AI COVER LETTER
   Uses AI to generate a section of a cover letter
===================================================== */
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobDetails, sectionType } = req.body;

    if (!jobDetails || !sectionType) {
      return res.status(400).json({
        success: false,
        error: "jobDetails and sectionType are required fields",
      });
    }

    console.log(`📥 AI Cover Letter request received for section: ${sectionType}`);

    // Generate AI cover letter section
    const aiText = await generateCoverLetterAI(jobDetails, sectionType);
    console.log("✅ AI Cover Letter section generated");

    // Send response
    res.json({
      success: true,
      message: "AI Cover Letter section generated successfully",
      result: aiText,
    });
  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({
      success: false,
      error: "AI generation failed: " + error.message,
    });
  }
};

/* =====================================================
   GET JOB RECOMMENDATIONS
   Uses AI to recommend jobs based on parsed resume data
===================================================== */
export const getJobRecommendations = async (req, res) => {
  try {
    const { parsedData } = req.body;

    if (!parsedData) {
      return res.status(400).json({
        success: false,
        error: "parsedData is a required field",
      });
    }

    console.log("📥 Job Recommendations request received");

    // Generate AI Job Recommendations
    const aiRecommendations = await generateJobRecommendationsAI(parsedData);
    
    // Send response
    res.json({
      success: true,
      data: aiRecommendations,
    });
  } catch (error) {
    console.error("❌ JS RECOMMENDATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Job recommendations generation failed: " + error.message,
    });
  }
};

/* =====================================================
   GET RESUME BY ID
===================================================== */
export const getResumeById = async (req, res) => {
  try {
    const hr = await pool.query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (hr.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    const r = hr.rows[0];
    res.status(200).json({ success: true, data: { _id: r.id, user: r.user_id, ...r.data, createdAt: r.created_at, updatedAt: r.updated_at } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =====================================================
   UPLOAD & ANALYZE RESUME (ATS Scan)
   Uploads a resume, parses it, analyzes ATS compatibility,
   saves results to MongoDB
===================================================== */
const extractTextFromDoc = async (filePath) => {
  try {
    return await DocumentParser.extractTextFromDocument(filePath);
  } catch (error) {
    console.error("Error extracting text from DOC:", error);
    return null;
  }
};
export const uploadAndAnalyzeResume = async (req, res) => {
  console.log("🔥 uploadAndAnalyzeResume HIT");
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.userId;
    const file = req.file;
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    
    let resumeText;
    let parseResult;

    // Handle different file types
    if (fileExtension === 'pdf') {
      parseResult = await parseResume(file);
      if (!parseResult?.success || !parseResult?.text) {
        deleteFile(file.path);
        return res.status(400).json({
          success: false,
          message: "Failed to parse resume",
        });
      }
      resumeText = parseResult.text;
    } else if (['doc', 'docx'].includes(fileExtension)) {
      // Extract text from DOC/DOCX
      resumeText = await extractTextFromDoc(file.path);
      if (!resumeText) {
        deleteFile(file.path);
        return res.status(400).json({
          success: false,
          message: "Failed to parse DOC/DOCX file",
        });
      }
      // Also try to parse it with your existing parser
      parseResult = await parseResume(file);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Please upload PDF, DOC, or DOCX.",
      });
    }

    // Extract structured data
    let extractedData = extractResumeData(resumeText);
    let isAIFallbackUsed = false;
    let parsingConfidence = 'High';

    // AI Fallback if the parser returns unusually empty results
    const hasLittleData = 
      extractedData.experience.length === 0 && 
      extractedData.education.length === 0 && 
      extractedData.skills.technical.length === 0;

    if (hasLittleData && resumeText.length > 50) {
      console.log("⚠️ Regex parser returned empty results. Falling back to AI extraction...");
      try {
        const aiData = await extractResumeDataAI(resumeText);
        // Merge AI data over existing data (prefer AI if it found things)
        extractedData = { ...extractedData, ...aiData };
        isAIFallbackUsed = true;
      } catch (err) {
        console.error("AI Fallback failed:", err);
      }
    }

    // Determine parsing confidence
    let parsedSections = 0;
    if (extractedData.experience?.length > 0) parsedSections++;
    if (extractedData.education?.length > 0) parsedSections++;
    if (extractedData.skills?.technical?.length > 0 || extractedData.skills?.soft?.length > 0) parsedSections++;
    if (extractedData.projects?.length > 0) parsedSections++;
    if (extractedData.summary?.length > 10) parsedSections++;

    if (parsedSections <= 1) parsingConfidence = 'Low';
    else if (parsedSections <= 3) parsingConfidence = 'Medium';
    if (isAIFallbackUsed) parsingConfidence = 'High (AI Assisted)';

    // ATS analysis
    const analysis = analyzeATSCompatibility(resumeText, extractedData);
    const misspelledWords = await getMisspelledWords(resumeText);
    analysis.misspelledWords = misspelledWords;

    const passes = passesATSThreshold(analysis.overallScore);
    const recommendations = generateRecommendations(analysis);

    // Validate required fields from frontend
   const { jobTitle, templateId, resumeprofileId } = req.body;

if (!jobTitle) {
  return res.status(400).json({
    success: false,
    message: "Job title is required"
  });
}

    // ✅ FIX: Ensure File Format Compatibility score is correct
    const isValidFormat = ['pdf', 'doc', 'docx'].includes(fileExtension) ||
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype);

    if (analysis.sectionScores) {
      analysis.sectionScores = analysis.sectionScores.map(section => {
        if (section.sectionName === "File Format Compatibility") {
          return {
            ...section,
            score: isValidFormat ? section.maxScore : 0,
            status: isValidFormat ? "ok" : "error",
            suggestions: isValidFormat ? [] : ["Upload resume in PDF or DOC/DOCX format."]
          };
        }
        return section;
      });
    }

    // ✅ FIX: Recalculate overallScore from sectionScores
    if (analysis.sectionScores && Array.isArray(analysis.sectionScores)) {
      const totalEarned = analysis.sectionScores.reduce(
        (sum, s) => sum + (typeof s.score === 'number' ? s.score : 0),
        0
      );
      const totalPossible = analysis.sectionScores.reduce(
        (sum, s) => sum + (typeof s.maxScore === 'number' ? s.maxScore : 0),
        0
      );
      
      // Calculate weighted overall score (0-100 scale)
      analysis.overallScore = totalPossible > 0 
        ? Math.round((totalEarned / totalPossible) * 100) 
        : 0;
    }

    const scanData = {
      filename: file.filename,
      originalName: file.originalname,
      filePath: `/uploads/resumes/${file.filename}`,
      fileSize: file.size,
      fileType: file.mimetype,
      sectionScores: analysis.sectionScores,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      extractedText: resumeText,
      extractedData: extractedData,
      parsingConfidence: parsingConfidence,
      passThreshold: passes,
      metrics: analysis.metrics,
      misspelledWords: analysis.misspelledWords
    };

    const insertScan = await pool.query(`
      INSERT INTO ats_scores (user_id, cv_id, template_id, job_title, score, feedback, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, feedback
    `, [
      userId, 
      resumeprofileId || null, 
      templateId || null, 
      jobTitle, 
      analysis.overallScore, 
      JSON.stringify(scanData)
    ]);
    const atsScan = { _id: insertScan.rows[0].id, filePath: insertScan.rows[0].feedback.filePath };

    res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      data: {
        scanId: atsScan._id,
        filename: file.filename,
        originalName: file.originalname,
        filePath: atsScan.filePath,
        fileType: fileExtension, // Add file type to response
        overallScore: analysis.overallScore,
        sectionScores: analysis.sectionScores,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions,
        recommendations,
        passThreshold: passes,
        extractedData,
        parsingConfidence,
        metrics: analysis.metrics,
        text: resumeText,
        misspelledWords: analysis.misspelledWords,
      },
    });
  } catch (error) {
    console.error("❌ Resume upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload and analyze resume",
      error: error.message,
    });
  }
};
/* =====================================================
   GET ALL USER SCANS
   Fetches all ATS scans for a specific user
===================================================== */
export const getUserScans = async (req, res) => {
  try {
    const scansRes = await pool.query(`
      SELECT 
        id as _id, 
        feedback->>'filename' as filename, 
        feedback->>'originalName' as "originalName", 
        score as "overallScore", 
        (feedback->>'passThreshold')::boolean as "passThreshold", 
        created_at as "createdAt", 
        feedback->'sectionScores' as "sectionScores" 
      FROM ats_scores WHERE user_id = $1 ORDER BY created_at DESC
    `, [req.userId]);

    res.status(200).json({
      success: true,
      count: scansRes.rowCount,
      data: scansRes.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scans",
      error: error.message,
    });
  }
};

/* =====================================================
   GET SCAN BY ID
   Fetches one ATS scan by its ID
===================================================== */
export const getScanById = async (req, res) => {
  try {
    const scanRes = await pool.query('SELECT * FROM ats_scores WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);

    if (scanRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }
    const row = scanRes.rows[0];
    const scan = { _id: row.id, overallScore: row.score, jobTitle: row.job_title, ...row.feedback, createdAt: row.created_at };

    res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scan",
      error: error.message,
    });
  }
};

/* =====================================================
   DELETE SCAN
   Deletes an ATS scan and its uploaded file
===================================================== */
export const deleteScan = async (req, res) => {
  try {
    const scanRes = await pool.query(`SELECT feedback->>'filePath' as "filePath" FROM ats_scores WHERE id = $1 AND user_id = $2`, [req.params.id, req.userId]);

    if (scanRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    // Delete file from storage
    deleteFile(scanRes.rows[0].filePath);

    // Delete database record
    await pool.query('DELETE FROM ats_scores WHERE id = $1', [req.params.id]);

    res.status(200).json({
      success: true,
      message: "Scan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete scan",
      error: error.message,
    });
  }
};

/* =====================================================
   DOWNLOAD RESUME FILE
   Sends the resume file for download
===================================================== */
export const downloadResume = async (req, res) => {
  try {
    const scanRes = await pool.query(`
      SELECT feedback->>'filePath' as "filePath", feedback->>'originalName' as "originalName", feedback->>'fileType' as "fileType" 
      FROM ats_scores WHERE feedback->>'filename' = $1 AND user_id = $2
    `, [req.params.filename, req.userId]);

    if (scanRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }
    const scan = scanRes.rows[0];

    const fileResult = getFile(scan.filePath);

    if (!fileResult?.buffer) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${scan.originalName}"`
    );
    res.setHeader("Content-Type", scan.fileType);
    res.send(fileResult.buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to download resume",
      error: error.message,
    });
  }
};

/* =====================================================
   SCAN STATISTICS
   Aggregates user scan stats like average score, pass rate
===================================================== */
export const getScanStatistics = async (req, res) => {
  try {
    const userId = req.userId;

    const statsRes = await pool.query(`
      SELECT 
        COUNT(*) as "totalScans",
        COALESCE(AVG(score), 0) as "avgScore",
        SUM(CASE WHEN (feedback->>'passThreshold')::boolean = true THEN 1 ELSE 0 END) as "passedScans"
      FROM ats_scores WHERE user_id = $1
    `, [userId]);
    
    const stats = statsRes.rows[0];
    const totalScans = parseInt(stats.totalScans, 10);
    const passedScans = parseInt(stats.passedScans || 0, 10);
    const avgScore = parseFloat(stats.avgScore);

    const recentScansRes = await pool.query(`
      SELECT id as _id, feedback->>'filename' as filename, score as "overallScore", created_at as "createdAt" 
      FROM ats_scores WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5
    `, [userId]);
    const recentScans = recentScansRes.rows;

    res.status(200).json({
      success: true,
      data: {
        totalScans,
        averageScore: avgScore[0]?.avgScore?.toFixed(1) || 0,
        passedScans,
        passRate:
          totalScans > 0
            ? ((passedScans / totalScans) * 100).toFixed(1)
            : 0,
        recentScans,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

// Get the latest scan uploaded by the user
export const getLatestScan = async (req, res) => {
  try {
    const latestRes = await pool.query('SELECT * FROM ats_scores WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.userId]);

    if (latestRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No scans found for this user",
      });
    }

    const row = latestRes.rows[0];
    const latestScan = { overallScore: row.score, jobTitle: row.job_title, ...row.feedback, createdAt: row.created_at };

    // Generate full file URL
    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";

    const responseData = {
      filename: latestScan.filename,
      originalName: latestScan.originalName,
      fileUrl: `${process.env.SERVER_URL || 'http://localhost:5000'}${latestScan.filePath}`,
      overallScore: latestScan.overallScore,
      sectionScores: latestScan.sectionScores,
      matchedKeywords: latestScan.matchedKeywords,
      missingKeywords: latestScan.missingKeywords,
      suggestions: latestScan.suggestions,
      passThreshold: latestScan.passThreshold,
      createdAt: latestScan.createdAt,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Failed to fetch latest scan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest scan",
      error: error.message,
    });
  }
};

// ==========================================
// ENHANCE WORK EXPERIENCE + SAVE TO MONGODB
// ==========================================
export const enhanceWorkExperience = async (req, res) => {
  try {
    console.log("Received AI generation request:", req.body);
    // 1. Generate AI professional summary
    const aiText = await refineExperienceDescription(req.body);
    console.log(aiText);

    console.log("AI Summary generated successfully");
    // 2. Try to save to MongoDB (optional - won't fail if DB is down)
    if (aiText) {
      // Real-time nested JSONB update omitted; Frontend handles saving the whole resume.

      // 3. Send AI summary back to frontend
      return res.json({
        message: "Experience description enhanced successfully",
        aiResume: aiText
      });
    }
    throw new Error(aiText || "AI generation failed without specific error message");
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      error: "AI generation failed: " + error.message
    });
  }
};

// ==============================================
// ENHANCE PROJECT DESCRIPTION + SAVE TO MONGODB
// ==============================================
export const enhanceProjectDescription = async (req, res) => {
  try {
    console.log("Received AI generation request:", req.body);
    // 1. Generate AI professional summary
    const projectDescription = await refineProjectDescription(req.body);
    console.log(projectDescription);

    console.log("AI Summary generated successfully");
    // 2. Try to save to MongoDB (optional - won't fail if DB is down)
    if (projectDescription) {
      // Real-time nested JSONB update omitted; Frontend handles saving the whole resume.

      // 3. Send AI summary back to frontend
      return res.json({
        message: "Project Description enhanced successfully",
        projectDescription: projectDescription
      });
    }
    throw new Error(projectDescription || "AI generation failed without specific error message");
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      error: "AI generation failed: " + error.message
    });
  }
};

/* =====================================================
   GENERATE AI COVER LETTER SECTION
===================================================== */
export const generateAICoverLetter = async (req, res) => {
  try {
    const { sectionType, jobDetails } = req.body;

    if (!sectionType || !jobDetails) {
      return res.status(400).json({
        success: false,
        error: "Missing sectionType or jobDetails"
      });
    }

    console.log(`📥 Generating Cover Letter AI for: ${sectionType}`);
    console.log("📊 Request Body:", req.body);

    const content = await generateCoverLetterAI(jobDetails, sectionType);

    console.log("✅ AI Content Generated Length:", content?.length);

    res.json({
      success: true,
      result: content
    });

  } catch (error) {
    console.error("❌ COVER LETTER AI ERROR:", error);
    res.status(500).json({
      success: false,
      error: "AI generation failed: " + error.message
    });
  }
};