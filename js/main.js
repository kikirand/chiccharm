/* ==========================================================================
   ChicCharm — Shared page behaviour (nav state, mobile menu, etc.)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  paintAuthNav();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // Newsletter mock signup (works on any page that includes the form)
  const newsletterForm = document.querySelector("[data-newsletter-form]");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = newsletterForm.querySelector("[data-newsletter-msg]");
      if (msg) { msg.textContent = "Thanks for subscribing! Watch your inbox for 10% off."; msg.style.display = "block"; }
      newsletterForm.reset();
    });
  }
});

function paintAuthNav() {
  const el = document.querySelector("[data-auth-slot]");
  if (!el) return;
  const user = getCurrentUser();
  if (user) {
    el.innerHTML = `<a href="orders.html">👤 Hi, ${user.name.split(" ")[0]}</a> <button class="link-btn" data-logout>Logout</button>`;
    const logoutBtn = el.querySelector("[data-logout]");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
  } else {
    el.innerHTML = `<a href="login.html">👤 Login</a>`;
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function statusPillClass(status) {
  if (status === "Delivered") return "status-delivered";
  if (status === "Shipped") return "status-shipped";
  return "status-processing";
}
