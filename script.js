// --- Helper Functions ---
function getParticipants() {
  return JSON.parse(localStorage.getItem("gomunParticipants")) || [];
}

function saveParticipants(data) {
  localStorage.setItem("gomunParticipants", JSON.stringify(data));
}

// --- Bulletproof Academy Registration Logic ---
const registrationForm = document.getElementById("registerForm");

if (registrationForm) {
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    // 1. Safely get values
    const fullName = document.getElementById("fullName")?.value || "Student";
    const email = document.getElementById("email")?.value || "no-email@gomun.org";
    const phone = document.getElementById("phone")?.value || "";
    const school = document.getElementById("school")?.value || "";
    const experience = document.getElementById("experience")?.value || "Beginner";
    const reason = document.getElementById("reason")?.value || "";

    // 2. Set Session Data
    localStorage.setItem("username", fullName); 
    localStorage.setItem("currentStudentEmail", email);
    localStorage.setItem("gomunRole", "user"); 

    // 3. Update Participant List
    const participant = {
      fullName: fullName,
      email: email,
      phone: phone,
      school: school,
      experience: experience,
      reason: reason,
      currentModule: "Module 1",
      completed: false,
      examScore: "N/A"
    };

    let data = getParticipants();
    data.push(participant);
    saveParticipants(data);

    // 4. THE REDIRECT
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
    // Try username first, then fallback to currentStudentEmail if name is missing
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
                    <img src="${cert.image}" style="width: 100%; max-width: 800px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-radius:10px; border: 1px solid #ddd;">
                    <br><br>
                    <div style="display:flex; gap:10px; justify-content:center;">
                        <a href="${cert.image}" download="GOMUN_Certificate.png" class="btn-nav btn-next" style="text-decoration:none;">Download PNG</a>
                        <button onclick="downloadPDF()" class="btn-nav btn-prev">Download PDF</button>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Error parsing certificate data", e);
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
