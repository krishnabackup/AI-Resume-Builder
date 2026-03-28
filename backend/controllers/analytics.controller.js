import { pool } from "../config/postgresdb.js"; 

export const trackPageView = async (req, res) => {
  try {
    const { page, route } = req.body;

    if (!page || !route) {
      return res.status(400).json({
        success: false,
        message: "'page' and 'route' are required",
      });
    }

    const result = await pool.query(
      "INSERT INTO page_views (page, route, user_id) VALUES ($1, $2, $3) RETURNING id",
      [page, route, req.userId || null]
    );

    return res.status(201).json({
      success: true,
      message: "Page view tracked",
      data: {
        id: result.rows[0].id,
      },
    });
  } catch (error) {
    console.error("Track Page View Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to track page view",
      error: error.message,
    });
  }
};

export const getTopViewedPages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        page,
        COUNT(*)::int AS views,
        COUNT(DISTINCT user_id)::int AS "uniqueUsers"
      FROM page_views
      GROUP BY 1
      ORDER BY views DESC
      LIMIT 5
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get Top Viewed Pages Error:", error);
    return res.status(500).json({
      message: "Failed to fetch top viewed pages",
      error: error.message,
    });
  }
};

