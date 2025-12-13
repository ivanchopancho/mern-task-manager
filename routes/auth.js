import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).send("Email already in use");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed
    });

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.log("Register error:", err);
    return res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("Login attempt for:", req.body.email);
  console.log("JWT_SECRET loaded?", Boolean(process.env.JWT_SECRET));

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Invalid password");

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;