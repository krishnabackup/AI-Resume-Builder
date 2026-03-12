import express from "express";
import puppeteer from "puppeteer";

import {
  uploadAndAnalyzeResume,
  getUserScans,
  getScanById,
  deleteScan,
  downloadResume,
  getScanStatistics,
  getLatestScan,
  generateCoverLetter,
  enhanceWorkExperience,
  enhanceProjectDescription,
  generateAICoverLetter,
  generateAIResume,
  getUserResume   // ✅ ADDED
} from "../controllers/Resume.controller.js";

import isAuth from "../middlewares/isAuth.js";

import {
  uploadSingleResume,
  handleUploadError,
} from "../middlewares/upload.middleware.js";

const resumeRouter = express.Router();

/* =====================================================
   GET LATEST SAVED RESUME FOR CV BUILDER
===================================================== */
resumeRouter.get("/", isAuth, getUserResume); // ✅ ADDED


/* =====================================================
   UPLOAD AND ANALYZE RESUME (ATS SCAN)
===================================================== */
resumeRouter.post(
  "/upload",
  isAuth,
  uploadSingleResume,
  handleUploadError,
  uploadAndAnalyzeResume
);


/* =====================================================
   GET ALL USER SCANS
===================================================== */
resumeRouter.get("/scans", isAuth, getUserScans);


/* =====================================================
   GET SCAN STATISTICS
===================================================== */
resumeRouter.get("/statistics", isAuth, getScanStatistics);


/* =====================================================
   GET SPECIFIC SCAN BY ID
===================================================== */
resumeRouter.get("/scans/:id", isAuth, getScanById);


/* =====================================================
   DELETE SCAN
===================================================== */
resumeRouter.delete("/scans/:id", isAuth, deleteScan);


/* =====================================================
   DOWNLOAD RESUME FILE
===================================================== */
resumeRouter.get("/download/:filename", isAuth, downloadResume);


/* =====================================================
   GET LATEST ATS SCAN
===================================================== */
resumeRouter.get("/latest", isAuth, getLatestScan);


/* =====================================================
   GENERATE AI RESUME SUMMARY
===================================================== */
resumeRouter.post("/generate-summary", generateAIResume);


/* =====================================================
   GENERATE AI COVER LETTER
===================================================== */
resumeRouter.post("/cover-letter/generate", generateCoverLetter);


/* =====================================================
   ENHANCE WORK EXPERIENCE (AI)
===================================================== */
resumeRouter.post(
  "/enhance-work-experience",
  isAuth,
  enhanceWorkExperience
);


/* =====================================================
   ENHANCE PROJECT DESCRIPTION (AI)
===================================================== */
resumeRouter.post(
  "/enhance-project-description",
  isAuth,
  enhanceProjectDescription
);


/* =====================================================
   GENERATE AI COVER LETTER SECTION
===================================================== */
resumeRouter.post(
  "/cover-letter/generate-ai",
  isAuth,
  generateAICoverLetter
);


/* =====================================================
   GENERATE PDF FROM HTML USING PUPPETEER
===================================================== */
resumeRouter.post("/generate-pdf", async (req, res) => {
  let browser;

  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        error: "HTML required"
      });
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume.pdf"`,
    });

    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Resume PDF Error:", error);

    res.status(500).json({
      error: "PDF generation failed"
    });

  } finally {
    if (browser) await browser.close();
  }
});

export default resumeRouter;