import expenseModel from "../models/expenseModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// Add expense
export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newExpense = await expenseModel.create({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    return res.json({
      success: true,
      message: "Expense added successfully!",
      data: newExpense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Get all expense
export async function getAllExpense(req, res) {
  const userId = req.user._id;

  try {
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

    return res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Update expense
export async function updateExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({
      success: true,
      message: "Expense updated successfully!",
      data: updatedExpense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// Delete expense
export async function deleteExpense(req, res) {
  try {
    const expense = await expenseModel.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({
      success: true,
      message: "Expense deleted successfully!",
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
export async function downloadExpenseExcel(req, res) {
  const userId = req.user._id;

  try {
    const expense = await expenseModel.find({ userId }).sort({ date: -1 });

    const plainData = expense.map((exp) => ({
      Description: exp.description,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "expense");

    const filePath = "expense_details.xlsx";

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
export async function getexpenseOverview(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const expenses = await expenseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
    const averageExpense = expenses.length ? totalExpense / expenses.length : 0;

    return res.json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions: expenses.length,
        recentTransactions: expenses.slice(0, 5),
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
