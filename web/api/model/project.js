import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { User } from "./user.js";
import { Task } from "./task.js";
import { Assignees } from "./assignees.js";
import { Client } from "./client.js";

export class ProjectTask {
  /** @property {Number} id ProjectTaskID */
  id;
  /** @property {Task} id TaskID */
  task;
  /** @property {Assignees} assignees Users assigned to this project task */
  assignees;

  /**
   * @param {Number} id ProjectTaskID
   * @param {Task} task TaskID
   * @param {Assignees} assignees Users assigned to this project task
   * @returns {ProjectTask}
   */
  constructor(id, task, assignees) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.task = task;
    this.assignees = assignees;
  }
}
cereal.register(ProjectTask);
new Memoize(ProjectTask);

export class Project {
  /** @property {Number} id ProjectID */
  id;
  /** @property {User} manager The project manager */
  manager;
  /** @property {Client} client The client the project is for */
  client;
  /** @property {Date} created Datetime the project was created */
  created;
  /** @property {Date} deadline Datetime the project should be completed by */
  deadline;
  /** @property {String} name Display name of the project */
  name;
  /** @property {CollectionDB<ProjectTask>} tasks A collection of tasks assigned to the project */
  tasks;
  /** @property {Assignees} assignees Users and Teams that have been assigned to the project */
  assignees;

  /**
   * @param {Number} id ProjectID
   * @param {User} manager The project manager
   * @param {Client} client The client the project is for
   * @param {Date} created Datetime the project was created
   * @param {Date} deadline Datetime the project should be completed by
   * @param {String} name Display name of the project
   * @param {Assignees} assignees Users and Teams that have been assigned to the project
   * @returns
   */
  constructor(id, manager, client, created, deadline, name, assignees) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.manager = manager;
    this.client = client;
    this.created = created;
    this.deadline = deadline;
    this.name = name;
    this.tasks = new CollectionDB(this.id, Project, ProjectTask);
    this.assignees = assignees;
  }

  /**
   * The list of all users who are assigned to this project either through a team or directly.
   * @returns {Promise<Array<User>>} An array of users which are assigned to the project
   */
  async users() {
    return this.assignees.all();
  }
}
cereal.register(Project);
new Memoize(Project);
new MemoizePair(Project, ProjectTask);
