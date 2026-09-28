/* =========================================================
   ChicCharm — Cart Page Logic
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  // Load products from MySQL first
  if (typeof loadProductsFromDatabase === "function") {
    await loadProductsFromDatabase();
  }

  // Render cart
  renderCartPage();

  // Load shipping address
  if (typeof getAddresses === "function") {
    await loadShippingAddress();
  }

  const promoForm = document.getElementById("promo-form");

  if (promoForm) {
    promoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const code = document.getElementById("promo-code").value.trim().toUpperCase();
      const msg = document.getElementById("promo-msg");

      if (code === "CHIC10") {
        msg.textContent = "Code applied — 10% off will be reflected at checkout.";
        msg.className = "promo-msg success";
      } else {
        msg.textContent = "That code isn't valid. Try CHIC10.";
        msg.className = "promo-msg error";
      }
    });
  }

  const checkoutBtn = document.getElementById("checkout-btn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) return;
      window.location.href = "payment.html";
    });
  }
});

function renderCartPage() {
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  const empty = document.getElementById("cart-empty");
  if (!container) return;

  let cart = getCart();

// Remove cart items whose products no longer exist
const validCart = cart.filter(item => getProductById(item.id));

if (validCart.length !== cart.length) {
  cart = validCart;
  saveCart(cart);
}

if (cart.length === 0) {
    container.innerHTML = "";
    if (summary) summary.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";
  if (summary) summary.style.display = "block";

  container.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return "";
    return `
      <div class="cart-row" data-id="${p.id}" data-size="${item.size}">
        <img src="${p.image}" alt="${p.name}" class="cart-row-img">
        <div class="cart-row-info">
          <h3>${p.name}</h3>
          <p class="cart-row-meta">Size: ${item.size}</p>
          <button class="cart-remove" onclick="handleRemove(${p.id}, '${item.size}')">Remove</button>
        </div>
        <div class="cart-row-qty">
          <button onclick="handleQty(${p.id}, '${item.size}', ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button onclick="handleQty(${p.id}, '${item.size}', ${item.quantity + 1})" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-row-price">${formatPrice(p.price * item.quantity)}</div>
      </div>`;
  }).join("");

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  document.getElementById("cart-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("cart-shipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  document.getElementById("cart-total").textContent = formatPrice(subtotal + shipping);
}

function handleRemove(id, size) {
  removeFromCart(id, size);
  renderCartPage();
}

function handleQty(id, size, qty) {
  if (qty < 1) {
    handleRemove(id, size);
    return;
  }
  updateCartQuantity(id, size, qty);
  renderCartPage();
}

async function loadShippingAddress() {
  const container = document.getElementById("shipping-address");

  if (!container) return;

  try {
    const addresses = await getAddresses();

    if (!addresses || addresses.length === 0) {
      container.innerHTML = `
        <p>No saved address found.</p>
        <a href="address.html">Add an address</a>
      `;
      return;
    }

    const address = addresses.find(addr => addr.is_default) || addresses[0];

    container.innerHTML = `
      <p>
        <strong>${address.name || address.full_name || "Customer"}</strong><br>
        ${address.street}<br>
        ${address.city}, ${address.state} - ${address.pincode}<br>
        Phone: ${address.phone}
      </p>
    `;

  } catch (error) {
    console.error("Shipping address error:", error);

    container.innerHTML = `
      <p>Unable to load address.</p>
    `;
  }
}