/* =========================================================
   ChicCharm - Checkout / Payment Page
   Demo checkout - no real payment is processed
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Require login
        if (typeof requireLogin === "function") {
            if (!requireLogin("payment.html")) return;
        }

        const cart = getLocalCart();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            window.location.href = "shop.html";
            return;
        }

        // Load everything
        await renderOrderSummary();
        await loadAddresses();

        initPaymentMethods();
        initCardInputs();
        initAddressForm();

    } catch (error) {
        console.error("Payment page initialization error:", error);
    }
});


/* =========================================================
   CART
   ========================================================= */

function getLocalCart() {
    try {
        return JSON.parse(
            localStorage.getItem("chiccharm_cart") || "[]"
        );
    } catch (error) {
        console.error("Cart read error:", error);
        return [];
    }
}


/* =========================================================
   ORDER SUMMARY
   ========================================================= */

async function renderOrderSummary() {
    const cart = getLocalCart();
    const list = document.getElementById("payment-items");

    if (!list) return;

    if (!cart || cart.length === 0) {
        list.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        let subtotal = 0;

        list.innerHTML = cart.map(item => {

            const productId = Number(item.id || item.product_id);

            const product = products.find(
                p => Number(p.product_id) === productId
            );

            if (!product) {
                console.warn("Product not found:", item);
                return "";
            }

            const price = Number(product.price);
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;

            subtotal += itemTotal;

            return `
                <div class="order-item-row">
                    <img
                        src="${product.image_url || ""}"
                        alt="${product.product_name}"
                    >

                    <div>
                        <p class="order-item-name">
                            ${product.product_name}
                        </p>

                        <p class="order-item-meta">
                            Size ${item.size || "N/A"} · Qty ${quantity}
                        </p>
                    </div>

                    <span class="order-item-price">
                        ₹${itemTotal.toFixed(2)}
                    </span>
                </div>
            `;
        }).join("");

        const shipping = subtotal >= 1000 ? 0 : 99;
        const total = subtotal + shipping;

        document.getElementById("payment-subtotal").textContent =
            `₹${subtotal.toFixed(2)}`;

        document.getElementById("payment-shipping").textContent =
            shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`;

        document.getElementById("payment-total").textContent =
            `₹${total.toFixed(2)}`;

    } catch (error) {

        console.error("Order summary error:", error);

        list.innerHTML =
            "<p>Unable to load product prices.</p>";

        document.getElementById("payment-subtotal").textContent = "₹0.00";
        document.getElementById("payment-shipping").textContent = "₹0.00";
        document.getElementById("payment-total").textContent = "₹0.00";
    }
}


/* =========================================================
   PAYMENT METHOD SWITCHING
   ========================================================= */

function initPaymentMethods() {

    const radios =
        document.querySelectorAll(
            'input[name="payment_method"]'
        );

    radios.forEach(radio => {

        radio.addEventListener("change", () => {
            updatePaymentMethod(radio.value);
        });

    });

    // Show card by default
    updatePaymentMethod("card");
}


function updatePaymentMethod(method) {

    const cardSection =
        document.getElementById("card-payment-section");

    const upiSection =
        document.getElementById("upi-payment-section");

    const codSection =
        document.getElementById("cod-payment-section");

    const payButton =
        document.getElementById("pay-btn");

    // Hide everything first
    if (cardSection) {
        cardSection.style.display = "none";
    }

    if (upiSection) {
        upiSection.style.display = "none";
    }

    if (codSection) {
        codSection.style.display = "none";
    }

    // Show selected option
    if (method === "card") {

        if (cardSection) {
            cardSection.style.display = "block";
        }

        if (payButton) {
            payButton.textContent = "Pay Now";
        }

    } else if (method === "upi") {

        if (upiSection) {
            upiSection.style.display = "block";
        }

        if (payButton) {
            payButton.textContent = "Pay with UPI";
        }

    } else if (method === "cod") {

        if (codSection) {
            codSection.style.display = "block";
        }

        if (payButton) {
            payButton.textContent = "Place Order";
        }
    }
}


/* =========================================================
   CARD INPUT FORMATTING
   ========================================================= */

function initCardInputs() {

    const cardNumber =
        document.getElementById("card-number");

    const expiry =
        document.getElementById("card-expiry");

    const cvv =
        document.getElementById("card-cvv");


    // Card number
    if (cardNumber) {

        cardNumber.addEventListener("input", () => {

            let value =
                cardNumber.value
                    .replace(/\D/g, "")
                    .slice(0, 16);

            let formatted =
                value.match(/.{1,4}/g);

            cardNumber.value =
                formatted
                    ? formatted.join(" ")
                    : "";
        });
    }


    // Expiry
    if (expiry) {

        expiry.addEventListener("input", () => {

            let value =
                expiry.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

            if (value.length > 2) {

                value =
                    value.substring(0, 2)
                    + " / "
                    + value.substring(2);
            }

            expiry.value = value;
        });
    }


    // CVV
    if (cvv) {

        cvv.addEventListener("input", () => {

            cvv.value =
                cvv.value
                    .replace(/\D/g, "")
                    .slice(0, 4);
        });
    }
}


/* =========================================================
   CARD VALIDATION
   ========================================================= */

function validateCard() {

    const cardInput =
        document.getElementById("card-number");

    const expiryInput =
        document.getElementById("card-expiry");

    const cvvInput =
        document.getElementById("card-cvv");

    const cardNumber =
        cardInput
            ? cardInput.value.replace(/\D/g, "")
            : "";

    const expiry =
        expiryInput
            ? expiryInput.value.trim()
            : "";

    const cvv =
        cvvInput
            ? cvvInput.value.replace(/\D/g, "")
            : "";


    // Card number must contain exactly 16 digits
    if (cardNumber.length !== 16) {

        showPaymentError(
            "Enter a valid 16-digit demo card number."
        );

        return false;
    }


    // Luhn validation
    if (!passesLuhn(cardNumber)) {

        showPaymentError(
            "The card number is not valid. Try the demo number 4111 1111 1111 1111."
        );

        return false;
    }


    // Expiry format
    if (!/^\d{2} \/ \d{2}$/.test(expiry)) {

        showPaymentError(
            "Enter expiry in MM / YY format."
        );

        return false;
    }


    const parts = expiry.split(" / ");

    const month = Number(parts[0]);
    const year = Number(parts[1]);

    if (month < 1 || month > 12) {

        showPaymentError(
            "Enter a valid expiry month."
        );

        return false;
    }


    // Demo expiry validation
    const now = new Date();

    const currentYear =
        now.getFullYear() % 100;

    const currentMonth =
        now.getMonth() + 1;

    if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
    ) {

        showPaymentError(
            "The card expiry date has passed."
        );

        return false;
    }


    // CVV
    if (cvv.length !== 3 && cvv.length !== 4) {

        showPaymentError(
            "Enter a 3 or 4 digit CVV."
        );

        return false;
    }

    return true;
}


/* =========================================================
   LUHN CHECK
   ========================================================= */

function passesLuhn(number) {

    let sum = 0;
    let doubleDigit = false;

    for (let i = number.length - 1; i >= 0; i--) {

        let digit = Number(number[i]);

        if (doubleDigit) {

            digit *= 2;

            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;

        doubleDigit = !doubleDigit;
    }

    return sum % 10 === 0;
}


/* =========================================================
   PAYMENT ERROR
   ========================================================= */

function showPaymentError(message) {

    const error =
        document.getElementById("payment-error");

    if (error) {

        error.textContent = message;
        error.classList.add("show");
    } else {

        alert(message);
    }
}


function clearPaymentError() {

    const error =
        document.getElementById("payment-error");

    if (error) {

        error.textContent = "";
        error.classList.remove("show");
    }
}


/* =========================================================
   ADDRESS LOADING
   ========================================================= */

async function loadAddresses() {

    const container =
        document.getElementById("address-list");

    if (!container) return;

    try {

        const addresses =
            await getAddresses();

        if (!addresses || addresses.length === 0) {

            container.innerHTML = `
                <p style="color:#666;">
                    No saved addresses found.
                    Add a delivery address below.
                </p>
            `;

            return;
        }


        container.innerHTML =
            addresses.map(address => {

                const addressId =
                    address.address_id || address.id;

                const name =
                    address.name ||
                    address.full_name ||
                    address.fullName ||
                    "Customer";

                const checked =
                    address.is_default ? "checked" : "";

                return `
                    <div class="address-card"
                         style="
                            border:1px solid #ddd;
                            padding:15px;
                            margin-bottom:12px;
                            border-radius:8px;
                         ">

                        <label
                            for="address-${addressId}"
                            style="
                                display:flex;
                                gap:12px;
                                cursor:pointer;
                            "
                        >

                            <input
                                type="radio"
                                id="address-${addressId}"
                                name="selected_address"
                                value="${addressId}"
                                ${checked}
                            >

                            <div>

                                <strong>
                                    ${name}
                                </strong>

                                <br>

                                ${address.street || ""}

                                <br>

                                ${address.city || ""},
                                ${address.state || ""}
                                - ${address.pincode || ""}

                                <br>

                                Phone:
                                ${address.phone || ""}
                            </div>

                        </label>

                        <button
                            type="button"
                            onclick="handleDeleteAddress(${addressId})"
                            style="
                                margin-top:10px;
                                border:none;
                                background:none;
                                color:#c62828;
                                cursor:pointer;
                            "
                        >
                            Delete Address
                        </button>

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Address loading error:", error);

        container.innerHTML = `
            <p style="color:red;">
                Unable to load saved addresses.
            </p>
        `;
    }
}


