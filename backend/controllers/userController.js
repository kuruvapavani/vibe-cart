import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Password validation function
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  // At least 6 chars, 1 lowercase, 1 uppercase, 1 number
  return regex.test(password);
};

// POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
