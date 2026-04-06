import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS template_visibilities (
        template_id VARCHAR(255) PRIMARY KEY,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("PostgreSQL table 'template_visibilities' securely created/verified.");
  } catch(e) {
    console.error("Error creating table:", e);
  } finally {
    pool.end();
  }
}

createTable();