/* =========================================================
   ADD ADDRESS
   ========================================================= */

function initAddressForm() {

    const form =
        document.getElementById("address-form");

    if (!form) return;

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const newAddress = {

            fullName:
                document
                    .getElementById("addr-name")
                    .value.trim(),

            street:
                document
                    .getElementById("addr-street")
                    .value.trim(),

            city:
                document
                    .getElementById("addr-city")
                    .value.trim(),

            state:
                document
                    .getElementById("addr-state")
                    .value.trim(),

            pincode:
                document
                    .getElementById("addr-pincode")
                    .value.trim(),

            phone:
                document
                    .getElementById("addr-phone")
                    .value.trim(),

            isDefault:
                document
                    .getElementById("addr-default")
                    .checked
        };


        if (
            !newAddress.fullName ||
            !newAddress.street ||
            !newAddress.city ||
            !newAddress.state ||
            !newAddress.pincode ||
            !newAddress.phone
        ) {

            alert("Please fill in all address fields.");
            return;
        }


        try {

            const result =
                await addAddress(newAddress);

            if (result) {

                form.reset();

                await loadAddresses();

                alert("Address saved successfully.");
            }

        } catch (error) {

            console.error(
                "Address save error:",
                error
            );

            alert(
                "Unable to save address."
            );
        }
    });
}


