/* =========================================================
   ChicCharm — Shared UI Behaviour
   ========================================================= */

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
  }

  // Highlight the current page in the navbar
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active-link");
    }
  });

  // Newsletter form (front-end only for now)
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value;
      const msg = document.getElementById("newsletter-msg");
      if (msg) {
        msg.textContent = `Thanks! A confirmation has been sent to ${email}.`;
        msg.classList.add("show");
      }
      newsletterForm.reset();
    });
  }

  // Simple FAQ accordion (used on contact.html)
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Contact form validation (front-end only for now)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("contact-status");
      status.textContent = "Message sent! Our team will get back to you within 2 business days.";
      status.classList.add("show");
      contactForm.reset();
    });
  }
});
