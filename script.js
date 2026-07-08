// ==========================
// DOM ELEMENTS
// ==========================
let isRendering = false;

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const summary = document.getElementById("summary");

// NEW ELEMENTS (Registration)
const regNumber = document.getElementById("regNumber");
const previewReg = document.getElementById("previewReg");
const previewRegNoText = document.getElementById("previewRegNoText");

const previewName = document.getElementById("previewName");
const previewContact = document.getElementById("previewContact");
const previewSummary = document.getElementById("previewSummary");
const photoInput = document.getElementById("photoInput");
const previewPhoto = document.getElementById("previewPhoto");

const educationContainer = document.getElementById("educationContainer");
const experienceContainer = document.getElementById("experienceContainer");
const projectContainer = document.getElementById("projectContainer");

// NEW ELEMENTS (Certificates & Languages)
const certificateContainer = document.getElementById("certificateContainer");
const languagesInput = document.getElementById("languagesInput");

const resumeSections = document.getElementById("resumeSections");

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
// BASIC INFO UPDATE
// ==========================
function updateBasicInfo(){
    previewName.textContent = fullName.value || "Your Name";
    previewContact.textContent = `${email.value || "Email"} | ${phone.value || "Phone"} | ${address.value || "Address"}`;
    previewSummary.textContent = summary.value || "Professional Summary";

    // Update Registration Number
    if(regNumber && previewReg && previewRegNoText) {
        if(regNumber.value.trim() !== "") {
            previewReg.style.display = "block";
            previewRegNoText.textContent = regNumber.value;
        } else {
            previewReg.style.display = "none";
        }
    }
}

fullName.addEventListener("input", updateBasicInfo);
email.addEventListener("input", updateBasicInfo);
phone.addEventListener("input", updateBasicInfo);
address.addEventListener("input", updateBasicInfo);
summary.addEventListener("input", updateBasicInfo);
if(regNumber) regNumber.addEventListener("input", updateBasicInfo);

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
    const template = document.getElementById("educationTemplate");
    const clone = template.content.cloneNode(true);
    educationContainer.appendChild(clone);
    renderResume();
});

document.getElementById("addExperienceBtn").addEventListener("click", () => {
    const template = document.getElementById("experienceTemplate");
    const clone = template.content.cloneNode(true);
    experienceContainer.appendChild(clone);
    renderResume();
});

document.getElementById("addProjectBtn").addEventListener("click", () => {
    const template = document.getElementById("projectTemplate");
    const clone = template.content.cloneNode(true);
    projectContainer.appendChild(clone);
    renderResume();
});

// Add Certificate Handler
const addCertBtn = document.getElementById("addCertificateBtn");
if(addCertBtn) {
    addCertBtn.addEventListener("click", () => {
        const template = document.getElementById("certificateTemplate");
        const clone = template.content.cloneNode(true);
        certificateContainer.appendChild(clone);
        renderResume();
    });
}

// ==========================
// REMOVE SECTION ENTRY
// ==========================
document.addEventListener("click", function(e){
    const removeBtn = e.target.closest(".remove-entry");
    if(removeBtn){
        removeBtn.parentElement.remove();
        renderResume();
    }
});

// ==========================
// 'CURRENTLY WORKING' CHECKBOX
// ==========================
document.addEventListener("change", function(e){
    if(e.target.classList.contains("presentCheck")){
        const card = e.target.closest(".experience-entry");
        const endDate = card.querySelector(".endDate");
        endDate.disabled = e.target.checked;
        if(e.target.checked){
            endDate.value = "";
        }
        renderResume();
    }
});

// ==========================
// AUTO-UPDATE ON INPUT
// ==========================
document.addEventListener("input", function(){
    renderResume();
});

// ==========================
// INITIAL ENTRY LOAD
// ==========================
document.getElementById("addEducationBtn").click();
document.getElementById("addExperienceBtn").click();
document.getElementById("addProjectBtn").click();
if(addCertBtn) addCertBtn.click(); 

// ==========================
// MAIN RENDER FUNCTION
// ==========================
function renderResume() {
    resumeSections.innerHTML = "";
    const sections = Array.from(document.querySelectorAll(".movable-section"));
    for (let section of sections) {
        if (section.dataset.hidden === "true") continue;
        
        switch (section.id) {
            case "educationSection":
                renderEducation();
                break;
            case "experienceSection":
                renderExperience();
                break;
            case "projectsSection":
                renderProjects();
                break;
            case "skillsSection":
                renderSkills();
                break;
            case "languagesSection":
                renderLanguages();
                break;
            case "certificatesSection":
                renderCertificates();
                break;
        }
    }
}

