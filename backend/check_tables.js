import { pool } from "./config/postgresdb.js";

async function checkTables() {
  try {
    console.log("🔍 Checking existing tables in database...");
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log("📋 Existing tables:");
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error("❌ Error checking tables:", error);
  } finally {
    await pool.end();
  }
}

checkTables();
