import * as api from "../api/core.js";
import { currentUser } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { navbar, HTMLasDOM } from "../nav.js";
import { Client } from "../api/model/client.js";

/** @typedef {import("../api/model/user.js").User} User */
/** @typedef {import("../api/model/project.js").Project} Project */

navbar();

const newProject = document.querySelector("button[data-action='new-project']");
const newProjectDialog = document.querySelector("#dialog-new-project");

newProject.addEventListener("click", () => {
  newProjectDialog.showModal();
  setDynamicData();
});
newProjectDialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => {
    newProjectDialog.close();
  });

newProjectDialog.querySelector("form").onsubmit = async (event) => {
  event.preventDefault();
  newProjectDialog.close();
  const form = event.target;

  const project = await api.createProject(
    await api.user(form.querySelector(`[name="teamLeader"]`).value),
    await api.client(form.querySelector(`[name="client"]`).value),
    Date.now(),
    Date.parse(form.querySelector(`[name="deadline"]`).value),
    form.querySelector(`[name="title"]`).value,
    form.querySelector(`[name="desc"]`).value
  );
  currentUser.projectlist().add(project);
};

const projectOverviewWrapper = document.querySelector(
  "#project-overview-wrapper"
);

currentUser.projectlist().onChange((event) => {
  for (const project of event.add) {
    projectOverviewWrapper.appendChild(
      HTMLasDOM(createProjectOverviewCard(project))
    );
  }
});

async function setDynamicData() {
  const selectorClient = newProjectDialog.querySelector("#options-client");
  selectorClient.innerHTML = createProjectOptionClientHTML({
    id: "",
    name: "Select a Client...",
  });
  for (const client of await api.clients())
    selectorClient.appendChild(
      HTMLasDOM(createProjectOptionClientHTML(client))
    );

  const selectorTeamLeader = newProjectDialog.querySelector(
    "#options-team-leader"
  );
  selectorTeamLeader.innerHTML = createProjectOptionTeamLeaderHTML({
    id: "",
    name: "Select a Team Leader...",
  });
  for (const user of await api.users())
    selectorTeamLeader.appendChild(
      HTMLasDOM(createProjectOptionTeamLeaderHTML(user))
    );
}

/**
 * Create a project overview progress card for managers
 * @param {Project} project
 * @returns {string} HTML for task list item
 */
function createProjectOverviewCard(project) {
  const tasks = project.tasks.snapshot;
  const progress = project.progress();

  // sum the 'manhours' of tasks that aren't done
  const workerHoursRemaining = tasks.reduce((previous, current) => {
    if (current.task.state != TaskState.Done) {
      return previous + current.task.manhours;
    }
    return previous;
  }, 0);

  const today = new Date();
  const deadline = new Date(project.deadline);

  // Thanks, copilot!
  const daysRemaining = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );

  const hoursWorkedDaily = 7.5;
  const noWorkers = project.team.users.snapshot.length;
  const workerHoursAvailable = noWorkers * hoursWorkedDaily * daysRemaining;

  let colour;
  if (workerHoursAvailable < workerHoursRemaining) {
    colour = "red";
  } else if (workerHoursAvailable < 0.75 * workerHoursRemaining) {
    colour = "amber";
  } else {
    colour = "green";
  }

  return /*HTML*/ `
    <div class="card-small bg-accent rag-band" data-rag="${colour}">
    <a href="/project/?id=${project.id}">
    <h3 class="title-card-small">${project.name}</h3>
    </a>
      <p class="card-description">Progress:</p>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          style="width: ${
            progress.percentage * 100
          }%; --bar-fill: var(--colour-card-highlight);"
        ></div>
      </div>
      <p class="card-description">${progress.done}/${progress.total}
      Tasks Completed</p>
      <p class="card-description">
        Deadline: ${deadline.toLocaleDateString()}
      </p>
      <p class="card-description project-detail">
        Estimated hours remaining: <span class="detail-highlight">
          ${workerHoursRemaining}
        </span>
      </p>
      <p class="card-description project-detail">
        Worker-hours available:  <span class="detail-highlight">
          ${workerHoursAvailable}
        </span>
      </p>
    </div>
    `;
}

/**
 * @param {Client} client
 * @returns {String}
 */
function createProjectOptionClientHTML(client) {
  return /* HTML */ `<option value="${client.id}">${client.name}</option>`;
}

/**
 * @param {User} user
 * @returns {String}
 */
function createProjectOptionTeamLeaderHTML(user) {
  return /* HTML */ `<option value="${user.id}">${user.name}</option>`;
}
