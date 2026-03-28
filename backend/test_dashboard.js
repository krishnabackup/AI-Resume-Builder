import { pool } from "./config/postgresdb.js";

const testDashboard = async () => {
    try {
        // Use a dummy UUID
        const userId = "00000000-0000-0000-0000-000000000000";

        console.log("1. Average ATS Score...");
        await pool.query(
            "SELECT score AS \"overallScore\" FROM ats_scores WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        console.log("2. Total Downloads...");
        await pool.query(
            "SELECT COUNT(*) FROM downloads WHERE user_id = $1 AND action = 'download'",
            [userId]
        );

        console.log("3. Last Edited Document...");
        await pool.query(
            "SELECT id, title, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
            [userId]
        );

        console.log("4a. Recent Resumes...");
        await pool.query(
            "SELECT id, title, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 10",
            [userId]
        );

        console.log("4b. Recent Downloads...");
        await pool.query(
            "SELECT id, name, type, format, created_at, download_date FROM downloads WHERE user_id = $1 AND action = 'download' ORDER BY created_at DESC LIMIT 10",
            [userId]
        );

        console.log("4c. Recent ATS Scans...");
        await pool.query(
            `SELECT a.id, a.created_at, a.score, coalesce(r.title, 'Resume Profile') as "resumeTitle", r.id as cv_id 
             FROM ats_scores a 
             LEFT JOIN resumes r ON a.cv_id = r.id 
             WHERE a.user_id = $1 
             ORDER BY a.created_at DESC LIMIT 10`,
            [userId]
        );

        console.log("✅ All queries succeeded!");
        process.exit(0);
    } catch (error) {
        console.error("❌ SQL Query Error:", error);
        process.exit(1);
    }
};

testDashboard();
