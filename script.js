// ==========================
// DOM ELEMENTS
// ==========================
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
const fontSelect = document.getElementById("fontSelect");

// ==========================
// DATE FORMATTER
// ==========================
function formatMonth(dateString){
    if(!dateString) return "";
    const [year, month] = dateString.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month)-1]} ${year}`;
}

// ==========================
// BASIC INFO & FONT UPDATE
// ==========================
function updateBasicInfo(){
    previewName.textContent = fullName.value || "Your Name";
    previewContact.textContent = `${email.value || "Email"} | ${phone.value || "Phone"} | ${address.value || "Address"}`;
    previewSummary.textContent = summary.value || "";
}
[fullName, email, phone, address, summary].forEach(el => el.addEventListener("input", updateBasicInfo));

if(fontSelect) {
    fontSelect.addEventListener("change", function() {
        document.getElementById("resumePreview").style.fontFamily = this.value;
    });
}

// ==========================
// PROFILE PHOTO HANDLER
// ==========================
photoInput.addEventListener("change", function(){
    const file = this.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
        previewPhoto.src = e.target.result;
        previewPhoto.style.display = "block";
    };
    reader.readAsDataURL(file);
});

// ==========================
// ADD SECTION ENTRIES
// ==========================
document.getElementById("addEducationBtn").addEventListener("click", () => {
    educationContainer.appendChild(document.getElementById("educationTemplate").content.cloneNode(true));
    renderResume();
});

document.getElementById("addExperienceBtn").addEventListener("click", () => {
    experienceContainer.appendChild(document.getElementById("experienceTemplate").content.cloneNode(true));
    renderResume();
});

document.getElementById("addProjectBtn").addEventListener("click", () => {
    projectContainer.appendChild(document.getElementById("projectTemplate").content.cloneNode(true));
    renderResume();
});

const addCertBtn = document.getElementById("addCertificateBtn");
if(addCertBtn) {
    addCertBtn.addEventListener("click", () => {
        certificateContainer.appendChild(document.getElementById("certificateTemplate").content.cloneNode(true));
        renderResume();
    });
}

// ==========================
// BUTTON LOGIC (DELETE, MOVE, HIDE)
// ==========================
document.addEventListener("click", (e) => {
    if(e.target.closest(".remove-entry")) { 
        e.target.parentElement.remove(); 
        renderResume(); 
    }
    
    if(e.target.closest(".delete-btn")) {
        if(confirm("Are you sure you want to delete this section?")) {
            e.target.closest(".section-card").style.display = "none";
            renderResume();
        }
    }
    
    if(e.target.closest(".hide-btn")) {
        const btn = e.target.closest(".hide-btn");
        const section = btn.closest(".section-card");
        const icon = btn.querySelector("i");
        
        section.classList.toggle("section-hidden");
        
        if (section.classList.contains("section-hidden")) {
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
        renderResume();
    }
    
    if(e.target.closest(".up-btn")) {
        const s = e.target.closest(".movable-section");
        if(s.previousElementSibling && s.previousElementSibling.classList.contains("movable-section")) {
            s.parentNode.insertBefore(s, s.previousElementSibling);
            renderResume();
        }
    }
    
    if(e.target.closest(".down-btn")) {
        const s = e.target.closest(".movable-section");
        if(s.nextElementSibling) {
            s.parentNode.insertBefore(s.nextElementSibling, s);
            renderResume();
        }
    }
});

// ==========================
// RENDER ENGINE
// ==========================
document.addEventListener("input", renderResume);
document.addEventListener("change", renderResume);

function renderResume() {
    resumeSections.innerHTML = "";
    document.querySelectorAll(".movable-section").forEach(s => {
        if (s.style.display === "none" || s.classList.contains("section-hidden")) return; 
        
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

// ==========================
// RENDER HELPERS
// ==========================
function renderEducation() {
    let html = `<div class="resume-section"><div class="resume-title">Education</div>`;
    document.querySelectorAll(".education-entry").forEach(e => {
        const i = e.querySelector(".institute")?.value, q = e.querySelector(".qualification")?.value, p = e.querySelector(".passingDate")?.value;
        if(i || q) html += `<div class="entry"><div class="entry-header"><div class="entry-title">${i}</div><div class="entry-date">${p ? formatMonth(p) : ''}</div></div><div class="entry-subtitle">${q}</div></div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}

function renderExperience() {
    let html = `<div class="resume-section"><div class="resume-title">Experience</div>`;
    document.querySelectorAll(".experience-entry").forEach(e => {
        const c = e.querySelector(".company")?.value, j = e.querySelector(".jobTitle")?.value, s = e.querySelector(".startDate")?.value, en = e.querySelector(".endDate")?.value, pr = e.querySelector(".presentCheck")?.checked, pts = e.querySelector(".experiencePoints")?.value;
        const finalDate = (s || pr || en) ? `${s ? formatMonth(s) : ''} - ${pr ? "Present" : formatMonth(en)}` : '';
        if(c || j) html += `<div class="entry"><div class="entry-header"><div class="entry-title">${c}</div><div class="entry-date">${finalDate !== " - " ? finalDate : ''}</div></div><div class="entry-subtitle">${j}</div><ul>${pts.split("\n").filter(p=>p.trim()).map(p => `<li>${p}</li>`).join("")}</ul></div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}

function renderProjects(){
    let html = `<div class="resume-section"><div class="resume-title">Projects</div>`;
    document.querySelectorAll(".project-entry").forEach(e=>{
        const p = e.querySelector(".projectName")?.value, pts = e.querySelector(".projectPoints")?.value;
        if(p) html += `<div class="entry"><div class="entry-title">${p}</div><ul>${pts.split("\n").filter(pt=>pt.trim()).map(pt => `<li>${pt}</li>`).join("")}</ul></div>`;
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
        if(n) html += `<div class="entry"><div class="entry-header"><div class="entry-title">${n}</div><div class="entry-date">${d}</div></div></div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}

// ==========================
// PDF DOWNLOAD (BULLETPROOF CLONE METHOD)
// ==========================
document.getElementById("downloadBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("downloadBtn");
    const originalText = btn.innerHTML;
    
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Downloading...`;
    btn.disabled = true;

    let userName = fullName.value.trim() || "Resume";
    const fileName = userName.replace(/\s+/g, "_") + "_AarK_Resume.pdf";
    const resume = document.getElementById("resumePreview");

    // 1. Ek temporary container banao jo ekdum 0,0 position par ho
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "800px";
    wrapper.style.background = "white";
    wrapper.style.zIndex = "-9999"; // Background me hide karne ke liye

    // 2. Resume ki copy (clone) banao aur center-margin hata do
    const clone = resume.cloneNode(true);
    clone.style.setProperty("margin", "0", "important"); // Sabse important line (Left cut roke gaa)
    clone.style.setProperty("width", "800px", "important");
    clone.style.setProperty("max-width", "800px", "important");
    clone.style.setProperty("box-shadow", "none", "important");

    // 3. Clone ko page me add karo
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const opt = {
        margin:       [10, 0, 10, 0], 
        filename:     fileName, 
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            scrollX: 0, 
            scrollY: 0, 
            windowWidth: 800 
        }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    };

    // 4. PDF generate karo aur clone ko delete kar do
    html2pdf().set(opt).from(clone).save().then(() => {
        document.body.removeChild(wrapper);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch((err) => {
        document.body.removeChild(wrapper);
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
});

// ==========================
// INITIALIZATION
// ==========================
window.onload = () => { 
    updateBasicInfo();
    renderResume(); 
};
