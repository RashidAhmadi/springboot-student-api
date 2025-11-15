// API base
const apiBase = "/api/courses"; // relative path works when hosted from same server

// Paging state
let currentPage = 0;
let pageSize = 5;
let totalPages = 0;
let currentSearch = "";

// Elements
const tbody = document.querySelector("#courseTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const addBtn = document.getElementById("addBtn");

// Modal elements
const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editCode = document.getElementById("editCode");
const editDescription = document.getElementById("editDescription");
const editCredits = document.getElementById("editCredits");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editingId = null;

// Load initial
window.addEventListener("load", () => loadCourses(0));

// Event bindings
searchBtn?.addEventListener("click", () => {
  currentSearch = searchInput.value.trim();
  loadCourses(0);
});
clearSearchBtn?.addEventListener("click", () => {
  searchInput.value = "";
  currentSearch = "";
  loadCourses(0);
});

addBtn?.addEventListener("click", async () => {
  const name = document.getElementById("addName").value.trim();
  const code = document.getElementById("addCode").value.trim();
  const creditsVal = document.getElementById("addCredits").value.trim();
  const credits = creditsVal ? parseInt(creditsVal, 10) : 0;

  if (!name) { alert("Fill course name"); return; }

  const payload = { name, code, description: "", credits };

  await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // clear inputs
  document.getElementById("addName").value = "";
  document.getElementById("addCode").value = "";
  document.getElementById("addCredits").value = "";

  loadCourses(0);
});

// Edit modal handlers
cancelEditBtn?.addEventListener("click", () => closeEditModal());
saveEditBtn?.addEventListener("click", async () => {
  if (!editingId) return;
  const body = {
    name: editName.value.trim(),
    code: editCode.value.trim(),
    description: editDescription.value.trim(),
    credits: editCredits.value ? parseInt(editCredits.value, 10) : 0
  };

  await fetch(`${apiBase}/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  closeEditModal();
  loadCourses(currentPage);
});

// Load courses (paged)
async function loadCourses(page = 0) {
  currentPage = page;
  const size = pageSize;

  let url;
  if (currentSearch) {
    url = `${apiBase}/search?name=${encodeURIComponent(currentSearch)}&page=${page}&size=${size}`;
  } else {
    url = `${apiBase}?page=${page}&size=${size}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json(); // Spring returns Page<Course> JSON

    // Spring's Page JSON has: content, totalPages, totalElements, number (page index)
    const courses = data.content || [];
    totalPages = data.totalPages || 0;
    renderTable(courses);
    renderPagination();
  } catch (err) {
    console.error("Load courses error", err);
    tbody.innerHTML = `<tr><td colspan="6">Error loading courses</td></tr>`;
  }
}

function renderTable(courses) {
  tbody.innerHTML = "";
  if (!courses.length) {
    tbody.innerHTML = `<tr><td colspan="6">No courses found</td></tr>`;
    return;
  }

  courses.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${escapeHtml(c.name || "")}</td>
      <td>${escapeHtml(c.code || "")}</td>
      <td>${escapeHtml(c.description || "")}</td>
      <td>${c.credits ?? ""}</td>
      <td class="actions">
        <button class="btn-edit" data-id="${c.id}">Edit</button>
        <button class="btn-delete" data-id="${c.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // wire buttons
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Delete this course?")) return;
      await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      loadCourses(currentPage);
    });
  });

  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      openEditModal(id);
    });
  });
}

function renderPagination() {
  paginationDiv.innerHTML = "";
  if (totalPages <= 1) return;

  // Prev
  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage <= 0;
  prev.addEventListener("click", () => loadCourses(currentPage - 1));
  paginationDiv.appendChild(prev);

  // page numbers (show up to 7)
  const maxButtons = 7;
  const start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons;
  if (end > totalPages) { end = totalPages; }

  for (let i = start; i < end; i++) {
    const btn = document.createElement("button");
    btn.textContent = (i + 1);
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => loadCourses(i));
    paginationDiv.appendChild(btn);
  }

  // Next
  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage >= (totalPages - 1);
  next.addEventListener("click", () => loadCourses(currentPage + 1));
  paginationDiv.appendChild(next);
}

// Edit modal open
async function openEditModal(id) {
  try {
    const res = await fetch(`${apiBase}/${id}`);
    if (!res.ok) throw new Error("Not found");
    const c = await res.json();
    editingId = c.id;
    editName.value = c.name || "";
    editCode.value = c.code || "";
    editDescription.value = c.description || "";
    editCredits.value = c.credits ?? "";
    editModal.classList.remove("hidden");
  } catch (err) {
    alert("Failed to load course");
  }
}

function closeEditModal() {
  editingId = null;
  editModal.classList.add("hidden");
}

// small helper to avoid HTML injection
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
