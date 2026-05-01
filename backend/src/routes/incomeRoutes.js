import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addIcome,
  deleteIncome,
  downloadIncomeExcel,
  getAllIncome,
  getIcomeOverview,
  updateIncome,
} from "../controllers/incomeController.js";

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIcome);
incomeRouter.get("/get", authMiddleware, getAllIncome);

incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.get("/downloadexcel", authMiddleware, downloadIncomeExcel);

incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);
incomeRouter.get("/overview", authMiddleware, getIcomeOverview);

export default incomeRouter;
