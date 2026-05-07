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

const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
};

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send({ status: 200, message: `server working on port ${port}` });
});

app.listen(port, () => {
  console.log(`Server running on port: http://localhost:${port}`);
});
