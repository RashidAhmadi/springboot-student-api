const BASE_URL = "http://localhost:8080/api/instructors";

let instructorToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
    loadInstructors();
    document.getElementById("searchInput").addEventListener("input", searchInstructors);
    document.getElementById("instructorForm").addEventListener("submit", saveInstructor);
});

// ================= LOAD ALL INSTRUCTORS =================

function loadInstructors() {
    fetch(`${BASE_URL}/all`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("instructorTableBody");
            tbody.innerHTML = "";

            data.forEach((ins, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${ins.name}</td>
                        <td>${ins.lastname}</td>
                        <td>${ins.faculty}</td>
                        <td>${ins.department}</td>
                        <td>${ins.academicRank}</td>
                        <td>${ins.degree}</td>
                        <td>${ins.employment}</td>
                        <td>${ins.proficiency}</td>
                        <td class="actions">
                            <button class="btn-edit" onclick="openEditPopup(${ins.id})">Edit</button>
                            <button class="btn-delete" onclick="openDeletePopup(${ins.id})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(err => console.error("Error loading instructors:", err));
}

// ================= SEARCH =================

function searchInstructors() {
    const keyword = document.getElementById("searchInput").value.trim();

    if (keyword === "") {
        loadInstructors();
        return;
    }

    fetch(`${BASE_URL}/search?keyword=${keyword}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("instructorTableBody");
            tbody.innerHTML = "";

            data.forEach((ins, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${ins.name}</td>
                        <td>${ins.lastname}</td>
                        <td>${ins.faculty}</td>
                        <td>${ins.department}</td>
                        <td>${ins.academicRank}</td>
                        <td>${ins.degree}</td>
                        <td>${ins.employment}</td>
                        <td>${ins.proficiency}</td>
                        <td>
                            <button onclick="openEditPopup(${ins.id})">Edit</button>
                            <button onclick="openDeletePopup(${ins.id})" class="btn-delete">Delete</button>
                        </td>
                    </tr>`;
            });
        });
}

// ================= ADD / EDIT POPUP =================

function openAddPopup() {
    document.getElementById("popupTitle").innerText = "Add Instructor";
    document.getElementById("instructorForm").reset();
    document.getElementById("instructorId").value = "";
    document.getElementById("popup").style.display = "flex";
}

function openEditPopup(id) {
    fetch(`${BASE_URL}/${id}`)
        .then(res => res.json())
        .then(inst => {
            document.getElementById("popupTitle").innerText = "Edit Instructor";
            document.getElementById("instructorId").value = inst.id;

            document.getElementById("name").value = inst.name;
            document.getElementById("lastname").value = inst.lastname;
            document.getElementById("faculty").value = inst.faculty;
            document.getElementById("department").value = inst.department;
            document.getElementById("academicRank").value = inst.academicRank;
            document.getElementById("degree").value = inst.degree;
            document.getElementById("employment").value = inst.employment;
            document.getElementById("proficiency").value = inst.proficiency;

            document.getElementById("popup").style.display = "flex";
        });
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// ================= SAVE =================

function saveInstructor(e) {
    e.preventDefault();

    const id = document.getElementById("instructorId").value;

    const instructor = {
        name: document.getElementById("name").value,
        lastname: document.getElementById("lastname").value,
        faculty: document.getElementById("faculty").value,
        department: document.getElementById("department").value,
        academicRank: document.getElementById("academicRank").value,
        degree: document.getElementById("degree").value,
        employment: document.getElementById("employment").value,
        proficiency: document.getElementById("proficiency").value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${BASE_URL}/${id}` : BASE_URL;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructor)
    }).then(() => {
        closePopup();
        loadInstructors();
    });
}

// ================= DELETE =================

function openDeletePopup(id) {
    instructorToDelete = id;
    document.getElementById("confirmDeletePopup").style.display = "flex";
}

function closeDeletePopup() {
    document.getElementById("confirmDeletePopup").style.display = "none";
}

function confirmDelete() {
    fetch(`${BASE_URL}/${instructorToDelete}`, {
        method: "DELETE"
    }).then(() => {
        closeDeletePopup();
        loadInstructors();
    });
}
