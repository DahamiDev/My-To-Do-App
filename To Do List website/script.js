// DOM Elements
const todayTasksContainer = document.getElementById("today-tasks");
const tomorrowTasksContainer = document.getElementById("tomorrow-tasks");
const todayTaskInput = document.getElementById("today-task-input");
const tomorrowTaskInput = document.getElementById("tomorrow-task-input");
const addTodayTaskBtn = document.getElementById("add-today-task");
const addTomorrowTaskBtn = document.getElementById("add-tomorrow-task");
const notesTextarea = document.getElementById("notes-textarea");
const saveNotesBtn = document.getElementById("save-notes");
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const progressPercentEl = document.getElementById("progress-percent");
const progressFillEl = document.getElementById("progress-fill");

// Sample initial tasks
let tasks = [
  { id: 1, text: "read a book", completed: false, section: "today" },
  { id: 2, text: "do homework", completed: true, section: "today" },
];

// Load tasks from localStorage if available
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }

  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    notesTextarea.value = savedNotes;
  }

  renderTasks();
  updateTracker();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTracker();
}

// Render tasks in the UI
function renderTasks() {
  // Clear containers
  todayTasksContainer.innerHTML = "";
  tomorrowTasksContainer.innerHTML = "";

  // Render today's tasks
  const todayTasks = tasks.filter((task) => task.section === "today");
  if (todayTasks.length === 0) {
    todayTasksContainer.innerHTML =
      '<div class="empty-state">No tasks for today. Add one above!</div>';
  } else {
    todayTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      todayTasksContainer.appendChild(taskElement);
    });
  }

  // Render tomorrow's tasks
  const tomorrowTasks = tasks.filter((task) => task.section === "tomorrow");
  if (tomorrowTasks.length === 0) {
    tomorrowTasksContainer.innerHTML =
      '<div class="empty-state">No tasks for tomorrow. Add one above!</div>';
  } else {
    tomorrowTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      tomorrowTasksContainer.appendChild(taskElement);
    });
  }
}

// Create a task element
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = `task ${task.completed ? "completed" : ""}`;
  taskDiv.setAttribute("data-id", task.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(taskText);
  taskDiv.appendChild(deleteBtn);

  return taskDiv;
}

// Add a new task
function addTask(text, section) {
  if (text.trim() === "") return;

  const newTask = {
    id: Date.now(), // Simple ID generation
    text: text.trim(),
    completed: false,
    section: section,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Clear input
  if (section === "today") {
    todayTaskInput.value = "";
  } else {
    tomorrowTaskInput.value = "";
  }
}

// Toggle task completion
function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();

    // Add animation to the progress bar
    progressFillEl.classList.add("pulse");
    setTimeout(() => {
      progressFillEl.classList.remove("pulse");
    }, 1000);
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Update tracker statistics
function updateTracker() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  totalTasksEl.textContent = totalTasks;
  completedTasksEl.textContent = completedTasks;
  progressPercentEl.textContent = `${progressPercent}%`;
  progressFillEl.style.width = `${progressPercent}%`;
}

// Save notes
function saveNotes() {
  localStorage.setItem("notes", notesTextarea.value);

  // Add animation to the save button
  saveNotesBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
  saveNotesBtn.style.background = "#27ae60";
  setTimeout(() => {
    saveNotesBtn.innerHTML = '<i class="fas fa-save"></i> Save Notes';
  }, 2000);
}

// Event Listeners
addTodayTaskBtn.addEventListener("click", () =>
  addTask(todayTaskInput.value, "today")
);
todayTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask(todayTaskInput.value, "today");
});

addTomorrowTaskBtn.addEventListener("click", () =>
  addTask(tomorrowTaskInput.value, "tomorrow")
);
tomorrowTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask(tomorrowTaskInput.value, "tomorrow");
});

saveNotesBtn.addEventListener("click", saveNotes);

// Initialize the app
loadTasks();
