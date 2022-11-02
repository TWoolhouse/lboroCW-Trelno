import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { Project } from "../api/model/project.js";
import { HTMLasDOM, navbar } from "../nav.js";
import { kanban } from "../kanban.js";

redirectLogin();
navbar();

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const project = await api.project(urlParams.get("id"));
console.log("Project", project);
if (project == null) {
  // Do something if the project can't be found and it was a broken link
  window.location.href = "/dashboard/";
}

setup();
kanban(
  document.querySelector("#kanban"),
  document.querySelector("#dialog-new-task"),
  project,
  (ondrag = updateProgressBar)
);

function setup() {
  document.querySelector("#project-name").innerHTML = project.name;
  document.querySelector("#project-description").innerHTML = project.desc;
  document.querySelector("#project-leader").innerHTML =
    project.team.leader.name;
  setProjectDeadlineDate(project.deadline);

  project.team.users.onChange((event) => event.add.map(addMember));

  project.tasks.onChange(updateProgressBar);

  document
    .querySelector("#client-link")
    .setAttribute("href", "../client/?id=" + project.client.id);

  console.log(project.client.id);

  document.querySelector("#client-name").innerHTML = project.client.name;
}

// Update assignee list
function addMember(user) {
  const projectMembersWrap = document.querySelector("#project-members-wrap");
  projectMembersWrap.appendChild(HTMLasDOM(createProjectMemberCard(user)));
}

function createProjectMemberCard(user) {
  return /*HTML*/ `
    <div class="card-small bg-accent flex-col-center card-smaller">
      <h3 class="title-card-small">${user.name}</h3>
      <img src=${user.profilePicture()}>
      <div class="link-list text-center">
              <a href="#">View Employee details</a>
      </div>
    </div>
  `;
}

// Update circular progress bar
function updateProgressBar() {
  const progress = project.progress();

  document.querySelector("#percentageDone").innerHTML =
    (progress.percentage * 100).toFixed(1) + "%";
  document.querySelector("#tasksDone").innerHTML =
    progress.done + "/" + progress.total + " tasks done";

  document
    .querySelector("#progress-bar")
    .style.setProperty("--progress", progress.percentage * 100 + "%");
  document
    .querySelector("#progress-bar")
    .style.setProperty("--progress-angle", progress.percentage + "turn");
}

// Set project deadline date
function setProjectDeadlineDate(deadlineUnix) {
  const projectDeadlineDate = new Date(deadlineUnix);
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
