// Elements
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.querySelector("#task-form #cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input"); // used as "Artist"
const descriptionInput = document.getElementById("description-input");
const searchInput = document.getElementById("search");
const panelTitle = document.getElementById("panel-title");

const STORAGE_KEY = "playlistData";
const taskData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentTask = {};

const removeSpecialChars = (str) => (str || "").replace(/[^a-zA-Z0-9 ]/g, "");

// Create/Update
const addOrUpdateTask = () => {
    if (!titleInput.value.trim()) {
        alert("Please provide a track title");
        return;
    }

    const safeTitle = removeSpecialChars(titleInput.value.trim());
    const safeDesc = removeSpecialChars(descriptionInput.value.trim());

    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = {
        id: `${safeTitle.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: titleInput.value.trim(),
        date: dateInput.value.trim(), // Artist
        description: descriptionInput.value.trim() // Notes / URL
    };

    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        // Preserve ID when updating
        taskObj.id = currentTask.id;
        taskData[dataArrIndex] = taskObj;
    }

    persist();
    updateTaskContainer();
    reset();
};

// Render
const renderTrack = ({ id, title, date, description }) => {
    // Try to auto-link if description looks like a URL
    const maybeLink = /^https?:\/\//i.test(description)
        ? `<a href="${description}" target="_blank" rel="noopener noreferrer">${description}</a>`
        : description
            ? description.replaceAll("\n", "<br/>")
            : "";

    return `
    <article class="track" id="${id}">
      <div class="avatar">♪</div>
      <div class="meta">
        <h3 class="title">${title}</h3>
        <p class="artist">${date || "Unknown Artist"}</p>
        ${maybeLink ? `<p class="notes">${maybeLink}</p>` : ""}
      </div>
      <div class="actions">
        <button type="button" class="icon-btn" onclick="editTask(this)">Edit</button>
        <button type="button" class="icon-btn" onclick="deleteTask(this)">Delete</button>
      </div>
    </article>
  `;
};

const updateTaskContainer = (arr = taskData) => {
    tasksContainer.innerHTML = arr.map(renderTrack).join("");
};

// Delete
window.deleteTask = (buttonEl) => {
    const id = buttonEl.closest(".track").id;
    const idx = taskData.findIndex((t) => t.id === id);
    if (idx > -1) {
        taskData.splice(idx, 1);
        persist();
    }
    buttonEl.closest(".track").remove();
};

// Edit
window.editTask = (buttonEl) => {
    const id = buttonEl.closest(".track").id;
    const idx = taskData.findIndex((t) => t.id === id);
    currentTask = taskData[idx];

    titleInput.value = currentTask.title || "";
    dateInput.value = currentTask.date || "";
    descriptionInput.value = currentTask.description || "";

    addOrUpdateTaskBtn.innerText = "Update Track";
    panelTitle.textContent = "Edit Track";
    taskForm.classList.remove("hidden");
};

// Reset / Persist
const reset = () => {
    addOrUpdateTaskBtn.innerText = "Add Track";
    panelTitle.textContent = "Add Track";
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    taskForm.classList.add("hidden");
    currentTask = {};
};

const persist = () =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskData));

// Startup
if (taskData.length) updateTaskContainer();

// Open/Close
openTaskFormBtn.addEventListener("click", () => {
    taskForm.classList.remove("hidden");
});

closeTaskFormBtn.addEventListener("click", tryClosePanel);
cancelBtn.addEventListener("click", tryClosePanel);

function tryClosePanel() {
    const hasValues =
        titleInput.value || dateInput.value || descriptionInput.value;
    const changed =
        titleInput.value !== (currentTask.title || "") ||
        dateInput.value !== (currentTask.date || "") ||
        descriptionInput.value !== (currentTask.description || "");

    if (hasValues && changed) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
}

discardBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
    reset();
});

// Submit
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateTask();
});

// Live search (title or artist)
searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) return updateTaskContainer();
    const filtered = taskData.filter(
        (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.date || "").toLowerCase().includes(q)
    );
    updateTaskContainer(filtered);
});
