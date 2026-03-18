// --- Helper Functions ---
function getParticipants() {
  return JSON.parse(localStorage.getItem("gomunParticipants")) || [];
}

function saveParticipants(data) {
  localStorage.setItem("gomunParticipants", JSON.stringify(data));
}

// --- Academy Registration Logic ---
const registrationForm = document.getElementById("registerForm");
if (registrationForm) {
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;

    // Save user info so the rest of the app knows who is logged in
    localStorage.setItem("username", fullName); 
    localStorage.setItem("currentStudentEmail", email);
    localStorage.setItem("gomunRole", "user"); // Log them in automatically

    // Save to participants list for the admin dashboard
    const participant = {
      fullName: fullName,
      email: email,
      phone: document.getElementById("phone").value,
      school: document.getElementById("school").value,
      experience: document.getElementById("experience").value,
      reason: document.getElementById("reason").value,
      currentModule: "Module 1",
      completed: false,
      examScore: "N/A"
    };

    const data = getParticipants();
    data.push(participant);
    saveParticipants(data);

    alert("✅ Registration successful! Welcome to the Academy.");
    window.location.href = "academy-content.html"; // This sends them to the lessons
  });
}

// --- Academy Module Navigation ---
function showModule(moduleNumber) {
    document.querySelectorAll('.module-container').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('active-module');
    });
    
    const target = document.getElementById('module-' + moduleNumber);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active-module');
        window.scrollTo(0, 0);
        
        const email = localStorage.getItem("currentStudentEmail");
        const data = getParticipants();
        const userIndex = data.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            data[userIndex].currentModule = "Module " + moduleNumber;
            saveParticipants(data);
        }
    }
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

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  
  const role = localStorage.getItem("gomunRole");
  const adminLink = document.getElementById("adminLink");
  
  if (role === "admin" && adminLink) {
    adminLink.style.display = "inline-block";
  }
  function loadUserCertificates() {
    const username = localStorage.getItem("username");
    const container = document.getElementById("certContainer");
    const msg = document.getElementById("noCertMsg");
    
    if (!container) return; // Exit if we aren't on the certificates page

    // Try to find the specific certificate for this user
    const certData = localStorage.getItem("gomun_cert_" + username);

    if (certData) {
        const cert = JSON.parse(certData);
        if (msg) msg.style.display = "none"; // Hide the "No certificates" message
        
        container.innerHTML = `
            <div class="cert-card" style="margin-top:20px;">
                <img src="${cert.image}" style="width: 100%; max-width: 800px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-radius:10px; border: 1px solid #ddd;">
                <br><br>
                <a href="${cert.image}" download="GOMUN_Certificate_${username}.PNG" class="btn primary" style="text-decoration:none;">Download PNG</a>
            </div>
        `;
    }
}

// Make sure this runs whenever a page loads
document.addEventListener("DOMContentLoaded", () => {
    loadUserCertificates();
    // ... keep your other initialization code here ...
});
