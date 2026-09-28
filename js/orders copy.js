/* =========================================================
   ChicCharm — Real Order History
   Loads orders from the backend/MySQL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

async function loadOrders() {
    const container = document.getElementById("orders-list");
    const empty = document.getElementById("orders-empty");

    if (!container) return;

    const token = localStorage.getItem("chiccharm_token");

    if (!token) {
        window.location.href = "login.html?redirect=orders.html";
        return;
    }

    try {
        const response = await fetch("/api/orders", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to load orders: ${response.status}`);
        }

        const orders = await response.json();

        console.log("Orders loaded from database:", orders);

        if (!orders || orders.length === 0) {
            container.innerHTML = "";
            container.style.display = "none";

            if (empty) {
                empty.style.display = "block";
            }

            return;
        }

        if (empty) {
            empty.style.display = "none";
        }

        container.style.display = "block";

        container.innerHTML = orders.map(order => {

            const status = order.order_status || "Pending";

            const statusClass = status
                .toLowerCase()
                .replace(/\s+/g, "-");

            const shipping =
                Number(order.shipping_fee || 0);

            const subtotal =
                Number(order.subtotal || 0);

            const total =
                Number(order.total_amount || 0);

            const payment =
                order.payment_method || "COD";

            return `
                <article class="order-card">

                    <div class="order-card-header">

                        <div>
                            <p class="order-id">
                                Order #${order.order_id}
                            </p>

                            <p class="order-date">
                                Your order
                            </p>
                        </div>

                        <span class="order-status order-status-${statusClass}">
                            ${capitalize(status)}
                        </span>

                    </div>

                    <div class="order-items">

                        <div class="order-item-row">

                            <div>
                                <p class="order-item-name">
                                    Order successfully placed
                                </p>

                                <p class="order-item-meta">
                                    Payment: ${capitalize(payment)}
                                </p>
                            </div>

                            <span class="order-item-price">
                                ${formatPrice(total)}
                            </span>

                        </div>

                    </div>

                    <div class="order-summary-details">

                        <div>
                            <span>Subtotal</span>
                            <span>${formatPrice(subtotal)}</span>
                        </div>

                        <div>
                            <span>Shipping</span>
                            <span>
                                ${shipping === 0
                                    ? "Free"
                                    : formatPrice(shipping)}
                            </span>
                        </div>

                    </div>

                    <div class="order-card-footer">

                        <span>Total</span>

                        <strong>
                            ${formatPrice(total)}
                        </strong>

                    </div>

                </article>
            `;
        }).join("");

    } catch (error) {

        console.error("Error loading orders:", error);

        container.innerHTML = `
            <div class="orders-error">
                <p>Unable to load your orders.</p>
                <button onclick="loadOrders()">
                    Try Again
                </button>
            </div>
        `;

    }
}


function formatPrice(amount) {
    return `₹${Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}


function capitalize(value) {
    if (!value) return "";

    return value.charAt(0).toUpperCase() +
           value.slice(1);
}