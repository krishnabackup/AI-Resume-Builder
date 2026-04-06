import { pool } from "../config/postgresdb.js";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import crypto from "crypto";

/* ================= GET TEMPLATE HTML ================= */
export const getTemplateHtml = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT file_path FROM templates WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Template not found" });
    }

    const template = result.rows[0];

    if (!fs.existsSync(template.file_path)) {
      return res.status(404).json({ msg: "File not found on server" });
    }

    const options = {
      styleMap: [
        "p[style-name='Section Title'] => h2:fresh",
        "p[style-name='Subsection Title'] => h3:fresh",
        "table => table.docx-table",
        "tr => tr.docx-tr",
        "td => td.docx-td",
        "p[style-name='List Paragraph'] => li:fresh",
      ],
      includeDefaultStyleMap: true,
    };

    const docResult = await mammoth.convertToHtml(
      { path: template.file_path },
      options
    );

    res.status(200).json({ html: docResult.value });
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    res.status(500).json({ msg: "Parsing failed", error: error.message });
  }
};

/* ================= UPLOAD TEMPLATE ================= */
export const uploadTemplate = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!req.files?.templateFile || !req.files?.thumbnail) {
      return res
        .status(400)
        .json({ msg: "Template file & thumbnail required" });
    }

    const templatePath = req.files.templateFile[0].path;
    const thumbnailPath = req.files.thumbnail[0].path;
    const templateId = crypto.randomUUID();
    const finalCategory = category || "Modern";

    await pool.query(
      `INSERT INTO templates (id, name, category, file_path, previewimage, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())`,
      [templateId, name, finalCategory, templatePath, thumbnailPath]
    );

    // 🔔 ADMIN NOTIFICATION
    await pool.query(
      `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
      [crypto.randomUUID(), "TEMPLATE_CREATED", `New template submitted: ${name} (${finalCategory})`, req.userId, "user"]
    );

    // 🔔 USER NOTIFICATION
    await pool.query(
      `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
      [crypto.randomUUID(), "TEMPLATE_CREATED", "Your template has been submitted for approval", req.userId, "system"]
    );

    res.status(201).json({
      msg: "Template uploaded & pending approval",
      template: { _id: templateId, name, category: finalCategory, status: "pending" },
    });
  } catch (error) {
    console.error("Error uploading template:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

/* ================= GET TEMPLATES ================= */
export const getTemplates = async (req, res) => {
  try {
    const { status } = req.query;
    
    let queryArgs = [];
    let queryStr = "SELECT id as \"_id\", name, description, previewimage, file_path, status, category, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM templates";
    
    if (status) {
      queryStr += " WHERE status = $1";
      queryArgs.push(status);
    }
    queryStr += " ORDER BY created_at DESC";

    const result = await pool.query(queryStr, queryArgs);

    const templatesWithUrls = result.rows.map((t) => ({
      ...t,
      fileUrl: `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/templates/${path.basename(
        t.file_path
      )}`,
      imageUrl: `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/templates/${path.basename(
        t.previewimage
      )}`,
    }));

    res.status(200).json(templatesWithUrls);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

/* ================= GET TEMPLATE BY ID ================= */
export const getTemplateById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id as \"_id\", name, description, previewimage, file_path, status, category, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM templates WHERE id = $1", 
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Template not found" });
    }

    const template = result.rows[0];

    res.status(200).json({
      ...template,
      fileUrl: `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/templates/${path.basename(
        template.file_path
      )}`,
      imageUrl: `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/templates/${path.basename(
        template.previewimage
      )}`,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================= APPROVE TEMPLATE ================= */
export const approveTemplate = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE templates SET status = 'approved', updated_at = NOW() WHERE id = $1 RETURNING id as \"_id\", *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Template not found" });
    }
    
    const template = result.rows[0];

    await pool.query(
      `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
      [crypto.randomUUID(), "TEMPLATE_APPROVED", "Your template has been approved 🎉", null, "system"]
    );

    res.status(200).json({ msg: "Template approved", template });
  } catch (error) {
    console.error("Error approving template:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================= UPDATE TEMPLATE ================= */
export const updateTemplate = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM templates WHERE id = $1", [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Template not found" });
    }
    
    let template = result.rows[0];

    if (req.files?.templateFile?.[0]) {
      if (fs.existsSync(template.file_path)) fs.unlinkSync(template.file_path);
      template.file_path = req.files.templateFile[0].path;
    }

    if (req.files?.thumbnail?.[0]) {
      if (fs.existsSync(template.previewimage))
        fs.unlinkSync(template.previewimage);
      template.previewimage = req.files.thumbnail[0].path;
    }

    if (req.body.name) template.name = req.body.name;
    if (req.body.category) template.category = req.body.category;

    const updateResult = await pool.query(
      "UPDATE templates SET name = $1, category = $2, file_path = $3, previewimage = $4, updated_at = NOW() WHERE id = $5 RETURNING id as \"_id\", *",
      [template.name, template.category, template.file_path, template.previewimage, req.params.id]
    );

    // 🔔 ADMIN NOTIFICATION
    await pool.query(
      `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
      [crypto.randomUUID(), "TEMPLATE_UPDATED", "Template updated", req.userId, "user"]
    );

    res.status(200).json({
      msg: "Template updated successfully",
      template: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================= DELETE TEMPLATE ================= */
export const deleteTemplate = async (req, res) => {
  try {
    const result = await pool.query("SELECT file_path, previewimage FROM templates WHERE id = $1", [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Template not found" });
    }

    const template = result.rows[0];

    if (fs.existsSync(template.file_path)) fs.unlinkSync(template.file_path);
    if (fs.existsSync(template.previewimage))
      fs.unlinkSync(template.previewimage);

    await pool.query("DELETE FROM templates WHERE id = $1", [req.params.id]);

    // 🔔 ADMIN NOTIFICATION
    await pool.query(
      `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
      [crypto.randomUUID(), "TEMPLATE_DELETED", "Template deleted", req.userId, "user"]
    );

    res.status(200).json({ msg: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
