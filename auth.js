const ADMIN_USER = "admin";
const ADMIN_PASS = "gomun123";

let isLoginMode = true;
const form = document.getElementById("loginForm");
const error = document.getElementById("error");
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggleText = document.getElementById("toggleText");

function toggleAuth() {
  isLoginMode = !isLoginMode;
  authTitle.textContent = isLoginMode ? "GOMUN Portal" : "Join GOMUN";
  authBtn.textContent = isLoginMode ? "Login" : "Sign Up";
  toggleText.innerHTML = isLoginMode 
    ? 'Don\'t have an account? <span onclick="toggleAuth()">Sign Up</span>' 
    : 'Already have an account? <span onclick="toggleAuth()">Login</span>';
  error.textContent = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("gomunUsers")) || [];

  if (isLoginMode) {
    // Admin Detection (Hidden)
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("gomunRole", "admin");
      window.location.href = "academy.html";
      return;
    }
    // User Detection
    const user = users.find(u => u.user === username && u.pass === password);
    if (user) {
      localStorage.setItem("gomunRole", "user");
      window.location.href = "academy.html";
    } else {
      error.textContent = "Invalid credentials.";
    }
  } else {
    // Sign Up Logic
    if (users.find(u => u.user === username)) {
      error.textContent = "Username already exists.";
    } else {
      users.push({ user: username, pass: password });
      localStorage.setItem("gomunUsers", JSON.stringify(users));
      alert("Account created! Please login.");
      toggleAuth();
    }
  }
});
