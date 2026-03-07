import mongoose from "mongoose";
import Resume from "../Models/resume.js";
import AtsScans from "../Models/atsScan.js";
import Download from "../Models/Download.js";

// Helper for relative time if we need it, but frontend does it. We will just supply the raw Date objects.

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Calculate Average ATS Score
        const allAtsScans = await AtsScans.find({ userId }).select("overallScore createdAt resumeprofileId").sort({ createdAt: -1 });
        let avgAtsScore = 0;
        if (allAtsScans.length > 0) {
            const sum = allAtsScans.reduce((s, scan) => s + scan.overallScore, 0);
            avgAtsScore = Math.round(sum / allAtsScans.length);
        }

        // 2. Calculate Total Downloads
        const totalDownloads = await Download.countDocuments({ user: userId, action: "download" });

        // 3. Find Last Edited Document
        // Assuming Resume is the main document type we track for "edits"
        const lastEditedDocRecord = await Resume.findOne({ user: userId }).sort({ updatedAt: -1 }).select("title updatedAt _id");

        let lastEditedDoc = null;
        if (lastEditedDocRecord) {
            lastEditedDoc = {
                id: lastEditedDocRecord._id,
                title: lastEditedDocRecord.title || "Untitled Resume",
                type: "Resume",
                updatedAt: lastEditedDocRecord.updatedAt,
            };
        }

        // 4. Construct Recent Activity Timeline
        const activities = [];

        // - Add recent resumes (created/edited)
        const recentResumes = await Resume.find({ user: userId }).sort({ updatedAt: -1 }).limit(10).select("title createdAt updatedAt _id");
        recentResumes.forEach((r) => {
            // Add 'created' event
            activities.push({
                id: `created-${r._id}`,
                type: "created",
                label: "Created a new resume",
                timestamp: r.createdAt,
                docTitle: r.title || "Untitled Resume",
                docId: r._id,
            });

            // Add 'edited' event if it was modified after creation (give or take a few seconds)
            if (r.updatedAt.getTime() - r.createdAt.getTime() > 5000) {
                activities.push({
                    id: `edited-${r._id}-${r.updatedAt.getTime()}`,
                    type: "edited",
                    label: "Edited document",
                    timestamp: r.updatedAt,
                    docTitle: r.title || "Untitled Resume",
                    docId: r._id,
                });
            }
        });

        // - Add recent downloads
        const recentDownloads = await Download.find({ user: userId, action: "download" }).sort({ createdAt: -1 }).limit(10).select("name type format createdAt downloadDate _id");
        recentDownloads.forEach((d) => {
            let docTitle = d.name || "Document";
            if (d.type) {
                docTitle += ` (${d.type})`;
            }
            activities.push({
                id: `download-${d._id}`,
                type: "download",
                label: `Downloaded ${d.format || "PDF"}`,
                timestamp: d.createdAt || d.downloadDate,
                docTitle: docTitle,
                docId: null,
            });
        });

        // - Add recent ATS scans
        const recentScans = await AtsScans.find({ userId }).sort({ createdAt: -1 }).limit(10).populate("resumeprofileId", "title").select("createdAt overallScore resumeprofileId _id");
        recentScans.forEach((s) => {
            activities.push({
                id: `scan-${s._id}`,
                type: "scan",
                label: `ATS Scan completed (${s.overallScore}%)`,
                timestamp: s.createdAt,
                docTitle: s.resumeprofileId?.title ? s.resumeprofileId.title : "Resume Profile",
                docId: s.resumeprofileId?._id || null,
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
