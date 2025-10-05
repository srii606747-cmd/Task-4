const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const taskCounter = document.getElementById("taskCounter");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearAll);
searchInput.addEventListener("input", filterTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const newTask = {
    text: taskText,
    completed: false,
    date: new Date().toLocaleString()
  };

  createTaskElement(newTask);
  saveTaskToStorage(newTask);

  taskInput.value = "";
  updateCounter();
}

function createTaskElement(task) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = task.text;

  const small = document.createElement("small");
  small.textContent = task.date;

  const leftDiv = document.createElement("div");
  leftDiv.appendChild(span);
  leftDiv.appendChild(document.createElement("br"));
  leftDiv.appendChild(small);

  const actions = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.classList.add("action");
  editBtn.onclick = () => editTask(li, task);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.classList.add("action");
  deleteBtn.onclick = () => {
    li.remove();
    deleteTaskFromStorage(task.text);
    updateCounter();
  };

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✅";
  completeBtn.classList.add("action");
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    toggleTaskCompletion(task.text);
    updateCounter();
  };

  actions.append(editBtn, deleteBtn, completeBtn);

  li.append(leftDiv, actions);
  if (task.completed) li.classList.add("completed");
  taskList.appendChild(li);
}

function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromStorage(text) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.filter(t => t.text !== text);
  localStorage.setItem("tasks", JSON.stringify(updated));
}

function toggleTaskCompletion(text) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.map(t => {
    if (t.text === text) t.completed = !t.completed;
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(updated));
}

function editTask(li, task) {
  const newText = prompt("Edit your task:", task.text);
  if (!newText || newText.trim() === "") return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(t => {
    if (t.text === task.text) t.text = newText;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  li.querySelector("span").textContent = newText;
}

function clearAll() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
    updateCounter();
  }
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(createTaskElement);
  updateCounter();
}

function filterTasks() {
  const searchValue = searchInput.value.toLowerCase();
  document.querySelectorAll("li").forEach(li => {
    const text = li.querySelector("span").textContent.toLowerCase();
    li.style.display = text.includes(searchValue) ? "flex" : "none";
  });
}

function updateCounter() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `${completed} / ${tasks.length} tasks completed`;
}
