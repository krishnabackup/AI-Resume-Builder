import { pool } from "../config/postgresdb.js";

// Get all visibility statuses
export const getVisibilityStatuses = async (req, res) => {
    try {
        const result = await pool.query("SELECT template_id, is_active FROM template_visibilities");
        // Convert array to object map for easy frontend lookup: { "jessica-claire": true, ... }
        const statusMap = result.rows.reduce((acc, curr) => {
            acc[curr.template_id] = curr.is_active;
            return acc;
        }, {});

        res.status(200).json(statusMap);
    } catch (error) {
        console.error("Error fetching visibility statuses:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// Toggle visibility
export const toggleVisibility = async (req, res) => {
    try {
        const { templateId } = req.body;

        if (!templateId) {
            return res.status(400).json({ msg: "Template ID is required" });
        }

        // Check if the record already exists
        const result = await pool.query("SELECT is_active FROM template_visibilities WHERE template_id = $1", [templateId]);

        let newStatus;
        if (result.rowCount === 0) {
            // If it doesn't exist, it was implicitly active. Toggling it means making it explicitly inactive.
            newStatus = false;
            await pool.query(
                "INSERT INTO template_visibilities (template_id, is_active, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
                [templateId, newStatus]
            );
        } else {
            // Flip the existing status
            newStatus = !result.rows[0].is_active;
            await pool.query(
                "UPDATE template_visibilities SET is_active = $1, updated_at = NOW() WHERE template_id = $2",
                [newStatus, templateId]
            );
        }

        res.status(200).json({
            msg: "Visibility updated",
            templateId,
            isActive: newStatus
        });

    } catch (error) {
        console.error("Error toggling visibility:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
