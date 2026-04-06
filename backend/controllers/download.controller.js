import puppeteer from "puppeteer";
import axios from "axios";
import { pool } from "../config/postgresdb.js";

/* =====================================================
   PDF HTML GENERATOR (Helper - Private to controller)
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
   CREATE DOWNLOAD
===================================================== */
export const createDownload = async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Auto-generate HTML if formData provided but html missing
    if (!req.body.html && req.body.formData) {
      req.body.html = generatePDFHTML(req.body.formData, req.body.name);
    }

    if (!req.body.html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const result = await client.query(
      `INSERT INTO downloads 
       (user_id, name, type, action, format, html, views, size, download_date, template, mongodb_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        req.userId,
        req.body.name || req.body.file_name,
        req.body.type || req.body.file_type,
        req.body.action || 'download',
        req.body.format || 'pdf',
        req.body.html,
        1, // initial views
        req.body.size || null,
        new Date(),
        req.body.template || null,
        req.body.mongodb_id || null
      ]
    );

    const row = result.rows[0];
    res.status(201).json({ 
      ...row, 
      name: row.name,  // ✅ file_name ki jagah name
      type: row.type   // ✅ file_type ki jagah type
    });

  } catch (err) {
    console.error("Create download error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

/* =====================================================
   COUNT TOTAL DOWNLOADS
===================================================== */
export const countDownloads = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM downloads WHERE user_id = $1`,
      [req.userId]
    );
    res.json({ totalDownloads: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Count downloads error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   LIST DOWNLOADS (with filters & pagination)
===================================================== */
export const listDownloads = async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    const limitNum = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * limitNum;

    let query = `
      SELECT *, COUNT(*) OVER() as total_count
      FROM downloads
      WHERE user_id = $1 AND action = 'download'
    `;
    const values = [req.userId];
    let paramIndex = 2;

    if (type) {
      query += ` AND type = $${paramIndex}`;  
      values.push(type);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limitNum, offset);

    const result = await pool.query(query, values);

    const downloads = result.rows.map(row => ({
      ...row,
      name: row.name,    
      type: row.type     
    }));
    
    const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;

    res.json({
      downloads,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum
      }
    });

  } catch (err) {
    console.error("Fetch downloads error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   LIST RECENT ACTIVITY
===================================================== */
export const listRecentActivity = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const limitNum = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * limitNum;

    const result = await pool.query(
      `SELECT *, COUNT(*) OVER() as total_count
       FROM downloads
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.userId, limitNum, offset]
    );

    const downloads = result.rows.map(row => ({
      ...row,
      name: row.name,    
      type: row.type     
    }));
    
    const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;

    res.json({
      downloads,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum
      }
    });

  } catch (err) {
    console.error("Fetch recent activity error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   DELETE DOWNLOAD
===================================================== */
export const deleteDownload = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM downloads WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Delete download error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET SINGLE DOWNLOAD (PREVIEW)
===================================================== */
export const getDownloadPreview = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM downloads WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const download = result.rows[0];

    // Increment views
    await pool.query(
      `UPDATE downloads SET views = views + 1 WHERE id = $1`,
      [id]
    );

    res.json({
      id: download.id,
      name: download.name,           
      type: download.type,          
      format: download.format,
      size: download.size,
      views: download.views,
      downloadDate: download.download_date,
      template: download.template,
      html: download.html
    });

  } catch (err) {
    console.error("Get download preview error:", err);
    res.status(500).json({
      message: "Failed to fetch document",
      error: err.message
    });
  }
};

/* =====================================================
   PDF DOWNLOAD
===================================================== */
export const downloadAsPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM downloads WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const download = result.rows[0];
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const pdfResponse = await axios.post(
      `${baseURL}/api/resume/generate-pdf`,
      { html: download.html },
      { responseType: "arraybuffer" }
    );

    const buffer = Buffer.from(pdfResponse.data);

    // Increment views
    await pool.query(
      `UPDATE downloads SET views = views + 1 WHERE id = $1`,
      [id]
    );

    const safeName = (download.name || "document")  // ✅ file_name ki jagah name
      .replace(/[^a-zA-Z0-9.-]/g, "_");

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
};

/* =====================================================
   WORD DOWNLOAD
===================================================== */
export const downloadAsWord = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM downloads WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const download = result.rows[0];
    const buffer = Buffer.from("\ufeff" + download.html, "utf8");

    // Increment views
    await pool.query(
      `UPDATE downloads SET views = views + 1 WHERE id = $1`,
      [id]
    );

    const safeName = (download.name || "document")  // ✅ file_name ki jagah name
      .replace(/[^a-zA-Z0-9.-]/g, "_");

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      "Content-Length": buffer.length
    });

    res.send(buffer);

  } catch (err) {
    console.error("Word error:", err);
    res.status(500).send("Word generation failed");
  }
};