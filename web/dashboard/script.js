import { Task } from "../api/task.js";

const taskList = [];
const taskStates = ["todo", "progress", "done"];
const kanbanSections = document.querySelectorAll(".kanban-section");
setupDragEvents();
populateTasksList();

const newTaskDialog = document.querySelector("#dialog-new-task");
// newTaskDialog.showModal();

const newItemButton = document.querySelector(".new-item");
newItemButton.addEventListener("click", () => {
  const newTaskDialog = document.querySelector("#dialog-new-task");

  newTaskDialog.showModal();
});

function setupDragEvents() {
  for (let section of kanbanSections) {
    section.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    section.addEventListener("drop", (event) => {
      console.log(event);
      event.preventDefault();
      let jsonData = event.dataTransfer.getData("json");
      console.log(JSON.parse(jsonData));
    });
  }
}

function onDrag(event, task) {
  event.dataTransfer.setData("json", JSON.stringify(task));
  event.dataTransfer.dropEffect = "move";
  console.log(event);
}

/**
 * Fill out the task list with tasks from the 'database'
 * @param {number} noItems Number of tasks to display
 */
function populateTasksList(noItems = 10) {
  for (let i = 0; i < noItems; i++) {
    let task = new Task(
      i,
      false,
      `Task ${i} ${"p".repeat(Math.random() * 10)}`
    );
    task.state = taskStates[Math.floor(Math.random() * 3)];
    taskList.push(task);
    const stateIndex = taskStates.indexOf(task.state);
    kanbanSections[stateIndex].innerHTML += createTaskListItem(task);
  }

  const cards = document.querySelectorAll(`[data-task-id]`);
  for (let card of cards) {
    const taskId = card.getAttribute("data-task-id");
    const task = taskList.filter((task) => task.id == taskId)[0];
    card.addEventListener("dragstart", (event) => {
      console.log(card, task);
      onDrag(event, task);
    });
  }
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskListItem(task) {
  return /*HTML*/ `
    <div class="card-small bg-accent" draggable="true" id="task-${task.id}" data-task-id="${task.id}">
      <h3 class="title-card-small">${task.name}</h3>
      <div class="flex-row">
        <a href="#" class="dimmed">View More Info</a>
        <p class="dimmed">11/12/22</p>
        <img src="https://placekitten.com/39/39" alt="Profile image" style="border-radius:100vh" />
      </div>
    </div>
    `;
}
