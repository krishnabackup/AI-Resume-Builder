import { pool } from "./config/postgresdb.js";

const checkSchema = async () => {
    try {
        const res1 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ats_scores'");
        console.log("ats_scores columns:", res1.rows);
        
        const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ats_results'");
        console.log("ats_results columns:", res2.rows);

        const res3 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'downloads'");
        console.log("downloads columns:", res3.rows);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkSchema();
