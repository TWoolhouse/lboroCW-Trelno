import * as api from "./api/core.js";
import { currentUser } from "./api/active.js";
import { TaskSrc, TaskState } from "./api/model/task.js";
import { HTMLasDOM } from "./nav.js";

/** @typedef {import("./api/model/task.js").Task} Task */
/** @typedef {import("./api/model/task.js").TaskRef} TaskRef */
/** @typedef {import("./api/model/project.js").Project} Project */

/**
 * @callback onDragCB
 * @param {Task} task The task that is being moved.
 * @param {Element} card The DOM object of the card being moved.
 * @param {Element} section The DOM object of the kanban section the card is arriving into.
 */

/**
 * Creates a kanban on the page
 * @param {Element} rootDOM The root element of the whole kanban
 * @param {Element} newTaskDialogDOM The dialog element for creating a new task
 * @param {Project} [project] A project this kanban is tied to, if any
 * @param {onDragCB} [ondrag] A callback when a kanban element is moved to another section
 */
export function kanban(
  rootDOM,
  newTaskDialogDOM,
  project,
  ondrag = (task, card, section) => {}
) {
  // Find kanban sections
  const kanbanSections = rootDOM.querySelectorAll(".kanban-section");
  if (kanbanSections.length != Object.entries(TaskState).length)
    console.warn(
      "There are not enough Kanban sections for the number of task states"
    );

  // Setup Kanban Drop Event Handler
  {
    kanbanSections.forEach((section, index) => {
      // TaskState is enumerated from 0, where that is the first state.
      section.setAttribute("data-task-state", index);
      section.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      section.addEventListener("drop", async (event) => {
        event.preventDefault();
        let taskId = event.dataTransfer.getData("task");
        if (!taskId) return;
        const task = await api.task(taskId);
        task.state = +section.getAttribute("data-task-state");
        const card = rootDOM.querySelector(`#task-${task.id}`);
        console.log("Kanban Card:", task, card);
        ondrag(task, card, section);
        card.remove();
        section.appendChild(card);
      });
    });
  }

  /**
   * Updates the kanban task list
   * @param {Array<TaskRef>} add
   * @param {Array<TaskRef>} sub
   */
  function tasklistEvent(add, sub) {
    for (const ref of add) {
      const task = ref.task;
      // console.log(task);
      const card = HTMLasDOM(createTaskHTML(task));
      kanbanSections[task.state].appendChild(card);

      // Kanban Drag Event Handler
      card.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("task", task.id);
        event.dataTransfer.dropEffect = "move";
      });
    }
  }

  // Add tasks to the kanban
  if (project) {
    project.tasks.onChange((event) => {
      // TODO: Filter out tasks they shouldn't be able to see
      const mapper = (pt) => {
        return {
          task: pt.task,
          source: TaskSrc.Project,
          projectTask: pt,
          project: project,
        };
      };
      tasklistEvent(event.add.map(mapper), event.sub.map(mapper));
    });
  } else {
    currentUser.tasklist().onChange((event) => {
      tasklistEvent(event.add, event.sub);
    });
  }

  // Create New Task
  const newTaskButtonDOM = rootDOM.querySelector(`[data-action="new-task"]`);
  newTaskButtonDOM.addEventListener("click", async () => {
    // If it has the select projects options list. Ensure its up to date
    const selectProject = newTaskDialogDOM.querySelector("#options-project");
    const selectUser = newTaskDialogDOM.querySelector("#assign-user");
    if (selectProject) {
      selectProject.innerHTML = createNewTaskDialogProjectOptionHTML({
        id: "user",
        name: "Personal TODO List",
      });
      // FIXME: Permissions
      for (const ref of await currentUser.projectlist()) {
        if (!ref.manager) continue;
        selectProject.innerHTML += createNewTaskDialogProjectOptionHTML(
          ref.project
        );
      }
      newTaskDashboard();
    }
    // Calin's code - adding user options to the new task dialog in project page
    if (selectUser) {
      selectUser.options.length = 0;
      selectUser.appendChild(new Option("Select user to assign task to"));
      for (let user of project.team.users.snapshot)
        selectUser.innerHTML += createNewTaskDialogUserOptionHTML(user);
      newTaskProject();
    }

    newTaskDialogDOM.showModal();
  });

  // Onsubmit of new task at dashboard
  function newTaskDashboard() {
    newTaskDialogDOM
      .querySelector("form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        newTaskDialogDOM.close();
        const form = event.target;
        const taskPromise = api.createTask(
          TaskState.Ready,
          form.querySelector(`[name="title"]`).value,
          Date.parse(form.querySelector(`[name="deadline"]`).value),
          12, // TODO add man hours input
          form.querySelector(`[name="desc"]`).value
          // TODO: Add deadline
        );
        const projectId = (
          form.querySelector(`[name="project"]`) ?? { value: project.id }
        ).value;
        // TODO: Clear the form

        if (projectId == "user") {
          currentUser.tasks.add(await taskPromise);
        } else {
          const project = await api.project(projectId);
          project.tasks.add(await api.createProjectTask(await taskPromise));
        }
        return false;
      });
  }
  // Onsubmit of new task at project page
  function newTaskProject() {
    newTaskDialogDOM
      .querySelector("form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        newTaskDialogDOM.close();
        const form = event.target;
        const task = await api.createTask(
          TaskState.Ready,
          form.querySelector(`[name="title"]`).value,
          Date.parse(form.querySelector(`[name="deadline"]`).value),
          12, // TODO add man hours input
          form.querySelector(`[name="desc"]`).value
          // TODO: Add deadline
        );
        // TODO: Clear the form

        const userId = form.querySelector(`[name="user"]`).value;
        const user = await api.user(userId);
        const urlParams = new URLSearchParams(window.location.search);
        const project = await api.project(urlParams.get("id"));

        const projectTask = await api.createProjectTask(task);
        project.tasks.add(projectTask);
        projectTask.assignees.add(user);

        console.log(user.tasks);
        return false;
      });
  }

  // Close the dialog
  newTaskDialogDOM
    .querySelector(".dialog-close")
    .addEventListener("click", () => {
      newTaskDialogDOM.close();
    });
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskHTML(task) {
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
function createNewTaskDialogProjectOptionHTML(project) {
  return /*HTML*/ `
    <option value="${project.id}">${project.name}</option>
  `;
}

/**
 * Create a User option for the new task dialog
 * @param {Project} project
 * @returns {String} HTML from project option.
 */
function createNewTaskDialogUserOptionHTML(user) {
  return /*HTML*/ `
    <option value="${user.id}">${user.name}</option>
  `;
}
