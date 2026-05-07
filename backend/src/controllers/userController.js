import User from "../models/userModel.js";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = process.env.JWT_EXPIRES || "24h";

const getJwtSecret = () => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return JWT_SECRET;
};

const createToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: TOKEN_EXPIRES });

// REGISTER A USER

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      sucess: false,
      message: "Invalid Email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be atleast of 8 characters.",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "User already present",
      });
    }

    const hashed = await bcryptjs.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err || err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to login a user

export async function LoginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Both fields are required.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const match = await bcryptjs.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user._id);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err || err.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// TO GET LOGGEDIN USER
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("name email");
    console.log("working");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err || err.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to update user profile
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email || !validator.isEmail(email)) {
    return res.json({
      success: false,
      message: "Valid email and name required.",
    });
  }

  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" },
    );

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err || err.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// to change user password
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password invalid or too short.",
    });
  }

  try {
    const user = await User.findById(req.user.id).select("password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const match = await bcryptjs.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcryptjs.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password changed.",
    });
  } catch (err) {
    console.log(err || err.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
