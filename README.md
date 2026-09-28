# ChicCharm — Women's Clothing Store (College Project)

A full front-end e-commerce website built with plain **HTML, CSS and JavaScript**.

## How to run
No build tools or server needed. Unzip the folder and open `index.html` in
any modern browser (Chrome/Edge/Firefox). Every page links to the others
through normal `<a href="...">` links.

## Pages included
| Page | Purpose |
|---|---|
| `index.html` | Home page — hero banner, category tiles, featured products, newsletter signup |
| `shop.html` | Full catalogue with category filter, price filter, search and sorting |
| `product.html` | Product detail page — images, sizes, quantity, related products |
| `cart.html` | Shopping cart — update quantity, remove items, order summary |
| `checkout.html` | Shipping address form + mock payment (Card / UPI / COD) |
| `order-confirmation.html` | Order success page after checkout |
| `login.html` | Login and Register (tabbed) |
| `orders.html` | Logged-in user's order history |
| `about.html` | Brand story |
| `contact.html` | Contact form (demo) |
| `404.html` | Not-found page |

## "Database" design
Since this is a static front-end project with no server, the app is split
into two layers, similar to how a real app separates its data model from
its UI:

1. **Product catalogue** (`js/data.js`) — a read-only "table" of products
   and categories, like a `products` table you'd normally pull from
   MySQL/MongoDB with a `GET /api/products` call.
2. **Users / Cart / Orders** (`js/db.js`) — read **and** write data, stored
   in the browser's `localStorage` behind small helper functions
   (`dbGetUsers`, `dbSaveOrders`, etc.) so the rest of the app never touches
   `localStorage` directly — exactly how it would call a real API layer.

This keeps all the logic (`auth.js`, `cart.js`, `orders.js`) identical to
what you'd write against a real backend; only `db.js` would need to change.

### Upgrading to a real database (optional, for extra credit)
To turn this into a full-stack project:
- Build a small **Node.js + Express** API with routes like
  `/api/products`, `/api/login`, `/api/orders`.
- Store data in **MongoDB** (`products`, `users`, `orders` collections) or
  **MySQL/PostgreSQL** (equivalent tables).
- Replace the functions in `db.js` with `fetch()` calls to those routes.
- Hash passwords with `bcrypt` before saving — the current version stores
  plain text passwords in `localStorage`, which is fine for a demo but
  **never** acceptable in a real product.

## Demo login
```
Email: demo@chiccharm.com
Password: demo123
```
(Or just register a new account — it's saved instantly.)

## Notes for your submission / viva
- Payments are fully mocked — no real payment gateway is contacted, and the
  UI says so on the checkout page.
- Product photos are placeholder images from picsum.photos, used only for
  layout/demo purposes.
- Cart and orders persist across page reloads (via localStorage) but are
  specific to the browser they were created in.

## Ideas to extend this project further
- Product reviews & star ratings written by users
- Wishlist / "save for later" page
- Admin panel to add/edit/remove products
- Order tracking with shipment status timeline
- Discount/coupon codes at checkout
- Email confirmation (would need a real backend)
- Pagination or infinite scroll on the shop page
- Unit tests for `cart.js` / `orders.js` logic
- Swap localStorage for a real backend + database (see above)
