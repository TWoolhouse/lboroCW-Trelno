import { Task } from "../api/task.js";

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
  const listParent = document.querySelector("#task-list-overall");
  for (let i = 0; i < noItems; i++) {
    let task = new Task(
      i,
      false,
      `Task ${i} ${"p".repeat(Math.random() * 10)}`
    );
    listParent.innerHTML += createTaskListItem(task);
  }
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskListItem(task) {
  return `<div class="task-list-item">
            <div>
              <input type="checkbox" id="${task.id}"/>
              <label for="${task.id}">${task.name}</label>
            </div>
            <p class="dimmed">Project ${Math.floor(Math.random() * 100)}</p>
            <p class="dimmed">08/11/22</p>
          </div>
          <hr class="item-break" />  `;
}
