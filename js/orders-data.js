/* =========================================================
   ChicCharm — Order Storage (shared)
   ---------------------------------------------------------
   Used by both payment.js (to record a new order) and
   orders.js (to list past orders). Kept separate from
   orders.js so the payment page doesn't pull in that page's
   login-redirect/rendering logic.

   Swap for real API calls later, e.g.:
     POST /api/orders        (create — called from payment.js)
     GET  /api/orders        (list — called from orders.js)
   ========================================================= */

const ORDERS_KEY = "chiccharm_orders";

function getOrders() {
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}
