import * as api from "../api/core.js";
import { HTMLasDOM, navbar } from "../nav.js";
import { kanban } from "../kanban.js";
import { currentUser } from "../api/active.js";
import { UserRank } from "../api/model/user.js";

/** @typedef {import("../api/model/user.js").User} User */

navbar();

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const project = await api.project(urlParams.get("id"));
console.log("Project", project);
if (project == null) {
  // Do something if the project can't be found and it was a broken link
  window.location.href = "/dashboard/";
}

// Check if currentUser can add tasks to project
if (currentUser.rank < UserRank.TeamLeader)
  document.querySelector(`[data-action="new-task"]`).classList.add("hidden");

setup();
kanban(
  document.querySelector("#kanban"),
  project,
  (ondrag = updateProgressBar)
);

function setup() {
  document.querySelector("#project-name").innerHTML = project.name;
  document.querySelector("#project-description").innerHTML = project.desc;
  const leaderDOM = document.querySelector("#project-leader");
  leaderDOM.innerHTML = project.team.leader.name;
  leaderDOM.parentElement.href = `../profile/?id=${project.team.leader.id}`;
  leaderDOM.parentElement.querySelector("img").src =
    project.team.leader.profilePicture();
  setProjectDeadlineDate(project.deadline);

  project.team.users.onChange((event) => event.add.map(addMember));

  project.tasks.onChange(updateProgressBar);

  const clientDOM = document.querySelector(".client-info");
  clientDOM.href = `../client/?id=${project.client.id}`;
  clientDOM.querySelector("#client-link").innerHTML = project.client.name;
  clientDOM.querySelector("img").src =
    project.client.representativeProfilePicture();
}

/**
 * Update assignee list
 * @param {User} user
 */
function addMember(user) {
  const projectMembersWrap = document.querySelector("#project-members-wrap");
  const card = HTMLasDOM(createUserOverviewCard(user));
  user.tasklist().onChange((event) => {
    const tasks = event.all.filter(
      (ref) =>
        ref.source == TaskSrc.Project &&
        ref.project.id == project.id &&
        ref.projectTask.assignees.snapshot.includes(user) &&
        ref.task.state < TaskState.Done
    );
    const totalHours = tasks.reduce(
      (total, current) => total + current.task.manhours,
      0
    );
    const hoursPerWeek = 37.5;
    const colour =
      totalHours >= hoursPerWeek
        ? "red"
        : totalHours >= 0.75 * hoursPerWeek
        ? "amber"
        : "green";
    card.setAttribute("data-rag", colour);
    card.querySelector(".detail-highlight").innerHTML = totalHours;
  });
  projectMembersWrap.appendChild(card);
}

/**
 * @param {User} user
 * @returns {String}
 */
function createUserOverviewCard(user) {
  return /* HTML */ `
    <div class="member-view card-small bg-accent flex-col-center card-smaller">
      <a href="../profile/?id=${user.id}">
        <img
          src="${user.profilePicture()}"
          alt="User Profile Picture"
          class="profile-pic"
          width="50"
          height="50"
        />
        <h3>${user.name}</h3>
      </a>
      <p class="dimmed">${user.rankTitle()}</p>
      <p class="hours">
        Assigned Hours
        <span class="detail-highlight">0</span>
      </p>
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
