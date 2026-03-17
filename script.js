// --- Helper Functions ---
function getParticipants() {
  return JSON.parse(localStorage.getItem("gomunParticipants")) || [];
}

function saveParticipants(data) {
  localStorage.setItem("gomunParticipants", JSON.stringify(data));
}

// --- Academy Registration Logic ---
// This replaces your old form listener to include the redirection to Module 1
const registrationForm = document.getElementById("registerForm");
if (registrationForm) {
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const participant = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      school: document.getElementById("school").value,
      experience: document.getElementById("experience").value,
      reason: document.getElementById("reason").value,
      currentModule: 1, // Track progress
      completed: false,
      hours: 0
    };

    const data = getParticipants();
    data.push(participant);
    saveParticipants(data);
    
    // Store email to track who is currently signed in for the session
    localStorage.setItem("currentStudentEmail", participant.email);

    alert("✅ Registration successful! Welcome to the Academy.");
    window.location.href = "academy-content.html"; // Redirect to curriculum
  });
}

// --- Academy Module Navigation ---
function showModule(moduleNumber) {
    // Hide all modules
    document.querySelectorAll('.module-container').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('active-module');
    });
    
    // Show the selected one
    const target = document.getElementById('module-' + moduleNumber);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active-module');
        window.scrollTo(0, 0); // Jump to top on mobile
        
        // Update progress in the background
        const email = localStorage.getItem("currentStudentEmail");
        const data = getParticipants();
        const userIndex = data.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            data[userIndex].currentModule = moduleNumber;
            saveParticipants(data);
        }
    }
}

// --- Dashboard Management (Admin Functions) ---
function loadDashboard() {
  const table = document.getElementById("participantsTable");
  if (!table) return;
  
  const data = JSON.parse(localStorage.getItem("gomunParticipants")) || [];
  table.innerHTML = ""; 

  data.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.fullName}</td>
      <td>${p.email}</td>
      <td>${p.currentModule || "Not Started"}</td> <td>${p.examScore || "Pending"}</td>        <td>${p.completed ? "✅ Passed" : "⏳ Learning"}</td>
      <td>
        <button onclick="deleteParticipant(${index})" style="background:#dc2626; color:white;">Remove</button>
      </td>
    `;
    table.appendChild(row);
  });
}


function markComplete(i) {
  const data = getParticipants();
  data[i].completed = true;
  data[i].hours = 10;
  saveParticipants(data);
  loadDashboard();
}

function deleteParticipant(i) {
  if (!confirm("Are you sure you want to delete this participant?")) return;
  const data = getParticipants();
  data.splice(i, 1);
  saveParticipants(data);
  loadDashboard();
}

function editParticipant(i) {
  const data = getParticipants();
  const p = data[i];
  const fullNameNew = prompt("Edit Full Name:", p.fullName);
  const emailNew = prompt("Edit Email:", p.email);
  const schoolNew = prompt("Edit School:", p.school);
  if (fullNameNew && emailNew && schoolNew) {
    p.fullName = fullNameNew;
    p.email = emailNew;
    p.school = schoolNew;
    saveParticipants(data);
    loadDashboard();
  }
}

// --- Certificates & PDF Generation ---
function loadCertificates() {
  const list = document.getElementById("certList");
  if (!list) return;
  const data = getParticipants();
  list.innerHTML = "";
  data.filter(p => p.completed).forEach((p) => {
    const div = document.createElement("div");
    div.className = "cert";
    div.innerHTML = `
      <h4>${p.fullName}</h4>
      <p>${p.hours} hours • GOMUN Academy</p>
      <button onclick="generatePDF('${p.fullName}', ${p.hours})">
        Download PDF
      </button>
    `;
    list.appendChild(div);
  });
}

function generatePDF(fullName, hours) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape");
  
  // Design elements
  doc.setDrawColor(29, 78, 216);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190); 

  doc.setFontSize(30);
  doc.setTextColor(29, 78, 216);
  doc.text("Certificate of Completion", 148, 50, { align: "center" });
  
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text("This is to certify that", 148, 80, { align: "center" });
  
  doc.setFontSize(24);
  doc.text(fullName, 148, 100, { align: "center" });
  
  doc.setFontSize(16);
  doc.text(`has successfully completed ${hours} hours of training at`, 148, 120, { align: "center" });
  
  doc.setFontSize(22);
  doc.text("GOMUN Academy", 148, 140, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Signed: Secretary-General, GOMUN", 40, 175);
  doc.text(new Date().toLocaleDateString(), 230, 175);

  doc.save(`${fullName}_GOMUN_Certificate.pdf`);
}

// --- Initialization & UI Observers ---
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadCertificates();

  // Reveal animations for sections
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach(section => observer.observe(section));

  // Auto-start Module 1 if we are on the academy content page
  if (document.getElementById('module-1')) {
      showModule(1);
  }
});
