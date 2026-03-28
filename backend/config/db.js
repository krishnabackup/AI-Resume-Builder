import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

const connectDB = async () => {
  try {
    if (!process.env.POSTGRESQL_URI) {
      console.error("❌ PostgreSQL URI is missing in .env file");
      return;
    }

    const client = await pool.connect();
    console.log("✅ PostgreSQL connected");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    console.log("⚠️ Server will continue without database connection");
  }
};

export default connectDB;
