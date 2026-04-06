import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { pool } from "../config/postgresdb.js";
import {
  createDownload,
  countDownloads,
  listDownloads,
  listRecentActivity,
  deleteDownload,
  getDownloadPreview,
  downloadAsPDF,
  downloadAsWord
} from "../controllers/download.controller.js";

const router = express.Router();

/* =====================================================
   ROUTE DEFINITIONS (Thin Router Layer)
===================================================== */

// CREATE
router.post("/", isAuth, createDownload);

// COUNT
router.get("/count", isAuth, countDownloads);

// LIST
router.get("/", isAuth, listDownloads);

// RECENT ACTIVITY
router.get("/recent", isAuth, listRecentActivity);

// DELETE
router.delete("/:id", isAuth, deleteDownload);

// PREVIEW / GET SINGLE
router.get("/:id", isAuth, getDownloadPreview);

// DOWNLOAD FORMATS
router.get("/:id/pdf", isAuth, downloadAsPDF);
router.get("/:id/word", isAuth, downloadAsWord);



export default router;