/* =========================================================
   DELETE ADDRESS
   ========================================================= */

async function handleDeleteAddress(addressId) {

    if (!addressId) return;

    const confirmed =
        confirm(
            "Are you sure you want to delete this address?"
        );

    if (!confirmed) return;

    try {

        await removeAddress(addressId);

        await loadAddresses();

    } catch (error) {

        console.error(
            "Delete address error:",
            error
        );
    }
}


/* =========================================================
   PLACE ORDER
   ========================================================= */

async function handleOrderCheckout(event) {

    if (event) {
        event.preventDefault();
    }

    clearPaymentError();


    /* ---------------------------------------------
       1. PAYMENT METHOD
       --------------------------------------------- */

    const selectedPayment =
        document.querySelector(
            'input[name="payment_method"]:checked'
        );

    if (!selectedPayment) {

        showPaymentError(
            "Please select a payment method."
        );

        return;
    }

    const paymentMethod =
        selectedPayment.value;


    /* ---------------------------------------------
       2. PAYMENT VALIDATION
       --------------------------------------------- */

    if (paymentMethod === "card") {

        if (!validateCard()) {
            return;
        }
    }


    if (paymentMethod === "upi") {

        const upiInput =
            document.getElementById("upi-id");

        const upi =
            upiInput
                ? upiInput.value.trim()
                : "";

        if (!upi || !/^[\w.-]+@[\w.-]+$/.test(upi)) {

            showPaymentError(
                "Enter a valid demo UPI ID, for example demo@upi."
            );

            return;
        }
    }


    // COD requires no payment details


    /* ---------------------------------------------
       3. ADDRESS
       --------------------------------------------- */

    // 1. Get Selected Address ID
        const selectedAddressInput =
        document.querySelector('input[name="selected_address"]:checked');

        if (!selectedAddressInput || !selectedAddressInput.value) {
        alert("Please select a delivery address.");
        return;
        }

const addressId = Number(selectedAddressInput.value);


    

    /* ---------------------------------------------
       4. CART
       --------------------------------------------- */

    

    // 2. Get Cart
const localCart = JSON.parse(
    localStorage.getItem("chiccharm_cart") || "[]"
);

if (!localCart || localCart.length === 0) {
    alert("Your cart is empty.");
    return;
}

    const formattedCart = localCart
    .map(item => ({
        product_id: Number(item.id ?? item.product_id),
        quantity: Number(item.quantity)
    }))
    .filter(item =>
        Number.isInteger(item.product_id) &&
        item.product_id > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );

console.log("Cart from localStorage:", localCart);
console.log("Cart sent to backend:", formattedCart);

if (formattedCart.length !== localCart.length) {
    console.error("Invalid cart data:", localCart);

    alert("One or more cart items are invalid. Please remove and re-add the affected products.");
    return;
}


    /* ---------------------------------------------
       5. AUTH TOKEN
       --------------------------------------------- */

    const token =
        localStorage.getItem(
            "chiccharm_token"
        );

    if (!token) {

        alert(
            "Your login session has expired. Please log in again."
        );

        window.location.href =
            "login.html";

        return;
    }


    /* ---------------------------------------------
       6. BUTTON
       --------------------------------------------- */

    const button =
        document.getElementById("pay-btn");

    if (button) {

        button.disabled = true;
        button.textContent =
            "Processing...";
    }


    /* ---------------------------------------------
       7. SEND ORDER
       --------------------------------------------- */

    try {

        const response =
            await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                    address_id: addressId,
                    cart: formattedCart,
                    payment_method: document.querySelector(
                        'input[name="payment_method"]:checked'
                    )?.value || "cod"
                })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to create order."
            );
        }


        /* -----------------------------------------
           SUCCESS
           ----------------------------------------- */

        localStorage.removeItem(
            "chiccharm_cart"
        );


        showSuccess({

            id:
                data.order_id,

            total:
                data.total_amount

        });


    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );

        showPaymentError(
            error.message ||
            "Failed to create order."
        );

        if (button) {

            button.disabled = false;

            button.textContent =
                paymentMethod === "cod"
                    ? "Place Order"
                    : paymentMethod === "upi"
                        ? "Pay with UPI"
                        : "Pay Now";
        }
    }
}


/* =========================================================
   SUCCESS
   ========================================================= */

function showSuccess(order) {

    const panel =
        document.getElementById(
            "payment-form-panel"
        );

    const success =
        document.getElementById(
            "payment-success"
        );

    if (panel) {
        panel.style.display = "none";
    }

    if (success) {
        success.style.display = "block";
    }


    const orderId =
        document.getElementById(
            "success-order-id"
        );

    const orderTotal =
        document.getElementById(
            "success-order-total"
        );


    if (orderId) {
        orderId.textContent =
            `#4${order.id}`;
    }

    if (orderTotal) {

        orderTotal.textContent =
            `₹${Number(order.total).toFixed(2)}`;
    }
}