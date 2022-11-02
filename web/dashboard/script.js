import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { navbar } from "../nav.js";
import { kanban } from "../kanban.js";

/** @typedef {import("../api/model/user.js").User} User */
/** @typedef {import("../api/model/task.js").Task} Task */
/** @typedef {import("../api/model/team.js").Team} Team */
/** @typedef {import("../api/model/project.js").Project} Project */

redirectLogin();
navbar();

// const newItemButton = document.querySelector(`[data-action="new-task"]`);
// const newTaskDialog = document.querySelector("#dialog-new-task");
// newItemButton.addEventListener("click", async () => {
//   const selectProject = newTaskDialog.querySelector("#options-project");
//   selectProject.innerHTML = createDialogProjectOption({
//     id: "user",
//     name: "Personal TODO List",
//   });
//   for (const ref of await currentUser.projectlist()) {
//     if (!ref.manager) continue;
//     selectProject.innerHTML += createDialogProjectOption(ref.project);
//   }
//   newTaskDialog.showModal();
// });
// newTaskDialog.querySelector(".dialog-close").onclick = () => {
//   newTaskDialog.close();
// };
// newTaskDialog.querySelector("form").onsubmit = async (event) => {
//   event.preventDefault();
//   newTaskDialog.close();
//   const form = event.target;
//   const taskPromise = api.createTask(
//     TaskState.Ready,
//     form.querySelector(`[name="title"]`).value,
//     Date.parse(form.querySelector(`[name="deadline"]`).value),
//     12, // TODO add man hours input
//     form.querySelector(`[name="desc"]`).value
//     // TODO: Add deadline
//   );
//   const projectId = form.querySelector(`[name="project"]`).value;
//   // TODO: Clear the form

//   if (projectId == "user") {
//     currentUser.tasks.add(await taskPromise);
//   } else {
//     const project = await api.project(projectId);
//     project.tasks.add(await api.createProjectTask(await taskPromise));
//   }
// };

// Mobile nav
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
mobileNavToggle.addEventListener("click", () => {
  const navDialog = document.querySelector(".nav-mobile");
  navDialog.showModal();
  const closeBtn = navDialog.querySelector(".dialog-close");
  closeBtn.addEventListener("click", () => {
    navDialog.close();
  });
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

kanban(
  document.querySelector("#kanban"),
  document.querySelector("#dialog-new-task")
);

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
