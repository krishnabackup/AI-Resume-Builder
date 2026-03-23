import { pool } from "../config/postgresdb.js";

const apiTracker = async (req, res, next) => {
  const start = Date.now();
  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
    const appMetricsId = crypto.randomUUID();
      await pool.query(
        `
        INSERT INTO api_metrics
        (id,endpoint, method, status_code, response_time, user_id, ip, created_at,updated_at)
        VALUES ($1, $2, $3, $4, $5, $6,$7, NOW(),NOW())
        `,
        [
          appMetricsId,  
          req.originalUrl || req.url,
          req.method,
          res.statusCode,
          duration,
          req.userId || null,
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