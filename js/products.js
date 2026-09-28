/* =========================================================
   ChicCharm — Products
   Loads products from MySQL
   ========================================================= */

const API_BASE_URL = "http://localhost:5000";

let PRODUCTS = [];

/* Load all products from database */
async function loadProductsFromDatabase() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const databaseProducts = await response.json();

        PRODUCTS = databaseProducts.map(product => ({
            id: Number(product.product_id),

            name: product.product_name || "",

            slug: product.slug || "",

            category: product.category_name || "",

            description: product.description || "",

            price: Number(product.price || 0),

            oldPrice: product.old_price
                ? Number(product.old_price)
                : null,

            rating: Number(product.rating || 0),

            image: product.image_url
                ? (product.image_url.startsWith("/") ? product.image_url : "/" + product.image_url)
                : "",

            sizes: product.size_options
                ? String(product.size_options)
                    .split(",")
                    .map(size => size.trim())
                    .filter(Boolean)
                : ["One Size"],

            color: product.color || "",

            stock: Number(product.stock_quantity || 0),

            badge: product.badge || null
        }));

        console.log(
            "ChicCharm products loaded:",
            PRODUCTS.length,
            PRODUCTS
        );

        return PRODUCTS;

    } catch (error) {

        console.error(
            "Failed to load products from MySQL:",
            error
        );

        PRODUCTS = [];

        return [];
    }
}


/* Get one product */
function getProductById(id) {

    return PRODUCTS.find(
        product => Number(product.id) === Number(id)
    ) || null;
}


/* Get categories */
function getAllCategories() {

    return [
        ...new Set(
            PRODUCTS
                .map(product => product.category)
                .filter(Boolean)
        )
    ];
}


/* Format Indian currency */
function formatPrice(price) {

    return `₹${Number(price).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}