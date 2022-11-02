import * as api from "../api/core.js";
import { navbar } from "../nav.js";
import { kanban } from "../kanban.js";
import { currentUser } from "../api/active.js";
/** @typedef {import("../api/model/project.js").Project} Project */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => {
        console.log("service worker registered");
      })
      .catch((err) => console.log("service worker not registered", err));
  });
}

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
  let icon = "";
  if (project.team.leader.id == currentUser.id) {
    console.log("I am the captain now");
    icon = /*HTML*/ `<span class="material-symbols-outlined">supervisor_account</span>`;
  }
  return (
    // prettier-ignore
    /* HTML */ `
    <div class="card-small bg-accent">
      <a class="icon-link" href="/project/?id=${project.id}">
        <h3 class="title-card-small text-center flex-row icon-link">${project.name}` 
        +
        icon
        +
        /* HTML */ `
        </h3>
      </a>
      <p class="card-description text-center">${project.desc}</p>
    </div>
  `
  );
}
