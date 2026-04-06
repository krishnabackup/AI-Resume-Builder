import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

async function run() {
  try {
    const adminReq = await pool.query("SELECT id, username, is_admin, admin_request_status FROM users");
    console.log("Users:", adminReq.rows);

    const notifs = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5");
    console.log("\nRecent Notifications:", notifs.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
