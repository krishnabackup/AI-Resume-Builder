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
  generateAIResume
} from "../controllers/Resume.controller.js";
import isAuth from "../middlewares/isAuth.js";
import {
  uploadSingleResume,
  handleUploadError,
} from "../middlewares/upload.middleware.js";

const resumeRouter = express.Router();

// Upload and analyze resume
resumeRouter.post(
  "/upload",
  isAuth,
  uploadSingleResume,
  handleUploadError,
  uploadAndAnalyzeResume
);

// Get all user scans
resumeRouter.get("/scans", isAuth, getUserScans);

// Get scan statistics
resumeRouter.get("/statistics", isAuth, getScanStatistics);

// Get specific scan by ID
resumeRouter.get("/scans/:id", isAuth, getScanById);

// Delete scan
resumeRouter.delete("/scans/:id", isAuth, deleteScan);

// Download resume file
resumeRouter.get("/download/:filename", isAuth, downloadResume);

// Get latest scan after refreshing the page
resumeRouter.get("/latest", isAuth, getLatestScan);

// Generate AI Resume Summary
resumeRouter.post("/generate-summary", generateAIResume);

// Generate AI Cover Letter
resumeRouter.post("/cover-letter/generate", generateCoverLetter);

//To enhance the work experience with the help of ai
resumeRouter.post("/enhance-work-experience", isAuth, enhanceWorkExperience);

//To enhance the project description with the help of ai
resumeRouter.post("/enhance-project-description", isAuth, enhanceProjectDescription);

//TO generate cover letter professional summary
resumeRouter.post("/cover-letter/generate-ai", isAuth, generateAICoverLetter);

// Generate PDF from HTML using Puppeteer
resumeRouter.post("/generate-pdf", async (req, res) => {
  let browser;
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: "HTML required" });

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume.pdf"`,
    });
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Resume PDF Error:", error);
    res.status(500).json({ error: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
  }
});

export default resumeRouter;
