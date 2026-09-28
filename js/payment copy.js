/* =========================================================
   ChicCharm — Mock Payment / Checkout
   ---------------------------------------------------------
   No real payment gateway is connected. Submitting the form
   just validates the fields look plausible, "processes" for
   a moment, then records an order in localStorage and empties
   the cart. When a real gateway (Razorpay/Stripe/etc.) is
   added, replace handlePayment() with a call to that SDK and
   only call addOrder()/saveCart([]) after it confirms success.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!requireLogin("payment.html")) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = "shop.html";
    return;
  }

  renderOrderSummary();

  const form = document.getElementById("payment-form");
  form.addEventListener("submit", handlePayment);

  // Light formatting as the person types, purely cosmetic
  const cardInput = document.getElementById("card-number");
  cardInput.addEventListener("input", () => {
    cardInput.value = cardInput.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  });
  const expiryInput = document.getElementById("card-expiry");
  expiryInput.addEventListener("input", () => {
    let v = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + " / " + v.slice(2);
    expiryInput.value = v;
  });
});

function renderOrderSummary() {
  const cart = getCart();
  const list = document.getElementById("payment-items");
  list.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return "";
    return `
      <div class="order-item-row">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <p class="order-item-name">${p.name}</p>
          <p class="order-item-meta">Size ${item.size} · Qty ${item.quantity}</p>
        </div>
        <span class="order-item-price">${formatPrice(p.price * item.quantity)}</span>
      </div>`;
  }).join("");

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 99;
  document.getElementById("payment-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("payment-shipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  document.getElementById("payment-total").textContent = formatPrice(subtotal + shipping);
}

function handlePayment(e) {
  e.preventDefault();
  const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
  const expiry = document.getElementById("card-expiry").value;
  const cvv = document.getElementById("card-cvv").value;
  const errorEl = document.getElementById("payment-error");

  if (cardNumber.length !== 16 || !/^\d{2} \/ \d{2}$/.test(expiry) || cvv.length < 3) {
    errorEl.textContent = "Check your card details — this is a demo, so any 16-digit number and valid-looking expiry/CVV will work.";
    errorEl.classList.add("show");
    return;
  }
  errorEl.classList.remove("show");

  const payBtn = document.getElementById("pay-btn");
  payBtn.disabled = true;
  payBtn.textContent = "Processing...";

  setTimeout(() => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 2000 ? 0 : 99;
    const order = {
      id: "CC" + Math.floor(10000 + Math.random() * 89999),
      date: new Date().toISOString(),
      items: getCart(),
      total: subtotal + shipping,
      status: "Processing",
    };
    addOrder(order);
    saveCart([]);
    showSuccess(order);
  }, 1400);
}

function showSuccess(order) {
  document.getElementById("payment-form-panel").style.display = "none";
  document.getElementById("payment-success").style.display = "block";
  document.getElementById("success-order-id").textContent = order.id;
  document.getElementById("success-order-total").textContent = formatPrice(order.total);
}
document.addEventListener("DOMContentLoaded", () => {
  renderAddressOptions();

  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newAddress = {
        fullName: document.getElementById("addr-name").value.trim(),
        street: document.getElementById("addr-street").value.trim(),
        city: document.getElementById("addr-city").value.trim(),
        state: document.getElementById("addr-state").value.trim(),
        pincode: document.getElementById("addr-pincode").value.trim(),
        phone: document.getElementById("addr-phone").value.trim(),
        isDefault: document.getElementById("addr-default")?.checked || false
      };

      addAddress(newAddress);
      addressForm.reset();
      renderAddressOptions();
    });
  }
});

function renderAddressOptions() {
  const container = document.getElementById("saved-addresses-list");
  if (!container) return;

  const addresses = getAddresses();

  if (addresses.length === 0) {
    container.innerHTML = "<p>No saved addresses yet. Add one below!</p>";
    return;
  }

  container.innerHTML = addresses.map(addr => `
    <div class="address-card ${addr.isDefault ? 'default' : ''}">
      <input type="radio" name="selected_address" id="addr-${addr.id}" value="${addr.id}" ${addr.isDefault ? 'checked' : ''}>
      <label for="addr-${addr.id}">
        <strong>${addr.name || addr.full_Name}</strong> ${addr.isDefault ? '<span class="badge">Default</span>' : ''}<br>
        ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}<br>
        Phone: ${addr.phone}
      </label>
      <button type="button" class="btn-remove" onclick="handleRemoveAddress(${addr.id})">Delete</button>
    </div>
  `).join("");
}

function handleRemoveAddress(id) {
  removeAddress(id);
  renderAddressOptions();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAddressOptions();

  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newAddress = {
        fullName: document.getElementById("addr-name").value.trim(),
        street: document.getElementById("addr-street").value.trim(),
        city: document.getElementById("addr-city").value.trim(),
        state: document.getElementById("addr-state").value.trim(),
        pincode: document.getElementById("addr-pincode").value.trim(),
        phone: document.getElementById("addr-phone").value.trim(),
        isDefault: document.getElementById("addr-default")?.checked || false
      };

      await addAddress(newAddress);
      addressForm.reset();
      await renderAddressOptions();
    });
  }
});

async function renderAddressOptions() {
  const container = document.getElementById("saved-addresses-list");
  if (!container) return;

  const addresses = await getAddresses();

  if (!addresses || addresses.length === 0) {
    container.innerHTML = "<p>No saved addresses yet. Add one below!</p>";
    return;
  }

  container.innerHTML = addresses.map(addr => `
    <div class="address-card ${addr.isDefault ? 'default' : ''}">
      <input type="radio" name="selected_address" id="addr-${addr._id}" value="${addr._id}" ${addr.isDefault ? 'checked' : ''}>
      <label for="addr-${addr._id}">
        <strong>${addr.name || addr.fullName}</strong> ${addr.isDefault ? '<span class="badge">Default</span>' : ''}<br>
        ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}<br>
        Phone: ${addr.phone}
      </label>
      <button type="button" class="btn-remove" onclick="handleRemoveAddress('${addr._id}')">Delete</button>
    </div>
  `).join("");
}

async function handleRemoveAddress(id) {
  await removeAddress(id);
  await renderAddressOptions();
}