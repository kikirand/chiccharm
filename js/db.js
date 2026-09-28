/* ==========================================================================
   ChicCharm — Mock database layer (localStorage)
   ---------------------------------------------------------------------
   This file simulates the three tables a real backend would keep in a
   database like MySQL/MongoDB:
     users   -> { name, email, password, joined }
     cart    -> { productId, size, qty }        (per-browser, not per-user)
     orders  -> { id, email, items[], address, payment, total, status, date }
   Everything is read/written through the functions below, the same way
   the rest of the app would call an API in a production version. See
   README.md for notes on swapping this for a real Node.js + database
   backend.
   ========================================================================== */

const DB_KEYS = { USERS: "cc_users", CART: "cc_cart", ORDERS: "cc_orders", SESSION: "cc_session" };

function dbRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("ChicCharm DB read error:", e);
    return fallback;
  }
}

function dbWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("ChicCharm DB write error:", e);
    return false;
  }
}

/* ---------------- Users table ---------------- */
function dbGetUsers() { return dbRead(DB_KEYS.USERS, []); }
function dbSaveUsers(users) { return dbWrite(DB_KEYS.USERS, users); }

/* ---------------- Cart table ---------------- */
function dbGetCart() { return dbRead(DB_KEYS.CART, []); }
function dbSaveCart(cart) { return dbWrite(DB_KEYS.CART, cart); }

/* ---------------- Orders table ---------------- */
function dbGetOrders() { return dbRead(DB_KEYS.ORDERS, []); }
function dbSaveOrders(orders) { return dbWrite(DB_KEYS.ORDERS, orders); }

/* ---------------- Session (who is logged in) ---------------- */
function dbGetSession() { return dbRead(DB_KEYS.SESSION, null); }
function dbSetSession(session) { return dbWrite(DB_KEYS.SESSION, session); }
function dbClearSession() { localStorage.removeItem(DB_KEYS.SESSION); }
