import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

async function checkDb() {
    const client = new Client({
        connectionString: 'postgresql://postgres.mwrkrtelawgepjqwhmeh:uptoskills9090@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'
    });
    
    await client.connect();
    
    const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `);
    
    const tables = res.rows.map(r => r.table_name);
    const schema = {};

    for (let table of tables) {
        const columns = await client.query(`
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = $1
        `, [table]);
        schema[table] = columns.rows;
    }
    
    fs.writeFileSync('schema.json', JSON.stringify(schema, null, 2));
    console.log("Schema written to schema.json");
    await client.end();
}

checkDb().catch(console.error);
