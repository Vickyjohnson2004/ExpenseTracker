import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://okikevictorodinaka_db_user:ExpenseTracker@expensetracker.moubdub.mongodb.net/ExpenseTracker",
    )
    .then(() => console.log("DATABASE CONNECTED"));
};
