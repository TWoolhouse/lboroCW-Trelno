import * as api from "./api/core.js";
import { currentUser } from "./api/active.js";
import { TaskSrc, TaskState } from "./api/model/task.js";
import { HTMLasDOM } from "./nav.js";
import { UserRank } from "./api/model/user.js";

/** @typedef {import("./api/model/user.js").User} User */
/** @typedef {import("./api/model/task.js").Task} Task */
/** @typedef {import("./api/model/task.js").TaskRef} TaskRef */
/** @typedef {import("./api/model/project.js").Project} Project */

/**
 * @callback onDragCB
 * @param {TaskRef} task The task that is being moved.
 * @param {Element} card The DOM object of the card being moved.
 * @param {Element} section The DOM object of the kanban section the card is arriving into.
 */

let TaskRefActive = {
  task: {
    id: null,
  },
};
let MultiTasking = {
  ref: null,
  func: null,
};

/**
 * Creates a kanban on the page
 * @param {Element} rootDOM The root element of the whole kanban
 * @param {Project} [project] A project this kanban is tied to, if any
 * @param {onDragCB} [ondrag] A callback when a kanban element is moved to another section
 * @param {HTMLDialogElement} [subtaskDialog] If the task has subtasks, this is the dialog to show them in
 */
export function kanban(rootDOM, project, ondrag = (task, card, section) => {}) {
  const tasklistEvent = kanbanEnable(rootDOM, ondrag);
  taskListener(tasklistEvent, project);
  createDialogs(rootDOM, project);
}

/**
 * Enables the Kanban drag and drop behaviour
 * @param {Element} rootDOM The kanban root Element
 * @param {onDragCB} ondrag An event to fire when the drag drop is completed
 * @returns {TaskEventCB} A function that takes the added and removed tasks and will edit the kanban respectively
 */
function kanbanEnable(rootDOM, ondrag) {
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
        let project = undefined;
        const projectID = card.getAttribute("data-project");
        if (projectID) project = await api.project(projectID);
        const ref = {
          task: task,
          source: project ? TaskSrc.Project : TaskSrc.User,
          projectTask: project
            ? await api.projectTask(card.getAttribute("data-project-task"))
            : undefined,
          project: project,
        };
        console.log("Kanban Card:", ref, card);
        ondrag(ref, card, section);
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
      const card = createTask(ref);
      kanbanSections[task.state].appendChild(card);

      // Kanban Drag Event Handler
      card.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("task", task.id);
        event.dataTransfer.dropEffect = "move";
      });
    }
  }
  return tasklistEvent;
}

/**
 * Adds the event listener for the tasklists
 * @param {TaskEventCB} tasklistEvent
 * @param {Project} [project]
 */
function taskListener(tasklistEvent, project) {
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

      const filterer = (pt) => {
        if (currentUser.rank == UserRank.Employee) {
          if (pt.assignees.user.id == currentUser.id) return pt;
        } else return pt;
      };

      tasklistEvent(
        event.add.filter(filterer).map(mapper),
        event.sub.filter(filterer).map(mapper)
      );
    });
  } else {
    currentUser.tasklist().onChange((event) => {
      tasklistEvent(event.add, event.sub);
    });
  }
}

/**
 * @param {Element} rootDOM
 * @param {Project} [project]
 */
function createDialogs(rootDOM, project) {
  const dialogTask = HTMLasDOM(createNewTaskDialogWindowHTML(project));
  const dialogSubtask = HTMLasDOM(createNewSubTaskDialogWindowHTML());
  const dialogUsers = HTMLasDOM(createUsersDialogWindowHTML());
  const dialogAssign = HTMLasDOM(createUsersAddDialogHTML());
  const dialogSubtasksView = HTMLasDOM(createSubtaskViewerDialogHTML());
  const dialogs = [
    dialogTask,
    dialogSubtask,
    dialogUsers,
    dialogAssign,
    dialogSubtasksView,
  ];

  for (const dialog of dialogs) {
    document.body.appendChild(dialog);
    // Close the dialog
    dialog.querySelector(".dialog-close").addEventListener("click", () => {
      dialog.close();
    });
  }

  // NEW TASK
  const newTaskButtonDOM = rootDOM.querySelector(`[data-action="new-task"]`);
  // Show the dialog
  newTaskButtonDOM.addEventListener("click", () => {
    dialogTask.showModal();
  });
  // Onsubmit of new task
  dialogTask.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    return await submitNewTask(dialogTask, project);
  });
  newTaskDynamicInformation(dialogTask, project);

  // NEW SUBTASK
  dialogSubtask
    .querySelector("form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      return await submitNewSubtask(rootDOM, dialogSubtask);
    });

  // ASSIGN USERS
  dialogAssign
    .querySelector('button[type="submit"]')
    .addEventListener("click", async () => {
      dialogAssign.close();
      const ref = TaskRefActive;
      if (dialogAssign.getAttribute("data-isTask")) {
        const users = await Promise.all(
          new Array(
            ...dialogAssign.querySelectorAll('input[type="checkbox"]').values()
          )
            .filter((input) => input.checked)
            .map((input) => api.user(input.value))
        );
        ref.projectTask.assignees.replace(...users);
      } else;
    });

  // SUBTASK VIEW
  dialogSubtasksView
    .querySelector("button.users")
    .addEventListener("click", showDialogUsers);
  dialogSubtasksView
    .querySelector("button.add")
    .addEventListener("click", () => {
      dialogSubtask.showModal();
    });
}

