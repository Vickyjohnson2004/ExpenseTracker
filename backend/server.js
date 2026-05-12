import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./src/config/db.js";

import userRouter from "./src/routes/userRoutes.js";
import incomeRouter from "./src/routes/incomeRoutes.js";
import expenseRouter from "./src/routes/expenseRoutes.js";
import dashboardRouter from "./src/routes/dashboardRoute.js";

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   ENVIRONMENT
========================= */
const isProduction = process.env.NODE_ENV === "production";

/* =========================
   ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://expense-tracker-three-beta-41.vercel.app",
];

/* =========================
   CORS OPTIONS (PRODUCTION SAFE)
========================= */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow mobile apps, Postman, server-to-server
    if (!origin) return callback(null, true);

    // Strict match (NOT startsWith — safer)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

/* =========================
   MIDDLEWARES
========================= */
app.use(cors(corsOptions));

// Handle preflight requests properly
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully 🚀",
    environment: isProduction ? "production" : "development",
  });
});

/* =========================
   GLOBAL ERROR HANDLER (IMPORTANT)
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   VERCEL EXPORT
========================= */
export default app;
