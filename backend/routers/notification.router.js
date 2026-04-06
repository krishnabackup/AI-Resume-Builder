import express from "express";
import isAuth from "../middlewares/isAuth.js";

import {
  getUserNotifications,
  markUserNotificationsRead,
  getAdminNotifications,
  markAdminNotificationsRead,
  markNotificationRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

/* -------- USER NOTIFICATIONS -------- */
router.get("/user", isAuth, getUserNotifications);
router.put("/user/read-all", isAuth, markUserNotificationsRead);

/* -------- ADMIN NOTIFICATIONS -------- */
router.get("/admin", isAuth, getAdminNotifications);
router.post("/admin/mark-all-read", isAuth, markAdminNotificationsRead);
router.delete("/admin/delete-all", isAuth, deleteAllNotifications);

/* -------- INDIVIDUAL NOTIFICATION ACTIONS -------- */
router.put("/:id/read", isAuth, markNotificationRead);
router.delete("/:id", isAuth, deleteNotification);


export default router;