/**
 * Set up event listeners for dynamic data inside of a new task dialog
 * @param {Element} dialog
 * @param {Project} [project]
 */
function newTaskDynamicInformation(dialog, project) {
  // Selecting a project
  const selectProject = dialog.querySelector("#options-project");
  const selectUser = dialog.querySelector("#options-user");

  if (selectUser) {
    project.team.users.onChange((event) => {
      for (const user of event.add)
        selectUser.appendChild(
          HTMLasDOM(createNewTaskDialogUserOptionHTML(user))
        );
      for (const user of event.sub) {
        const opt = selectUser.querySelector(`option[value="${user.id}"]`);
        if (opt) opt.remove();
      }
    });
  }

  if (selectProject) {
    currentUser.projectlist().onChange((event) => {
      for (const project of event.add)
        if (
          currentUser.rank >= UserRank.ProjectManager ||
          project.team.leader.id == currentUser.id
        )
          selectProject.appendChild(
            HTMLasDOM(createNewTaskDialogProjectOptionHTML(project))
          );
      for (const project of event.sub)
        selectProject.querySelector(`option[value="${project.id}"]`).remove();
    });
  }
}

/**
 * @param {TaskRef} ref
 * @returns {Element}
 */
function createTask(ref) {
  const task = ref.task;
  const dom = HTMLasDOM(createTaskHTML(task));
  if (ref.source == TaskSrc.Project) {
    dom.setAttribute("data-project", ref.project.id);
    dom.setAttribute("data-project-task", ref.projectTask.id);

    ref.projectTask.assignees.onChange(async (event) => {
      ref.project.team.users.add(...event.add);
      const users = ref.project.tasks.snapshot.flatMap(
        (pt) => pt.assignees.snapshot
      );
      ref.project.team.users.remove(
        ...event.sub.filter((user) => !users.find((u) => u.id == user.id))
      );
    });
  }

  dom
    .querySelector("select.kanban-mobile-options")
    .addEventListener("change", (event) => {
      const newState = +event.target.value;
      task.state = newState;
      const newSection = document.querySelector(
        `.kanban-section[data-task-state="${newState}"]`
      );
      console.log(newSection);
      dom.remove();
      newSection.appendChild(dom);
    });

  const showTaskModal = (modal) => {
    TaskRefActive = ref;
    modal.showModal();
  };

  if (task.subtasks.snapshot.length == 0) {
    // Has no subtasks
    dom
      .querySelector("button#subtask-add")
      .addEventListener("click", (event) => {
        showTaskModal(document.querySelector("#dialog-new-subtask"));
      });
    if (ref.source == TaskSrc.Project) {
      dom.querySelector("button#users-show").addEventListener("click", () => {
        TaskRefActive = ref;
        showDialogUsers();
      });
    } else dom.querySelector("button#users-show").classList.add("hidden");
  } else {
    dom.querySelector(".analytics").addEventListener("click", () => {
      showMultiTask(ref);
    });
    dom.querySelector("button.add");
  }
  return dom;
}

