const searchApiUrl = "http://localhost:8080/api/students/search?name=";
const studentApiUrl = "http://localhost:8080/api/students";

// Select the input and table body
const searchBox = document.getElementById("searchBox");
const studentBody = document.getElementById("studentBody");

async function loadStudents(query = "") {
  try {
    const response = await fetch(searchApiUrl + query);
    const students = await response.json();

    // Clear previous rows
    studentBody.innerHTML = "";

    // Add new rows
    students.forEach(student => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.course || ""}</td>
         <td>
          <button onclick="editStudent(${student.id})">Edit</button>
          <button onclick="deleteStudent(${student.id})">Delete</button>
        </td>
      `;

      studentBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Fetch all students initially
loadStudents();

// Add live search listener
searchBox.addEventListener("input", (e) => {
  const query = e.target.value;
  loadStudents(query);
});
async function addStudent() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const course = document.getElementById("course").value;

    if (!name || !email || !course) {
        alert("Please fill in all fields");
        return;
    }

    const response = await fetch(studentApiUrl, {
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
  document.getElementById("uname").value = name;
  document.getElementById("uemail").value = email;
  document.getElementById("ucourse").value = course;

  document.getElementById("editForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const updatedStudent = {
    name: document.getElementById("uname").value,
    email: document.getElementById("uemail").value,
    course: document.getElementById("ucourse").value
  };

  await fetch(`${studentApiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedStudent)
  });

  alert("Student updated successfully!");
  loadStudents();
  e.target.reset();
});

loadStudents();

}
async function deleteStudent(id) {
    const response = await fetch(`${studentApiUrl}/${id}`, { method: "DELETE" });
    if (response.ok) {
        loadStudents();
    } else {
        alert("Failed to delete student");
    }
}


