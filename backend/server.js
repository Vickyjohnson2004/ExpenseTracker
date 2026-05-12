import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./src/config/db.js";

import userRouter from "./src/routes/userRoutes.js";
import incomeRouter from "./src/routes/incomeRoutes.js";
import expenseRouter from "./src/routes/expenseRoutes.js";
import dashboardRouter from "./src/routes/dashboardRoute.js";

const app = express();

// CONNECT DATABASE
connectDB();

// ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://expense-tracker-three-beta-41.vercel.app",
  "https://expense-tracker-ld5u5bkbe-victor-johnsons-projects.vercel.app",
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // ALLOW POSTMAN / MOBILE APPS
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully",
  });
});

// IMPORTANT FOR VERCEL
export default app;
