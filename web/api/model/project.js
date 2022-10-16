import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { User } from "./user.js";
import { Task } from "./task.js";
import { CollectionDB } from "../interface/collectionDB.js";

export class ProjectTask {
  task;
  users;

  constructor(task) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.task = task;
    this.users = new CollectionDB(this.id, ProjectTask.name, User.name);
  }
}
cereal.register(ProjectTask);
new Memoize(ProjectTask);
new MemoizePair(ProjectTask, User);

export class Project {
  /** @property {Number} id Database ID of the project */
  id;
  /** @property {User} manager The project manager */
  manager;
  /** @property {Date} created Datetime the project was created */
  created;
  /** @property {Date} deadline Datetime the project should be completed by */
  deadline;
  /** @property {String} name Display name of the project */
  name;
  /** @property {Collection<ProjectTask>} tasks A collection of tasks assigned to the project */
  tasks;
  /** @property {ProjectAssignees} assigned Users and Teams that have been assigned to the project */
  assigned;

  constructor(id, manager, created, deadline, name, tasks, assigned) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.manager = manager;
    this.created = created;
    this.deadline = deadline;
    this.name = name;
    this.tasks = tasks;
    this.assigned = assigned;
  }
}
cereal.register(Project);
new Memoize(Project);
new MemoizePair(Project, ProjectTask);
