import { pool } from "./config/postgresdb.js";

async function showIndexLocations() {
  try {
    console.log("🔍 Showing all database indexes and their locations...");
    
    const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);
    
    console.log("📋 Database Indexes:");
    console.log("=" .repeat(80));
    
    let currentTable = '';
    result.rows.forEach(row => {
      if (row.tablename !== currentTable) {
        currentTable = row.tablename;
        console.log(`\n📊 Table: ${row.tablename}`);
        console.log("-".repeat(40));
      }
      
      console.log(`  📍 ${row.indexname}`);
      console.log(`     ${row.indexdef}`);
    });
    
    console.log("\n" + "=".repeat(80));
    console.log(`📈 Total indexes found: ${result.rows.length}`);
    
    // Show index usage statistics (if available)
    try {
      const indexStats = await pool.query(`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_scan,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes 
        ORDER BY idx_scan DESC
      `);
      
      console.log("\n📊 Index Usage Statistics:");
      console.log("=" .repeat(80));
      
      if (indexStats.rows.length > 0) {
        indexStats.rows.forEach(row => {
          console.log(`🔍 ${row.indexname} (${row.tablename})`);
          console.log(`   Scans: ${row.idx_scan}, Tuples Read: ${row.idx_tup_read}, Tuples Fetched: ${row.idx_tup_fetch}`);
        });
      } else {
        console.log("ℹ️  No index usage statistics available yet. Run queries first to see usage data.");
      }
    } catch (statsError) {
      console.log("⚠️  Could not retrieve index usage statistics:", statsError.message);
    }
    
  } catch (error) {
    console.error("❌ Error showing index locations:", error);
  } finally {
    await pool.end();
  }
}

showIndexLocations();
