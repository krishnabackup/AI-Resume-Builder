import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/postgresdb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    const schemaPath = path.join(__dirname, "migrate_schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");
    console.log("Running migrations...");
    await pool.query(sql);
    console.log("✅ Schema updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

runMigrations();
