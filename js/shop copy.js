/* =========================================================
   ChicCharm — Shop / Catalog Page Logic
   ========================================================= */

let currentFilters = {
  categories: new Set(),
  maxPrice: 6000,
  search: "",
  sort: "featured",
};

let visibleCount = 12;
const PAGE_SIZE = 12;

document.addEventListener("DOMContentLoaded", () => {
  buildCategoryFilters();
  bindControls();
  applyURLCategory();
  renderProducts();
});

function buildCategoryFilters() {
  const container = document.getElementById("category-filters");
  if (!container) return;
  getAllCategories().forEach(cat => {
    const id = "cat-" + cat.toLowerCase().replace(/\s+/g, "-");
    const wrapper = document.createElement("label");
    wrapper.className = "filter-checkbox";
    wrapper.innerHTML = `<input type="checkbox" value="${cat}" id="${id}"> ${cat}`;
    container.appendChild(wrapper);
  });
  container.addEventListener("change", (e) => {
    if (e.target.matches("input[type=checkbox]")) {
      if (e.target.checked) currentFilters.categories.add(e.target.value);
      else currentFilters.categories.delete(e.target.value);
      visibleCount = PAGE_SIZE;
      renderProducts();
    }
  });
}

function applyURLCategory() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("category");
  if (cat) {
    currentFilters.categories.add(cat);
    const checkbox = document.querySelector(`#category-filters input[value="${cat}"]`);
    if (checkbox) checkbox.checked = true;
  }
}

function bindControls() {
  const search = document.getElementById("shop-search");
  if (search) {
    search.addEventListener("input", (e) => {
      currentFilters.search = e.target.value.trim().toLowerCase();
      visibleCount = PAGE_SIZE;
      renderProducts();
    });
  }

  const sort = document.getElementById("shop-sort");
  if (sort) {
    sort.addEventListener("change", (e) => {
      currentFilters.sort = e.target.value;
      renderProducts();
    });
  }

  const priceRange = document.getElementById("price-range");
  const priceLabel = document.getElementById("price-range-label");
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      currentFilters.maxPrice = Number(e.target.value);
      if (priceLabel) priceLabel.textContent = formatPrice(currentFilters.maxPrice);
      visibleCount = PAGE_SIZE;
      renderProducts();
    });
  }

  const clearBtn = document.getElementById("clear-filters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      currentFilters = { categories: new Set(), maxPrice: 6000, search: "", sort: "featured" };
      document.querySelectorAll("#category-filters input").forEach(c => c.checked = false);
      if (search) search.value = "";
      if (priceRange) priceRange.value = 6000;
      if (priceLabel) priceLabel.textContent = formatPrice(6000);
      if (sort) sort.value = "featured";
      visibleCount = PAGE_SIZE;
      renderProducts();
    });
  }

  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += PAGE_SIZE;
      renderProducts();
    });
  }
}

function getFilteredProducts() {
  let list = PRODUCTS.filter(p => {
    const matchesCategory = currentFilters.categories.size === 0 || currentFilters.categories.has(p.category);
    const matchesPrice = p.price <= currentFilters.maxPrice;
    const matchesSearch = !currentFilters.search || p.name.toLowerCase().includes(currentFilters.search) || p.category.toLowerCase().includes(currentFilters.search);
    return matchesCategory && matchesPrice && matchesSearch;
  });

  switch (currentFilters.sort) {
    case "price-low":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break; // featured = original order
  }
  return list;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const resultsCount = document.getElementById("results-count");
  const loadMoreBtn = document.getElementById("load-more");
  if (!grid) return;

  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map(productCardHTML).join("") ||
    `<p class="empty-state">No pieces match those filters yet — try widening your search.</p>`;

  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`;
  }

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount < filtered.length ? "inline-flex" : "none";
  }
}

function productCardHTML(p) {
  const badge = p.badge ? `<span class="badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : "";
  const oldPrice = p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : "";
  return `
    <article class="product-card">
      <a href="product.html?id=${p.id}" class="product-card-media">
        ${badge}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </a>
      <div class="product-card-body">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating" aria-label="Rated ${p.rating} out of 5">${starString(p.rating)} <span>${p.rating}</span></div>
        <div class="product-price-row">
          <span class="price">${formatPrice(p.price)}</span>
          ${oldPrice}
        </div>
        <button class="btn btn-outline btn-sm add-to-cart-quick" onclick="addToCart(${p.id}, '${p.sizes[0]}', 1); this.textContent='Added ✓'; setTimeout(()=>this.textContent='Quick Add', 1200)">Quick Add</button>
      </div>
    </article>`;
}

function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
