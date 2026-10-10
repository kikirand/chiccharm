[README.md](https://github.com/user-attachments/files/33274865/README.md)
# ChicCharm

> A full-stack women's fashion e-commerce website built with HTML, CSS, JavaScript, Node.js, Express.js and MySQL.

ChicCharm is a modern e-commerce web application designed as a portfolio project to demonstrate practical frontend and backend development skills.

The application provides a complete shopping flow including product browsing, product details, shopping cart management, customer authentication, saved addresses, checkout, payment-method selection, order creation and order management.

---

## Overview

ChicCharm is designed to simulate a real-world online clothing store.

The project combines a responsive frontend with a Node.js/Express backend and a MySQL database.

Users can:

- Browse women's clothing and accessories
- Search and explore products
- View individual product details
- Select product sizes
- Add products to their shopping bag
- Update quantities and remove products
- Create an account and log in
- Save delivery addresses
- Select a delivery address during checkout
- Select a payment method
- Place orders
- View previous orders
- Cancel eligible orders

---

## Features

### Shopping Experience

- Responsive fashion-store interface
- Product catalog
- Product detail pages
- Product categories
- Product images
- Product pricing
- Product size selection
- Shopping bag/cart
- Quantity controls
- Remove-from-cart functionality
- Order summary

### User Authentication

- Customer registration
- Customer login
- JWT-based authentication
- Persistent login session
- Protected order functionality

### Address Management

- Add delivery addresses
- Store customer addresses in MySQL
- Select an address during checkout
- Default-address support

### Checkout

- Delivery address selection
- Payment method selection
- Order summary
- Subtotal calculation
- Shipping calculation
- Final order total
- Mock payment flow

### Order Management

- Create orders
- Store order information in MySQL
- Store ordered products and quantities
- View previous orders
- View order status
- Cancel eligible orders

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive Web Design

### Backend

- Node.js
- Express.js
- REST API
- JSON Web Tokens (JWT)

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

---

## Project Structure

```text
chiccharm/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── ...
│   │
│   ├── server.js
│   └── package.json
│
├── css/
│   └── style.css
│
├── js/
│   ├── products.js
│   ├── shop.js
│   ├── product.js
│   ├── cart.js
│   ├── cart-page.js
│   ├── login.js
│   ├── auth.js
│   ├── address.js
│   ├── payment.js
│   └── orders.js
│
├── images/
│   └── product images
│
├── index.html
├── shop.html
├── product.html
├── cart.html
├── payment.html
├── login.html
├── orders.html
├── about.html
├── contact.html
│
├── .gitignore
└── README.md
