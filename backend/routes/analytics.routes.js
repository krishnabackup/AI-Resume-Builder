import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import isAuth from "../middlewares/isAuth.js";
import { getTopViewedPages, trackPageView } from "../controllers/analytics.controller.js";

const analyticsRouter = express.Router();

// Optional auth: attach req.userId when token is valid, but do not block anonymous tracking.
const optionalAuth = (req, _res, next) => {
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      req.userId = decoded.id;
    }

    return next();
  } catch (_error) {
    return next();
  }
};

analyticsRouter.post("/analytics/page-view", optionalAuth, trackPageView);
analyticsRouter.get("/admin/top-pages", isAuth, getTopViewedPages);

export default analyticsRouter;
