import mongoose from "mongoose";
import mammoth from "mammoth";

// Models
import Resume from "../Models/resume.js";
import AtsScans from "../Models/atsScan.js";


// AI Service
import {
  generateResumeAI,
  generateCoverLetterAI,
  refineExperienceDescription,
  refineProjectDescription
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
   SAVE NORMAL RESUME (Manual Save)
   Saves a resume document to MongoDB
===================================================== */
export const saveResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();

    res.json({
      success: true,
      message: "Resume saved to database",
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
    const resumes = await Resume.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =====================================================
   GET USER RESUME (Latest)
===================================================== */
export const getUserResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, data: resume });
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

    // Generate AI summary
    const aiText = await generateResumeAI(req.body);
    console.log("✅ AI Summary generated");

    // Save AI-generated resume to DB (optional)
    try {
      const resume = new Resume({
        ...req.body,
        summary: aiText,
      });
      await resume.save();
      console.log("💾 AI Resume saved to DB");
    } catch (dbError) {
      console.log("⚠️ DB save skipped (MongoDB not connected)");
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
   GET RESUME BY ID
===================================================== */
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, data: resume });
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
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
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
    const extractedData = extractResumeData(resumeText);

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

    // Save ATS scan
    const atsScan = new AtsScans({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      filePath: `/uploads/resumes/${file.filename}`,
      fileSize: file.size,
      fileType: file.mimetype,
      overallScore: analysis.overallScore,
      sectionScores: analysis.sectionScores,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      extractedText: resumeText,
      extractedData,
      passThreshold: passes,
      templateId: templateId || null,
       resumeprofileId: resumeprofileId
      ? new mongoose.Types.ObjectId(resumeprofileId)
     : null,
      jobTitle,
    });

    await atsScan.save();

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
    const scans = await AtsScans.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select(
        "filename originalName overallScore passThreshold createdAt sectionScores"
      );

    res.status(200).json({
      success: true,
      count: scans.length,
      data: scans,
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
    const scan = await AtsScans.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

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
    const scan = await AtsScans.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    // Delete file from storage
    deleteFile(scan.filePath);

    // Delete database record
    await AtsScans.findByIdAndDelete(scan._id);

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
    const scan = await AtsScans.findOne({
      filename: req.params.filename,
      userId: req.userId,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

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

    const totalScans = await AtsScans.countDocuments({ userId });

    const avgScore = await AtsScans.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, avgScore: { $avg: "$overallScore" } } },
    ]);

    const passedScans = await AtsScans.countDocuments({
      userId,
      passThreshold: true,
    });

    const recentScans = await AtsScans.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("filename overallScore createdAt");

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
    const latestScan = await AtsScans.findOne({ userId: req.userId })
      .sort({ createdAt: -1 });

    if (!latestScan) {
      return res.status(404).json({
        success: false,
        message: "No scans found for this user",
      });
    }

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
      try {
        await Resume.findOneAndUpdate(
          {
            "experience.id": req.body.id,
          },
          {
            $set: {
              "experience.$.description": aiText,
            },
          },
          { new: true }
        );
        console.log("Experience description updated in database");

      } catch (dbError) {
        console.log("Database save skipped (MongoDB not connected)", dbError);
      }

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
      try {
        await Resume.findOneAndUpdate(
          {
            "project.id": req.body.id,
          },
          {
            $set: {
              "project.$.description": projectDescription,
            },
          },
          { new: true }
        );
        console.log("Project description updated in database");

      } catch (dbError) {
        console.log("Database save skipped (MongoDB not connected)", dbError);
      }

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