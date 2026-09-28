const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require("./config/database");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const addressRouter = require("./routes/address");

const app = express();


app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "..", "images")));
app.use(express.static(path.join(__dirname, '..')));


// Test route to check if the server is running

app.get('/', (req, res) => {
    res.json({
        message: 'ChicCharm API is running'
    });
});

// Products API routes
console.log("Product routes loaded successfully");

app.get("/product/:slug", (req, res) => {
    res.sendFile(path.join(__dirname, "../product.html"));
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRouter);
// Start the server
const PORT = 5000;

app.get("/product/:slug", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "product.html"));
});

app.listen(PORT, () => {
    console.log(`ChicCharm server running on http://localhost:${PORT}`);
});