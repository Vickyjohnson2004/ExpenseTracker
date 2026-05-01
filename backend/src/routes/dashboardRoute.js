import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getDashBoardOverview } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", authMiddleware, getDashBoardOverview);

export default dashboardRouter;
