import { pool } from "./config/postgresdb.js";

async function createApiMetricsTable() {
  try {
    console.log("Creating api_metrics table if it does not exist...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER NOT NULL,
        response_time INTEGER NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        ip_address INET,
        user_agent TEXT,
        request_size INTEGER,
        response_size INTEGER,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes for better query performance
    console.log("Creating indexes for api_metrics table...");
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_metrics_created_at ON api_metrics(created_at);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_metrics_endpoint ON api_metrics(endpoint);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_metrics_user_id ON api_metrics(user_id);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_metrics_status_code ON api_metrics(status_code);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_metrics_response_time ON api_metrics(response_time);
    `);

    // Create composite index for common queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_metrics_composite ON api_metrics(created_at, endpoint, method);
    `);

    console.log("✅ api_metrics table and indexes created successfully.");
  } catch (error) {
    console.error("❌ Error creating api_metrics table:", error);
  } finally {
    await pool.end();
  }
}

createApiMetricsTable();
