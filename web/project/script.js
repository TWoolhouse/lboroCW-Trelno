import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
import { TaskState } from "../api/model/task.js";
import { Project } from "../api/model/project.js";

// // Create new Project
// const id = (
//   await api.createProject(
//     await api.user(1),
//     1667059483,
//     1668959318,
//     "New Project"
//   )
// ).id;

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const project = await api.project(urlParams.get("id"));
console.log(project);
if (project == null); // Do something if the project can't be found and it was a broken link
console.log("Project", project);

function setup() {
  document.querySelector("#project-name").innerHTML = project.name;
  document.querySelector("#project-description").innerHTML = project.desc;
  document.querySelector("#project-leader").innerHTML =
    project.team.leader.name;
  setProjectDeadlineDate(project.deadline);

  project.team.users.onChange((event) => event.add.map(addMember));

  project.tasks.onChange((event) =>
    updateProgressBar(event.all.map((pt) => pt.task))
  ); // no idea how this works

  document
    .querySelector("#client-link")
    .setAttribute("href", "../client/?id=" + project.client.id);

  console.log(project.client.id);

  document.querySelector("#client-name").innerHTML = project.client.name;
}

setup();

// Update assignee list
function addMember(user) {
  const projectMembersWrap = document.querySelector("#project-members-wrap");
  projectMembersWrap.appendChild(HTMLasDOM(createProjectMemberCard(user)));
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
function updateProgressBar(tasks) {
  const totalTasks = tasks.length;
  const tasksDone = tasks.filter((task) => task.state == TaskState.Done).length;
  const percentageDone = (tasksDone / (totalTasks == 0 ? 1 : totalTasks)) * 100;

  document.querySelector("#percentageDone").innerHTML =
    percentageDone.toFixed(1) + "%";
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

// Kanban section
const kanbanSections = document.querySelectorAll(".kanban-section");
if (kanbanSections.length != Object.entries(TaskState).length)
  console.warn(
    "There are not enough Kanban sections for the number of task states"
  );

// Create new task
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
    12, // TODO add man hours input
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

currentUser.tasklist().onChange((event) => {
  for (const ref of event.add) {
    const task = ref.task;
    const card = HTMLasDOM(createTaskListItem(task));
    kanbanSections[task.state].appendChild(card);

    // Kanban Drag Event Handler
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("task", task.id);
      event.dataTransfer.dropEffect = "move";
    });
  }
});

// Setup Kanban Drop Event Handler
(() => {
  kanbanSections.forEach((element, index) => {
    // TaskState is enumerated from 0, where that is the first state.
    element.setAttribute("data-task-state", index);
  });
  for (let section of kanbanSections) {
    section.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    section.addEventListener("drop", async (event) => {
      event.preventDefault();
      let taskId = event.dataTransfer.getData("task");
      if (!taskId) return;
      const task = await api.task(taskId);
      task.state = +section.getAttribute("data-task-state");
      const card = document.querySelector(`#task-${task.id}`);
      console.log("Kanban Card:", task, card);
      card.remove();
      section.appendChild(card);
    });
  }
})();

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskListItem(task) {
  return /*HTML*/ `
    <div class="card-small bg-accent" draggable="true" id="task-${
      task.id
    }" data-task-id="${task.id}">
      <div class="flex-row kanban-title">
        <h3 class="title-card-small">${task.name}</h3>
        <button class="kanban-mobile-options material-symbols-outlined">more_horiz</button>
        <div class="kanban-dropdown" >
          <ul>
            <li>Mark as To Do </li>
            <li>Mark as In Progress </li>
            <li>Mark as Completed </li>
          </ul>
        </div>
      </div>
      <div class="flex-row">
        <button class="flex-row dimmed btn-icon click-expander"><span class="material-symbols-outlined">analytics</span>View More Info</button>
        <p class="dimmed flex-row"><span class="material-symbols-outlined">schedule</span>${new Date(
          task.deadline
        ).toLocaleDateString()}</p>
        <img src="https://placekitten.com/39/39" alt="Profile image" style="border-radius:100vh" />
      </div>
      <div class="expand-content">
        <p>${task.desc}</p>
      </div>
    </div>
    `;
}

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
