/* =========================================================
   ChicCharm — Shop / Catalog
   ========================================================= */

let currentFilters = {
    categories: new Set(),
    maxPrice: 6000,
    search: "",
    sort: "featured"
};

const PAGE_SIZE = 12;
let visibleCount = PAGE_SIZE;


/* =========================================================
   INITIALIZE SHOP
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Shop page loading...");

    await loadProductsFromDatabase();

    console.log(
        "Products available to shop:",
        PRODUCTS.length
    );

    buildCategoryFilters();

    bindControls();

    applyURLCategory();

    renderProducts();
});


/* =========================================================
   CATEGORY FILTERS
   ========================================================= */

function buildCategoryFilters() {

    const container =
        document.getElementById("category-filters");

    if (!container) return;

    container.innerHTML = "";

    getAllCategories().forEach(category => {

        const id =
            "cat-" +
            category
                .toLowerCase()
                .replace(/\s+/g, "-");

        const label =
            document.createElement("label");

        label.className = "filter-checkbox";

        label.innerHTML = `
            <input
                type="checkbox"
                value="${category}"
                id="${id}"
            >
            ${category}
        `;

        container.appendChild(label);
    });

    container.addEventListener("change", event => {

        if (!event.target.matches(
            "input[type='checkbox']"
        )) {
            return;
        }

        if (event.target.checked) {

            currentFilters.categories.add(
                event.target.value
            );

        } else {

            currentFilters.categories.delete(
                event.target.value
            );
        }

        visibleCount = PAGE_SIZE;

        renderProducts();
    });
}


/* =========================================================
   URL CATEGORY
   ========================================================= */

function applyURLCategory() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");

    if (!category) return;

    currentFilters.categories.add(category);

    const checkbox =
        document.querySelector(
            `#category-filters input[value="${category}"]`
        );

    if (checkbox) {
        checkbox.checked = true;
    }
}


/* =========================================================
   CONTROLS
   ========================================================= */

function bindControls() {

    const search =
        document.getElementById("shop-search");

    if (search) {

        search.addEventListener(
            "input",
            event => {

                currentFilters.search =
                    event.target.value
                        .trim()
                        .toLowerCase();

                visibleCount = PAGE_SIZE;

                renderProducts();
            }
        );
    }


    const sort =
        document.getElementById("shop-sort");

    if (sort) {

        sort.addEventListener(
            "change",
            event => {

                currentFilters.sort =
                    event.target.value;

                renderProducts();
            }
        );
    }


    const priceRange =
        document.getElementById("price-range");

    const priceLabel =
        document.getElementById(
            "price-range-label"
        );

    if (priceRange) {

        priceRange.addEventListener(
            "input",
            event => {

                currentFilters.maxPrice =
                    Number(event.target.value);

                if (priceLabel) {

                    priceLabel.textContent =
                        formatPrice(
                            currentFilters.maxPrice
                        );
                }

                visibleCount = PAGE_SIZE;

                renderProducts();
            }
        );
    }


    const clearButton =
        document.getElementById(
            "clear-filters"
        );

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                currentFilters = {
                    categories: new Set(),
                    maxPrice: 6000,
                    search: "",
                    sort: "featured"
                };

                document
                    .querySelectorAll(
                        "#category-filters input"
                    )
                    .forEach(input => {
                        input.checked = false;
                    });

                if (search) {
                    search.value = "";
                }

                if (priceRange) {
                    priceRange.value = 6000;
                }

                if (priceLabel) {
                    priceLabel.textContent =
                        formatPrice(6000);
                }

                if (sort) {
                    sort.value = "featured";
                }

                visibleCount = PAGE_SIZE;

                renderProducts();
            }
        );
    }


    const loadMore =
        document.getElementById("load-more");

    if (loadMore) {

        loadMore.addEventListener(
            "click",
            () => {

                visibleCount += PAGE_SIZE;

                renderProducts();
            }
        );
    }
}


/* =========================================================
   FILTER PRODUCTS
   ========================================================= */

function getFilteredProducts() {

    let list = PRODUCTS.filter(product => {

        const categoryMatch =
            currentFilters.categories.size === 0 ||
            currentFilters.categories.has(
                product.category
            );

        const priceMatch =
            product.price <=
            currentFilters.maxPrice;

        const searchMatch =
            !currentFilters.search ||
            product.name
                .toLowerCase()
                .includes(
                    currentFilters.search
                ) ||
            product.category
                .toLowerCase()
                .includes(
                    currentFilters.search
                );

        return (
            categoryMatch &&
            priceMatch &&
            searchMatch
        );
    });


    switch (currentFilters.sort) {

        case "price-low":

            list.sort(
                (a, b) => a.price - b.price
            );

            break;


        case "price-high":

            list.sort(
                (a, b) => b.price - a.price
            );

            break;


        case "rating":

            list.sort(
                (a, b) => b.rating - a.rating
            );

            break;
    }

    return list;
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        document.getElementById(
            "product-grid"
        );

    const resultsCount =
        document.getElementById(
            "results-count"
        );

    const loadMore =
        document.getElementById(
            "load-more"
        );

    if (!grid) return;


    const filtered =
        getFilteredProducts();

    const productsToShow =
        filtered.slice(
            0,
            visibleCount
        );


    grid.innerHTML =
        productsToShow.length > 0
            ? productsToShow
                .map(productCardHTML)
                .join("")
            : `
                <p class="empty-state">
                    No products found.
                </p>
              `;


    if (resultsCount) {

        resultsCount.textContent =
            `${filtered.length} item${
                filtered.length !== 1
                    ? "s"
                    : ""
            }`;
    }


    if (loadMore) {

        loadMore.style.display =
            visibleCount < filtered.length
                ? "inline-flex"
                : "none";
    }
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function productCardHTML(product) {

    const badge =
        product.badge
            ? `
                <span class="badge">
                    ${product.badge}
                </span>
              `
            : "";


    const oldPrice =
        product.oldPrice
            ? `
                <span class="old-price">
                    ${formatPrice(
                        product.oldPrice
                    )}
                </span>
              `
            : "";


    const image =
        product.image ||
        "";


    return `
        <article class="product-card">

            <a
                href="product/${encodeURIComponent(product.slug || product.id)}"
                class="product-card-media"
            >

                ${badge}

                <img
                    src="${image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.style.display='none';
                    "
                >

            </a>


            <div class="product-card-body">

                <p class="product-category">
                    ${product.category}
                </p>


                <h3 class="product-name">

                    <a
                        href="product/${encodeURIComponent(product.slug || product.id)}"
                    >
                        ${product.name}
                    </a>

                </h3>


                <div class="product-rating">

                    ${starString(
                        product.rating
                    )}

                    <span>
                        ${product.rating}
                    </span>

                </div>


                <div class="product-price-row">

                    <span class="price">
                        ${formatPrice(
                            product.price
                        )}
                    </span>

                    ${oldPrice}

                </div>


                <button
                    class="btn btn-outline btn-sm"
                    onclick="
                        addToCart(
                            ${product.id},
                            '${product.sizes[0] || ""}',
                            1
                        );

                        this.textContent='Added ✓';

                        setTimeout(
                            () =>
                                this.textContent='Quick Add',
                            1200
                        );
                    "
                >
                    Quick Add
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   STARS
   ========================================================= */

function starString(rating) {

    const full =
        Math.round(Number(rating) || 0);

    return (
        "★".repeat(full) +
        "☆".repeat(5 - full)
    );
}