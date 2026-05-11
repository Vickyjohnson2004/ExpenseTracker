import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./src/config/db.js";

import userRouter from "./src/routes/userRoutes.js";
import incomeRouter from "./src/routes/incomeRoutes.js";
import expenseRouter from "./src/routes/expenseRoutes.js";
import dashboardRouter from "./src/routes/dashboardRoute.js";

const app = express();

const port = Number(process.env.PORT) || 4000;

// ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://expense-tracker-three-beta-41.vercel.app",
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // ALLOW REST TOOLS / POSTMAN / MOBILE APPS
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: `Server running on port ${port}`,
  });
});

// SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
