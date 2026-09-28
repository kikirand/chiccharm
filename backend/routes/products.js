console.log("LOADED: products.js");
const express = require ('express');
const router = express.Router();

const db = require("../config/database");

// Get all products
router.get("/", async (req, res) => {
    try {
        const [results] = await db.query(`
    SELECT *
    FROM products
    WHERE is_active = TRUE
    ORDER BY product_id ASC
`);
        res.json(results);

    } catch (err) {
        console.error("Database query error:", err);

        res.status(500).json({
            message: "Failed to fetch products",
            error: err.message
        });
    }
});

router.get("/:id", async (req, res) => {

    try {

        const productId = Number(req.params.id);

        if (!Number.isInteger(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const [results] = await db.query(`
            SELECT
                p.product_id,
                p.product_name,
                p.slug,
                p.description,
                p.price,
                p.old_price,
                p.stock_quantity,
                p.size_options,
                p.color,
                p.image_url,
                p.rating,
                p.badge,
                COALESCE(c.category_name, p.category_name) AS category_name
            FROM products p
            LEFT JOIN categories c
                ON p.category_name = c.category_name
            WHERE p.product_id = ?
              AND p.is_active = TRUE
            LIMIT 1
        `, [productId]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);

    } catch (err) {

        console.error("Database query error:", err);

        res.status(500).json({
            message: "Failed to fetch product",
            error: err.message
        });
    }
});

router.get("/slug/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const [rows] = await db.query(`
    SELECT *
    FROM products
    WHERE slug = ?
    LIMIT 1
`, [slug]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("Product slug error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;