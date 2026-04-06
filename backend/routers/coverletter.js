import express from "express";
import puppeteer from "puppeteer";
import isAuth from "../middlewares/isAuth.js";
import { pool } from "../config/postgresdb.js";

const router = express.Router();

/* ────────────────────────────────────────────────────────────────────────────
   EMPTY CONTENT DEFAULTS
   Ensures every field exists so the frontend never needs to null-check.
──────────────────────────────────────────────────────────────────────────── */
const DEFAULT_CONTENT = {
  fullName: "", email: "", phone: "", address: "", linkedin: "",
  recipientName: "", recipientTitle: "", companyName: "", companyAddress: "",
  jobTitle: "", jobReference: "", jobSummary: "", jobDescription: "",
  openingParagraph: "", bodyParagraph1: "", bodyParagraph2: "", closingParagraph: "",
  salutation: "Sincerely", customSalutation: "",
};

/* ────────────────────────────────────────────────────────────────────────────
   GET /api/coverletter
   Load the current user's cover letter. Returns empty defaults for new users.
──────────────────────────────────────────────────────────────────────────── */
router.get("/", isAuth, async (req, res) => {
  try {
    const docRes = await pool.query('SELECT * FROM cover_letters WHERE user_id = $1', [req.userId]);

    if (docRes.rowCount === 0) {
      // New user — return empty scaffold (nothing saved yet)
      return res.json({
        templateId: "professional",
        documentTitle: "",
        content: { ...DEFAULT_CONTENT },
      });
    }

    const doc = docRes.rows[0];

    res.json({
      templateId: doc.template_id,
      documentTitle: doc.document_title,
      content: { ...DEFAULT_CONTENT, ...doc.content },
    });
  } catch (err) {
    console.error("GET /api/coverletter error:", err);
    res.status(500).json({ message: "Failed to load cover letter" });
  }
});

/* ────────────────────────────────────────────────────────────────────────────
   PUT /api/coverletter
   Upsert (autosave) — called by the debounced frontend hook.
   Creates the document on first save; updates on subsequent saves.
──────────────────────────────────────────────────────────────────────────── */
router.put("/", isAuth, async (req, res) => {
  try {
    const { content = {}, templateId, documentTitle } = req.body;
    const finalContent = { ...DEFAULT_CONTENT, ...content };

    const docRes = await pool.query(`
      INSERT INTO cover_letters (id, user_id, template_id, document_title, content, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        template_id = EXCLUDED.template_id,
        document_title = EXCLUDED.document_title,
        content = EXCLUDED.content,
        updated_at = NOW()
      RETURNING updated_at
    `, [req.userId, templateId || "professional", documentTitle || "", JSON.stringify(finalContent)]);

    res.json({ success: true, updatedAt: docRes.rows[0].updated_at });
  } catch (err) {
    console.error("PUT /api/coverletter error:", err);
    res.status(500).json({ message: "Failed to save cover letter" });
  }
});

/* ────────────────────────────────────────────────────────────────────────────
   DELETE /api/coverletter
   Wipe the current user's cover letter (reset to empty).
──────────────────────────────────────────────────────────────────────────── */
router.delete("/", isAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM cover_letters WHERE user_id = $1', [req.userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/coverletter error:", err);
    res.status(500).json({ message: "Failed to delete cover letter" });
  }
});

/* ────────────────────────────────────────────────────────────────────────────
   POST /api/coverletter/generate-pdf
   Receives a FULL HTML document (built on the client by rendering the React
   template component into a hidden div, then wrapping in a Tailwind+Fonts
   envelope). Returns a PDF buffer.

   The client is responsible for building the HTML envelope — this endpoint
   is intentionally thin so it works for ALL templates without any knowledge
   of template internals.
──────────────────────────────────────────────────────────────────────────── */
router.post("/generate-pdf", async (req, res) => {
  let browser;
  try {
    const { html } = req.body;

    if (!html || typeof html !== "string") {
      return res.status(400).json({ error: "HTML string is required" });
    }

    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none", // crisp font rendering
      ],
    });

    const page = await browser.newPage();

    // Set viewport to A4 width in CSS pixels (96 dpi → 794px ≈ 210mm)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Load the full HTML document sent by the client.
    // waitUntil: 'networkidle0' ensures Tailwind CDN and Google Fonts finish
    // loading before Puppeteer takes the PDF snapshot.
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // Extra wait for custom web fonts to be fully painted
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false, // use Puppeteer's A4, not @page CSS
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Cover-Letter.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "PDF generation failed", detail: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

export default router;
