// =================== CONFIG ===================
const apiBase = "/api/faculties"; // Faculty API endpoint
const instructorsAllEndpoint = "/api/instructors/all"; // expects full list (non-paginated)

// Paging state
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let currentSearch = "";

// HTML elements
const tbody = document.querySelector("#facultyTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const openAddFacultyBtn = document.getElementById("openAddFacultyBtn");

// Edit modal elements
const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editCode = document.getElementById("editCode");
const editDescription = document.getElementById("editDescription");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editCloseBtn = document.getElementById("editCloseBtn");
const editingIdField = document.getElementById("editingId");
const editFormMessage = document.getElementById("editFormMessage");

// Add modal elements
const addFacultyOverlay = document.getElementById("addFacultyOverlay");
const addFacultyForm = document.getElementById("addFacultyForm");
const addName = document.getElementById("addName");
const addCode = document.getElementById("addCode");
const addDescription = document.getElementById("addDescription");
const addSaveBtn = document.getElementById("addSaveBtn");
const addCancelBtn = document.getElementById("addCancelBtn");
const addCloseBtn = document.getElementById("addCloseBtn");
const addFormMessage = document.getElementById("addFormMessage");

let editingId = null;

// =================== INIT ===================
window.addEventListener("load", () => {
  loadFaculties(0);
});

// Search and control bindings
searchBtn?.addEventListener("click", () => {
  currentSearch = searchInput.value.trim();
  loadFaculties(0);
});
clearSearchBtn?.addEventListener("click", () => {
  searchInput.value = "";
  currentSearch = "";
  loadFaculties(0);
});
openAddFacultyBtn?.addEventListener("click", openAddModal);

// Add modal bindings
if (addFacultyOverlay) {
  addCloseBtn?.addEventListener("click", closeAddModal);
  addCancelBtn?.addEventListener("click", closeAddModal);
  addSaveBtn?.addEventListener("click", submitAddFaculty);
  addFacultyOverlay.addEventListener("click", (e) => {
    if (e.target === addFacultyOverlay) closeAddModal();
  });
}

// Edit modal bindings
cancelEditBtn?.addEventListener("click", closeEditModal);
saveEditBtn?.addEventListener("click", submitEdit);
editCloseBtn?.addEventListener("click", closeEditModal);
editModal?.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

// =================== LOAD FACULTIES ===================
async function loadFaculties(page = 0) {
  currentPage = page;

  const url = currentSearch
    ? `${apiBase}/search?name=${encodeURIComponent(currentSearch)}&page=${page}&size=${pageSize}`
    : `${apiBase}?page=${page}&size=${pageSize}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    const faculties = data.content || [];
    totalPages = data.totalPages || 0;

    renderTable(faculties);
    renderPagination();
  } catch (err) {
    console.error("Failed to load faculties:", err);
    tbody.innerHTML = `<tr><td colspan="7">Error loading faculties</td></tr>`;
  }
}

// =================== RENDER TABLE ===================
function renderTable(faculties) {
  tbody.innerHTML = "";
  if (!faculties.length) {
    tbody.innerHTML = `<tr><td colspan="7">No faculties found</td></tr>`;
    return;
  }

  faculties.forEach((c, index) => {
    const instructorName = c.instructor
      ? `${c.instructor.name || ""} ${c.instructor.lastname || ""}`.trim()
      : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index+1}</td>
      <td>${escapeHtml(c.name || "")}</td>
      <td>${escapeHtml(c.code || "")}</td>
      <td>${escapeHtml(c.description || "")}</td>
      <td class="actions">
        <button class="btn-edit" data-id="${c.id}">Edit</button>
        <button class="btn-delete" data-id="${c.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // wire actions
  document.querySelectorAll(".btn-delete").forEach(btn =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Delete this faculty?")) return;
      await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      loadFaculties(currentPage);
    })
  );

  document.querySelectorAll(".btn-edit").forEach(btn =>
    btn.addEventListener("click", () => openEditModal(btn.dataset.id))
  );
}

// =================== PAGINATION ===================
function renderPagination() {
  paginationDiv.innerHTML = "";
  if (totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage === 0;
  prev.onclick = () => loadFaculties(currentPage - 1);
  paginationDiv.appendChild(prev);

  const maxButtons = 7;
  const start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons);

  for (let i = start; i < end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => loadFaculties(i);
    paginationDiv.appendChild(btn);
  }

  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage >= totalPages - 1;
  next.onclick = () => loadFaculties(currentPage + 1);
  paginationDiv.appendChild(next);
}

// =================== ADD FACULTY ===================
function openAddModal() {
  addFacultyForm.reset();
  addFormMessage.textContent = "";
  addFacultyOverlay.classList.remove("hidden");
  // load instructors fresh
  loadInstructorsIntoAdd();
  addName.focus();
}

function closeAddModal() {
  addFacultyOverlay.classList.add("hidden");
}

async function submitAddFaculty() {
  addFormMessage.textContent = "";
  const payload = {
    name: addName.value.trim(),
    code: addCode.value.trim(),
    description: addDescription.value.trim(),
  };

  if (!payload.name) {
    addFormMessage.textContent = "Name is required.";
    return;
  }

  addSaveBtn.disabled = true;
  addSaveBtn.textContent = "Saving...";

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      addFormMessage.textContent = `Server error: ${res.status}`;
      return;
    }

    closeAddModal();
    loadFaculties(0);
  } catch (err) {
    addFormMessage.textContent = "Network error.";
    console.error(err);
  } finally {
    addSaveBtn.disabled = false;
    addSaveBtn.textContent = "Save";
  }
}

// =================== EDIT FACULTY ===================
async function openEditModal(id) {
  try {
    const res = await fetch(`${apiBase}/${id}`);
    if (!res.ok) throw new Error("Not found");
    const faculty = await res.json();

    editingIdField.value = faculty.id;
    editName.value = faculty.name || "";
    editCode.value = faculty.code || "";
    editDescription.value = faculty.description || "";
    editCredits.value = faculty.credits ?? "";


    editFormMessage.textContent = "";
    editModal.classList.remove("hidden");
    editName.focus();
  } catch (err) {
    alert("Failed to load faculty.");
    console.error(err);
  }
}

function closeEditModal() {
  editingIdField.value = "";
  editModal.classList.add("hidden");
}

async function submitEdit() {
  const id = editingIdField.value;
  if (!id) return;

  const payload = {
    name: editName.value.trim(),
    code: editCode.value.trim(),
    description: editDescription.value.trim(),
    credits: Number(editCredits.value || 0),
    instructorId: editInstructorSelect.value || null
  };

  saveEditBtn.disabled = true;
  saveEditBtn.textContent = "Saving...";

  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      editFormMessage.textContent = `Server error: ${res.status}`;
      return;
    }

    closeEditModal();
    loadFaculties(currentPage);
  } catch (err) {
    editFormMessage.textContent = "Network error.";
    console.error(err);
  } finally {
    saveEditBtn.disabled = false;
    saveEditBtn.textContent = "Save";
  }
}

// =================== LOAD INSTRUCTORS ===================
async function loadInstructorsIntoAdd() {
  try {
    const res = await fetch(instructorsAllEndpoint);
    if (!res.ok) throw new Error("Instructor API error");
    const list = await res.json();

    addInstructorSelect.innerHTML = `<option value="">-- No instructor --</option>`;
    list.forEach(i => {
      addInstructorSelect.innerHTML += `
        <option value="${i.id}">${escapeHtml(i.name || "")} ${escapeHtml(i.lastname || "")}</option>
      `;
    });
  } catch (err) {
    console.error("Failed to load instructors (add):", err);
    addInstructorSelect.innerHTML = `<option value="">-- failed to load --</option>`;
  }
}

async function loadInstructorsIntoEdit() {
  try {
    const res = await fetch(instructorsAllEndpoint);
    if (!res.ok) throw new Error("Instructor API error");
    const list = await res.json();

    editInstructorSelect.innerHTML = `<option value="">-- No instructor --</option>`;
    list.forEach(i => {
      editInstructorSelect.innerHTML += `
        <option value="${i.id}">${escapeHtml(i.name || "")} ${escapeHtml(i.lastname || "")}</option>
      `;
    });
  } catch (err) {
    console.error("Failed to load instructors (edit):", err);
    editInstructorSelect.innerHTML = `<option value="">-- failed to load --</option>`;
  }
}

// =================== HELPERS ===================
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// wire edit save button (submit)
saveEditBtn?.addEventListener("click", submitEdit);