// ==========================
// COMPONENT RENDER FUNCTIONS
// ==========================
function renderEducation() {
    const entries = document.querySelectorAll(".education-entry");
    let hasData = false;
    let html = `<div class="resume-section"><div class="resume-title">Education</div>`;
    entries.forEach(entry => {
        const institute = entry.querySelector(".institute")?.value || "";
        const qualification = entry.querySelector(".qualification")?.value || "";
        const passing = entry.querySelector(".passingDate")?.value || "";
        if (institute.trim() === "" && qualification.trim() === "") return;
        hasData = true;
        html += `
        <div class="entry" style="margin-bottom: 18px;">
            <div class="entry-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; flex-wrap: nowrap !important;">
                <div class="entry-title" style="font-size: 17px; font-weight: 700; padding-right: 15px; width: 70%;">${institute}</div>
                <div class="entry-date" style="color: #444; font-weight: 600; white-space: nowrap !important; min-width: 80px; text-align: right;">${formatMonth(passing)}</div>
            </div>
            <div class="entry-subtitle" style="margin-top: 4px; color: #333; font-size: 15.5px;">
                ${qualification ? '• ' + qualification : ''}
            </div>
        </div>`;
    });
    html += `</div>`;
    if (hasData) resumeSections.innerHTML += html;
}

function renderExperience() {
    const entries = document.querySelectorAll(".experience-entry");
    let hasData = false;
    let html = `<div class="resume-section"><div class="resume-title">Experience</div>`;
    entries.forEach(entry => {
        const company = entry.querySelector(".company")?.value || "";
        const job = entry.querySelector(".jobTitle")?.value || "";
        const start = entry.querySelector(".startDate")?.value || "";
        const end = entry.querySelector(".endDate")?.value || "";
        const present = entry.querySelector(".presentCheck")?.checked;
        const points = entry.querySelector(".experiencePoints")?.value || "";
        if (company.trim() === "" && job.trim() === "") return;
        hasData = true;
        let bullets = "";
        points.split("\n").filter(p => p.trim() !== "").forEach(point => {
            bullets += `<li style="margin-bottom: 5px; line-height: 1.6;">${point}</li>`;
        });
        html += `
        <div class="entry" style="margin-bottom: 18px;">
            <div class="entry-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; flex-wrap: nowrap !important;">
                <div style="padding-right: 15px; width: 70%;">
                    <div class="entry-title" style="font-size: 17px; font-weight: 700;">${company}</div>
                    <div class="entry-subtitle" style="margin-top: 4px; color: #555;">${job ? '• ' + job : ''}</div>
                </div>
                <div class="entry-date" style="color: #444; font-weight: 600; white-space: nowrap !important; min-width: 100px; text-align: right;">
                    ${formatMonth(start)} - ${present ? "Present" : formatMonth(end)}
                </div>
            </div>
            <ul style="margin-top: 8px; padding-left: 22px;">${bullets}</ul>
        </div>`;
    });
    html += `</div>`;
    if (hasData) resumeSections.innerHTML += html;
}

function renderProjects(){
    const entries = document.querySelectorAll(".project-entry");
    let hasData = false;
    let html = `<div class="resume-section"><div class="resume-title">Projects</div>`;
    entries.forEach(entry=>{
        const project = entry.querySelector(".projectName")?.value || "";
        const points = entry.querySelector(".projectPoints")?.value || "";
        if(project.trim()==="") return;
        hasData = true;
        let bullets = "";
        points.split("\n").filter(p=>p.trim()!=="").forEach(point=>{
            bullets += `<li>${point}</li>`;
        });
        html += `
        <div class="entry">
            <div class="entry-title">${project}</div>
            <ul>${bullets}</ul>
        </div>`;
    });
    html += `</div>`;
    if(hasData) resumeSections.innerHTML += html;
}

function renderSkills(){
    const skillsInput = document.getElementById("skillsInput");
    if(!skillsInput) return;
    const skills = skillsInput.value.split("\n").filter(skill => skill.trim() !== "");
    if(skills.length === 0) return;
    let html = `<div class="resume-section"><div class="resume-title">Skills</div><ul class="skills-list">`;
    skills.forEach(skill=>{ html += `<li>${skill}</li>`; });
    html += `</ul></div>`;
    resumeSections.innerHTML += html;
}

function renderLanguages(){
    if(!languagesInput) return;
    const langs = languagesInput.value.split("\n").filter(lang => lang.trim() !== "");
    if(langs.length === 0) return;
    // Reusing the 'skills-list' class to maintain consistent UI design
    let html = `<div class="resume-section"><div class="resume-title">Languages</div><ul class="skills-list">`;
    langs.forEach(lang=>{ html += `<li>${lang}</li>`; });
    html += `</ul></div>`;
    resumeSections.innerHTML += html;
}

