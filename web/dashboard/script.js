import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";

/** @typedef {import("../api/model/user.js").User} User */
/** @typedef {import("../api/model/task.js").Task} Task */
/** @typedef {import("../api/model/team.js").Team} Team */
/** @typedef {import("../api/model/project.js").Project} Project */

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

const newItemButton = document.querySelector(`[data-action="new-task"]`);
const newTaskDialog = document.querySelector("#dialog-new-task");
newItemButton.addEventListener("click", async () => {
  const selectProject = newTaskDialog.querySelector("#options-project");
  selectProject.innerHTML = createDialogProjectOption({
    id: "user",
    name: "Personal TODO List",
  });
  for (const ref of await currentUser.projectlist()) {
    if (!ref.leader) continue;
    selectProject.innerHTML += createDialogProjectOption(ref.project);
  }
  newTaskDialog.showModal();
});
newTaskDialog.querySelector(".dialog-close").onclick = () => {
  newTaskDialog.close();
};
newTaskDialog.querySelector("form").onsubmit = async (event) => {
  event.preventDefault();
  newTaskDialog.close();
  const form = event.target;
  const taskPromise = api.createTask(
    TaskState.Ready,
    form.querySelector(`[name="title"]`).value,
    Date.parse(form.querySelector(`[name="deadline"]`).value),
    form.querySelector(`[name="desc"]`).value
    // TODO: Add deadline
  );
  const projectId = form.querySelector(`[name="project"]`).value;
  // TODO: Clear the form

  if (projectId == "user") {
    currentUser.tasks.add(await taskPromise);
  } else {
    const project = await api.project(projectId);
    project.tasks.add(await api.createProjectTask(await taskPromise));
  }
};

// Mobile nav
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
mobileNavToggle.addEventListener("click", () => {
  const navDialog = document.querySelector(".nav-mobile");
  navDialog.showModal();
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

    // mobile task button event handler
    const mobileBtn = card.querySelector(".kanban-mobile-options");
    if (mobileBtn) {
      mobileBtn.addEventListener("click", (event) => {
        console.log(task.name);
        const dropdownMenu = card.querySelector(".kanban-dropdown");
        dropdownMenu.toggleAttribute("data-show");
      });
    }
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
    <div class="card-small bg-accent" draggable="true" id="task-${
      task.id
    }" data-task-id="${task.id}">
      <div class="flex-row kanban-title">
        <h3 class="title-card-small">${task.name}</h3>
        <button class="kanban-mobile-options material-symbols-outlined">more_horiz</button>
        <div class="kanban-dropdown" >
          <ul>
            <li>Mark as To Do </li>
            <li>Mark as In Progress </li>
            <li>Mark as Completed </li>
          </ul>
        </div>
      </div>
      <div class="flex-row">
        <button class="flex-row dimmed btn-icon click-expander"><span class="material-symbols-outlined">analytics</span>View More Info</button>
        <p class="dimmed flex-row"><span class="material-symbols-outlined">schedule</span>${new Date(
          task.deadline
        ).toLocaleDateString()}</p>
        <img src="https://placekitten.com/39/39" alt="Profile image" style="border-radius:100vh" />
      </div>
      <div class="expand-content">
        <p>${task.desc}</p>
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
    <a href="/project/?id=${project.id}">
    <h3 class="title-card-small">${project.name}</h3>
    </a>
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

/**
 * Create a Project option for the new task dialog
 * @param {Project} project
 * @returns {String} HTML from project option.
 */
function createDialogProjectOption(project) {
  return /*HTML*/ `
    <option value="${project.id}">${project.name}</option>
  `;
}
