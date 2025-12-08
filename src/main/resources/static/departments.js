// =================== CONFIG ===================
const apiBase = "/api/departments"; // Department API endpoint
const facultiesAllEndpoint = "/api/faculties/all"; // expects full list (non-paginated)

// Paging state
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let currentSearch = "";

// HTML elements
const tbody = document.querySelector("#departmentTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const openAddDepartmentBtn = document.getElementById("openAddDepartmentBtn");

// Edit modal elements
const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editCode = document.getElementById("editCode");
const editDescription = document.getElementById("editDescription");
const editDepartmentSelect = document.getElementById("editDepartmentSelect");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editCloseBtn = document.getElementById("editCloseBtn");
const editingIdField = document.getElementById("editingId");
const editFormMessage = document.getElementById("editFormMessage");

// Add modal elements
const addDepartmentOverlay = document.getElementById("addDepartmentOverlay");
const addDepartmentForm = document.getElementById("addDepartmentForm");
const addName = document.getElementById("addName");
const addCode = document.getElementById("addCode");
const addDescription = document.getElementById("addDescription");
const addFacultySelect = document.getElementById("facultySelect");
const addSaveBtn = document.getElementById("addSaveBtn");
const addCancelBtn = document.getElementById("addCancelBtn");
const addCloseBtn = document.getElementById("addCloseBtn");
const addFormMessage = document.getElementById("addFormMessage");

let editingId = null;

// =================== INIT ===================
window.addEventListener("load", () => {
  loadDepartments(0);
  // preload faculty for add form
  loadFacutiesIntoAdd();
});

// Search and control bindings
searchBtn?.addEventListener("click", () => {
  currentSearch = searchInput.value.trim();
  loadDepartments(0);
});
clearSearchBtn?.addEventListener("click", () => {
  searchInput.value = "";
  currentSearch = "";
  loadDepartments(0);
});
openAddDepatmentBtn?.addEventListener("click", openAddModal);

// Add modal bindings
if (addDepartmentOverlay) {
  addCloseBtn?.addEventListener("click", closeAddModal);
  addCancelBtn?.addEventListener("click", closeAddModal);
  addSaveBtn?.addEventListener("click", submitAddDepartment);
  addDepartmentOverlay.addEventListener("click", (e) => {
    if (e.target === addDepartmentOverlay) closeAddModal();
  });
}

// Edit modal bindings
cancelEditBtn?.addEventListener("click", closeEditModal);
saveEditBtn?.addEventListener("click", submitEdit);
editCloseBtn?.addEventListener("click", closeEditModal);
editModal?.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

// =================== LOAD Departments ===================
async function loadDepartments(page = 0) {
  currentPage = page;

  const url = currentSearch
    ? `${apiBase}/search?name=${encodeURIComponent(currentSearch)}&page=${page}&size=${pageSize}`
    : `${apiBase}?page=${page}&size=${pageSize}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    const departments = data.content || [];
    totalPages = data.totalPages || 0;

    renderTable(departments);
    renderPagination();
  } catch (err) {
    console.error("Failed to load departments:", err);
    tbody.innerHTML = `<tr><td colspan="7">Error loading departments</td></tr>`;
  }
}

// =================== RENDER TABLE ===================
function renderTable(departments) {
  tbody.innerHTML = "";
  if (!departments.length) {
    tbody.innerHTML = `<tr><td colspan="7">No departments found</td></tr>`;
    return;
  }

  departments.forEach((c, index) => {
    const faccultyName = c.faculty
      ? `${c.faculty.name || ""}`.trim()
      : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index+1}</td>
      <td>${escapeHtml(c.name || "")}</td>
      <td>${escapeHtml(c.code || "")}</td>
      <td>${escapeHtml(c.description || "")}</td>
      <td>${escapeHtml(faccultyName)}</td>
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
      if (!confirm("Delete this department?")) return;
      await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      loadDepartments(currentPage);
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
  prev.onclick = () => loadDepartments(currentPage - 1);
  paginationDiv.appendChild(prev);

  const maxButtons = 7;
  const start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons);

  for (let i = start; i < end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => loadDepartments(i);
    paginationDiv.appendChild(btn);
  }

  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage >= totalPages - 1;
  next.onclick = () => loadDepartments(currentPage + 1);
  paginationDiv.appendChild(next);
}

// =================== ADD Department ===================
function openAddModal() {
  addDepartmentForm.reset();
  addFormMessage.textContent = "";
  addDepartmentOverlay.classList.remove("hidden");
  // load faculties fresh
  loadFacultiesIntoAdd();
  addName.focus();
}

function closeAddModal() {
  addDepartmentOverlay.classList.add("hidden");
}

async function submitAddDepartment() {
  addFormMessage.textContent = "";
  const payload = {
    name: addName.value.trim(),
    code: addCode.value.trim(),
    description: addDescription.value.trim(),
    credits: Number(addCredits.value || 0),
    facultyId: addFacultySelect.value || null
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
    loadDepartments(0);
  } catch (err) {
    addFormMessage.textContent = "Network error.";
    console.error(err);
  } finally {
    addSaveBtn.disabled = false;
    addSaveBtn.textContent = "Save";
  }
}

// =================== EDIT Department ===================
async function openEditModal(id) {
  try {
    const res = await fetch(`${apiBase}/${id}`);
    if (!res.ok) throw new Error("Not found");
    const department = await res.json();

    editingIdField.value = department.id;
    editName.value = department.name || "";
    editCode.value = department.code || "";
    editDescription.value = department.description || "";

    // load faculty then set selected
    await loadFacultyIntoEdit();
    editFacultySelect.value = department.faculty ? (department.faculty.id || "") : "";

    editFormMessage.textContent = "";
    editModal.classList.remove("hidden");
    editName.focus();
  } catch (err) {
    alert("Failed to load department.");
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
    facultyId: editFacultySelect.value || null
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
    loadDepartments(currentPage);
  } catch (err) {
    editFormMessage.textContent = "Network error.";
    console.error(err);
  } finally {
    saveEditBtn.disabled = false;
    saveEditBtn.textContent = "Save";
  }
}

// =================== LOAD FACULTIES ===================
async function loadFacultiesIntoAdd() {
  try {
    const res = await fetch(facultiesAllEndpoint);
    if (!res.ok) throw new Error("Faculty API error");
    const list = await res.json();

    addFacultySelect.innerHTML = `<option value="">-- No faculty --</option>`;
    list.forEach(i => {
      addFacultySelect.innerHTML += `
        <option value="${i.id}">${escapeHtml(i.name || "")} ${escapeHtml(i.lastname || "")}</option>
      `;
    });
  } catch (err) {
    console.error("Failed to load faculties (add):", err);
    addFacultySelect.innerHTML = `<option value="">-- failed to load --</option>`;
  }
}

async function loadFacultiesIntoEdit() {
  try {
    const res = await fetch(facultiesAllEndpoint);
    if (!res.ok) throw new Error("Faculty API error");
    const list = await res.json();

    editFacultySelect.innerHTML = `<option value="">-- No faculty --</option>`;
    list.forEach(i => {
      editFacultySelect.innerHTML += `
        <option value="${i.id}">${escapeHtml(i.name || "")} ${escapeHtml(i.lastname || "")}</option>
      `;
    });
  } catch (err) {
    console.error("Failed to load faculties (edit):", err);
    editFacultySelect.innerHTML = `<option value="">-- failed to load --</option>`;
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
