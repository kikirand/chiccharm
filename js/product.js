/* =========================================================
   ChicCharm — Product Detail Page
   Loads the selected product directly from MySQL API
   ========================================================= */

let selectedSize = null;
let selectedQty = 1;


document.addEventListener("DOMContentLoaded", async () => {

    console.log("Product detail page started.");

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const slug = pathParts[pathParts.length - 1];

    console.log("Product slug:", slug);

    

    if (!slug) {
        console.error("No product slug found in URL.");
        return;
    }

    try {

        const response = await fetch(
            `/api/products/slug/${encodeURIComponent(slug)}`
        );

        console.log(
            "Product API status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Product API returned ${response.status}`
            );
        }

        const data =
            await response.json();

        console.log(
            "Product received from database:",
            data
        );

        /*
         * Convert database fields
         * into the format used by the page.
         */

        const product = {
    id: Number(data.product_id),
    name: data.product_name || "Product",
    category: data.category_name || data.category || "",
    price: Number(data.price || 0),
    oldPrice: data.old_price ? Number(data.old_price) : null,
    rating: Number(data.rating || 0),
    image: data.image_url
    ? (data.image_url.startsWith("/") ? data.image_url : "/" + data.image_url)
    : "",
    description: data.description || "",
    sizes: data.size_options
        ? String(data.size_options)
            .split(",")
            .map(size => size.trim())
            .filter(Boolean)
        : ["One Size"],
    badge: data.badge || null
};
        console.log(
            "Formatted product:",
            product
        );

        renderProduct(product);

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        const name =
            document.getElementById("product-name");

        if (name) {
            name.textContent =
                "Unable to load product";
        }
    }
});


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    selectedSize =
        product.sizes[0] || "One Size";

    selectedQty = 1;


    /* Page title */

    document.title =
        `${product.name} · ChicCharm`;


    /* Image */

    const image =
        document.getElementById(
            "product-image"
        );

    if (image) {

        image.src =
            product.image;

        image.alt =
            product.name;

        image.onerror = () => {

            console.error(
                "Product image failed:",
                product.image
            );
        };
    }


    /* Breadcrumb */

    const category =
        document.getElementById(
            "breadcrumb-category"
        );

    if (category) {

        category.textContent =
            product.category;

        category.href =
            `shop.html?category=${encodeURIComponent(
                product.category
            )}`;
    }


    const breadcrumbName =
        document.getElementById(
            "breadcrumb-name"
        );

    if (breadcrumbName) {

        breadcrumbName.textContent =
            product.name;
    }


    /* Category */

    const categoryElement =
        document.getElementById(
            "product-category"
        );

    if (categoryElement) {

        categoryElement.textContent =
            product.category;
    }


    /* Name */

    const nameElement =
        document.getElementById(
            "product-name"
        );

    if (nameElement) {

        nameElement.textContent =
            product.name;
    }


    /* Rating */

    const ratingElement =
        document.getElementById(
            "product-rating"
        );

    if (ratingElement) {

        const rating =
            Math.max(
                0,
                Math.min(
                    5,
                    Math.round(product.rating)
                )
            );

        ratingElement.innerHTML =
            `${"★".repeat(rating)}${"☆".repeat(5 - rating)}
             <span>
                ${product.rating} · Verified buyer ratings
             </span>`;
    }


    /* Description */

    const description = document.getElementById("product-description");

if (description) {
    description.textContent = product.description || "No description available.";
}

    /* Price */

    const priceElement =
        document.getElementById(
            "product-price"
        );

    if (priceElement) {

        const currentPrice =
            `₹${product.price.toLocaleString("en-IN")}`;

        if (product.oldPrice) {

            priceElement.innerHTML =
                `${currentPrice}
                 <span class="old-price">
                    ₹${product.oldPrice.toLocaleString("en-IN")}
                 </span>`;

        } else {

            priceElement.textContent =
                currentPrice;
        }
    }


    /* Badge */

    const badgeElement =
        document.getElementById(
            "product-badge"
        );

    if (badgeElement) {

        if (product.badge) {

            badgeElement.textContent =
                product.badge;

            badgeElement.style.display =
                "inline-block";

        } else {

            badgeElement.style.display =
                "none";
        }
    }


    /* =====================================================
       SIZE OPTIONS
       ===================================================== */

    const sizeContainer =
        document.getElementById(
            "size-options"
        );

    if (sizeContainer) {

        sizeContainer.innerHTML =
            product.sizes.map(
                (size, index) => `
                    <button
                        class="size-btn ${
                            index === 0
                                ? "selected"
                                : ""
                        }"
                        data-size="${size}"
                    >
                        ${size}
                    </button>
                `
            ).join("");


        sizeContainer
            .querySelectorAll(".size-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        sizeContainer
                            .querySelectorAll(
                                ".size-btn"
                            )
                            .forEach(btn =>
                                btn.classList.remove(
                                    "selected"
                                )
                            );

                        button.classList.add(
                            "selected"
                        );

                        selectedSize =
                            button.dataset.size;
                    }
                );
            });
    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    const quantityElement =
        document.getElementById(
            "qty-value"
        );

    if (quantityElement) {

        quantityElement.textContent =
            selectedQty;
    }


    const decrease =
        document.getElementById(
            "qty-decrease"
        );

    if (decrease) {

        decrease.onclick = () => {

            selectedQty =
                Math.max(
                    1,
                    selectedQty - 1
                );

            quantityElement.textContent =
                selectedQty;
        };
    }


    const increase =
        document.getElementById(
            "qty-increase"
        );

    if (increase) {

        increase.onclick = () => {

            selectedQty += 1;

            quantityElement.textContent =
                selectedQty;
        };
    }


    /* =====================================================
       ADD TO BAG
       ===================================================== */

    const addButton =
        document.getElementById(
            "add-to-cart-btn"
        );

    if (addButton) {

        addButton.onclick = () => {

            addToCart(
                product.id,
                selectedSize,
                selectedQty
            );

            addButton.textContent =
                "Added to Bag ✓";

            setTimeout(() => {

                addButton.textContent =
                    "Add to Bag";

            }, 1500);
        };
    }
}