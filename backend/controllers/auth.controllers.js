import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { genrateToken } from "../config/token.js";
import { pool } from "../config/postgresdb.js";
import nodemailer from "nodemailer";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (email) email = email.trim();

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

    const vertificationCheck = await pool.query('SELECT is_verified FROM email_verifications WHERE email = $1', [email]);
    if (vertificationCheck.rowCount === 0 || !vertificationCheck.rows[0].is_verified) {
      return res.status(403).json({ message: "Email has not been verified" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const isAdmin = email === process.env.ADMIN_EMAIL;
    const newUserId = crypto.randomUUID();
    const newProfileId = crypto.randomUUID();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO users (id, username, email, password, is_admin, is_active, plan_id, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 1, NOW(), NOW())`,
        [newUserId, username, email, hashedPass, isAdmin, true]);

      await client.query(
        `INSERT INTO user_profiles (id, user_id, full_name, phone, location, bio, github, linkedin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)`,
        [newProfileId, newUserId, "", "", "", "", "", ""]
      );
      await client.query("COMMIT");

    }
    catch (error) {
      await client.query("ROLLBACK")
      console.error(error);
      throw error;
    }
    finally {
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
    } catch (e) {
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

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    await pool.query(
      `INSERT INTO password_resets (email, token, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at`,
      [email, token, expiresAt]
    );

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || '"UptoSkills AI" <no-reply@uptoskills.com>',
      to: email,
      subject: "Password Reset Request - UptoSkills AI Resume Builder",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #1a2e52;">Reset Your Password</h2>
          <p style="font-size: 16px; color: #333;">We received a request to reset the password for your account.</p>
          <p style="font-size: 14px; color: #555;">Please click the button below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
          <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link into your browser: <br/>${resetLink}</p>
          <p style="font-size: 12px; color: #999;">If you didn't request a password reset, you can safely ignore this email.</p>
          <br/>
          <p style="font-size: 14px; color: #777;">Best Regards,<br/><strong>The UptoSkills Team</strong></p>
        </div>
      `,
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email credentials missing. Check .env");
      return res.status(200).json({ success: true, message: "Simulated password reset link. Token: " + token });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({
      message: "Failed to send password reset email",
      error: error.message,
    });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const result = await pool.query(
      "SELECT * FROM password_resets WHERE token = $1",
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const resetRequest = result.rows[0];

    if (new Date() > new Date(resetRequest.expires_at)) {
      await pool.query("DELETE FROM password_resets WHERE email = $1", [resetRequest.email]);
      return res.status(400).json({ message: "Reset token has expired" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);
    
    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPass, resetRequest.email]
    );

    await pool.query(
      "DELETE FROM password_resets WHERE email = $1",
      [resetRequest.email]
    );

    res.status(200).json({ success: true, message: "Password has been successfully reset" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Failed to reset password", error: error.message });
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

/* ================= ADD: EMAIL VERIFICATION ================= */

export const sendVerificationEmail = async (req, res) => {
  try {
    let { email } = req.body;
    if (email) email = email.trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    // Upsert the token
    await pool.query(
      `INSERT INTO email_verifications (email, token, is_verified, expires_at)
       VALUES ($1, $2, FALSE, $3)
       ON CONFLICT (email) DO UPDATE SET token = EXCLUDED.token, is_verified = FALSE, expires_at = EXCLUDED.expires_at`,
      [email, token, expiresAt]
    );

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationLink = `${clientUrl}/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || '"UptoSkills AI" <no-reply@uptoskills.com>',
      to: email,
      subject: "Verify Your Email - UptoSkills AI Resume Builder",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #1a2e52;">Verify Your Email</h2>
          <p style="font-size: 16px; color: #333;">Thank you for signing up!</p>
          <p style="font-size: 14px; color: #555;">Please click the button below to verify your email address and complete your registration.</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
          <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link into your browser: <br/>${verificationLink}</p>
          <br/>
          <p style="font-size: 14px; color: #777;">Best Regards,<br/><strong>The UptoSkills Team</strong></p>
        </div>
      `,
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email credentials missing. Check .env");
      return res.status(200).json({ message: "Simulated verification. Token: " + token });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification email sent!" });
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const result = await pool.query(
      "SELECT * FROM email_verifications WHERE token = $1",
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    const verification = result.rows[0];

    if (new Date() > new Date(verification.expires_at)) {
      return res.status(400).json({ message: "Verification token has expired" });
    }

    await pool.query(
      "UPDATE email_verifications SET is_verified = TRUE WHERE email = $1",
      [verification.email]
    );

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmailToken error:", error);
    res.status(500).json({ message: "Failed to verify email", error: error.message });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const result = await pool.query(
      "SELECT is_verified FROM email_verifications WHERE email = $1",
      [email.trim()]
    );

    if (result.rowCount === 0) {
      return res.status(200).json({ is_verified: false }); // or return error if strict
    }

    res.status(200).json({ is_verified: result.rows[0].is_verified });
  } catch (error) {
    console.error("checkVerificationStatus error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
