import express from "express";
import puppeteer from "puppeteer";
import mongoose from "mongoose";
import axios from "axios";
import Download from "../Models/Download.js";
import isAuth from "../middlewares/isAuth.js"; // ✅ YOUR AUTH

const router = express.Router();

/* =====================================================
   PDF HTML GENERATOR (fallback)
===================================================== */
const generatePDFHTML = (formData = {}, filename = "Document") => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${filename}</title>
<style>
@page { size:A4; margin:40px; }
body { font-family:Arial, sans-serif; font-size:11pt; line-height:1.5; }
.section { margin-bottom:18px; }
</style>
</head>   
<body>

<h2>${formData.fullName || filename}</h2>

${formData.address ? `<div class="section">${formData.address}</div>` : ""}
${formData.recipientName ? `<div class="section"><strong>To:</strong> ${formData.recipientName}</div>` : ""}
${formData.openingParagraph ? `<div class="section">${formData.openingParagraph}</div>` : ""}
${formData.bodyParagraph1 ? `<div class="section">${formData.bodyParagraph1}</div>` : ""}
${formData.bodyParagraph2 ? `<div class="section">${formData.bodyParagraph2}</div>` : ""}
${formData.closingParagraph ? `<div class="section">${formData.closingParagraph}</div>` : ""}

</body>
</html>`;
};

/* =====================================================
   WORD HTML GENERATOR (fallback)
===================================================== */
const generateWordHTML = (formData = {}, filename = "Document") => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${filename}</title>
<style>
@page { size:21cm 29.7cm; margin:4cm; }
body { font-family:"Times New Roman",Times,serif; font-size:11pt; }
</style>
</head>
<body>

<div style="text-align:right;margin-bottom:18pt;">
  <div style="font-weight:bold">${formData.fullName || ""}</div>
  ${(formData.address || "")
    .toString()
    .split("\n")
    .filter(Boolean)
    .map(l => `<div>${l}</div>`)
    .join("")}
  ${formData.email ? `<div>${formData.email}</div>` : ""}
  ${formData.phone ? `<div>${formData.phone}</div>` : ""}
  <div>${date}</div>
</div>

<div style="margin-bottom:24pt;">
  <div style="font-weight:bold">${formData.recipientName || "Hiring Manager"}</div>
  ${formData.companyName ? `<div>${formData.companyName}</div>` : ""}
</div>

<div style="margin-bottom:12pt;font-weight:bold;">
  Dear ${formData.recipientName || "Hiring Manager"},
</div>

<p>${(formData.openingParagraph || "").replace(/\n/g,"<br>")}</p>
<p>${(formData.bodyParagraph1 || "").replace(/\n/g,"<br>")}</p>
<p>${(formData.bodyParagraph2 || "").replace(/\n/g,"<br>")}</p>
<p>${(formData.closingParagraph || "").replace(/\n/g,"<br>")}</p>

<div style="margin-top:24pt;text-align:right;">
  <div>Sincerely</div>
  <div style="font-weight:bold">${formData.fullName || ""}</div>
</div>

</body>
</html>`;
};

/* =====================================================
   CREATE DOWNLOAD RECORD (USER)
===================================================== */
router.post("/", isAuth, async (req, res) => {
  try {
    if (!req.body.html && req.body.formData) {
      req.body.html = generatePDFHTML(req.body.formData, req.body.name);
    }

    if (!req.body.html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const download = new Download({
      ...req.body,
      user: req.userId, // ✅ OWNER
      views: 1,
      downloadDate: new Date()
    });

    await download.save();
    res.status(201).json(download);

  } catch (err) {
    console.error("Create download error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   LIST USER DOWNLOADS
===================================================== */
router.get("/", isAuth, async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;

    const query = {
      user: req.userId,
      ...(type && { type })
    };

    const downloads = await Download.find(query)
      .sort({ downloadDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Download.countDocuments(query);

    res.json({
      downloads,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) }
    });

  } catch (err) {
    console.error("Fetch downloads error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   DELETE DOWNLOAD (OWNER)
===================================================== */
router.delete("/:id", isAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Download.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Delete download error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   PDF DOWNLOAD (OWNER)
===================================================== */
router.get("/:id/pdf", isAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const download = await Download.findOne({
      _id: id,
      user: req.userId
    });

    if (!download) return res.status(404).json({ message: "Not found" });

    const baseURL = `${req.protocol}://${req.get("host")}`;

    const pdfResponse = await axios.post(
      `${baseURL}/api/resume/generate-pdf`,
      { html: download.html },
      { responseType: "arraybuffer" }
    );

    const buffer = Buffer.from(pdfResponse.data);

    download.views += 1;
    await download.save();

    const safeName = (download.name || "document").replace(/[^a-zA-Z0-9.-]/g, "_");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      "Content-Length": buffer.length
    });

    res.send(buffer);

  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).send("PDF generation failed");
  }
});

/* =====================================================
   WORD DOWNLOAD (OWNER)
===================================================== */
router.get("/:id/word", isAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const download = await Download.findOne({
      _id: id,
      user: req.userId
    });

    if (!download) return res.status(404).json({ message: "Not found" });

    const buffer = Buffer.from("\ufeff" + download.html, "utf8");

    download.views += 1;
    await download.save();

    const safeName = (download.name || "document").replace(/[^a-zA-Z0-9.-]/g, "_");

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      "Content-Length": buffer.length
    });

    res.send(buffer);

  } catch (err) {
    console.error("Word error:", err);
    res.status(500).send("Word generation failed");
  }
});

export default router;