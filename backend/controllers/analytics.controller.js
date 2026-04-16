import { pool } from "../config/postgresdb.js"; 

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const PRESET_RANGE_DAYS = {
  "7d": 7,
  "30d": 30,
  "3m": 90,
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatBoundary = (date, endOfDay = false) => {
  return `${formatLocalDate(date)} ${endOfDay ? "23:59:59.999" : "00:00:00.000"}`;
};

const parseDateOnly = (value) => {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const parsed = new Date(`${raw}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const resolveAnalyticsWindow = (query = {}) => {
  const rangeKey = String(query.range ?? query.filterDate ?? query.filterdate ?? "30d").trim().toLowerCase();
  const customStart = parseDateOnly(query.startDate);
  const customEnd = parseDateOnly(query.endDate);

  if (customStart && customEnd) {
    const start = customStart <= customEnd ? customStart : customEnd;
    const end = customStart <= customEnd ? customEnd : customStart;
    return {
      startDate: formatBoundary(start),
      endDate: formatBoundary(end, true),
    };
  }

  const rangeDays = PRESET_RANGE_DAYS[rangeKey] || PRESET_RANGE_DAYS["30d"];
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (rangeDays - 1));

  return {
    startDate: formatBoundary(startDate),
    endDate: formatBoundary(endDate, true),
  };
};

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
    const { startDate, endDate } = resolveAnalyticsWindow(req.query);
    const result = await pool.query(`
      SELECT 
        page,
        COUNT(*)::int AS views,
        COUNT(DISTINCT user_id)::int AS "uniqueUsers"
      FROM page_views
      WHERE timestamp >= $1
        AND timestamp <= $2
      GROUP BY 1
      ORDER BY views DESC
      LIMIT 5
    `, [startDate, endDate]);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get Top Viewed Pages Error:", error);
    return res.status(500).json({
      message: "Failed to fetch top viewed pages",
      error: error.message,
    });
  }
};

