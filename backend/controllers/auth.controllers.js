import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { genrateToken } from "../config/token.js";
import { pool } from "../config/postgresdb.js";
/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // admin sirf backend se decide hoga
    const isAdmin = email === process.env.ADMIN_EMAIL;
    const newUserId = crypto.randomUUID();
    const newProfileId = crypto.randomUUID();
     const client = await pool.connect();
     try{
      await  client.query('BEGIN');
      await client.query(
      `INSERT INTO users (id, username, email, password, is_admin, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [newUserId, username, email, hashedPass, isAdmin, true]);

      await client.query(
      `INSERT INTO user_profiles (id, user_id, full_name, phone, location, bio, github, linkedin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)`,
      [newProfileId,newUserId, "", "", "","","",""]
    );
    await client.query("COMMIT");

     }
     catch(error){
      await client.query("ROLLBACK")
      console.error(error);
     throw error;
     }
     finally{
      client.release();
     }

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Register failed:", error);
    res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
};


/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    /* ---------- LOGIN ---------- */
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];

    // Some tables use true/false for isActive, verify via === false for exact matching
    if (user.is_active === false) {
      return res
        .status(403)
        .json({ message: "Your account is deactivated" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ---------- FIRST TIME LOGIN ---------- */
    if (!user.last_login) { // Check both camelCase and snake_case just in case
      // 🔔 ADMIN notification
      await pool.query(
        'INSERT INTO notifications (user_id, type, message, is_read, actor,created_at,updated_at) VALUES ($1, $2, $3, false, $4,NOW(),NOW())',
        [user.id, "FIRST_LOGIN", `${user.username} logged in for the first time`, "user",]
      );

      // 🔔 USER notification
      await pool.query(
        'INSERT INTO notifications (user_id, type, message, is_read, actor,created_at,updated_at) VALUES ($1, $2, $3, false, $4,NOW(),NOW())',
         [user.id, "FIRST_LOGIN", "Welcome to UptoSkills AI Resume Builder 🎉", "system"]
      );
    }

    // update last login every time (support both standard schemas)
    try {
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    } catch(e) {
      // If column is named something else or doesn't exist, we just suppress
    }
    console.log("USER ID:", user.id);
    console.log("EMAIL:", user.email);
    const token = genrateToken(
      {
        id: user.id,
        isAdmin: user.is_admin,
      },
      rememberMe
    );

    const cookieExpiry = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 2 * 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: cookieExpiry,
    });

    res.status(200).json({
      success: true,
      token,
      userID: user.id,
      isAdmin: user.is_admin,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // future me email logic
    res.status(200).json({
      success: true,
      message: "Password reset link sent (simulated)",
    });
  } catch (error) {
    res.status(500).json({
      message: "Forgot password failed",
      error: error.message,
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

    const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPass, userId]);

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Change password failed",
      error: error.message,
    });
  }
};
