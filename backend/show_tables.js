import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRESQL_URI });

async function showTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name ASC
    `);
    console.log("\n--- POSTGRESQL DATABASE TABLES ---");
    res.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`);
    });
    console.log("----------------------------------\n");
  } catch(e) {
    console.error("Error fetching tables:", e);
  } finally {
    pool.end();
  }
}

showTables();
