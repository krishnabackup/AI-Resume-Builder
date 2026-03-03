import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { genrateToken } from "../config/token.js";
import Notification from "../Models/notification.js";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // admin sirf backend se decide hoga
    const isAdmin = email === process.env.ADMIN_EMAIL;

    const newUser = new User({
      username,
      email,
      password: hashedPass,
      isAdmin,
      isActive: true,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive === false) {
      return res
        .status(403)
        .json({ message: "Your account is deactivated" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ---------- FIRST TIME LOGIN ---------- */
    if (!user.lastLogin) {
      // 🔔 ADMIN notification
      await Notification.create({
        type: "FIRST_LOGIN",
        message: `${user.username} logged in for the first time`,
        userId: user._id,
        actor: "user",
      });

      // 🔔 USER notification
      await Notification.create({
        type: "FIRST_LOGIN",
        message: "Welcome to UptoSkills AI Resume Builder 🎉",
        userId: user._id,
        actor: "system",
      });
    }

    // update last login every time
    user.lastLogin = new Date();
    await user.save();

    const token = genrateToken(
      {
        id: user._id,
        isAdmin: user.isAdmin,
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
      userID: user._id,
      isAdmin: user.isAdmin,
      message: "Login successful",
    });
  } catch (error) {
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

    const user = await User.findOne({ email });
    if (!user) {
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    await user.save();


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
