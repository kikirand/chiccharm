// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // <--- CHANGE THIS FROM "bcrypt" TO "bcryptjs"
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [name, email, hashedPassword]);

    const newUserId = result.insertId;
    const userId = user.user_id;
    
    const token = jwt.sign(
    { id: UserId, email: user.email },
    "your_jwt_secret",
    { expiresIn: "7d" }
);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: newUserId, name, email }
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message || "Unable to create account" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email and password" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const userId = user.user_id;
    console.log("LOGIN USER ID:", userId); // Debugging line to check user ID
    const token = jwt.sign(
    { id: userId, email: user.email },
    "your_jwt_secret",
    { expiresIn: "7d" }
);
  res.status(200).json({
    message: "Logged in successfully",
    token,
    user: {
        id: userId,
        name: user.name,
        email: user.email
    }
});
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message || "Server error during login" });
  }
});

module.exports = router;