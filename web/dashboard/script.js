import { Task } from "../api/task.js";

populateTasksList();

const newTaskDialog = document.querySelector("#dialog-new-task");

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
    let task = new Task(i, false, null);
    task.name = `Task ${i}`;
    listParent.innerHTML += createTaskListItem(task);
  }
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskListItem(task) {
  return `<input type="checkbox" id="${task.id}"/>
          <label for="${task.id}">${task.name}</label>
          <hr class="item-break" />  `;
}
