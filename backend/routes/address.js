const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");

// GET /api/addresses — Fetch all addresses
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM addresses");
    res.json(rows);
  } catch (err) {
    console.error("Fetch Addresses Error:", err);
    res.status(500).json({ error: "Failed to fetch addresses from database" });
  }
});

// POST /api/addresses — Save address
router.post("/", async (req, res) => {
  try {
    const fullName = req.body.fullName || req.body.full_name;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;
    const phone = req.body.phone;
    const isDefault = req.body.isDefault || req.body.is_default || false;

    // Use logged-in user's ID or check user existence
    const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ error: "Authentication required" });
}

const token = authHeader.split(" ")[1];

const decoded = jwt.verify(
  token,
  "your_jwt_secret"
);

const userId = decoded.user_id;

    if (!fullName || !street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
  INSERT INTO addresses
  (user_id, name, street, city, state, pincode, phone, is_default)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
    const [result] = await db.query(sql, [
      userId,
      fullName,
      street,
      city,
      state,
      pincode,
      phone,
      isDefault ? 1 : 0
    ]);

    res.status(201).json({ message: "Address saved successfully", address_id: result.insertId });
  } catch (err) {
    // Print full error details in terminal to identify foreign key or column mismatches
    console.error("Save Address MySQL Error:", err);
    res.status(500).json({ error: err.message || "Database error saving address" });
  }
});

// DELETE /api/addresses/:id
router.delete("/:id", async (req, res) => {
  const addressId = parseInt(req.params.id, 10);

  if (!addressId || isNaN(addressId)) {
    return res.status(400).json({ error: "Invalid address ID" });
  }

  try {
    // Changed 'id' to 'address_id'
    const sql = "DELETE FROM addresses WHERE address_id = ?";
    const [result] = await db.query(sql, [addressId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete Address MySQL Error:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;