import { Project } from "../api/project.js";
import { Task } from "../api/task.js";
import { Collection } from "../api/collection.js";

const taskList = [];
const taskStates = ["todo", "progress", "done"];
const kanbanSections = document.querySelectorAll(".kanban-section");
setupDragEvents();
populateTasksList();

const projectOverviewWrapper = document.querySelector(
  "#project-overview-wrapper"
);
addProjectOverviewCards();

const newItemButton = document.querySelector(".new-item");
newItemButton.addEventListener("click", () => {
  const newTaskDialog = document.querySelector("#dialog-new-task");

  newTaskDialog.showModal();
});

/* PROJECTS overview card */

function addProjectOverviewCards() {
  const projects = [];
  for (let i = 0; i < 7; i++) {
    let project = new Project(
      i,
      "King Firat",
      Date.now(),
      new Date().setDate(new Date().getDate() + 7),
      `Project ${i}`,
      new Collection(taskList),
      null
    );
    projects.push(project);
  }
  for (let project of projects) {
    projectOverviewWrapper.innerHTML += createProjectOverviewCard(project);
  }
}

/**
 * Create a project overview progress card for managers
 * @param {Project} project
 * @returns {string} HTML for task list item
 */
function createProjectOverviewCard(project) {
  const colours = ["colour-red", "colour-amber", "colour-green"];
  const progress = project.tasks.snapshot[0].filter(
    (task) => task.state == "done"
  ).length;
  const projectTasks = project.tasks.snapshot[0];

  return /*HTML*/ `
    <div class="card-small bg-accent">
      <h3 class="title-card-small">${project.name}</h3>
      <p class="card-description">Progress:</p>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          style="width: ${
            (progress / projectTasks.length) * 100
          }%; --bar-fill: var(--${colours[project.id % 3]});"
        ></div>
      </div>
      <p class="card-description">${progress}/${projectTasks.length} 
      Tasks Completed</p>

      <a href="#">View Team Members</a>
    </div>
    `;
}

/* TASKS card*/

function setupDragEvents() {
  for (let section of kanbanSections) {
    section.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    section.addEventListener("drop", (event) => {
      console.log(event);
      event.preventDefault();
      let jsonData = event.dataTransfer.getData("json");
      console.log(jsonData);
      const task = JSON.parse(jsonData);
      console.log(task);
      const currentTaskCard = document.querySelector(
        `[data-task-id="${task.id}"]`
      );
      currentTaskCard.remove();
      console.log(currentTaskCard);
      section.innerHTML += createTaskListItem(task);

      setupCardDragEvents();
    });
  }
}

function setupCardDragEvents() {
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

  setupCardDragEvents();
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
