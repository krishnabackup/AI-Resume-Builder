import pg from "pg";
import dotenv from "dotenv";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.POSTGRESQL_URI ?? "";

const pgConfig = {
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
};

const sslEnv = process.env.POSTGRESQL_SSL?.toLowerCase();
const sslMode = process.env.PGSSLMODE?.toLowerCase();
const shouldUseSsl = Boolean(
  (sslMode && sslMode !== "disable") ||
  sslEnv === "true" ||
  (typeof sslEnv === "undefined" &&
    connectionString.includes("supabase") &&
    connectionString.includes("://")),
);

if (shouldUseSsl) {
  pgConfig.ssl = {
    rejectUnauthorized: false, // Allow self-signed certificates for development
  };
  if (process.env.POSTGRESQL_ROOT_CERT) {
    pgConfig.ssl.ca = process.env.POSTGRESQL_ROOT_CERT;
  }
}

export const pool = new Pool(pgConfig);

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
