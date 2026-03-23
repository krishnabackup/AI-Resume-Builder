import Notification from "../Models/notification.js";
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
    const notifications = await Notification.find({
      actor: "user", // ✅ user ne koi action kiya
    })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      actor: "user",
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Admin notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// MARK ALL READ (admin)
export const markAdminNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { actor: "user", isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark admin notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= INDIVIDUAL NOTIFICATION ACTIONS ================= */

// MARK SINGLE NOTIFICATION READ
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE SINGLE NOTIFICATION
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE ALL NOTIFICATIONS
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ actor: "user" });

    res.status(200).json({ success: true, message: "All notifications deleted" });
  } catch (error) {
    console.error("Delete all notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= TEST NOTIFICATIONS (FOR DEVELOPMENT) ================= */
export const createTestNotifications = async (req, res) => {
  try {
    // Get first admin user
    const { User } = await import("../Models/User.js");
    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      return res.status(400).json({ success: false, message: "No admin user found" });
    }

    // Create test notifications for admin
    const testNotifications = [
      {
        type: "NEW_USER",
        message: "New user 'John Doe' registered via email signup",
        userId: adminUser._id,
        actor: "user",
        isRead: false,
      },
      {
        type: "ACCOUNT_STATUS",
        message: "User account has been activated",
        userId: adminUser._id,
        actor: "user",
        isRead: false,
      },
      {
        type: "PAYMENT_RECEIVED",
        message: "Payment received for premium subscription",
        userId: adminUser._id,
        actor: "user",
        isRead: true,
      },
      {
        type: "SECURITY_ALERT",
        message: "Suspicious login activity detected",
        userId: adminUser._id,
        actor: "user",
        isRead: false,
      },
    ];

    await Notification.insertMany(testNotifications);

    res.status(200).json({
      success: true,
      message: "Test notifications created successfully",
      count: testNotifications.length,
    });
  } catch (error) {
    console.error("Create test notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
