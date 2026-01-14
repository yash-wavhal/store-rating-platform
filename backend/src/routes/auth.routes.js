import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { validateSignup, validatePasswordUpdate } from "../middleware/validation.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
  });
});

/* Signup */
router.post("/signup", validateSignup, async (req, res) => {
  const { name, email, address, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,address,password,role)
     VALUES($1,$2,$3,$4,'USER')
     RETURNING id, role`,
    [name, email, address, hashed]
  );

  const token = jwt.sign(
    { id: result.rows[0].id, role: result.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // true in production (HTTPS)
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Signup successful" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // true in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ role: user.role });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.put("/password", validatePasswordUpdate, async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [hashed, req.user.id]
  );

  res.json({ message: "Password updated" });
});

export default router;