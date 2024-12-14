const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");

let tasks = [];

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const date = taskDate.value;
  const category = taskCategory.value;
  const priority = taskPriority.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskText,
    date: date || "No Date",
    category: category || "General",
    priority: priority || "medium",
    completed: false,
  };

  tasks.push(newTask);
  displayTasks(tasks);
  resetInputs();
});

function resetInputs() {
  taskInput.value = "";
  taskDate.value = "";
  taskCategory.selectedIndex = 0; 
  taskPriority.selectedIndex = 1; 
}

function displayTasks(taskListArray) {
  taskList.innerHTML = "";

  
  taskListArray.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  taskListArray.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task-item");
    if (task.completed) taskElement.classList.add("completed");

    let priorityColor = { high: "red", medium: "yellow", low: "green" }[task.priority] || "grey";

    taskElement.innerHTML = `
      <span style="color: ${priorityColor};">${task.name} (${task.category}) - ${task.date} - Priority: ${task.priority}</span>
      <div>
        <input type="checkbox" class="complete-checkbox" data-task-id="${task.id}" ${task.completed ? "checked" : ""} />
        <button class="delete-btn" data-task-id="${task.id}">Delete</button>
      </div>
    `;
    taskList.appendChild(taskElement);
  });

  updateTaskEvents();
}

function toggleTaskCompletion(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });
  displayTasks(tasks);
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  displayTasks(tasks);
}

function updateTaskEvents() {
  document.querySelectorAll(".complete-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      toggleTaskCompletion(Number(taskId));
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      deleteTask(Number(taskId));
    });
  });
}


filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const filter = e.target.textContent;
    const filteredTasks = filter === "All" ? tasks : tasks.filter((task) => task.category === filter);
    displayTasks(filteredTasks);
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query)
  );
  displayTasks(filteredTasks);
});

