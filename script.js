// --- FIXED Helper Functions ---
function getParticipants() {
  return JSON.parse(localStorage.getItem("gomunParticipants")) || [];
}

function saveParticipants(data) {
  // FIX: Actually save the data to the correct key!
  localStorage.setItem("gomunParticipants", JSON.stringify(data));
}

// --- Fixed Academy Registration Logic ---
const registrationForm = document.getElementById("registerForm");

if (registrationForm) {
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();

    // 1. Update Participant List for Admin Dashboard
    const participants = getParticipants();
    const newParticipant = {
      fullName: fullName,
      email: email,
      currentModule: "Module 1",
      completed: false,
      examScore: "N/A"
    };
    participants.push(newParticipant);
    saveParticipants(participants);

    // 2. Add them to the LOGIN database so they can log back in
    const users = JSON.parse(localStorage.getItem("gomunUsers")) || [];
    if (!users.find(u => u.user === fullName)) {
        users.push({ user: fullName, pass: "123" }); // Default temporary password
        localStorage.setItem("gomunUsers", JSON.stringify(users));
    }

    // 3. Set Session Data & Redirect
    localStorage.setItem("username", fullName); 
    localStorage.setItem("gomunRole", "user"); 
    localStorage.setItem("currentStudentEmail", email); // Essential for progress tracking!

    alert("✅ Registration successful! Welcome to Module 1.");
    window.location.href = "academy-content.html";
  });
}


// --- Academy Module Navigation ---
function showModule(moduleNumber) {
    // 1. VISUAL SWITCH (Do this first so the user sees the change)
    const modules = document.querySelectorAll('.module-container');
    modules.forEach(m => {
        m.style.display = 'none';
        m.classList.remove('active-module');
    });
    
    const target = document.getElementById('module-' + moduleNumber);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active-module');
        window.scrollTo(0, 0);
    } else {
        console.error("Module " + moduleNumber + " not found!");
        return; // Stop if the module ID is wrong
    }

    // 2. BACKGROUND SAVE (Try to save, but don't break the page if it fails)
    try {
        const email = localStorage.getItem("currentStudentEmail");
        if (email) {
            const data = JSON.parse(localStorage.getItem("gomunParticipants")) || [];
            const userIndex = data.findIndex(u => u.email === email);
            if (userIndex !== -1) {
                data[userIndex].currentModule = "Module " + moduleNumber;
                localStorage.setItem("gomunParticipants", JSON.stringify(data));
            }
        }
    } catch (err) {
        console.warn("Could not save progress, but moving to next module anyway.");
    }
}

// --- Resume Course Logic ---
function checkProgress() {
  const email = localStorage.getItem("currentStudentEmail");
  const resumeSection = document.getElementById("resumeSection");
  const welcomeMsg = document.getElementById("welcomeBackMsg");

  if (email && resumeSection) {
    const data = getParticipants();
    const user = data.find(p => p.email === email);

    if (user && user.currentModule && user.currentModule !== "Not Started") {
      resumeSection.style.display = "block";
      if(welcomeMsg) welcomeMsg.innerText = `Welcome back, ${user.fullName}!`;
    }
  }
}

function resumeAcademy() {
  window.location.href = "academy-content.html";
}

// --- Dashboard Management ---
function loadDashboard() {
  const table = document.getElementById("participantsTable");
  if (!table) return;
  
  const data = getParticipants();
  table.innerHTML = ""; 

  data.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.fullName}</td>
      <td>${p.email}</td>
      <td>${p.currentModule || "Not Started"}</td> 
      <td>${p.examScore || "Pending"}</td>        
      <td>${p.completed ? "✅ Passed" : "⏳ Learning"}</td>
      <td>
        <button onclick="deleteParticipant(${index})" style="background:#dc2626; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Remove</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function deleteParticipant(i) {
  if (!confirm("Are you sure you want to delete this participant?")) return;
  const data = getParticipants();
  data.splice(i, 1);
  saveParticipants(data);
  loadDashboard();
}

// --- Certificate Loading ---
function loadUserCertificates() {
    const username = localStorage.getItem("username");
    const container = document.getElementById("certContainer");
    const msg = document.getElementById("noCertMsg");
    
    if (!container || !username) return; 

    const certData = localStorage.getItem("gomun_cert_" + username);

    if (certData) {
        try {
            const cert = JSON.parse(certData);
            if (msg) msg.style.display = "none"; 
            
            container.innerHTML = `
                <div class="cert-card" style="margin-top:20px;">
                    <img src="${cert.image}" style="width: 100%; max-width: 800px; border: 1px solid #ddd;">
                    <br><br>
                    <a href="${cert.image}" download="GOMUN_Certificate.png" class="btn-nav btn-next">Download Certificate</a>
                </div>
            `;
        } catch (e) {
            console.error("Error loading certificate:", e);
        }
    }
}


// --- Unified Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  // Check Admin Link
  const role = localStorage.getItem("gomunRole");
  const adminLink = document.getElementById("adminLink");
  if (role === "admin" && adminLink) {
    adminLink.style.display = "inline-block";
  }

  // Run page-specific functions
  checkProgress();
  loadDashboard();
  loadUserCertificates();
});
