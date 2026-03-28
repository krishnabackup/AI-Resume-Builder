import Notification from "../Models/notification.js";
import AtsScans from "../Models/atsScan.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import Payment from "../Models/payment.js";
import Resume from "../Models/resume.js";
import Subscription from "../Models/subscription.js";
import ApiMetric from "../Models/ApiMetric.js";
import Download from "../Models/Download.js";
import { pool } from "../config/postgresdb.js";
import crypto from "crypto";

/* ================== USER DASHBOARD ================== */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const userResult = await pool.query(
      "SELECT username, email, profile_views, is_admin, admin_request_status FROM users WHERE id = $1",
      [userId]
    );
    const userObj = userResult.rows[0] || {};

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Document Breakdown counts (per logged-in user)
    const dlsResult = await pool.query(
      "SELECT type, COUNT(*) as count FROM downloads WHERE user_id = $1 AND action = 'download' GROUP BY type",
      [userId]
    );
    
    let totalResumes = 0, totalCvs = 0, totalCoverLetters = 0;
    dlsResult.rows.forEach(row => {
        if (row.type === 'resume') totalResumes = parseInt(row.count, 10);
        else if (row.type === 'cv') totalCvs = parseInt(row.count, 10);
        else if (row.type === 'cover-letter') totalCoverLetters = parseInt(row.count, 10);
    });

    // Total and Weekly Resumes
    const resumesThisWeekResult = await pool.query(
      "SELECT COUNT(*) as count FROM resumes WHERE user_id = $1 AND created_at >= $2",
      [userId, oneWeekAgo]
    );
    const resumesThisWeek = parseInt(resumesThisWeekResult.rows[0].count, 10);

    // ATS Scores logic
    const atsResult = await pool.query(
        "SELECT score FROM ats_scores WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    const allAtsScans = atsResult.rows;

    let avgAtsScore = 0;
    if (allAtsScans.length > 0) {
      const sum = allAtsScans.reduce((s, scan) => s + (scan.score || 0), 0);
      avgAtsScore = Math.round(sum / allAtsScans.length);
    }

    const latestAts = allAtsScans[0]?.score || 0;
    const previousAts = allAtsScans[1]?.score || latestAts;
    const atsDelta = latestAts - previousAts;

    const recentResumesResult = await pool.query(
      "SELECT id, title, created_at FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
      [userId]
    );
    const recentResumes = recentResumesResult.rows;

    res.status(200).json({
      user: {
        name: userObj.username || "User",
        email: userObj.email,
        isAdmin: userObj.is_admin || false,
        adminRequestStatus: userObj.admin_request_status || "none"
      },
      stats: {
        resumesCreated: totalResumes,
        cvsCreated: totalCvs,
        coverLettersCreated: totalCoverLetters,
        resumesThisWeek,
        avgAtsScore: avgAtsScore,
        latestAts: latestAts,
        atsDelta: atsDelta,
        profileViews: userObj.profile_views || 0,
      },
      recentResumes: recentResumes.map((r) => ({
        id: r.id,
        name: r.title,
        date: r.created_at,
        // Include ATS score for each resume if available
      })),
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

// ------------------------USER: Username ---------------------
export const getUserName = async (req, res) => {
  try {
    const { id } = req.params;

    const userQuery = await pool.query('select username from users where id = $1',[id])
    const user = userQuery.rows[0];
    if (!user.username) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================== ADMIN: USERS ================== */
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, is_admin as \"isAdmin\", admin_request_status as \"adminRequestStatus\", is_active as \"isActive\", plan, last_login as \"lastLogin\", created_at as \"createdAt\", profile_views as \"profileViews\" FROM users"
    );

    // Ensure frontend gets Mongoose-compatible properties (specifically _id)
    const users = result.rows.map(row => ({
      ...row,
      _id: row.id
    }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/* ================== USER PROFILE (SELF) ================== */

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.username,
        u.email,
        u.is_admin,
        u.is_active,
        u.created_at,
        up.full_name,
        up.phone,
        up.location,
        up.bio,
        up.github,
        up.linkedin
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username || "",
        email: result.rows[0].email || "",
        isAdmin: Boolean(result.rows[0].is_admin),
        isActive: Boolean(result.rows[0].is_active),
        createdAt: result.rows[0].created_at,
        fullName: result.rows[0].full_name || "",
        phone: result.rows[0].phone || "",
        location: result.rows[0].location || "",
        bio: result.rows[0].bio || "",
        github: result.rows[0].github || "",
        linkedin: result.rows[0].linkedin || "",
        extraLinks: [],
      },
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.userId;
    const {
      fullName,
      username,
      email,
      phone,
      location,
      bio,
      github,
      linkedin,
    } = req.body;

    const userResult = await client.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // Email uniqueness check (if changing email)
    if (email && email !== user.email) {
      const emailCheck = await client.query(
        `SELECT id FROM users WHERE email = $1 AND id <> $2`,
        [email, userId]
      );

      if (emailCheck.rowCount > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    await client.query("BEGIN");

    const updatedUserResult = await client.query(
      `
      UPDATE users
      SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        updated_at = NOW()
      WHERE id = $3
      RETURNING id, username, email, created_at, is_admin, is_active
      `,
      [
        username,
        email,
        userId,
      ]
    );

    const existingProfileResult = await client.query(
      `SELECT id FROM user_profiles WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (existingProfileResult.rowCount > 0) {
      await client.query(
        `
        UPDATE user_profiles
        SET
          full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          location = COALESCE($3, location),
          bio = COALESCE($4, bio),
          github = COALESCE($5, github),
          linkedin = COALESCE($6, linkedin)
        WHERE user_id = $7
        `,
        [fullName, phone, location, bio, github, linkedin, userId]
      );
    } else {
      await client.query(
        `
        INSERT INTO user_profiles (id, user_id, full_name, phone, location, bio, github, linkedin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [crypto.randomUUID(), userId, fullName || "", phone || "", location || "", bio || "", github || "", linkedin || ""]
      );
    }

    const mergedProfileResult = await client.query(
      `
      SELECT
        u.id,
        u.username,
        u.email,
        u.created_at,
        u.is_admin,
        u.is_active,
        up.full_name,
        up.phone,
        up.location,
        up.bio,
        up.github,
        up.linkedin
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = $1
      `,
      [userId]
    );

    await client.query("COMMIT");

    const row = mergedProfileResult.rows[0] || updatedUserResult.rows[0];

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: row.id,
        username: row.username || "",
        email: row.email || "",
        isAdmin: Boolean(row.is_admin),
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        fullName: row.full_name || "",
        phone: row.phone || "",
        location: row.location || "",
        bio: row.bio || "",
        github: row.github || "",
        linkedin: row.linkedin || "",
        extraLinks: [],
      },
    });

  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {
      // ignore rollback errors
    }
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  } finally {
    client.release();
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both passwords are required" });
    if (newPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const userResult = await pool.query("SELECT id, password FROM users WHERE id = $1", [userId]);
    if (userResult.rowCount === 0) return res.status(404).json({ message: "User not found" });
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2", [hashed, userId]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, isAdmin, isActive, plan } = req.body;
    const targetUserId = req.params.id;

    const existingUserResult = await pool.query(
      `
      SELECT id, username, email, is_admin, is_active, plan, created_at, admin_request_status
      FROM users
      WHERE id = $1
      `,
      [targetUserId]
    );
    if (existingUserResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingUser = existingUserResult.rows[0];

    if (email && email !== existingUser.email) {
      const emailExistsResult = await pool.query(
        `SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1`,
        [email, targetUserId]
      );
      if (emailExistsResult.rowCount > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (typeof isActive === "boolean") {
      console.log(
        `Updating user ${existingUser.email} isActive from ${existingUser.is_active} to ${isActive}`,
      );
    }

    const updatedUserResult = await pool.query(
      `
      UPDATE users
      SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        is_admin = COALESCE($3, is_admin),
        is_active = COALESCE($4, is_active),
        plan = COALESCE($5, plan),
        created_at = COALESCE($6, created_at),
        updated_at = NOW()
      WHERE id = $7
      RETURNING
        id,
        id AS "_id",
        username,
        email,
        is_admin AS "isAdmin",
        is_active AS "isActive",
        plan,
        created_at AS "createdAt",
        admin_request_status AS "adminRequestStatus"
      `,
      [
        username ?? null,
        email ?? null,
        typeof isAdmin === "boolean" ? isAdmin : null,
        typeof isActive === "boolean" ? isActive : null,
        plan ?? null,
        req.body.createdAt ?? null,
        targetUserId,
      ]
    );
    const updatedUser = updatedUserResult.rows[0];

    /* 🔔 ADMIN NOTIFICATION (USER ACTION) */
    if (typeof isActive === "boolean") {
      // 🔔 USER
      await pool.query(
        `
        INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, false, false, NOW(), NOW())
        `,
        [
          crypto.randomUUID(),
          updatedUser.id,
          "ACCOUNT_STATUS",
          `Your account was ${isActive ? "activated" : "deactivated"} by admin`,
          "system",
        ]
      );

      // 🔔 ADMIN
      await pool.query(
        `
        INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, false, true, NOW(), NOW())
        `,
        [
          crypto.randomUUID(),
          req.userId,
          "USER_STATUS",
          `${updatedUser.username || updatedUser.email} was ${isActive ? "activated" : "deactivated"}`,
          "user",
        ]
      );
    }

    console.log(
      `User ${updatedUser.email} updated - isActive is now: ${updatedUser.isActive}`,
    );
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Update failed", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const userResult = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [targetUserId]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];

    // 🔔 ADMIN NOTIFICATION
    await pool.query(
      `
      INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, false, true, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        req.userId,
        "USER_DELETED",
        `${user.username || user.email} account was deleted`,
        "user",
      ]
    );

    await pool.query(`DELETE FROM users WHERE id = $1`, [targetUserId]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Delete failed", error: error.message });
  }
};

/* ================== ADMIN REQUESTS ================== */
export const requestAdminAccess = async (req, res) => {
  try {
    const userId = req.userId;
    const userResult = await pool.query(
      "SELECT id, username, email, is_admin, admin_request_status FROM users WHERE id = $1", 
      [userId]
    );
    
    if (userResult.rowCount === 0) return res.status(404).json({ message: "User not found" });
    const user = userResult.rows[0];

    if (user.is_admin) {
      return res.status(400).json({ message: "You are already an admin" });
    }

    if (user.admin_request_status === 'pending') {
      return res.status(400).json({ message: "Admin request is already pending" });
    }

    await pool.query(
      "UPDATE users SET admin_request_status = 'pending', updated_at = NOW() WHERE id = $1", 
      [userId]
    );

    // 🔔 USER NOTIFICATION (Self acknowledgement)
    await pool.query(
      `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
      [crypto.randomUUID(), "ADMIN_REQUEST_USER", "Your request for admin access has been submitted", userId, "system"]
    );

    // 🔔 ADMIN NOTIFICATION
    const adminUserResult = await pool.query("SELECT id FROM users WHERE is_admin = true LIMIT 1");
    if (adminUserResult.rowCount > 0) {
      const adminUserId = adminUserResult.rows[0].id;
      await pool.query(
        `INSERT INTO notifications (id, type, message, user_id, actor, is_read, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())`,
        [crypto.randomUUID(), "ADMIN_REQUEST", `${user.username || user.email} has requested for admin access`, adminUserId, "user"]
      );
    }

    const refreshedUserResult = await pool.query(
      `
      SELECT
        id,
        id AS "_id",
        username,
        email,
        is_admin AS "isAdmin",
        is_active AS "isActive",
        plan,
        created_at AS "createdAt",
        admin_request_status AS "adminRequestStatus"
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    res.status(200).json({ 
      message: "Admin request submitted successfully", 
      user: refreshedUserResult.rows[0]
    });
  } catch (error) {
    console.error("Request admin error DETAILED:", error.message, error.stack);
    res.status(500).json({ message: "Failed to submit admin request", error: error.message });
  }
};

export const approveAdminRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const userResult = await pool.query(
      `
      SELECT id, username, email, admin_request_status
      FROM users
      WHERE id = $1
      `,
      [targetUserId]
    );

    if (userResult.rowCount === 0) return res.status(404).json({ message: "User not found" });
    const user = userResult.rows[0];

    if (user.admin_request_status !== 'pending') {
      return res.status(400).json({ message: "No pending admin request for this user" });
    }

    const updatedUserResult = await pool.query(
      `
      UPDATE users
      SET is_admin = true, admin_request_status = 'approved', updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        id AS "_id",
        username,
        email,
        is_admin AS "isAdmin",
        is_active AS "isActive",
        plan,
        created_at AS "createdAt",
        admin_request_status AS "adminRequestStatus"
      `,
      [targetUserId]
    );
    const updatedUser = updatedUserResult.rows[0];

    const adminResult = await pool.query(`SELECT username FROM users WHERE id = $1`, [req.userId]);
    const adminName = adminResult.rows[0]?.username || "Admin";

    // 🔔 USER NOTIFICATION
    await pool.query(
      `
      INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, false, false, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        updatedUser.id,
        "ROLE_UPDATE",
        `Your admin access request has been approved by ${adminName}`,
        "system",
      ]
    );

    // 🔔 ADMIN NOTIFICATION (Confirmation)
    await pool.query(
      `
      INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, false, true, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        req.userId,
        "ROLE_APPROVED_ADMIN",
        `You approved ${user.username || user.email}'s admin access request`,
        "user",
      ]
    );

    res.status(200).json({ message: "Admin request approved", user: updatedUser });
  } catch (error) {
    console.error("Approve admin error:", error);
    res.status(500).json({ message: "Failed to approve admin request", error: error.message });
  }
};

export const rejectAdminRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const userResult = await pool.query(
      `
      SELECT id, username, email, admin_request_status
      FROM users
      WHERE id = $1
      `,
      [targetUserId]
    );

    if (userResult.rowCount === 0) return res.status(404).json({ message: "User not found" });
    const user = userResult.rows[0];

    if (user.admin_request_status !== 'pending') {
      return res.status(400).json({ message: "No pending admin request for this user" });
    }

    const updatedUserResult = await pool.query(
      `
      UPDATE users
      SET admin_request_status = 'rejected', updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        id AS "_id",
        username,
        email,
        is_admin AS "isAdmin",
        is_active AS "isActive",
        plan,
        created_at AS "createdAt",
        admin_request_status AS "adminRequestStatus"
      `,
      [targetUserId]
    );
    const updatedUser = updatedUserResult.rows[0];

    const adminResult = await pool.query(`SELECT username FROM users WHERE id = $1`, [req.userId]);
    const adminName = adminResult.rows[0]?.username || "Admin";

    // 🔔 USER NOTIFICATION
    await pool.query(
      `
      INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, false, false, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        updatedUser.id,
        "ROLE_UPDATE",
        `Your admin access request was rejected by ${adminName}`,
        "system",
      ]
    );

    // 🔔 ADMIN NOTIFICATION (Confirmation)
    await pool.query(
      `
      INSERT INTO notifications (id, user_id, type, message, actor, is_read, from_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, false, true, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        req.userId,
        "ROLE_REJECTED_ADMIN",
        `You rejected ${user.username || user.email}'s admin access request`,
        "user",
      ]
    );

    res.status(200).json({ message: "Admin request rejected", user: updatedUser });
  } catch (error) {
    console.error("Reject admin error:", error);
    res.status(500).json({ message: "Failed to reject admin request", error: error.message });
  }
};
