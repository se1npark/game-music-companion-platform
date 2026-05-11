import { Router } from "express";
import { getDashboardStats } from "../data/seed.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", (_req, res) => {
  res.json({ data: getDashboardStats() });
});
