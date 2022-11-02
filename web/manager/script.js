import { currentUser } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { navbar, HTMLasDOM } from "../nav.js";

navbar();
import * as api from "../api/core.js";

const newProject = document.querySelector("button[data-action='new-project']");
const newProjectDialog = document.querySelector("#dialog-new-project");

newProject.addEventListener("click", () => {
  newProjectDialog.showModal();
  const closeBtn = newProjectDialog.querySelector(".dialog-close");
  closeBtn.addEventListener("click", () => {
    newProjectDialog.close();
  });
});

newProjectDialog.querySelector("form").onsubmit = async (event) => {
  event.preventDefault();
  newProjectDialog.close();
  const form = event.target;

  const project = await api.createProject(
    currentUser,
    api.createClient(
      "Client Name",
      "Ada Lovelace",
      "0 avenue road",
      "asd",
      "cum@bum.com",
      "07123456"
    ),
    new Date(),
    newProjectDialog.querySelector(`[name="deadline"]`).value,
    newProjectDialog.querySelector(`[name="title"]`).value,
    newProjectDialog.querySelector(`[name="desc"]`).value
  );
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

/**
 * Create a project overview progress card for managers
 * @param {Project} project
 * @returns {string} HTML for task list item
 */
function createProjectOverviewCard(project) {
  const colours = ["colour-red", "colour-amber", "colour-green"];
  const tasks = project.tasks.snapshot;
  const completedTasks = tasks.filter((task) => task.state == TaskState.Done);
  const percentage =
    (completedTasks.length / (tasks.length == 0 ? 1 : tasks.length)) * 100;

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
      <p class="card-description">${completedTasks.length}/${tasks.length}
      Tasks Completed</p>
      <p class="card-description">
        Deadline: ${deadline.toLocaleDateString()}
      </p>
      <p class="card-description">
        Estimated hours remaining: ${workerHoursRemaining}
      </p>
      <p class="card-description">
        Worker-hours available: ${workerHoursAvailable}
      </p>
    </div>
    `;
}
