let currentPage = 0;
let totalPages = 0;
let instructorToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
    loadInstructors();
    document.getElementById("searchInput").addEventListener("input", searchInstructors);
    document.getElementById("instructorForm").addEventListener("submit", saveInstructor);
});

function loadInstructors() {
    fetch("http://localhost:8080/api/instructors/all")
        .then(response => response.json())
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
                            <button onclick="editInstructor(${ins.id})">Edit</button>
                            <button onclick="deleteInstructor(${ins.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error loading instructors:", err));
}

function loadInstructors() {
    fetch("http://localhost:8080/api/instructors/all")
        .then(response => response.json())
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
                            <button onclick="editInstructor(${ins.id})">Edit</button>
                            <button onclick="deleteInstructor(${ins.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error loading instructors:", err));
}

function loadInstructors() {
    fetch("http://localhost:8080/api/instructors/all")
        .then(response => response.json())
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
                            <button onclick="editInstructor(${ins.id})">Edit</button>
                            <button onclick="deleteInstructor(${ins.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error loading instructors:", err));
}

loadInstructors();




function searchInstructors() {
    let keyword = document.getElementById("searchInput").value.trim();

    if (keyword === "") {
        loadInstructors();
        return;
    }

    fetch(`/api/instructors/search?keyword=${keyword}`)
        .then(res => res.json())
        .then(data => {
            let tbody = document.getElementById("instructorTableBody");
            tbody.innerHTML = "";

            data.forEach(inst => {
                tbody.innerHTML += `
                    <tr>
                        <td>${inst.name}</td>
                        <td>${inst.lastname}</td>
                        <td>${inst.faculty}</td>
                        <td>${inst.department}</td>
                        <td>${inst.academicRank}</td>
                        <td>${inst.degree}</td>
                        <td>${inst.employment}</td>
                        <td>${inst.proficiency}</td>
                        <td>
                            <button onclick="openEditPopup(${inst.id})">Edit</button>
                            <button onclick="openDeletePopup(${inst.id})" style="background:#dc3545">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function openAddPopup() {
    document.getElementById("popupTitle").innerText = "Add Instructor";
    document.getElementById("instructorForm").reset();
    document.getElementById("instructorId").value = "";
    document.getElementById("popup").style.display = "flex";
}

function openEditPopup(id) {
    fetch(`/api/instructors/${id}`)
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

function saveInstructor(e) {
    e.preventDefault();

    let id = document.getElementById("instructorId").value;

    let instructor = {
        name: document.getElementById("name").value,
        lastname: document.getElementById("lastname").value,
        faculty: document.getElementById("faculty").value,
        department: document.getElementById("department").value,
        academicRank: document.getElementById("academicRank").value,
        degree: document.getElementById("degree").value,
        employment: document.getElementById("employment").value,
        proficiency: document.getElementById("proficiency").value
    };

    let method = id ? "PUT" : "POST";
    let url = id ? `/api/instructors/${id}` : `/api/instructors`;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructor)
    }).then(() => {
        closePopup();
        loadInstructors();
    });
}

function openDeletePopup(id) {
    instructorToDelete = id;
    document.getElementById("confirmDeletePopup").style.display = "flex";
}

function closeDeletePopup() {
    document.getElementById("confirmDeletePopup").style.display = "none";
}

function confirmDelete() {
    fetch(`/api/instructors/${instructorToDelete}`, {
        method: "DELETE"
    }).then(() => {
        closeDeletePopup();
        loadInstructors();
    });
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        loadInstructors();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        loadInstructors();
    }
}
