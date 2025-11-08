const apiUrl = "http://localhost:8080/api/students";

async function loadStudents() {
  const res = await fetch(apiUrl);
  const students = await res.json();
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.course}</td>
        <td>
          <button onclick="editStudent(${s.id}, '${s.name}', '${s.email}', '${s.course}')">Edit</button>
          <button onclick="deleteStudent(${s.id})">Delete</button>
          
        </td>
      </tr>`;
  });
}
async function addStudent() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const course = document.getElementById("course").value;

    if (!name || !email || !course) {
        alert("Please fill in all fields");
        return;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, course })
    });

    if (response.ok) {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("course").value = "";
        loadStudents();
    } else {
        alert("Failed to add student");
    }
}

function editStudent(id, name, email, course) {
  document.getElementById("studentId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("course").value = course;
}
async function deleteStudent(id) {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (response.ok) {
        loadStudents();
    } else {
        alert("Failed to delete student");
    }
}

document.getElementById("editForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const updatedStudent = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    course: document.getElementById("course").value
  };

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedStudent)
  });

  alert("Student updated successfully!");
  loadStudents();
  e.target.reset();
});

loadStudents();
