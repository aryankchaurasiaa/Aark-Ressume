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

// BASIC INFO UPDATE
function updateBasicInfo(){
    previewName.textContent = fullName.value || "Your Name";
    previewContact.textContent = `${email.value || "Email"} | ${phone.value || "Phone"} | ${address.value || "Address"}`;
    previewSummary.textContent = summary.value || "Professional Summary";
}
fullName.addEventListener("input", updateBasicInfo);
email.addEventListener("input", updateBasicInfo);
phone.addEventListener("input", updateBasicInfo);
address.addEventListener("input", updateBasicInfo);
summary.addEventListener("input", updateBasicInfo);

// PHOTO HANDLER
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

// ADD SECTION ENTRIES
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

// BUTTON ACTIONS (DELETE, MOVE, HIDE)
document.addEventListener("click", (e) => {
    // Remove Entry
    if(e.target.closest(".remove-entry")) { e.target.parentElement.remove(); renderResume(); }
    
    // Delete Section
    if(e.target.closest(".delete-btn")) {
        if(confirm("Are you sure?")) e.target.closest(".section-card").style.display = "none";
    }
    
    // Move Up/Down
    if(e.target.closest(".up-btn")) {
        const section = e.target.closest(".movable-section");
        if(section.previousElementSibling) section.parentNode.insertBefore(section, section.previousElementSibling);
        renderResume();
    }
    if(e.target.closest(".down-btn")) {
        const section = e.target.closest(".movable-section");
        if(section.nextElementSibling) section.parentNode.insertBefore(section.nextElementSibling, section);
        renderResume();
    }
    
    // Hide Section
    if(e.target.closest(".hide-btn")) {
        const section = e.target.closest(".section-card");
        section.dataset.hidden = section.dataset.hidden === "true" ? "false" : "true";
        renderResume();
    }
});

// AUTO-UPDATE
document.addEventListener("input", renderResume);
document.addEventListener("change", renderResume);

// INITIAL LOAD
document.getElementById("addEducationBtn").click();
document.getElementById("addExperienceBtn").click();
document.getElementById("addProjectBtn").click();
if(addCertBtn) addCertBtn.click(); 

// RENDER ENGINE
function renderResume() {
    resumeSections.innerHTML = "";
    document.querySelectorAll(".movable-section").forEach(section => {
        if (section.style.display === "none" || section.dataset.hidden === "true") return;
        switch (section.id) {
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

// RENDER HELPERS (Same as before)
function renderEducation() {
    let html = `<div class="resume-section"><div class="resume-title">Education</div>`;
    document.querySelectorAll(".education-entry").forEach(e => {
        const inst = e.querySelector(".institute")?.value, qual = e.querySelector(".qualification")?.value, pass = e.querySelector(".passingDate")?.value;
        if (!inst && !qual) return;
        html += `<div class="entry" style="margin-bottom:10px;"><strong>${inst}</strong><br>${qual} ${pass ? '| ' + formatMonth(pass) : ''}</div>`;
    });
    if (html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}
function renderExperience() {
    let html = `<div class="resume-section"><div class="resume-title">Experience</div>`;
    document.querySelectorAll(".experience-entry").forEach(e => {
        const comp = e.querySelector(".company")?.value, job = e.querySelector(".jobTitle")?.value, start = e.querySelector(".startDate")?.value, end = e.querySelector(".endDate")?.value, present = e.querySelector(".presentCheck")?.checked, pts = e.querySelector(".experiencePoints")?.value;
        if (!comp && !job) return;
        html += `<div class="entry"><strong>${comp}</strong> - ${job}<br>${formatMonth(start)} - ${present ? "Present" : formatMonth(end)}<ul>${pts.split("\n").map(p => p.trim() ? `<li>${p}</li>` : "").join("")}</ul></div>`;
    });
    if (html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}
function renderProjects(){
    let html = `<div class="resume-section"><div class="resume-title">Projects</div>`;
    document.querySelectorAll(".project-entry").forEach(e=>{
        const proj = e.querySelector(".projectName")?.value, pts = e.querySelector(".projectPoints")?.value;
        if(!proj) return;
        html += `<div class="entry"><strong>${proj}</strong><ul>${pts.split("\n").map(p => p.trim() ? `<li>${p}</li>` : "").join("")}</ul></div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}
function renderSkills(){
    const s = skillsInput.value.split("\n").filter(i => i.trim());
    if(!s.length) return;
    resumeSections.innerHTML += `<div class="resume-section"><div class="resume-title">Skills</div><ul class="skills-list">${s.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
}
function renderLanguages(){
    const l = languagesInput.value.split("\n").filter(i => i.trim());
    if(!l.length) return;
    resumeSections.innerHTML += `<div class="resume-section"><div class="resume-title">Languages</div><ul class="skills-list">${l.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
}
function renderRegistration(){
    const r = registrationInput.value.split("\n").filter(i => i.trim());
    if(!r.length) return;
    resumeSections.innerHTML += `<div class="resume-section"><div class="resume-title">Licenses & Registrations</div><ul style="padding-left: 22px;">${r.map(i => `<li style="margin-bottom: 5px;">${i}</li>`).join("")}</ul></div>`;
}
function renderCertificates(){
    let html = `<div class="resume-section"><div class="resume-title">Certificates</div>`;
    document.querySelectorAll(".certificate-entry").forEach(e=>{
        const name = e.querySelector(".certName")?.value, det = e.querySelector(".certDetails")?.value;
        if(!name) return;
        html += `<div class="entry"><strong>${name}</strong><br>${det}</div>`;
    });
    if(html.includes("class=\"entry\"")) resumeSections.innerHTML += html + "</div>";
}

// PDF DOWNLOAD
document.getElementById("downloadBtn")?.addEventListener("click", () => {
    const resume = document.getElementById("resumePreview");
    if (resume.scrollHeight > 2300) { alert("Your resume exceeds the 2-page limit."); return; }
    html2pdf().set({ margin: 10, filename: 'Resume.pdf', jsPDF: { format: 'a4' } }).from(resume).save();
});

window.onload = () => { renderResume(); updateBasicInfo(); };
