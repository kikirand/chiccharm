const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");

// Get previous orders for logged-in user
router.get("/", async (req, res) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            "your_jwt_secret"
        );

        const userId = Number(decoded.id);
        console.log("Creating order for user:", userId);
        const [orders] = await db.query(
            `
            SELECT
                order_id,
                user_id,
                address_id,
                order_status,
                subtotal,
                shipping_fee,
                total_amount,
                payment_method,
                created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY order_id DESC
            `,
            [userId]
        );

        res.json(orders);

    } catch (error) {

        console.error("Fetch orders error:", error);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
});

// Create a new order
router.post("/", async (req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(
        token,
        "your_jwt_secret"
        );

        const userId = Number(decoded.id);
        console.log("Creating order for user:", userId);
        console.log("ORDER USER ID:", userId);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                message: "Invalid user ID in token"
            });
        }

        const { address_id, cart, payment_method } = req.body;

        console.log("ORDER REQUEST:");
        console.log("USER ID:", userId);
        console.log("ADDRESS ID:", address_id);
        console.log("PAYMENT METHOD:", payment_method);
        console.log("CART:", cart);

        // Basic validation
        if (!address_id) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let subtotal = 0;
        const orderItems = [];

        // Check every product in the cart
        for (const item of cart) {
            const productId = Number(item.product_id);
            const quantity = Number(item.quantity);

            if (!productId || !quantity || quantity < 1) {
                return res.status(400).json({
                    message: "Invalid cart item"
                });
            }

            const [products] = await db.query(
                `SELECT product_id, price, stock_quantity, is_active
                 FROM products
                 WHERE product_id = ?`,
                [productId]
            );

            if (products.length === 0) {
                return res.status(400).json({
                    message: `Product ${productId} not found`
                });
            }

            const product = products[0];

            if (!product.is_active) {
                return res.status(400).json({
                    message: `Product ${productId} is not available`
                });
            }

            if (product.stock_quantity < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${productId}`
                });
            }

            const unitPrice = Number(product.price);
            subtotal += unitPrice * quantity;

            orderItems.push({
                product_id: productId,
                quantity: quantity,
                unit_price: unitPrice
            });
        }

        // Shipping rule
        const shippingFee = subtotal >= 1000 ? 0 : 99;

        const totalAmount = subtotal + shippingFee;

        // Create order
        const [orderResult] = await db.query(
            `INSERT INTO orders
            (user_id, address_id, order_status, subtotal, shipping_fee, total_amount, payment_method)
            VALUES (?, ?, 'pending', ?, ?, ?, ?)`,
            [
                userId,
                address_id,
                subtotal,
                shippingFee,
                totalAmount,
                payment_method || "cod"
            ]
        );

        const orderId = orderResult.insertId;

        // Add order items
        for (const item of orderItems) {
            await db.query(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, unit_price)
                 VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.unit_price
                ]
            );
        }

        res.status(201).json({
            message: "Order created successfully",
            order_id: orderId,
            subtotal: subtotal.toFixed(2),
            shipping_fee: shippingFee.toFixed(2),
            total_amount: totalAmount.toFixed(2)
        });

    } catch (error) {
        console.error("Create order error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        res.status(500).json({
            message: "Failed to create order"
        });
    }
});

// Get logged-in user's previous orders
router.get("/", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, "your_jwt_secret");
        console.log("Creating order for user:", userId);
        const userId = Number(decoded.id);

        const [orders] = await db.query(
    `
    SELECT
        o.order_id,
        o.address_id,
        o.order_status,
        o.subtotal,
        o.shipping_fee,
        o.total_amount,
        o.payment_method,
        oi.order_item_id,
        oi.product_id,
        oi.quantity,
        oi.unit_price,
        p.product_name,
        p.image_url
    FROM orders o
    LEFT JOIN order_items oi
        ON o.order_id = oi.order_id
    LEFT JOIN products p
        ON oi.product_id = p.product_id
    WHERE o.user_id = ?
    ORDER BY o.order_id DESC, oi.order_item_id ASC
    `,
    [userId]
);
    const groupedOrders = [];

for (const row of orders) {

    let order = groupedOrders.find(
        o => o.order_id === row.order_id
    );

    if (!order) {
        order = {
            order_id: row.order_id,
            address_id: row.address_id,
            order_status: row.order_status,
            subtotal: row.subtotal,
            shipping_fee: row.shipping_fee,
            total_amount: row.total_amount,
            payment_method: row.payment_method,
            items: []
        };

        groupedOrders.push(order);
    }

    if (row.product_id) {
        order.items.push({
            product_id: row.product_id,
            product_name: row.product_name,
            image_url: row.image_url,
            quantity: row.quantity,
            unit_price: row.unit_price
        });
    }
}

        res.json(groupedOrders);

    } catch (error) {

        console.error("Fetch orders error:", error);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
});

// Cancel an order
router.patch("/:orderId/cancel", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_jwt_secret"
        );

        const userId = Number(decoded.id);
        console.log("Creating order for user:", userId);
        const orderId = Number(req.params.orderId);

        if (!orderId) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        // Make sure this order belongs to the logged-in user
        const [orders] = await db.query(
            `SELECT order_id, order_status
             FROM orders
             WHERE order_id = ? AND user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const order = orders[0];

        // Only pending/confirmed orders can be cancelled
        if (!["pending", "confirmed"].includes(order.order_status)) {
            return res.status(400).json({
                message: "This order cannot be cancelled"
            });
        }

        await db.query(
            `UPDATE orders
             SET order_status = 'cancelled'
             WHERE order_id = ? AND user_id = ?`,
            [orderId, userId]
        );

        res.json({
            message: "Order cancelled successfully",
            order_id: orderId
        });

    } catch (error) {
        console.error("Cancel order error:", error);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        res.status(500).json({
            message: "Failed to cancel order"
        });
    }
});


module.exports = router;