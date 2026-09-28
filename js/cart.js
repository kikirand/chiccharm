/* =========================================================
   ChicCharm — Cart Logic
   ---------------------------------------------------------
   Uses localStorage so the cart works with zero backend.
   When a real database/auth system is added, swap the
   three functions below (getCart, saveCart, and the calls
   to them) for API requests to something like:
     GET  /api/cart
     POST /api/cart/add
     POST /api/cart/remove
   The rest of the site (badge counter, cart page rendering)
   can stay exactly the same.
   ========================================================= */

const CART_KEY = "chiccharm_cart";

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, size, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, size, quantity });
  }
  saveCart(cart);
}

function removeFromCart(productId, size) {
  const cart = getCart().filter(item => !(item.id === productId && item.size === size));
  saveCart(cart);
}

function updateCartQuantity(productId, size, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId && i.size === size);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const product = getProductById(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = getCartCount();
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
