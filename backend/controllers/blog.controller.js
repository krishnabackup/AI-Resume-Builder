import { pool } from "../config/postgresdb.js";

const formatDate = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toBlogResponse = (row) => ({
  id: row.id,
  _id: row.id, // for frontend compatibility
  title: row.title,
  excerpt: row.excerpt,
  detail: row.detail,
  category: row.category,
  date: row.date || formatDate(row.created_at),
  image: row.image,
  readTime: row.read_time,
  isPublished: row.is_published,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const createMutationNotification = async (type, message, userId) => {
  if (!userId) return;

  try {
    await pool.query(
        `INSERT INTO notifications (type, message, user_id, actor, is_read, from_admin, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [type, message, userId, "user", false, true]
    );
  } catch (error) {
    console.error("Blog notification error:", error.message);
  }
};

export const getBlogs = async (req, res) => {
  try {
    const { category, search, includeUnpublished } = req.query;

    let queryText = "SELECT * FROM blogs WHERE 1=1";
    const queryParams = [];

    if (includeUnpublished !== "true") {
      queryText += " AND is_published = true";
    }

    if (category && category !== "All Articles") {
      queryParams.push(category);
      queryText += ` AND category = $${queryParams.length}`;
    }

    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (title ILIKE $${queryParams.length} OR excerpt ILIKE $${queryParams.length})`;
    }

    queryText += " ORDER BY created_at DESC";

    const result = await pool.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      data: result.rows.map(toBlogResponse),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({ success: true, data: toBlogResponse(result.rows[0]) });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, detail, category, date, image, readTime, isPublished } = req.body;

    if (!title || !excerpt || !detail || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "title, excerpt, detail, category, and image are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO blogs (title, excerpt, detail, category, date, image, read_time, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [title, excerpt, detail, category, date || "", image, readTime || "", typeof isPublished === "boolean" ? isPublished : true]
    );

    const blog = result.rows[0];

    await createMutationNotification(
      "BLOG_CREATED",
      `Blog created: ${blog.title}`,
      req.userId
    );

    return res.status(201).json({ success: true, data: toBlogResponse(blog) });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, excerpt, detail, category, date, image, readTime, isPublished } = req.body;

    const queryParams = [];
    const updateFields = [];

    if (title !== undefined) { queryParams.push(title); updateFields.push(`title = $${queryParams.length}`); }
    if (excerpt !== undefined) { queryParams.push(excerpt); updateFields.push(`excerpt = $${queryParams.length}`); }
    if (detail !== undefined) { queryParams.push(detail); updateFields.push(`detail = $${queryParams.length}`); }
    if (category !== undefined) { queryParams.push(category); updateFields.push(`category = $${queryParams.length}`); }
    if (date !== undefined) { queryParams.push(date); updateFields.push(`date = $${queryParams.length}`); }
    if (image !== undefined) { queryParams.push(image); updateFields.push(`image = $${queryParams.length}`); }
    if (readTime !== undefined) { queryParams.push(readTime); updateFields.push(`read_time = $${queryParams.length}`); }
    if (isPublished !== undefined) { queryParams.push(isPublished); updateFields.push(`is_published = $${queryParams.length}`); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    updateFields.push("updated_at = NOW()");
    queryParams.push(req.params.id);
    const queryText = `UPDATE blogs SET ${updateFields.join(", ")} WHERE id = $${queryParams.length} RETURNING *`;

    const result = await pool.query(queryText, queryParams);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const blog = result.rows[0];

    await createMutationNotification(
      "BLOG_UPDATED",
      `Blog updated: ${blog.title}`,
      req.userId
    );

    return res.status(200).json({ success: true, data: toBlogResponse(blog) });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM blogs WHERE id = $1 RETURNING *", [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const blog = result.rows[0];

    await createMutationNotification(
      "BLOG_DELETED",
      `Blog deleted: ${blog.title}`,
      req.userId
    );

    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
