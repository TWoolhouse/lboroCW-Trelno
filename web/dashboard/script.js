import { Task } from "../api/task.js";

const listParent = document.querySelector("#task-list-overall");
for (let i = 0; i < 8; i++) {
  let task = new Task(i, false, null);
  task.name = `Task ${i}`;
  listParent.innerHTML += createTaskListItem(task);
}

/**
 *
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskListItem(task) {
  return `<input type="checkbox" id="${task.id}" checked="${task.done}"/>
          <label for="${task.id}">${task.name}</label>
          <hr class="item-break" />  `;
}
