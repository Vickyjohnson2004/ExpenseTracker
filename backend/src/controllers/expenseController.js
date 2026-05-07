import expenseModel from "../models/expenseModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// add expense
export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All field are required.",
      });
    }

    const newExpense = new expenseModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });
    await newExpense.save();

    res.json({
      success: true,
      message: "Expense added successfully!",
    });
  } catch (error) {
    console.log(error || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to get all expense
export async function getAllExpense(req, res) {
  const userId = req.user._id;
  try {
    const expenses = (await expenseModel.find({ userId })).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.log(error || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to update expense
export async function updateExpense(req, res) {
  const { id } = req.param;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedExpense) {
      res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense Updated successfully!",
      data: updateExpense,
    });
  } catch (error) {
    console.log(error || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to delete an expense
export async function deleteExpense(req, res) {
  try {
    const expense = await expenseModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!expense) {
      res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({
      success: true,
      message: "Expense deleted successfully!",
    });
  } catch (error) {
    console.log(error || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to download the data in an excel sheet || download excel for expense
export async function downloadExpenseExcel(params) {
  const userId = req.user._id;
  try {
    const expense = (await incomeModel.find({ userId })).toSorted({ date: -1 });
    const plainData = expense.map((exp) => ({
      Description: exp.description,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
    XLSX.writefile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    console.log(error || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to get expense overview
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

    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expenses.length > 0 ? totalExpense / expenses.length : 0;
    const numberOfTransactions = expenses.length;

    const recentTransactions = expenses.slice(0, 5);

    return res.json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.log(error || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
