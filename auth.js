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
    // Admin Detection
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("gomunRole", "admin");
      localStorage.setItem("username", "Admin"); // Track the active session
      window.location.href = "academy.html";
      return;
    }
    
    // User Detection
    const user = users.find(u => u.user === username && u.pass === password);
    if (user) {
      localStorage.setItem("gomunRole", "user");
      // CRITICAL: Save the username so the Academy can track progress for this specific user
      localStorage.setItem("username", username); 
      window.location.href = "academy.html";
    } else {
      error.textContent = "Invalid credentials.";
    }
  } else {
    // Sign Up Logic
    if (users.find(u => u.user === username)) {
      error.textContent = "Username already exists.";
    } else {
      // Save the user object
      users.push({ user: username, pass: password });
      localStorage.setItem("gomunUsers", JSON.stringify(users));
      
      // Also initialize them in the participants list so they appear in the dashboard immediately
      const participants = JSON.parse(localStorage.getItem("gomunParticipants")) || [];
      participants.push({
        fullName: username,
        email: username + "@gomun.org", // Placeholder if email isn't in signup
        currentModule: "Not Started",
        examScore: "N/A",
        completed: false
      });
      localStorage.setItem("gomunParticipants", JSON.stringify(participants));

      alert("Account created! Please login.");
      toggleAuth();
    }
  }
});
