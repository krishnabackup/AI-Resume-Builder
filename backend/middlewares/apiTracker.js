import { pool } from "../config/postgresdb.js";

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const apiTracker = async (req, res, next) => {
  const start = Date.now();
  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
      const userId = req.userId || null;
      let pgUserId = null;

      if (userId && isUUID(userId)) {
        pgUserId = userId;
      }

      await pool.query(
        `
        INSERT INTO api_metrics
        (endpoint, method, status_code, response_time, user_id, ip, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
        [
          req.originalUrl || req.url,
          req.method,
          res.statusCode,
          duration,
          pgUserId,
          req.ip,
        ]
      );
    } catch (error) {
      console.error("Error saving API metric:", error);
    }
  });

  next();
};

export default apiTracker;