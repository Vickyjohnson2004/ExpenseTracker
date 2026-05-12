import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// Add income
export async function addIcome(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newIcome = await incomeModel.create({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    return res.json({
      success: true,
      message: "Income added successfully!",
      data: newIcome,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Get all income
export async function getAllIncome(req, res) {
  const userId = req.user._id;

  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });

    return res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Update income
export async function updateIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.json({
      success: true,
      message: "Income updated successfully!",
      data: updatedIncome,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Delete income
export async function deleteIncome(req, res) {
  try {
    const income = await incomeModel.findByIdAndDelete(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.json({
      success: true,
      message: "Income deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Excel export
export async function downloadIncomeExcel(req, res) {
  const userId = req.user._id;

  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });

    const plainData = income.map((inc) => ({
      Description: inc.description,
      Amount: inc.amount,
      Category: inc.category,
      Date: new Date(inc.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "income");

    const filePath = "income_details.xlsx";

    XLSX.writeFile(workbook, filePath);

    return res.download(filePath);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Overview
export async function getIcomeOverview(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const incomes = await incomeModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);
    const averageIncome = incomes.length ? totalIncome / incomes.length : 0;

    return res.json({
      success: true,
      data: {
        totalIncome,
        averageIncome,
        numberOfTransactions: incomes.length,
        recentTransactions: incomes.slice(0, 9),
        range,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