function showDialogUsers() {
  const ref = TaskRefActive;
  const dialog = document.querySelector("#dialog-task-users");
  const userListDOM = dialog.querySelector(".user-list");
  userListDOM.innerHTML = "";
  const IsPowerUser =
    currentUser.rank >= UserRank.ProjectManager ||
    ref.project.team.leader.id == currentUser.id;
  const onChangeUserAssigned = (event) => {
    if (TaskRefActive.task.id != ref.task.id) return;
    for (const user of event.add) {
      const cardUser = HTMLasDOM(createUserAssignedHTML(user));
      const remove = cardUser.querySelector(".remove");
      if (IsPowerUser)
        remove.addEventListener("click", () => {
          cardUser.remove();
          ref.projectTask.assignees.remove(user);
        });
      else remove.classList.add("hidden");
      userListDOM.appendChild(cardUser);
    }
    for (const user of event.sub) {
      const cardUser = userListDOM.querySelector(
        `[data-user-assigned="${user.id}"]`
      );
      if (cardUser) cardUser.remove();
    }
  };
  ref.projectTask.assignees.onChange(onChangeUserAssigned);
  const buttonAdd = dialog.querySelector("button.add");
  if (IsPowerUser) {
    buttonAdd.classList.remove("hidden");
    buttonAdd.addEventListener("click", async () => {
      TaskRefActive = ref;
      assignUsers(
        (await api.users()).filter((user) => user.rank <= UserRank.Employee),
        ref.projectTask.assignees.snapshot,
        true
      );
    });
  } else buttonAdd.classList.add("hidden");
  dialog.showModal();
}

/**
 * @param {Array<User>} userlist
 * @param {Array<User>} assigned
 * @param {Boolean} isTask
 */
function assignUsers(userlist, assigned, isTask = false) {
  const dialog = document.querySelector("#dialog-assign-user");
  dialog.setAttribute("data-isTask", isTask);
  const userListDOM = dialog.querySelector(".user-list");
  userListDOM.innerHTML = "";
  for (const user of userlist)
    userListDOM.appendChild(
      HTMLasDOM(
        createUserAssigningHTML(
          user,
          assigned.find((u) => user.id == u.id) != undefined
        )
      )
    );
  dialog.close();
  dialog.showModal();
}

/**
 * @param {TaskRef} ref
 */
function showMultiTask(ref) {
  TaskRefActive = ref;
  const dialog = document.querySelector("#dialog-multitask");
  dialog.querySelector("h2").innerHTML = ref.task.name;
  const buttonUserShow = dialog.querySelector("button.users");
  if (ref.source != TaskSrc.Project) buttonUserShow.classList.add("hidden");
  else buttonUserShow.classList.remove("hidden");
  const buttonSubtaskAdd = dialog.querySelector("button.add");
  if (
    currentUser.rank >= UserRank.ProjectManager ||
    (ref.source == TaskSrc.Project &&
      ref.project.team.leader.id == currentUser.id) ||
    ref.source == TaskSrc.User
  )
    buttonSubtaskAdd.classList.remove("hidden");
  else buttonSubtaskAdd.classList.add("hidden");
  const tasklistDOM = dialog.querySelector(".subtask-list");
  if (MultiTasking.ref)
    MultiTasking.ref.task.subtasks.onChangeRemove(MultiTasking.func);
  MultiTasking.ref = ref;
  MultiTasking.func = (event) => {
    for (const subtask of event.add) {
      const subtaskDOM = HTMLasDOM(createSubtaskHTML(subtask));
      subtaskDOM
        .querySelector('input[type="checkbox"]')
        .addEventListener("change", () => {
          console.log("SUBTASK STATE CHANGE");
        });
      tasklistDOM.appendChild(subtaskDOM);
    }
  };
  tasklistDOM.innerHTML = "";
  ref.task.subtasks.onChange(MultiTasking.func);
  dialog.showModal();
}

/**
 * @param {Element} dialog
 * @param {Project} [project]
 * @returns
 */
async function submitNewTask(dialog, project) {
  dialog.close();
  const form = dialog.querySelector("form");
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
    const projectTask = await api.createProjectTask(await taskPromise);
    project.tasks.add(projectTask);

    const userId = form.querySelector(`[name="user"]`).value;
    if (userId) projectTask.assignees.add(await api.user(userId));

    currentUser.tasklist(); // Need to force an event update
  }
}

/**
 * @param {Element} rootDOM
 * @param {Element} dialog
 */
async function submitNewSubtask(rootDOM, dialog) {
  dialog.close();
  const parentTask = TaskRefActive.task;
  const form = dialog.querySelector("form");
  parentTask.subtasks.add(
    await api.createTask(
      TaskState.Ready,
      form.querySelector(`[name="title"]`).value,
      Date.parse(form.querySelector(`[name="deadline"]`).value),
      12, // TODO add man hours input
      form.querySelector(`[name="desc"]`).value
      // TODO: Add deadline
    )
  );
  rootDOM
    .querySelector(`#task-${parentTask.id}`)
    .replaceWith(createTask(TaskRefActive));
}

