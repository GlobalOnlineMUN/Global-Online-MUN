const ADMIN_USER = "admin";
const ADMIN_PASS = "gomun123";
const USER_USER = "user";
const USER_PASS = "gomun";
const form = document.getElementById("loginForm");
const error = document.getElementById("error");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (role === "admin" && username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("gomunRole", "admin");
    window.location.href = "index.html";
  } else if (role === "user" && username === USER_USER && password === USER_PASS) {
    localStorage.setItem("gomunRole", "user");
    window.location.href = "index.html";
  } else {
    error.textContent = "Invalid credentials.";
  }
});
