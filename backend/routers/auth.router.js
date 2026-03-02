import express from "express";

import isAuth from "../middlewares/isAuth.js";
import {
  forgotPassword,
  login,
  register,
  changePassword,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// Example routes

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.put("/change-password", isAuth, changePassword);

export default authRouter;
