import { currentUser } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { navbar, HTMLasDOM } from "../nav.js";

navbar();

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
