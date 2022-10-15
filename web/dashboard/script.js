import { Task } from "../api/task.js";

const taskStates = ["todo", "progress", "done"];

populateTasksList();

const newTaskDialog = document.querySelector("#dialog-new-task");
// newTaskDialog.showModal();

const newItemButton = document.querySelector(".new-item");
newItemButton.addEventListener("click", () => {
  const newTaskDialog = document.querySelector("#dialog-new-task");

  newTaskDialog.showModal();
});

/**
 * Fill out the task list with tasks from the 'database'
 * @param {number} noItems Number of tasks to display
 */
function populateTasksList(noItems = 10) {
  const kanbanSections = document.querySelectorAll(".kanban-section");
  for (let i = 0; i < noItems; i++) {
    let task = new Task(
      i,
      false,
      `Task ${i} ${"p".repeat(Math.random() * 10)}`
    );
    task.state = taskStates[Math.floor(Math.random() * 3)];
    let stateIndex = taskStates.indexOf(task.state);
    kanbanSections[stateIndex].innerHTML += createTaskListItem(task);
  }
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskListItem(task) {
  return /*HTML*/ `
    <div class="card-small bg-accent">
      <h3 class="title-card-small">${task.name}</h3>
      <div class="flex-row">
        <a href="#" class="dimmed">View More Info</a>
        <p class="dimmed">11/12/22</p>
        <img src="https://placekitten.com/39/39" alt="Profile image" style="border-radius:100vh" />
      </div>
    </div>
    `;
}
