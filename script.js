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
    const username = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;

    const participant = {
      fullName: username,
      email: email,
      phone: document.getElementById("phone").value,
      school: document.getElementById("school").value,
      experience: document.getElementById("experience").value,
      reason: document.getElementById("reason").value,
      currentModule: 1,
      completed: false,
      examScore: "N/A"
    };

    const data = getParticipants();
    data.push(participant);
    saveParticipants(data);
    
    localStorage.setItem("username", username);
    localStorage.setItem("currentStudentEmail", email);

    alert("✅ Registration successful! Welcome to the Academy.");
    window.location.href = "academy-content.html";
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

// --- Dashboard Management (Admin Functions) ---
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

// --- DYNAMIC CERTIFICATE GENERATION ---
// This uses your uploaded template and writes the user's name on it
function generateCertificate(userName) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = "anonymous"; // Prevents security errors on some browsers
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Font Settings
        ctx.font = 'italic 70px "Times New Roman"'; // Formal font for the name
        ctx.fillStyle = "#1c2e4a"; // Matching the dark blue in your logo
        ctx.textAlign = 'center';
        
        // Position the name (Adjust 890 to align perfectly with the blank line)
        ctx.fillText(userName, canvas.width / 2, 890); 
        
        const certData = canvas.toDataURL('image/png');
        saveCertificateToUser(certData);
    };
    // MUST match your GitHub file name exactly
    img.src = 'certificate-template.png'; 
}

function saveCertificateToUser(certData) {
    const username = localStorage.getItem("username");
    const certEntry = {
        date: new Date().toLocaleDateString(),
        image: certData
    };
    // Save to a specific key for this user
    localStorage.setItem("gomun_cert_" + username, JSON.stringify(certEntry));
}

function loadUserCertificates() {
    const username = localStorage.getItem("username");
    const container = document.getElementById("certContainer");
    const msg = document.getElementById("noCertMsg");
    if (!container) return;

    const cert = JSON.parse(localStorage.getItem("gomun_cert_" + username));

    if (cert) {
        if (msg) msg.style.display = "none";
        container.innerHTML = `
            <div class="cert-card" style="margin-top:20px;">
                <img src="${cert.image}" style="width: 100%; max-width: 700px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-radius:5px;">
                <br><br>
                <a href="${cert.image}" download="GOMUN_Certificate_${username}.png" class="btn-nav" style="text-decoration:none; background:#1d4ed8; color:white; padding:10px 20px; border-radius:5px;">Download Certificate</a>
            </div>
        `;
    }
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadUserCertificates();

  const role = localStorage.getItem("gomunRole");
  const adminLink = document.getElementById("adminLink");
  const loginBtn = document.getElementById("loginBtn");

  if (role === "admin") {
    if (adminLink) adminLink.style.display = "inline-block";
    if (loginBtn) loginBtn.textContent = "Admin Logout";
  } else if (role === "user") {
    if (loginBtn) loginBtn.textContent = "Logout";
  }

  if (document.getElementById('module-1')) {
      showModule(1);
  }
}); //
