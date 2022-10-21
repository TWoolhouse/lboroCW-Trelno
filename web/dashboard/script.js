import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";

redirectLogin();

const kanbanSections = document.querySelectorAll(".kanban-section");
if (kanbanSections.length != Object.entries(TaskState).length)
  console.warn(
    "There are not enough Kanban sections for the number of task states"
  );
const projectOverviewWrapper = document.querySelector(
  "#project-overview-wrapper"
);
const teamCardsWrapper = document.querySelector("#teams-wrapper");

const newItemButton = document.querySelector(".new-item");
newItemButton.addEventListener("click", () => {
  const newTaskDialog = document.querySelector("#dialog-new-task");
  const selectProject = newTaskDialog.querySelector("#options-project");
  // selectProject.children = [];
  newTaskDialog.showModal();
});

const _wrapper = document.createElement("div");
/**
 * Converts the HTML into a DOM Node
 * @param {String} html The HTML String
 * @returns {Node} A Node
 */
function HTMLasDOM(html) {
  _wrapper.innerHTML = html.trim();
  const element = _wrapper.firstChild;
  element.remove();
  return element;
}

currentUser.teamlist().onChange((event) => {
  for (const ref of event.add) {
    const team = ref.team;
    teamCardsWrapper.appendChild(HTMLasDOM(createTeamCard(team)));
  }
});

currentUser.projectlist().onChange((event) => {
  for (const ref of event.add) {
    const project = ref.project;
    projectOverviewWrapper.appendChild(
      HTMLasDOM(createProjectOverviewCard(project))
    );
  }
});

currentUser.tasklist().onChange((event) => {
  for (const ref of event.add) {
    const task = ref.task;
    const card = HTMLasDOM(createTaskListItem(task));
    kanbanSections[task.state].appendChild(card);

    // Kanban Drag Event Handler
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("task", task.id);
      event.dataTransfer.dropEffect = "move";
    });
  }
});

// Setup Kanban Drop Event Handler
(() => {
  kanbanSections.forEach((element, index) => {
    // TaskState is enumerated from 0, where that is the first state.
    element.setAttribute("data-task-state", index);
  });
  for (let section of kanbanSections) {
    section.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    section.addEventListener("drop", async (event) => {
      event.preventDefault();
      let taskId = event.dataTransfer.getData("task");
      if (!taskId) return;
      const task = await api.task(taskId);
      task.state = +section.getAttribute("data-task-state");
      const card = document.querySelector(`#task-${task.id}`);
      console.log("Kanban Card:", task, card);
      card.remove();
      section.appendChild(card);
    });
  }
})();

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

/**
 * Creates HTml card for a team
 * @param {Team} team
 * @returns HTML string for team card
 */
function createTeamCard(team) {
  return /*HTML*/ `
    <div class="card-small accent-outline flex-col text-center">
      <h3 class="title-card-small">${team.name}</h3>
      <p class="description">
        ${team.desc}
      </p>
      <a class="fg-accent" href="#">View My Team</a>
    </div>
`;
}

/**
 * Create a project overview progress card for managers
 * @param {Project} project
 * @returns {string} HTML for task list item
 */
function createProjectOverviewCard(project) {
  const colours = ["colour-red", "colour-amber", "colour-green"];
  const tasks = project.tasks.snapshot;
  const progress = tasks.filter((task) => task.state == TaskState.Done).length;
  const percentage = (progress / (tasks.length == 0 ? 1 : tasks.length)) * 100;

  return /*HTML*/ `
    <div class="card-small bg-accent">
      <h3 class="title-card-small">${project.name}</h3>
      <p class="card-description">Progress:</p>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          style="width: ${percentage}%; --bar-fill: var(--${
    colours[project.id % 3]
  });"
        ></div>
      </div>
      <p class="card-description">${progress}/${tasks.length}
      Tasks Completed</p>

      <a href="#">View Team Members</a>
    </div>
    `;
}
