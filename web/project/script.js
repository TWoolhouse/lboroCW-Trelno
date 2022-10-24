import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");
const projectHead = document.querySelector("#project-id");
projectHead.innerHTML = projectId
  ? (projectHead.innerHTML = "Project " + projectId)
  : (projectHead.innerHTML = "Project X");

// for (const [key, value] of urlParams) {
//   console.log(`${key}:${value}`);
// }

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

// Creating new task
const newItemButton = document.querySelector(`[data-action="new-task"]`);
const newTaskDialog = document.querySelector("#dialog-new-task");
newItemButton.addEventListener("click", async () => {
  const selectProject = newTaskDialog.querySelector("#options-project");
  selectProject.innerHTML = createDialogProjectOption({
    id: "user",
    name: "Personal TODO List",
  });
  for (const ref of await currentUser.projectlist()) {
    if (!ref.manager) continue;
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