function renderCertificates(){
    const entries = document.querySelectorAll(".certificate-entry");
    let hasData = false;
    let html = `<div class="resume-section"><div class="resume-title">Certificates</div>`;
    entries.forEach(entry=>{
        const name = entry.querySelector(".certName")?.value || "";
        const details = entry.querySelector(".certDetails")?.value || "";
        if(name.trim()==="") return;
        hasData = true;
        html += `
        <div class="entry" style="margin-bottom: 12px;">
            <div class="entry-title" style="font-size: 16px; font-weight: 700;">${name}</div>
            <div class="entry-subtitle" style="margin-top: 2px; color: #555;">${details}</div>
        </div>`;
    });
    html += `</div>`;
    if(hasData) resumeSections.innerHTML += html;
}

// ==========================
// VISIBILITY TOGGLE (HIDE/SHOW)
// ==========================
document.addEventListener("click", function(e){
    const hideBtn = e.target.closest(".hide-btn");
    if(!hideBtn) return;
    const section = hideBtn.closest(".section-card");
    const icon = hideBtn.querySelector("i");
    
    // Includes newly added inputs: #languagesInput and #certificateContainer
    const content = section.querySelector(
        "#educationContainer, #experienceContainer, #projectContainer, #skillsInput, #languagesInput, #certificateContainer"
    );
    const addBtn = section.querySelector(".add-btn");
    const isHidden = section.dataset.hidden === "true";

    if(isHidden){
        section.dataset.hidden = "false";
        content.style.display = "block";
        if(addBtn) addBtn.style.display = "flex";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        section.dataset.hidden = "true";
        content.style.display = "none";
        if(addBtn) addBtn.style.display = "none";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
    renderResume(); 
});

// ==========================
// DELETE, MOVE UP, MOVE DOWN
// ==========================
document.addEventListener("click", function(e){
    const deleteBtn = e.target.closest(".delete-btn");
    if(!deleteBtn) return;
    const section = deleteBtn.closest(".section-card");
    if(confirm("Are you sure you want to delete this section?")){
        section.style.display = "none";
    }
});

document.addEventListener("click", function(e){
    const upBtn = e.target.closest(".up-btn");
    if(!upBtn) return;
    const section = upBtn.closest(".movable-section");
    const prev = section.previousElementSibling;
    if(prev && prev.classList.contains("movable-section")){
        prev.before(section);
        setTimeout(() => { renderResume(); }, 0);
    }
});

document.addEventListener("click", function(e){
    const downBtn = e.target.closest(".down-btn");
    if(!downBtn) return;
    const section = downBtn.closest(".movable-section");
    const next = section.nextElementSibling;
    if(next && next.classList.contains("movable-section")){
        next.after(section);
        setTimeout(() => { renderResume(); }, 0);
    }
});

// ==========================
// DYNAMIC FONT STYLING
// ==========================
window.addEventListener("load", () => {
    const fontSelect = document.getElementById("fontSelect");
    if (!fontSelect) return;
    function applyFont() {
        const selectedFont = fontSelect.value;
        const previewEl = document.getElementById("resumePreview");
        if (previewEl) {
            previewEl.style.setProperty("font-family", selectedFont, "important");
            previewEl.querySelectorAll("*").forEach(el => {
                el.style.setProperty("font-family", selectedFont, "important");
            });
        }
    }
    fontSelect.addEventListener("change", applyFont);
    const observer = new MutationObserver(applyFont);
    const targetSection = document.getElementById("resumeSections");
    if (targetSection) {
        observer.observe(targetSection, { childList: true, subtree: true });
    }
    applyFont();
});

// ==========================
// PDF GENERATION & EXPORT
// ==========================
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        let userName = fullName.value.trim();
        if (userName === "") userName = "Resume";
        
        const fileName = userName.replace(/\s+/g, "_") + "_AarK_Resume.pdf";
        const resume = document.getElementById("resumePreview");

        // Validate max 2 pages limit (~1131px per page)
        if (resume.scrollHeight > 2300) {
            alert("Your resume exceeds the maximum 2-page limit. Please reduce the content or remove sections before downloading.");
            return; 
        }

        // Scroll to top to prevent blank canvas issues
        window.scrollTo(0, 0); 
        
        // Temporarily adjust styling for optimal PDF capture
        const originalPadding = resume.style.padding;
        const originalBorder = resume.style.border;
        resume.style.padding = "20px";
        resume.style.border = "none"; 

        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     fileName,
            image:        { type: "jpeg", quality: 1 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                scrollY: 0,      
                scrollX: 0
            },
            jsPDF: { 
                unit: "mm", 
                format: "a4", 
                orientation: "portrait" 
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
        };

        // Generate PDF and restore original styling upon completion
        html2pdf().set(opt).from(resume).save().then(() => {
            resume.style.padding = originalPadding;
            resume.style.border = originalBorder;
        });
    });
}

// ==========================
// INITIALIZATION ON PAGE LOAD
// ==========================
window.addEventListener("load", () => {
    updateBasicInfo();
    renderResume();
});
