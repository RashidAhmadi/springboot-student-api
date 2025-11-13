const apiUrl = "http://localhost:8080/api/courses";

async function loadCourses() {
    const response = await fetch(apiUrl);
    const courses = await response.json();
    const tbody = document.querySelector("#courseTable tbody");
    tbody.innerHTML = "";
    courses.forEach(course => {
        tbody.innerHTML += `<tr>
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.code}</td>
            <td>${course.description}</td>
            <td>${course.credits}</td>
            <td>
                <button onclick="editCourse(${course.id})">Edit</button>
                <button onclick="deleteCourse(${course.id})">Delete</button>
            </td>
        </tr>`;
    });
}

async function searchCourses() {
    const name = document.getElementById("searchInput").value;
    const response = await fetch(`${apiUrl}/search?name=${name}`);
    const courses = await response.json();
    const tbody = document.querySelector("#courseTable tbody");
    tbody.innerHTML = "";
    courses.forEach(course => {
        tbody.innerHTML += `<tr>
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.code}</td>
            <td>${course.description}</td>
            <td>${course.credits}</td>
            <td>
                <button onclick="editCourse(${course.id})">Edit</button>
                <button onclick="deleteCourse(${course.id})">Delete</button>
            </td>
        </tr>`;
    });
}

async function deleteCourse(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadCourses();
}

function editCourse(id) {
    alert("You can implement edit popup or redirect to edit form for course ID: " + id);
}

window.onload = loadCourses;
