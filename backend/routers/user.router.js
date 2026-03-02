import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getDashboardData,
  getAllUsers,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
  getAdminDashboardStats,
  getAnalyticsStats,
  getUserName,
  requestAdminAccess,
  approveAdminRequest,
  rejectAdminRequest
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// ---- User Routes ----
userRouter.get("/dashboard", isAuth, getDashboardData);
// profile (self)
userRouter.get("/profile", isAuth, getProfile);
userRouter.put("/profile", isAuth, updateProfile);
userRouter.put("/password", isAuth, changePassword);
userRouter.get("/profile/:id", isAuth, getUserName);
userRouter.post("/request-admin", isAuth, requestAdminAccess);

// ---- Admin Stats Routes (STATIC FIRST) ----
userRouter.get("/dashboard-stat", isAuth, getAdminDashboardStats);
userRouter.get("/analytics-stat", isAuth, getAnalyticsStats);

// ---- Admin User Routes (DYNAMIC LAST) ----
userRouter.get("/", isAuth, getAllUsers);
userRouter.put("/:id", isAuth, updateUser);
userRouter.delete("/:id", isAuth, deleteUser);
userRouter.put("/approve-admin/:id", isAuth, approveAdminRequest);
userRouter.put("/reject-admin/:id", isAuth, rejectAdminRequest);

export default userRouter;
