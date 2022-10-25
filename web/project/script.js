import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");
const projectHead = document.querySelector("#project-id");
projectId
  ? (projectHead.innerHTML = "Project " + projectId)
  : (projectHead.innerHTML = "Project X");

// for (const [key, value] of urlParams) {
//   console.log(`${key}:${value}`);
// }

// Set project deadline date
const projectDeadline = document.querySelector("#deadline-date");
const today = new Date();
const projectDeadlineDate = new Date();
projectDeadlineDate.setDate(projectDeadlineDate.getDate() + 7);
let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let formattedDate =
  monthNames[projectDeadlineDate.getMonth()] +
  " " +
  projectDeadlineDate.getDate() +
  ", " +
  projectDeadlineDate.getFullYear();

projectDeadline.innerHTML = formattedDate;

// Display days left until project deadline
function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const deadlineRemainingDays = document.querySelector("#days-remaining");
const differenceDays = dateDiffInDays(today, projectDeadlineDate);
deadlineRemainingDays.innerHTML = differenceDays + " days remaining";

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
