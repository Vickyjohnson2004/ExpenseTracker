import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is required");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};
