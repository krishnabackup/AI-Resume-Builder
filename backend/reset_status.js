import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

async function run() {
  try {
    // Reset Swaraj's status to 'none' so he can successfully trigger the full process again
    await pool.query("UPDATE users SET admin_request_status = 'none' WHERE id = '26b471bc-0eae-4641-8767-d13c0f6194e3'");
    console.log("Status reset successfully!");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
