import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/summary", isAuth, getDashboardSummary);

export default dashboardRouter;
