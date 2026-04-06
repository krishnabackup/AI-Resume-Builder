import { pool } from "../config/postgresdb.js";

// Helper for relative time if we need it, but frontend does it. We will just supply the raw Date objects.

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Calculate Average ATS Score (Now using Latest for consistency)
        const atsResult = await pool.query(
            "SELECT score AS \"overallScore\" FROM ats_scores WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
            [userId]
        );
        const allAtsScans = atsResult.rows;
        let avgAtsScore = allAtsScans.length > 0 ? allAtsScans[0].overallScore : 0;

        // 2. Calculate Total Downloads
        const dlCountResult = await pool.query(
            "SELECT COUNT(*) FROM downloads WHERE user_id = $1 AND action = 'download'",
            [userId]
        );
        const totalDownloads = parseInt(dlCountResult.rows[0].count, 10);

        // 3. Find Last Edited Document
        const lastEditedResult = await pool.query(
            "SELECT id, title, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
            [userId]
        );
        
        let lastEditedDoc = null;
        if (lastEditedResult.rowCount > 0) {
            const record = lastEditedResult.rows[0];
            lastEditedDoc = {
                id: record.id,
                title: record.title || "Untitled Resume",
                type: "Resume",
                updatedAt: record.updated_at,
            };
        }

        // 4. Construct Recent Activity Timeline
        const activities = [];

        // - Add recent resumes (created/edited)
        const recentResumesResult = await pool.query(
            "SELECT id, title, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 10",
            [userId]
        );
        
        recentResumesResult.rows.forEach((r) => {
            const rCreatedAt = new Date(r.created_at);
            const rUpdatedAt = new Date(r.updated_at);
            
            activities.push({
                id: `created-${r.id}`,
                type: "created",
                label: "Created a new resume",
                timestamp: rCreatedAt,
                docTitle: r.title || "Untitled Resume",
                docId: r.id,
            });

            if (rUpdatedAt.getTime() - rCreatedAt.getTime() > 5000) {
                activities.push({
                    id: `edited-${r.id}-${rUpdatedAt.getTime()}`,
                    type: "edited",
                    label: "Edited document",
                    timestamp: rUpdatedAt,
                    docTitle: r.title || "Untitled Resume",
                    docId: r.id,
                });
            }
        });

        // - Add recent downloads
        const recentDownloadsResult = await pool.query(
            "SELECT id, name, type, format, created_at, download_date FROM downloads WHERE user_id = $1 AND action = 'download' ORDER BY created_at DESC LIMIT 10",
            [userId]
        );
        
        recentDownloadsResult.rows.forEach((d) => {
            let docTitle = d.name || "Document";
            if (d.type) {
                docTitle += ` (${d.type})`;
            }
            activities.push({
                id: `download-${d.id}`,
                type: "download",
                label: `Downloaded ${d.format || "PDF"}`,
                timestamp: d.download_date || d.created_at || new Date(),
                docTitle: docTitle,
                docId: null,
            });
        });

        // - Add recent ATS scans
        const recentScansResult = await pool.query(
            `SELECT a.id, a.created_at, a.score, coalesce(r.title, 'Resume Profile') as "resumeTitle", r.id as cv_id 
             FROM ats_scores a 
             LEFT JOIN resumes r ON a.cv_id = r.id 
             WHERE a.user_id = $1 
             ORDER BY a.created_at DESC LIMIT 10`,
            [userId]
        );
        
        recentScansResult.rows.forEach((s) => {
            activities.push({
                id: `scan-${s.id}`,
                type: "scan",
                label: `ATS Scan completed (${s.score || 0}%)`,
                timestamp: new Date(s.created_at),
                docTitle: s.resumeTitle,
                docId: s.cv_id || null,
            });
        });

        // Sort all activities descending by timestamp and take top 15
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivity = activities.slice(0, 15);

        // 5. Send Response
        res.status(200).json({
            avgAtsScore,
            totalDownloads,
            lastEditedDoc,
            recentActivity,
        });
    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        res.status(500).json({ message: "Failed to load dashboard summary" });
    }
};
