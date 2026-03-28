import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function runMigration() {
    const client = new Client({
        connectionString: 'postgresql://postgres.mwrkrtelawgepjqwhmeh:uptoskills9090@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'
    });
    
    await client.connect();
    console.log("Connected to PostgreSQL for Schema Migration.");
    
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'migrate_schema.sql'), 'utf-8');
        await client.query(sql);
        console.log("Schema migration completed successfully.");
    } catch (err) {
        console.error("Error during schema migration:", err);
    } finally {
        await client.end();
    }
}

runMigration();
