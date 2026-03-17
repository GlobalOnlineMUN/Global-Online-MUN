function getParticipants() {
  return JSON.parse(localStorage.getItem("gomunParticipants")) || [];
}
function saveParticipants(data) {
  localStorage.setItem("gomunParticipants", JSON.stringify(data));
}
const form = document.getElementById("registerForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const participant = {
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      school: school.value,
      experience: experience.value,
      reason: reason.value,
      completed: false,
      hours: 0
    };
    const data = getParticipants();
    data.push(participant);
    saveParticipants(data);
    alert("✅ Registration successful!");
    form.reset();
  });
}
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
      <td>${p.school}</td>
      <td>${p.experience}</td>
      <td>${p.completed ? "✅ Completed" : "⏳ In Progress"}</td>
      <td>
        <button onclick="markComplete(${index})">Complete</button>
        <button onclick="editParticipant(${index})">Edit</button>
        <button onclick="deleteParticipant(${index})">Delete</button>
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
  loadCertificates();
}
function deleteParticipant(i) {
  if (!confirm("Delete this participant?")) return;
  const data = getParticipants();
  data.splice(i, 1);
  saveParticipants(data);
  loadDashboard();
  loadCertificates();
}
function editParticipant(i) {
  const data = getParticipants();
  const p = data[i];
  const fullNameNew = prompt("Edit fullName:", p.fullName);
  const emailNew = prompt("Edit email:", p.email);
  const schoolNew = prompt("Edit school:", p.school);
  if (fullNameNew && emailNew && schoolNew) {
    p.fullName = fullNameNew;
    p.email = emailNew;
    p.school = schoolNew;
    saveParticipants(data);
    loadDashboard();
    loadCertificates();
  }
}
function loadCertificates() {
  const list = document.getElementById("certList");
  if (!list) return;
  const data = getParticipants();
  list.innerHTML = "";
  data.filter(p => p.completed).forEach((p, i) => {
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
  doc.setFontSize(26);
  doc.text("Certificate of Completion", 150, 40, { align: "center" });
  doc.setFontSize(16);
  doc.text(
    `This is to certify that ${fullName}\n\nhas successfully completed\n\n${hours} hours of training at`,
    150,
    80,
    { align: "center" }
  );
  doc.setFontSize(20);
  doc.text("GOMUN Academy", 150, 120, { align: "center" });
  doc.setFontSize(12);
  doc.text("Signed: Secretary-General, GOMUN", 30, 180);
  doc.text(new Date().toLocaleDateString(), 260, 180);

  doc.save(`${fullName}_GOMUN_Certificate.pdf`);
}
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadCertificates();
});
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);
sections.forEach(section => observer.observe(section));
function loadDashboard() {
  const table = document.getElementById("participantsTable");
  if (!table) return;
  const role = localStorage.getItem("gomunRole");
  const data = getParticipants();
  table.innerHTML = "";
  data.forEach((p, index) => {
    let actions = "View Only";
    if (role === "admin") {
      actions = `
        <button onclick="markComplete(${index})">Complete</button>
        <button onclick="editParticipant(${index})">Edit</button>
        <button onclick="deleteParticipant(${index})">Delete</button>
      `;
    }
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.fullName}</td>
      <td>${p.email}</td>
      <td>${p.school}</td>
      <td>${p.experience}</td>
      <td>${p.completed ? "✅ Completed" : "⏳ In Progress"}</td>
      <td>${actions}</td>
    `;
    table.appendChild(row);
  });
}