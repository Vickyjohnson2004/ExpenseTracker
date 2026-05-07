import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    // Get token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized or token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user
    req.user = user;

    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
