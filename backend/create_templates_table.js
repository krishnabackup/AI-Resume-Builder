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
      CREATE TABLE IF NOT EXISTS templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        previewimage VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        category VARCHAR(100) DEFAULT 'Modern',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("PostgreSQL table 'templates' securely created/verified.");
  } catch(e) {
    console.error("Error creating table:", e);
  } finally {
    pool.end();
  }
}

createTable();
