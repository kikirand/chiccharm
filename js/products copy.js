/* =========================================================
   ChicCharm — Product Data
   ---------------------------------------------------------
   This file simulates a database table called "products".
   Right now it's a plain JS array so the site works with
   zero setup. When a real backend is added later, replace
   the PRODUCTS array below with a fetch() call, e.g.:

   let PRODUCTS = [];
   async function loadProducts() {
     const res = await fetch("/api/products");
     PRODUCTS = await res.json();
     return PRODUCTS;
   }

   Everything in shop.js / product.js that reads PRODUCTS
   will keep working as long as each object keeps this
   shape: { id, name, category, price, oldPrice, rating,
   badge, image, sizes, description }
   ========================================================= */

let PRODUCTS = [
  { id: 1,  name: "Rosalind Wrap Midi Dress",        category: "Dresses",    price: 2499, oldPrice: 3199, rating: 4.6, badge: "Sale",     image: "/images/chic01-rosalind-wrap-midi-dress.jpg", sizes: ["XS","S","M","L","XL"], description: "A fluid wrap midi in a rose-tinted crepe, finished with a self-tie waist that flatters every silhouette." },
  { id: 2,  name: "Marlowe Linen Shirt Dress",       category: "Dresses",    price: 2899, oldPrice: null, rating: 4.4, badge: "New",      image: "images/chic02-marlowe-linen-shirt-dress.jpg", sizes: ["S","M","L","XL"], description: "Breathable linen-blend shirt dress with a relaxed collar and dropped shoulder for warm-weather ease." },
  { id: 3,  name: "Isla Puff-Sleeve Mini",           category: "Dresses",    price: 1999, oldPrice: null, rating: 4.2, badge: null,       image: "images/chic03-isla-puff-sleeve-mini.jpg", sizes: ["XS","S","M","L"], description: "A playful mini with statement puff sleeves and a nipped-in waist for evenings out." },
  { id: 4,  name: "Verona Satin Slip Dress",         category: "Dresses",    price: 2199, oldPrice: 2699, rating: 4.7, badge: "Sale",     image: "images/chic04-verona-satin-slip-dress.jpg", sizes: ["XS","S","M","L","XL"], description: "Bias-cut satin slip that skims the body — the quiet showstopper of any occasion wardrobe." },
  { id: 5,  name: "Tallis Floral Tiered Dress",      category: "Dresses",    price: 2350, oldPrice: null, rating: 4.3, badge: null,       image: "images/chic05-tallis-floral-tiered-dress.jpg", sizes: ["S","M","L","XL"], description: "Tiered cotton dress in a hand-drawn floral print, cut for movement from morning to evening." },
  { id: 6,  name: "Noor Embroidered Kurta Dress",    category: "Ethnic",     price: 2799, oldPrice: null, rating: 4.8, badge: "New",      image: "images/chic06-noor-embroidered-kurta-dress.jpg", sizes: ["S","M","L","XL","XXL"], description: "Hand-embroidered yoke on soft chanderi fabric — a modern kurta dress rooted in traditional craft." },
  { id: 7,  name: "Meera Banarasi Silk Saree",       category: "Ethnic",     price: 5499, oldPrice: 6999, rating: 4.9, badge: "Sale",     image: "images/chic07-meera-banarasi-silk-saree.jpg", sizes: ["Free Size"], description: "Pure silk saree woven with a traditional Banarasi border, paired with an unstitched matching blouse piece." },
  { id: 8,  name: "Anaya Anarkali Suit Set",         category: "Ethnic",     price: 3299, oldPrice: null, rating: 4.5, badge: null,       image: "images/chic08-anaya-anarkali-suit-set.jpg", sizes: ["S","M","L","XL"], description: "Floor-sweeping anarkali with a fitted bodice and flared panels, layered over matching churidar." },
  { id: 9,  name: "Devika Zari Border Kurti",        category: "Ethnic",     price: 1499, oldPrice: 1899, rating: 4.1, badge: "Sale",     image: "images/chic09-devika-zari-border-kurti.jpg", sizes: ["S","M","L","XL","XXL"], description: "Straight-cut kurti in soft cotton with a delicate zari border, easy to dress up or down." },
  { id: 10, name: "Sana Chikankari Kurta",           category: "Ethnic",     price: 1899, oldPrice: null, rating: 4.6, badge: "New",      image: "images/chic10-sana-chikankari-kurta.jpg", sizes: ["S","M","L","XL"], description: "Traditional Lucknowi chikankari hand-embroidery on breathable cotton voile." },
  { id: 11, name: "Cove Ribbed Knit Top",            category: "Tops",       price: 999,  oldPrice: null, rating: 4.3, badge: null,       image: "images/chic11-cove-ribbed-knit-top.jpg", sizes: ["XS","S","M","L","XL"], description: "Second-skin ribbed knit top that layers well and holds its shape wash after wash." },
  { id: 12, name: "Bellamy Poplin Blouse",           category: "Tops",       price: 1299, oldPrice: 1599, rating: 4.4, badge: "Sale",     image: "images/chic12-bellamy-poplin-blouse.jpg", sizes: ["S","M","L","XL"], description: "Crisp cotton poplin blouse with mother-of-pearl buttons and a relaxed office-ready fit." },
  { id: 13, name: "Faye Off-Shoulder Top",           category: "Tops",       price: 1150, oldPrice: null, rating: 4.0, badge: "New",      image: "images/chic13-faye-off-shoulder-top.jpg", sizes: ["XS","S","M","L"], description: "Off-shoulder top in stretch jersey with elasticated neckline for an easy, flattering fit." },
  { id: 14, name: "Odette Silk Cami",                category: "Tops",       price: 1450, oldPrice: null, rating: 4.5, badge: null,       image: "images/chic14-odette-silk-cami.jpg", sizes: ["XS","S","M","L","XL"], description: "Adjustable-strap silk cami that layers under blazers or shines on its own." },
  { id: 15, name: "Harlow Cropped Hoodie",           category: "Tops",       price: 1699, oldPrice: 1999, rating: 4.2, badge: "Sale",     image: "images/chic15-harlow-cropped-hoodie.jpg", sizes: ["S","M","L","XL"], description: "Brushed-fleece cropped hoodie with a relaxed drop shoulder for off-duty days." },
  { id: 16, name: "Quinn Pleated Wide-Leg Trousers", category: "Bottoms",    price: 1899, oldPrice: null, rating: 4.6, badge: "New",      image: "images/chic16-quinn-pleated-wide-leg-trousers.jpg", sizes: ["XS","S","M","L","XL"], description: "High-waisted wide-leg trousers with a sharp front pleat, tailored to elongate the leg." },
  { id: 17, name: "Reid Straight-Fit Denim",         category: "Bottoms",    price: 2199, oldPrice: null, rating: 4.4, badge: null,       image: "images/chic17-reid-straight-fit-denim.jpg", sizes: ["26","28","30","32","34"], description: "Rigid-wash straight denim with a mid-rise fit that pairs with everything in your closet." },
  { id: 18, name: "Willa Denim Mini Skirt",          category: "Bottoms",    price: 1399, oldPrice: 1699, rating: 4.1, badge: "Sale",     image: "images/chic18-willa-denim-mini-skirt.jpg", sizes: ["XS","S","M","L"], description: "A-line denim mini with a raw hem and front button placket for everyday wear." },
  { id: 19, name: "Prima Pleated Midi Skirt",        category: "Bottoms",    price: 1599, oldPrice: null, rating: 4.3, badge: null,       image: "images/chic19-prima-pleated-midi-skirt.jpg", sizes: ["XS","S","M","L","XL"], description: "Accordion-pleated midi skirt in a fluid satin that catches the light with every step." },
  { id: 20, name: "Nova High-Waist Shorts",          category: "Bottoms",    price: 999,  oldPrice: null, rating: 4.0, badge: "New",      image: "images/chic20-nova-high-waist-shorts.jpg", sizes: ["XS","S","M","L"], description: "Tailored high-waist shorts in a structured cotton blend, sharp enough for the office." },
  { id: 21, name: "Winslow Belted Trench Coat",      category: "Outerwear", price: 4299, oldPrice: 4999, rating: 4.8, badge: "Sale",     image: "images/chic21-winslow-belted-trench-coat.jpg", sizes: ["S","M","L","XL"], description: "Classic double-breasted trench in water-resistant cotton twill with a cinched belt waist." },
  { id: 22, name: "Ember Quilted Puffer Jacket",     category: "Outerwear", price: 3599, oldPrice: null, rating: 4.5, badge: "New",      image: "images/chic22-ember-quilted-puffer-jacket.jpg", sizes: ["S","M","L","XL"], description: "Lightweight quilted puffer with a packable hood, built for city winters." },
  { id: 23, name: "Sloane Wool-Blend Blazer",        category: "Outerwear", price: 3299, oldPrice: null, rating: 4.6, badge: null,       image: "images/chic23-sloane-wool-blend-blazer.jpg", sizes: ["XS","S","M","L","XL"], description: "Single-breasted wool-blend blazer with a nipped waist — the one piece that upgrades everything." },
  { id: 24, name: "Cedar Oversized Denim Jacket",    category: "Outerwear", price: 2599, oldPrice: 2999, rating: 4.3, badge: "Sale",     image: "images/chic24-cedar-oversized-denim-jacket.jpg", sizes: ["S","M","L","XL"], description: "Oversized denim jacket in a mid-wash indigo, made for layering in every season." },
  { id: 25, name: "Pulse Seamless Sports Bra",       category: "Activewear",price: 899,  oldPrice: null, rating: 4.4, badge: null,       image: "images/chic25-pulse-seamless-sports-bra.jpg", sizes: ["XS","S","M","L","XL"], description: "Medium-support seamless sports bra with four-way stretch for studio to street." },
  { id: 26, name: "Stride High-Waist Leggings",      category: "Activewear",price: 1399, oldPrice: 1699, rating: 4.7, badge: "Sale",     image: "images/chic26-stride-high-waist-leggings.jpg", sizes: ["XS","S","M","L","XL"], description: "Squat-proof high-waist leggings with a hidden side pocket for keys and cards." },
  { id: 27, name: "Motion Zip-Front Track Jacket",   category: "Activewear",price: 1799, oldPrice: null, rating: 4.2, badge: "New",      image: "images/chic27-motion-zip-front-track-jacket.jpg", sizes: ["S","M","L","XL"], description: "Lightweight zip-front track jacket with breathable mesh panels for high-output days." },
  { id: 28, name: "Flex Racerback Tank",             category: "Activewear",price: 699,  oldPrice: null, rating: 4.0, badge: null,       image: "images/chic28-flex-racerback-tank.jpg", sizes: ["XS","S","M","L","XL"], description: "Featherlight racerback tank that wicks moisture through your toughest workouts." },
  { id: 29, name: "Aria Beaded Clutch",              category: "Accessories",price: 1299, oldPrice: null, rating: 4.5, badge: "New",     image: "images/chic29-aria-beaded-clutch.jpg", sizes: ["One Size"], description: "Hand-beaded clutch with a detachable chain strap for day-to-night versatility." },
  { id: 30, name: "Luma Layered Necklace Set",       category: "Accessories",price: 799,  oldPrice: 999,  rating: 4.3, badge: "Sale",    image: "images/chic30-luma-layered-necklace-set.jpg", sizes: ["One Size"], description: "A trio of delicate layered chains finished in tarnish-resistant gold plating." },
  { id: 31, name: "Reyna Wide-Brim Sun Hat",         category: "Accessories",price: 899,  oldPrice: null, rating: 4.1, badge: null,      image: "images/chic31-reyna-wide-brim-sun-hat.jpg", sizes: ["One Size"], description: "Packable straw hat with a wide brim for sun protection that doesn't skip on style." },
  { id: 32, name: "Story Woven Tote Bag",            category: "Accessories",price: 1599, oldPrice: null, rating: 4.6, badge: "New",     image: "images/chic32-story-woven-tote-bag.jpg", sizes: ["One Size"], description: "Hand-woven raffia tote lined in cotton canvas, roomy enough for everyday essentials." },
  { id: 33, name: "Elin Ruffle-Sleeve Blouse",       category: "Tops",       price: 1350, oldPrice: null, rating: 4.2, badge: null,       image: "images/chic33-elin-ruffle-sleeve-blouse.jpg", sizes: ["XS","S","M","L"], description: "Soft crepe blouse with a ruffled sleeve detail that dresses up jeans in seconds." },
  { id: 34, name: "Solene Wrap Maxi Dress",          category: "Dresses",    price: 2899, oldPrice: 3499, rating: 4.7, badge: "Sale",     image: "images/chic34-solene-wrap-maxi-dress.jpg", sizes: ["S","M","L","XL"], description: "Floor-length wrap maxi in a fluid jersey, designed to move with you all day." },
  { id: 35, name: "Priya Georgette Palazzo Set",     category: "Ethnic",     price: 2299, oldPrice: null, rating: 4.4, badge: "New",      image: "images/chic35-priya-georgette-palazzo-set.jpg", sizes: ["S","M","L","XL"], description: "Flowy georgette palazzo paired with a printed kurta top — festive comfort in one set." },
  { id: 36, name: "Vela Corduroy Overshirt",         category: "Outerwear", price: 2099, oldPrice: null, rating: 4.3, badge: null,       image: "images/chic36-vela-corduroy-overshirt.jpg", sizes: ["S","M","L","XL"], description: "Soft corduroy overshirt with patch pockets, worn open or buttoned as a light jacket." },
  { id: 37, name: "Tessa Ankle-Length Culottes",     category: "Bottoms",    price: 1499, oldPrice: 1799, rating: 4.0, badge: "Sale",     image: "images/chic37-tessa-ankle-length-culottes.jpg", sizes: ["XS","S","M","L","XL"], description: "Ankle-length culottes with a fluid drape that moves like a skirt, fits like trousers." },
  { id: 38, name: "Marigold Print Co-ord Set",       category: "Tops",       price: 2399, oldPrice: null, rating: 4.5, badge: "New",      image: "images/chic38-marigold-print-co-ord-set.jpg", sizes: ["S","M","L","XL"], description: "Matching printed top and trouser co-ord — one hanger, one perfectly put-together outfit." },
];

// Convenience lookups used across pages
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getAllCategories() {
  return [...new Set(PRODUCTS.map(p => p.category))].sort();
}

function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? "₹" + amount.toLocaleString("en-IN")
    : "Price unavailable";
}
