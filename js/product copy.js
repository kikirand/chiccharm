/* =========================================================
   ChicCharm — Product Detail Page Logic
   ========================================================= */

let selectedSize = null;
let selectedQty = 1;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = getProductById(id) || PRODUCTS[0];
  renderProduct(product);
  renderRelated(product);
});

function renderProduct(p) {
  selectedSize = p.sizes[0];
  selectedQty = 1;

  document.title = `${p.name} · ChicCharm`;
  document.getElementById("product-image").src = p.image;
  document.getElementById("product-image").alt = p.name;
  document.getElementById("breadcrumb-category").textContent = p.category;
  document.getElementById("breadcrumb-category").href = `shop.html?category=${encodeURIComponent(p.category)}`;
  document.getElementById("breadcrumb-name").textContent = p.name;
  document.getElementById("product-category").textContent = p.category;
  document.getElementById("product-name").textContent = p.name;
  document.getElementById("product-rating").innerHTML = `${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <span>${p.rating} · Verified buyer ratings</span>`;
  document.getElementById("product-description").textContent = p.description;

  const priceEl = document.getElementById("product-price");
  priceEl.innerHTML = p.oldPrice
    ? `${formatPrice(p.price)} <span class="old-price">${formatPrice(p.oldPrice)}</span>`
    : formatPrice(p.price);

  const badgeEl = document.getElementById("product-badge");
  if (p.badge) {
    badgeEl.textContent = p.badge;
    badgeEl.className = `badge badge-${p.badge.toLowerCase()}`;
    badgeEl.style.display = "inline-block";
  } else {
    badgeEl.style.display = "none";
  }

  const sizeContainer = document.getElementById("size-options");
  sizeContainer.innerHTML = p.sizes.map((s, i) =>
    `<button class="size-btn ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`
  ).join("");
  sizeContainer.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sizeContainer.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.dataset.size;
    });
  });

  document.getElementById("qty-value").textContent = selectedQty;
  document.getElementById("qty-decrease").onclick = () => {
    selectedQty = Math.max(1, selectedQty - 1);
    document.getElementById("qty-value").textContent = selectedQty;
  };
  document.getElementById("qty-increase").onclick = () => {
    selectedQty += 1;
    document.getElementById("qty-value").textContent = selectedQty;
  };

  const addBtn = document.getElementById("add-to-cart-btn");
  addBtn.onclick = () => {
    addToCart(p.id, selectedSize, selectedQty);
    addBtn.textContent = "Added to Bag ✓";
    setTimeout(() => (addBtn.textContent = "Add to Bag"), 1500);
  };
}

function renderRelated(p) {
  const container = document.getElementById("related-products");
  if (!container) return;
  const related = PRODUCTS.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4);
  container.innerHTML = related.map(r => `
    <article class="product-card">
      <a href="product.html?id=${r.id}" class="product-card-media">
        <img src="${r.image}" alt="${r.name}" loading="lazy">
      </a>
      <div class="product-card-body">
        <p class="product-category">${r.category}</p>
        <h3 class="product-name"><a href="product.html?id=${r.id}">${r.name}</a></h3>
        <div class="product-price-row"><span class="price">${formatPrice(r.price)}</span></div>
      </div>
    </article>`).join("");
}
