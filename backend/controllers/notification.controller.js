
import { pool } from "../config/postgresdb.js";
/* ================= USER NOTIFICATIONS ================= */

// GET user notifications (sirf system → user)
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Get notifications
    const notificationsResult = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1 AND actor = $2
      ORDER BY created_at DESC
      `,
      [userId, "system"]
    );

    // ✅ Get unread count
    const unreadResult = await pool.query(
      `
      SELECT COUNT(*) 
      FROM notifications
      WHERE user_id = $1 AND actor = $2 AND is_read = false
      `,
      [userId, "system"]
    );

    res.status(200).json({
      success: true,
      unreadCount: parseInt(unreadResult.rows[0].count, 10),
      data: notificationsResult.rows,
    });

  } catch (error) {
    console.error("User notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// MARK ALL READ (user)
export const markUserNotificationsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await pool.query(
      `
      UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1
        AND actor = $2
        AND is_read = false
      `,
      [userId, "system"]
    );

    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
    });

  } catch (error) {
    console.error("Mark user notifications error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN NOTIFICATIONS ================= */

// GET admin notifications (sirf user → admin)
export const getAdminNotifications = async (req, res) => {
  try {
    
    const notificationsResult = await pool.query(
      `
      SELECT 
        n.id,
        n.type,
        n.message,
        n.actor,
        n.is_read,
        n.created_at,
        EXTRACT(EPOCH FROM (NOW() - n.created_at))::int AS age_seconds,
        n.user_id,
        u.username,
        u.email
      FROM notifications n
      LEFT JOIN users u ON u.id = n.user_id
      WHERE n.actor = 'user'
      ORDER BY n.created_at DESC
      `,
      []
    );

    const notifications = notificationsResult.rows.map((n) => {
      const messageSenderMatch =
        n.type === "ADMIN_REQUEST" && typeof n.message === "string"
          ? n.message.match(/^(.+?)\s+has requested for admin access$/i)
          : null;

      return {
        id: n.id,
        type: n.type,
        message: n.message,
        actor: n.actor,
        isRead: n.is_read,
        createdAt: n.created_at,
        ageSeconds: Math.max(0, n.age_seconds || 0),
        userId: n.user_id,
        user: messageSenderMatch?.[1] || n.username || n.email || "User"
      };
    });

  
    const countResult = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE actor = 'user' AND is_read = false
      `
    );

    const unreadCount = countResult.rows[0].count;


    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Admin notification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MARK ALL READ (admin)
export const markAdminNotificationsRead = async (req, res) => {
  try {
    await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE actor = 'user' AND is_read = false
      `
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark admin notifications error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= INDIVIDUAL NOTIFICATION ACTIONS ================= */

// MARK SINGLE NOTIFICATION READ
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID required",
      });
    }

    const updatedNotification = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (updatedNotification.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedNotification.rows[0],
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SINGLE NOTIFICATION

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID required",
      });
    }

    const result = await pool.query(
      `DELETE FROM notifications
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ALL NOTIFICATIONS
export const deleteAllNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM notifications
       WHERE actor = $1`,
      ["user"]
    );

    res.status(200).json({
      success: true,
      message: "All notifications deleted",
      deletedCount: result.rowCount,
    });
  } catch (error) {
    console.error("Delete all notifications error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

