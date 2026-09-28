/* =========================================================
   ChicCharm — Login / Signup Logic (Mock)
   ---------------------------------------------------------
   There's no real backend, so any email + password (6+ chars)
   is accepted. This is intentional — it's a placeholder for
   real authentication (e.g. POST /api/auth/login and
   POST /api/auth/signup) that a backend would add later.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const tabSignIn = document.getElementById("tab-signin");
  const tabSignUp = document.getElementById("tab-signup");
  const formSignIn = document.getElementById("signin-form");
  const formSignUp = document.getElementById("signup-form");

  tabSignIn.addEventListener("click", () => switchTab("signin"));
  tabSignUp.addEventListener("click", () => switchTab("signup"));

  function switchTab(tab) {
    const isSignIn = tab === "signin";
    tabSignIn.classList.toggle("active", isSignIn);
    tabSignUp.classList.toggle("active", !isSignIn);
    formSignIn.style.display = isSignIn ? "block" : "none";
    formSignUp.style.display = isSignIn ? "none" : "block";
  }

  // If a redirect target was already logged in, skip straight past
  if (isLoggedIn()) {
    redirectAfterLogin();
  }

formSignIn.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;
  const errorEl = document.getElementById("signin-error");

  errorEl.textContent = "";
  errorEl.classList.remove("show");

  try {

    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.message || "Invalid email or password."
      );
    }

    /*
      Save authetication information.
    */

      localStorage.setItem(
        "chiccharm_token",
        data.token
      );
      
      data.user.id = data.user.id || data.user.user_id;

      
      localStorage.setItem(
        "chiccharm_user",
        JSON.stringify(data.user)
      );


      /* Keep existing ChicCharm login system working */


       loginUser({
  name: data.user.name,
  email: data.user.email
});

       /* Redirect after successful login */

      redirectAfterLogin();

  } catch (error) {
    
    console.error(
      "Login error:",
      error
    );

    errorEl.textContent =
      error.message ||
      "Invalid email or password. Please try again.";

    errorEl.classList.add("show");

    };

  });
formSignUp.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const errorEl = document.getElementById("signup-error");

  errorEl.textContent = "";
  errorEl.classList.remove("show");

  if (password.length < 6) {
    errorEl.textContent =
      "Password should be at least 6 characters.";
    errorEl.classList.add("show");
    return;
  }

  if (name.length < 2) {
    errorEl.textContent =
      "Please enter your full name.";
    errorEl.classList.add("show");
    return;
  }

  try {

    /*
      Split the full name into first and last name.
      Example:
      "Kiran Ghumman"
      → first_name = Kiran
      → last_name = Ghumman
    */

    const nameParts = name.split(/\s+/);

    const first_name = nameParts[0];

    const last_name =
      nameParts.slice(1).join(" ") || null;


    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

       body: JSON.stringify({
        name: name,
        email: email,
        password: password
})
      }
    );


    const data = await response.json();

console.log("Registration response:", data);

if (!response.ok) {
    throw new Error(data.error || data.message || "Unable to create account.");
}

if (data.token) {
    localStorage.setItem("chiccharm_token", data.token);
}

if (data.user) {
    localStorage.setItem("chiccharm_user", JSON.stringify(data.user));

    loginUser({
        name: data.user.name,
        email: data.user.email
    });
}

redirectAfterLogin();

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    errorEl.textContent =
      error.message ||
      "Unable to create account. Please try again.";

    errorEl.classList.add("show");

  }

});
});

function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function redirectAfterLogin() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  window.location.href = redirect && redirect !== "login.html" ? redirect : "index.html";
}
