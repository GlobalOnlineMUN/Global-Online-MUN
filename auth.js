const authForm = document.getElementById("authForm");
const toggleAuth = document.getElementById("toggleAuth");
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const errorMsg = document.getElementById("error");
let isLogin = true;

// URL Check: login.html?admin=true shows the role selector
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('admin') === 'true') {
  document.getElementById("adminFields").style.display = "block";
}

toggleAuth.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? "Login" : "Sign Up";
  authBtn.textContent = isLogin ? "Login" : "Register";
  document.getElementById("toggleText").textContent = isLogin ? "Don't have an account?" : "Already have an account?";
  toggleAuth.textContent = isLogin ? "Sign Up" : "Login";
  errorMsg.textContent = "";
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const role = document.getElementById("role")?.value || "user";

  let users = JSON.parse(localStorage.getItem("gomunUsers")) || [];

  if (isLogin) {
    // 1. Hardcoded Admin Check
    if (user === "admin" && pass === "gomun123") {
      localStorage.setItem("gomunRole", "admin");
      window.location.href = "dashboard.html";
      return;
    }
    // 2. Local Storage User Check
    const found = users.find(u => u.username === user && u.password === pass);
    if (found) {
      localStorage.setItem("gomunRole", found.role);
      window.location.href = (found.role === "admin") ? "dashboard.html" : "academy.html";
    } else {
      errorMsg.textContent = "Invalid credentials. Try again.";
    }
  } else {
    // Signup Logic
    if (users.find(u => u.username === user)) {
      errorMsg.textContent = "Username already exists.";
    } else {
      users.push({ username: user, password: pass, role: role });
      localStorage.setItem("gomunUsers", JSON.stringify(users));
      alert("Registration successful! You can now log in.");
      location.reload(); 
    }
  }
});
