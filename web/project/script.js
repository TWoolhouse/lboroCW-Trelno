import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { Project } from "../api/model/project.js";

// Create new Project
const id = (
  await api.createProject(
    await api.user(1),
    1667059483,
    1668959318,
    "New Project"
  )
).id;

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

// Get project details
await api.project(id).then((projectResponse) => {
  document.querySelector("#project-name").innerHTML = projectResponse.name;
  document.querySelector("#project-manager").innerHTML =
    projectResponse.manager.name;
  setProjectDeadlineDate(projectResponse.deadline);
  projectResponse.tasks.onChange((event) =>
    updateProgressBar(event.all.map((pt) => pt.task))
  ); // no idea how this works
  projectResponse.assignees.users.onChange((event) => updateMembers(event.add));
  projectResponse.assignees.teams.onChange((event) =>
    setProjectTeam(event.add)
  );
  // updateMembers(projectResponse.users());
  // Not implemented yet
  // document.querySelector("#project-description").innerHTML =
  //   projectResponse.desc;
  // document.querySelector("#project-client").innerHTML = projectResponse.client;
});

// Set project team
function setProjectTeam(teams) {
  let teamNameHTML = document.querySelector("#team-name");
  for (const team of teams) {
    teamNameHTML.innerHTML = team.name;
  }
}

// Update assignee list
function updateMembers(users) {
  const projectMembersWrap = document.querySelector("#project-members-wrap");
  for (const user of users) {
    projectMembersWrap.appendChild(HTMLasDOM(createProjectMemberCard(user)));
  }
}

/**
 * Converts the HTML into a DOM Node
 * @param {String} html The HTML String
 * @returns {Node} A Node
 */
function HTMLasDOM(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html.trim();
  const element = temp.firstChild;
  element.remove();
  return element;
}

function createProjectMemberCard(user) {
  return `
    <div class="card-small bg-accent flex-col-center card-smaller">
      <h3 class="title-card-small">${user.name}</h3>
      <div class="link-list text-center">
              <a href="#">View Employee details</a>
      </div>
    </div>
  `;
}

// Update circular progress bar
function updateProgressBar(tasks) {
  const totalTasks = tasks.length;
  const tasksDone = tasks.filter((task) => task.state == TaskState.Done).length;
  const percentageDone = (tasksDone / (totalTasks == 0 ? 1 : totalTasks)) * 100;

  document.querySelector("#percentageDone").innerHTML = percentageDone + "%";
  document.querySelector("#tasksDone").innerHTML =
    tasksDone + "/" + totalTasks + " tasks done";

  document
    .querySelector("#progress-bar")
    .style.setProperty("--progress", percentageDone + "%");
  document
    .querySelector("#progress-bar")
    .style.setProperty("--progress-angle", percentageDone / 100 + "turn");
}

// Set project deadline date
function setProjectDeadlineDate(deadlineUnix) {
  const projectDeadlineDate = new Date(deadlineUnix * 1000);
  const projectDeadlineDateFormatted = projectDeadlineDate.toLocaleDateString(
    "en-gb",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
  document.querySelector("#project-deadline").innerHTML =
    projectDeadlineDateFormatted;

  document.querySelector("#days-remaining").innerHTML =
    dateDiffInDays(new Date(), projectDeadlineDate) + " days remaining";
}

// Display days left until project deadline
function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

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
