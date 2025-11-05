const apiUrl = "/api/students";

async function fetchStudents() {
    const response = await fetch(apiUrl);
    const students = await response.json();

    const tableBody = document.querySelector("#studentsTable tbody");
    tableBody.innerHTML = "";

    students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function addStudent() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!name || !email) {
        alert("Please fill in both fields");
        return;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    });

    if (response.ok) {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        fetchStudents();
    } else {
        alert("Failed to add student");
    }
}

async function deleteStudent(id) {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (response.ok) {
        fetchStudents();
    } else {
        alert("Failed to delete student");
    }
}

// Load students when the page opens
window.onload = fetchStudents;
