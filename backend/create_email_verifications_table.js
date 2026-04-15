import { pool } from "./config/postgresdb.js";

async function createEmailVerificationsTable() {
  try {
    console.log("Creating email_verifications table if it does not exist...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        email VARCHAR(255) PRIMARY KEY,
        token UUID NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Table created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    pool.end();
  }
}

createEmailVerificationsTable();
