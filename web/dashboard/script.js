import * as api from "../api/core.js";
import { navbar } from "../nav.js";
import { kanban } from "../kanban.js";
import { currentUser } from "../api/active.js";
/** @typedef {import("../api/model/project.js").Project} Project */

navbar();

kanban(
  document.querySelector("#kanban"),
  document.querySelector("#dialog-new-task"),
  null
);

const projectWrapper = document.querySelector("#project-wrapper");

currentUser.projectlist().onChange((e) => {
  for (const project of e.add) {
    projectWrapper.innerHTML += createProjectCard(project);
    console.log(project);
  }
});

/**
 * Create a project card
 * @param {Project} project
 * @returns {string} HTML for project info card
 */
function createProjectCard(project) {
  return /* HTML */ `
    <div class="card-small bg-accent">
      <h3 class="title-card-small text-center">${project.name}</h3>
      <p class="card-description text-center">${project.desc}</p>
    </div>
  `;
}
