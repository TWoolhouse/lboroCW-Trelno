import * as api from "../api/core.js";
import { navbar, HTMLasDOM } from "../nav.js";
import { kanban } from "../kanban.js";
import { currentUser } from "../api/active.js";
/** @typedef {import("../api/model/project.js").Project} Project */

navbar();

kanban(document.querySelector("#kanban"), null);

const projectWrapper = document.querySelector("#project-wrapper");

currentUser.projectlist().onChange((e) => {
  for (const project of e.add) {
    projectWrapper.appendChild(HTMLasDOM(createProjectCard(project)));
  }
});

/**
 * Create a project card
 * @param {Project} project
 * @returns {string} HTML for project info card
 */
function createProjectCard(project) {
  const icon =
    project.team.leader.id == currentUser.id
      ? /*HTML*/ `<span class="material-symbols-outlined">supervisor_account</span>`
      : "";
  return (
    // prettier-ignore
    /* HTML */ `
    <div class="card-small bg-accent">
      <a class="icon-link" href="/project/?id=${project.id}">
        <h3 class="title-card-small text-center flex-row icon-link">${project.name}
        ${icon}
        </h3>
      </a>
      <p class="card-description text-center">${project.desc}</p>
      <a class="client" href="/client/?id=${project.client.id}">
        <img src="${project.client.representativeProfilePicture()}">
        ${project.client.name}
      </a>
    </div>
  `
  );
}
