// DOM ELEMENTS
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const summary = document.getElementById("summary");
const previewName = document.getElementById("previewName");
const previewContact = document.getElementById("previewContact");
const previewSummary = document.getElementById("previewSummary");
const photoInput = document.getElementById("photoInput");
const previewPhoto = document.getElementById("previewPhoto");
const educationContainer = document.getElementById("educationContainer");
const experienceContainer = document.getElementById("experienceContainer");
const projectContainer = document.getElementById("projectContainer");
const certificateContainer = document.getElementById("certificateContainer");
const skillsInput = document.getElementById("skillsInput");
const languagesInput = document.getElementById("languagesInput");
const registrationInput = document.getElementById("registrationInput");
const resumeSections = document.getElementById("resumeSections");

// DATE FORMATTER
function formatMonth(dateString){
    if(!dateString) return "";
    const [year, month] = dateString.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month)-1]} ${year}`;
}

// BASIC INFO
function updateBasicInfo(){
    previewName.textContent = fullName.value || "Your Name";
    previewContact.textContent = `${email.value || "Email"} | ${phone.value || "Phone"} | ${address.value || "Address"}`;
    previewSummary.textContent = summary.value || "Professional Summary";
}
[fullName, email, phone, address, summary].forEach(el => el.addEventListener("input", updateBasicInfo));

// PHOTO
photoInput.addEventListener("change", function(){
    const file = this.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { previewPhoto.src = e.target.result; previewPhoto.style.display = "block"; };
    reader.readAsDataURL(file);
});

// ADD ENTRIES
document.getElementById("addEducationBtn").addEventListener("click", () => { educationContainer.appendChild(document.getElementById("educationTemplate").content.cloneNode(true)); renderResume(); });
document.getElementById("addExperienceBtn").addEventListener("click", () => { experienceContainer.appendChild(document.getElementById("experienceTemplate").content.cloneNode(true)); renderResume(); });
document.getElementById("addProjectBtn").addEventListener("click", () => { projectContainer.appendChild(document.getElementById("projectTemplate").content.cloneNode(true)); renderResume(); });
const addCertBtn = document.getElementById("addCertificateBtn");
if(addCertBtn) addCertBtn.addEventListener("click", () => { certificateContainer.appendChild(document.getElementById("certificateTemplate").content.cloneNode(true)); renderResume(); });

// BUTTON ACTIONS
document.addEventListener("click", (e) => {
    if(e.target.closest(".remove-entry")) { e.target.parentElement.remove(); renderResume(); }
    if(e.target.closest(".delete-btn")) { if(confirm("Are you sure?")) e.target.closest(".section-card").style.display = "none"; renderResume(); }
    if(e.target.closest(".up-btn")) { const s = e.target.closest(".movable-section"); if(s.previousElementSibling) s.parentNode.insertBefore(s, s.previousElementSibling); renderResume(); }
    if(e.target.closest(".down-btn")) { const s = e.target.closest(".movable-section"); if(s.nextElementSibling) s.parentNode.insertBefore(s.nextElementSibling, s); renderResume(); }
    
    // HIDE LOGIC
    if(e.target.closest(".hide-btn")) {
        const btn = e.target.closest(".hide-btn");
        const section = btn.closest(".section-card");
        const icon = btn.querySelector("i");
        const isHidden = section.dataset.hidden === "true";
        section.dataset.hidden = isHidden ? "false" : "true";
        icon.className = isHidden ? "fa-regular fa-eye" : "fa-regular fa-eye-slash";
        renderResume();
    }
});

// AUTO RENDER
document.addEventListener("input", renderResume);
document.addEventListener("change", renderResume);

// RENDER ENGINE
function renderResume() {
    resumeSections.innerHTML = "";
    document.querySelectorAll(".movable-section").forEach(s => {
        if (s.style.display === "none" || s.dataset.hidden === "true") return;
        switch (s.id) {
            case "educationSection": renderEducation(); break;
            case "experienceSection": renderExperience(); break;
            case "projectsSection": renderProjects(); break;
            case "skillsSection": renderSkills(); break;
            case "languagesSection": renderLanguages(); break;
            case "registrationSection": renderRegistration(); break;
            case "certificatesSection": renderCertificates(); break;
        }
    });
}

// RENDER HELPERS
function renderEducation() {
    let html = `<div class="resume-section"><div class="resume-title">Education</div>`;
    document.querySelectorAll(".education-entry").forEach(e => {
        const i = e.querySelector(".institute")?.value, q = e.querySelector(".qualification")?.value, p = e.querySelector(".passingDate")?.value;
        if (i || q) html += `<div class="entry"><strong>${i}</strong><br>${q} ${p ? '| ' + formatMonth(p) : ''}</div>`;
    });
    if (html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}
function renderExperience() {
    let html = `<div class="resume-section"><div class="resume-title">Experience</div>`;
    document.querySelectorAll(".experience-entry").forEach(e => {
        const c = e.querySelector(".company")?.value, j = e.querySelector(".jobTitle")?.value, s = e.querySelector(".startDate")?.value, en = e.querySelector(".endDate")?.value, pr = e.querySelector(".presentCheck")?.checked, pts = e.querySelector(".experiencePoints")?.value;
        if (c || j) html += `<div class="entry"><strong>${c}</strong> - ${j}<br>${formatMonth(s)} - ${pr ? "Present" : formatMonth(en)}<ul>${pts.split("\n").filter(p=>p.trim()).map(p => `<li>${p}</li>`).join("")}</ul></div>`;
    });
    if (html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}
function renderProjects(){
    let html = `<div class="resume-section"><div class="resume-title">Projects</div>`;
    document.querySelectorAll(".project-entry").forEach(e=>{
        const p = e.querySelector(".projectName")?.value, pts = e.querySelector(".projectPoints")?.value;
        if(p) html += `<div class="entry"><strong>${p}</strong><ul>${pts.split("\n").filter(pt=>pt.trim()).map(pt => `<li>${pt}</li>`).join("")}</ul></div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}
function renderSkills(){
    const s = skillsInput.value.split("\n").filter(i => i.trim());
    if(s.length) resumeSections.innerHTML += `<div class="resume-section"><div class="resume-title">Skills</div><ul class="skills-list">${s.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
}
function renderLanguages(){
    const l = languagesInput.value.split("\n").filter(i => i.trim());
    if(l.length) resumeSections.innerHTML += `<div class="resume-section"><div class="resume-title">Languages</div><ul class="skills-list">${l.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
}
function renderRegistration(){
    const r = registrationInput.value.split("\n").filter(i => i.trim());
    if(r.length) resumeSections.innerHTML += `<div class="resume-section"><div class="resume-title">Licenses & Registrations</div><ul style="padding-left: 22px;">${r.map(i => `<li style="margin-bottom: 5px;">${i}</li>`).join("")}</ul></div>`;
}
function renderCertificates(){
    let html = `<div class="resume-section"><div class="resume-title">Certificates</div>`;
    document.querySelectorAll(".certificate-entry").forEach(e=>{
        const n = e.querySelector(".certName")?.value, d = e.querySelector(".certDetails")?.value;
        if(n) html += `<div class="entry"><strong>${n}</strong><br>${d}</div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}

// PDF
document.getElementById("downloadBtn")?.addEventListener("click", () => {
    const resume = document.getElementById("resumePreview");
    html2pdf().set({ margin: 10, filename: 'Resume.pdf', jsPDF: { format: 'a4' } }).from(resume).save();
});

window.onload = () => { renderResume(); updateBasicInfo(); };