/**
 * @param {Task} subtask
 * @return {String}
 */
function createSubtaskHTML(subtask) {
  return /*HTML*/ `
    <li class="flex-row">
      <label for="${subtask.id}">${subtask.name}<label>
      <input type="checkbox" class="checkbox" id="${subtask.id}"/>
    </li>
  `;
}

function isSelected(task, index) {
  if (task.state == index) {
    return "selected";
  }
  return "";
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskHTML(task) {
  const isSingle = task.subtasks.snapshot.length == 0;
  return /*HTML*/ `
    <div class="card-small task-${
      isSingle ? "single" : "multi"
    } bg-accent" draggable="true" id="task-${task.id}" data-task-id="${
    task.id
  }">
      <div class="flex-row kanban-title">
        <h3 class="title-card-small">${task.name}</h3>
       <select class="kanban-mobile-options">
          <option value="0" ${isSelected(task, 0)}>To-Do</option>
          <option value="1" ${isSelected(task, 1)}>In Progress</option>
          <option value="2" ${isSelected(task, 2)}>Completed</option>
        </select>
      </div>
      ${isSingle ? createTaskSingleHTML(task) : createTaskMultiHTML(task)}
    </div>
    `;
}

/**
 * Create checkbox/label/hr elements for a task
 * @param {Task} task
 * @returns {string} HTML for task list item
 */
function createTaskSingleHTML(task) {
  return /*HTML*/ `
    <div class="flex-row">
      <button class="flex-row dimmed btn-icon click-expander"><span class="material-symbols-outlined">analytics</span>View More Info</button>
      <p class="dimmed flex-row"><span class="material-symbols-outlined">schedule</span>${new Date(
        task.deadline
      ).toLocaleDateString()}</p>
    </div>
    <div class="expand-content">
      <p>${task.desc}</p>
      <div class="flex-row">
        <button id="users-show" type="button" class="btn-action">
          <p>Users</p>
          <span class="material-symbols-outlined">people</span>
        </button>
        <button id="subtask-add" type="button" class="btn-action">
          <p>Subtasks</p>
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
    `;
}

/**
 * @param {Task} task
 * @returns {String}
 */
function createTaskMultiHTML(task) {
  const percentage = 0.0;
  return /* HTML */ `
    <div class="flex-row">
      <button class="flex-row dimmed btn-icon analytics">
        <span class="material-symbols-outlined">analytics</span>View More Info
      </button>
      <p class="dimmed flex-row">
        <span class="material-symbols-outlined">schedule</span>${new Date(
          task.deadline
        ).toLocaleDateString()}
      </p>
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: ${percentage * 100}%"></div>
    </div>
  `;
  const subtasksHTML = task.subtasks.snapshot
    .map((subtask) => createSubtaskHTML(subtask))
    .join("");
  return /*HTML*/ `
    <div>
      <p>${task.desc}</p>
      <p class="dimmed flex-row jc-start">
        <span class="material-symbols-outlined">schedule</span>${new Date(
          task.deadline
        ).toLocaleDateString()}
      </p>
      <ul>
        ${subtasksHTML}
      </ul>
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
 * @returns {String} HTML from user option.
 */
function createNewTaskDialogUserOptionHTML(user) {
  return /*HTML*/ `
    <option value="${user.id}">${user.name}</option>
  `;
}

/**
 * Create Project options for the new task dialog
 * @returns {String} HTML from project selector options.
 */
function createNewTaskDialogProjectSelectorHTML() {
  return /* HTML */ `
    <select name="project" id="options-project" required>
      <option value="">Select Project to Add Task to...</option>
      <option value="user">Personal TODO</option>
    </select>
  `;
}

/**
 * Create User options for the new task dialog
 * @returns {String} HTML from user selector options.
 */
function createNewTaskDialogUserSelectorHTML() {
  return /* HTML */ `
    <select name="user" id="options-user">
      <option value="">Select User to Add Task to...</option>
      <option value="">None</option>
    </select>
  `;
}

/**
 * @param {Project} [project]
 * @returns {String}
 */
function createNewTaskDialogWindowHTML(project) {
  const projectUserSelector =
    project == null
      ? createNewTaskDialogProjectSelectorHTML()
      : createNewTaskDialogUserSelectorHTML();
  return /* HTML */ `
    <dialog class="modal" id="dialog-new-task">
      <div class="flex-row kanban-title">
        <h2 class="title-card">Add New Task</h2>
        <button class="material-symbols-outlined btn-icon dialog-close">
          close
        </button>
      </div>
      <form class="modal-form">
        <input name="title" type="text" placeholder="Task Title..." required />
        <textarea
          name="desc"
          placeholder="Write Task description here..."
        ></textarea>
        ${projectUserSelector}
        <div class="input-label">
          <label for="task-date">Enter Deadline for Task:</label>
          <input name="deadline" type="date" id="task-date" required />
        </div>
        <div class="end-button">
          <button class="btn-action">
            <p>Submit Item</p>
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </dialog>
  `;
}

/**
 * @returns {String}
 */
function createNewSubTaskDialogWindowHTML() {
  // FIXME: Not a complete copy paste
  return /* HTML */ `
    <dialog class="modal" id="dialog-new-subtask">
      <div class="flex-row kanban-title">
        <h2 class="title-card">Add New Subtask</h2>
        <button class="material-symbols-outlined btn-icon dialog-close">
          close
        </button>
      </div>
      <form class="modal-form">
        <input
          name="title"
          type="text"
          placeholder="Subtask Title..."
          required
        />
        <textarea
          name="desc"
          placeholder="Write Subtask description here..."
        ></textarea>
        <div class="input-label">
          <label for="task-date">Enter Deadline for Subtask:</label>
          <input name="deadline" type="date" id="task-date" required />
        </div>
        <div class="end-button">
          <button class="btn-action">
            <p>Submit Item</p>
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </dialog>
  `;
}

/**
 * The dialog which has all of the assigned users to a task
 * @returns {String}
 */
function createUsersDialogWindowHTML() {
  return /* HTML */ `
    <dialog class="modal" id="dialog-task-users">
      <div class="flex-row kanban-title">
        <h2 class="title-card">Assigned Users</h2>
        <button class="material-symbols-outlined btn-icon dialog-close">
          close
        </button>
      </div>
      <div class="user-list"></div>
      <button type="button" class="btn-action add">
        <p>Add User</p>
        <span class="material-symbols-outlined">add</span>
      </button>
    </dialog>
  `;
}

/**
 * @param {User} user
 * @returns {String}
 */
function createUserAssignedHTML(user) {
  return /* HTML */ `<div data-user-assigned="${user.id}">
    <a
      ><img
        class="profile-pic"
        src="${user.profilePicture()}"
        width="50"
        height="50"
      />${user.name}</a
    >
    <button type="button" class="remove btn-action">
      <p>Remove</p>
      <p>
        <span class="material-symbols-outlined">delete</span>
      </p>
    </button>
  </div>`;
}

/**
 * @returns {String}
 */
function createUsersAddDialogHTML() {
  return /* HTML */ `
    <dialog class="modal" id="dialog-assign-user">
      <div class="flex-row kanban-title">
        <h2 class="title-card">Assign Users</h2>
        <button class="material-symbols-outlined btn-icon dialog-close">
          close
        </button>
      </div>
      <ul class="user-list"></ul>
      <button type="submit" class="btn-action add">
        <p>Save</p>
        <span class="material-symbols-outlined">save</span>
      </button>
    </dialog>
  `;
}

/**
 * @param {User} user
 * @param {Boolean} assigned
 * @returns {String}
 */
function createUserAssigningHTML(user, assigned) {
  return /* HTML */ `<li>
    <a
      ><img
        class="profile-pic"
        src="${user.profilePicture()}"
        width="50"
        height="50"
      />${user.name}</a
    >
    <input type="checkbox" value="${user.id}" ${assigned ? "checked" : ""} />
  </li>`;
}

/**
 * @returns {String}
 */
function createSubtaskViewerDialogHTML() {
  return /* HTML */ `
    <dialog class="modal" id="dialog-multitask">
      <div class="flex-row kanban-title">
        <h2 class="title-card">TaskName</h2>
        <button class="material-symbols-outlined btn-icon dialog-close">
          close
        </button>
      </div>
      <div class="flex-row">
        <button type="button" class="btn-action users">
          <p>Users</p>
          <span class="material-symbols-outlined">people</span>
        </button>
        <button type="button" class="btn-action add">
          <p>New Subtask</p>
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>
      <div class="subtask-list"></div>
    </dialog>
  `;
}
