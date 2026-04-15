import express from "express";

import isAuth from "../middlewares/isAuth.js";
import {
  forgotPassword,
  login,
  register,
  changePassword,
  sendVerificationEmail,
  verifyEmailToken,
  checkVerificationStatus,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// Example routes

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.put("/change-password", isAuth, changePassword);

// Email Verification routes
authRouter.post("/send-verification", sendVerificationEmail);
authRouter.post("/verify-email", verifyEmailToken);
authRouter.get("/check-verification", checkVerificationStatus);

export default authRouter;
