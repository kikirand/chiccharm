document.addEventListener("DOMContentLoaded", async () => {
    if (typeof requireLogin === "function") {
        if (!requireLogin("orders.html")) return;
    }

    await loadOrders();
});


async function loadOrders() {
    const container = document.getElementById("orders-list");

    if (!container) {
        console.error("orders-list element not found.");
        return;
    }

    const token = localStorage.getItem("chiccharm_token");

    if (!token) {
        container.innerHTML = "<p>Please login to view your orders.</p>";
        return;
    }

    try {
        const response = await fetch("/api/orders", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        console.log("Orders received:", data);

        if (!response.ok) {
            throw new Error(data.message || "Unable to load orders");
        }

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-orders">
                    <h3>No orders yet</h3>
                    <p>Your placed orders will appear here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(order => {

            const canCancel =
                order.order_status === "pending" ||
                order.order_status === "confirmed";

            return `
                <div class="order-card">

                    <div class="order-header">
                        <div>
                            <strong>Order #${order.order_id}</strong>
                        </div>

                        <span class="order-status ${order.order_status}">
                            ${order.order_status}
                        </span>
                    </div>

                    <div class="order-details">
                        <p>
                            <strong>Order Date:</strong>
                            ${formatOrderDate(order.created_at)}
                        </p>

                        <p>
                            <strong>Subtotal:</strong>
                            ₹${Number(order.subtotal || 0).toLocaleString("en-IN")}
                        </p>

                        <p>
                            <strong>Shipping:</strong>
                            ₹${Number(order.shipping_fee || 0).toLocaleString("en-IN")}
                        </p>

                        <p>
                            <strong>Total:</strong>
                            ₹${Number(order.total_amount || 0).toLocaleString("en-IN")}
                        </p>
                    </div>

                    ${
                        canCancel
                        ? `
                            <button
                                class="cancel-order-btn"
                                onclick="cancelOrder(${order.order_id})"
                            >
                                Cancel Order
                            </button>
                        `
                        : ""
                    }

                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Load orders error:", error);

        container.innerHTML = `
            <p class="error-message">
                Unable to load your orders.
            </p>
        `;
    }
}


async function cancelOrder(orderId) {

    const confirmed = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem("chiccharm_token");

    if (!token) {
        alert("Please login again.");
        return;
    }

    try {

        const response = await fetch(
            `/api/orders/${orderId}/cancel`,
            {
                method: "PATCH",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        console.log("Cancel order response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to cancel order"
            );
        }

        alert("Order cancelled successfully.");

        // Reload orders so the status changes immediately
        await loadOrders();

    } catch (error) {

        console.error("Cancel order error:", error);

        alert(
            error.message ||
            "Unable to cancel order."
        );
    }
}


function formatOrderDate(dateString) {

    if (!dateString) {
        return "N/A";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}