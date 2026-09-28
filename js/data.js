/* ==========================================================================
   ChicCharm — Product "database"
   For this college project the catalogue lives in this JS file and acts as
   the read-only product table. Users, carts and orders (the read/write
   data) are simulated with the browser's localStorage in db.js, which is
   written the same way a real backend would store rows in a database.
   See README.md for how this would map onto a real SQL/NoSQL database.
   ========================================================================== */

const CATEGORIES = [
  { id: "dresses",      name: "Dresses",        image: "https://picsum.photos/seed/cc-cat-dresses/600/750" },
  { id: "tops",         name: "Tops & Blouses",  image: "https://picsum.photos/seed/cc-cat-tops/600/750" },
  { id: "bottoms",      name: "Bottoms",         image: "https://picsum.photos/seed/cc-cat-bottoms/600/750" },
  { id: "ethnic",       name: "Ethnic Wear",     image: "https://picsum.photos/seed/cc-cat-ethnic/600/750" },
  { id: "winterwear",   name: "Winter Wear",     image: "https://picsum.photos/seed/cc-cat-winter/600/750" },
  { id: "accessories",  name: "Accessories",     image: "https://picsum.photos/seed/cc-cat-accessories/600/750" }
];

const PRODUCTS = [
  { id: 1, name: "Floral Wrap Midi Dress", category: "dresses", price: 1699, oldPrice: 2199,
    sizes: ["XS","S","M","L","XL"], rating: 4.6, featured: true,
    description: "A breezy wrap-style midi dress in a soft floral print, cinched with a self-tie belt. Lined bodice, flutter sleeves, perfect for daytime brunches or festive evenings." },
  { id: 2, name: "Emerald Satin Slip Dress", category: "dresses", price: 2299, oldPrice: null,
    sizes: ["XS","S","M","L"], rating: 4.8, featured: true,
    description: "A fluid, bias-cut satin slip dress with adjustable straps and a cowl neckline. Effortlessly elegant for evening occasions." },
  { id: 3, name: "Ivory Tiered Sundress", category: "dresses", price: 1399, oldPrice: 1799,
    sizes: ["S","M","L","XL"], rating: 4.3, featured: false,
    description: "Lightweight tiered cotton sundress with a square neckline and puff sleeves. Breathable and easy to dress up or down." },
  { id: 4, name: "Wine Bodycon Party Dress", category: "dresses", price: 1899, oldPrice: null,
    sizes: ["XS","S","M","L"], rating: 4.4, featured: false,
    description: "A figure-hugging bodycon dress with a sweetheart neckline in a rich wine hue, built for statement nights out." },
  { id: 5, name: "Silk-Feel Wrap Blouse", category: "tops", price: 999, oldPrice: 1299,
    sizes: ["XS","S","M","L","XL"], rating: 4.5, featured: true,
    description: "A fluid wrap blouse in a silk-feel fabric with a surplice neckline and elbow-length sleeves. Tucks beautifully into skirts or trousers." },
  { id: 6, name: "Ribbed Turtleneck Top", category: "tops", price: 649, oldPrice: null,
    sizes: ["XS","S","M","L","XL","XXL"], rating: 4.2, featured: false,
    description: "A soft ribbed-knit turtleneck top, a wardrobe staple for layering through every season." },
  { id: 7, name: "Off-Shoulder Ruffle Top", category: "tops", price: 899, oldPrice: 1099,
    sizes: ["S","M","L"], rating: 4.1, featured: false,
    description: "A romantic off-shoulder top with tiered ruffle detailing, cropped at the waist for pairing with high-rise bottoms." },
  { id: 8, name: "Classic White Poplin Shirt", category: "tops", price: 899, oldPrice: null,
    sizes: ["XS","S","M","L","XL"], rating: 4.7, featured: true,
    description: "A crisp cotton poplin shirt with a relaxed fit, curved hem and mother-of-pearl buttons — the everyday essential." },
  { id: 9, name: "High-Rise Wide Leg Trousers", category: "bottoms", price: 1499, oldPrice: 1899,
    sizes: ["XS","S","M","L","XL"], rating: 4.5, featured: true,
    description: "Tailored wide-leg trousers with a high-rise waist and front pleats, cut from a fluid crepe fabric that drapes beautifully." },
  { id: 10, name: "Denim Straight Jeans", category: "bottoms", price: 1699, oldPrice: null,
    sizes: ["26","28","30","32","34"], rating: 4.4, featured: false,
    description: "Mid-wash straight-fit denim jeans with a classic five-pocket cut, built to be worn on repeat." },
  { id: 11, name: "Pleated A-Line Skirt", category: "bottoms", price: 1099, oldPrice: 1399,
    sizes: ["XS","S","M","L"], rating: 4.3, featured: false,
    description: "A knee-length pleated skirt with a flattering A-line silhouette and hidden side-zip closure." },
  { id: 12, name: "Linen-Blend Culottes", category: "bottoms", price: 1199, oldPrice: null,
    sizes: ["S","M","L","XL"], rating: 4.0, featured: false,
    description: "Wide, breathable linen-blend culottes with an elasticated back waist for all-day comfort." },
  { id: 13, name: "Banarasi-Style Silk Saree", category: "ethnic", price: 3499, oldPrice: 4299,
    sizes: ["Free Size"], rating: 4.9, featured: true,
    description: "A richly woven silk-blend saree with a traditional Banarasi border, paired with an unstitched matching blouse piece." },
  { id: 14, name: "Embroidered Anarkali Suit", category: "ethnic", price: 2799, oldPrice: 3399,
    sizes: ["S","M","L","XL"], rating: 4.6, featured: true,
    description: "A floor-length Anarkali kurta with thread embroidery, paired with matching churidar and dupatta." },
  { id: 15, name: "Block-Print Cotton Kurti", category: "ethnic", price: 799, oldPrice: 999,
    sizes: ["S","M","L","XL","XXL"], rating: 4.3, featured: false,
    description: "A relaxed straight-cut kurti in hand block-printed cotton, easy to dress up with jhumkas or down with sneakers." },
  { id: 16, name: "Chanderi Palazzo Set", category: "ethnic", price: 2199, oldPrice: null,
    sizes: ["S","M","L"], rating: 4.4, featured: false,
    description: "A three-piece Chanderi co-ord set with a short kurta, flowy palazzos and a printed dupatta." },
  { id: 17, name: "Quilted Longline Puffer Jacket", category: "winterwear", price: 2999, oldPrice: 3699,
    sizes: ["S","M","L","XL"], rating: 4.7, featured: true,
    description: "A longline quilted puffer jacket with a stand collar and zip closure, made to keep the chill out in style." },
  { id: 18, name: "Cable-Knit Wool Sweater", category: "winterwear", price: 1799, oldPrice: null,
    sizes: ["S","M","L","XL"], rating: 4.5, featured: false,
    description: "A chunky cable-knit sweater in a soft wool blend, perfect layered over shirts or worn on its own." },
  { id: 19, name: "Belted Wool-Blend Overcoat", category: "winterwear", price: 3999, oldPrice: 4799,
    sizes: ["S","M","L"], rating: 4.8, featured: true,
    description: "A tailored wool-blend overcoat with a self-belt and notch lapel — the finishing layer for cold-weather dressing." },
  { id: 20, name: "Fleece-Lined Denim Jacket", category: "winterwear", price: 2199, oldPrice: null,
    sizes: ["S","M","L","XL"], rating: 4.2, featured: false,
    description: "A classic denim jacket lined with soft fleece for extra warmth without giving up the everyday denim look." },
  { id: 21, name: "Gold-Plated Layered Necklace", category: "accessories", price: 599, oldPrice: 799,
    sizes: ["Free Size"], rating: 4.4, featured: false,
    description: "A delicate gold-plated layered necklace set, an easy way to elevate any outfit." },
  { id: 22, name: "Structured Tote Bag", category: "accessories", price: 1499, oldPrice: null,
    sizes: ["Free Size"], rating: 4.6, featured: true,
    description: "A structured faux-leather tote with a spacious interior and detachable strap — office-to-evening ready." },
  { id: 23, name: "Oversized Round Sunglasses", category: "accessories", price: 549, oldPrice: 699,
    sizes: ["Free Size"], rating: 4.1, featured: false,
    description: "UV-protected oversized round sunglasses with a lightweight acetate frame." },
  { id: 24, name: "Silk Printed Hair Scarf", category: "accessories", price: 349, oldPrice: null,
    sizes: ["Free Size"], rating: 4.0, featured: false,
    description: "A silk-feel printed square scarf that doubles as a hair accessory, neck scarf or bag charm." }
];

// Helper to build a consistent product image URL from its id/name.
function productImage(product) {
  
  return product.image;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}
