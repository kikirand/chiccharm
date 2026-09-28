/* =========================================================
   ChicCharm — Mock Authentication
   ---------------------------------------------------------
   No real backend yet, so "login" just stores a user object
   in localStorage. Any email/password combination works —
   this is intentional for a demo/student project.

   When a real backend is added, replace loginUser()/getUser()
   with calls to something like:
     POST /api/auth/login   -> returns a session token
     GET  /api/auth/me      -> returns the current user
   and swap localStorage for an httpOnly cookie or JWT stored
   the way your backend expects. The rest of the site (the
   account link in the navbar, requireLogin() on protected
   pages) can stay exactly the same.
   ========================================================= */

const USER_KEY = "chiccharm_user";

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function isLoggedIn() {
  return !!getUser();
}

function loginUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  renderAccountNav();
}

function logoutUser() {
  localStorage.removeItem(USER_KEY);
  renderAccountNav();
}

// Redirects to the login page if nobody is logged in.
// Pages that require an account call this at the top of their script.
// Returns true if the user is logged in (so the caller can continue).
function requireLogin(redirectTarget) {
  if (!isLoggedIn()) {
    const target = redirectTarget || window.location.pathname.split("/").pop();
    window.location.href = `login.html?redirect=${encodeURIComponent(target)}`;
    return false;
  }
  return true;
}

function renderAccountNav() {
  const accountLink = document.getElementById("account-link");
  const logoutLink = document.getElementById("logout-link");
  if (!accountLink) return;

  const user = getUser();
  if (user) {
    accountLink.textContent = `Hi, ${user.name.split(" ")[0]}`;
    accountLink.href = "orders.html";
    if (logoutLink) logoutLink.style.display = "inline";
  } else {
    accountLink.textContent = "Login";
    accountLink.href = "login.html";
    if (logoutLink) logoutLink.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderAccountNav();
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
      window.location.href = "index.html";
    });
  }
});
