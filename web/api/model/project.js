import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { User } from "./user.js";
import { Task } from "./task.js";
import { Team } from "./team.js";
import { Client } from "./client.js";

export class ProjectTask {
  /** @property {Number} id ProjectTaskID */
  id;
  /** @property {Task} task The Task */
  task;
  /** @property {CollectionDB<User>} assignees The users assigned to this task */
  assignees;

  /**
   * @param {Number} id ProjectTaskID
   * @param {Task} task The Task
   */
  constructor(id, task) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.task = task;
    this.assignees = new CollectionDB(this.id, ProjectTask, User);
  }
}
cereal.register(ProjectTask);
new Memoize(ProjectTask);
new MemoizePair(ProjectTask, User);

export class Project {
  /** @property {Number} id ProjectID */
  id;
  /** @property {Team} team The team assigned to the project */
  team;
  /** @property {Client} client The client the project is for */
  client;
  /** @property {Date} created Datetime the project was created */
  created;
  /** @property {Date} deadline Datetime the project should be completed by */
  deadline;
  /** @property {String} name Display name of the project */
  name;
  /** @property {String} desc Description of the project */
  desc;
  /** @property {CollectionDB<ProjectTask>} tasks A collection of tasks assigned to the project */
  tasks;

  /**
   * @param {Number} id ProjectID
   * @param {Team} team The project manager
   * @param {Client} client The client the project is for
   * @param {Date} created Datetime the project was created
   * @param {Date} deadline Datetime the project should be completed by
   * @param {String} name Display name of the project
   * @param {String} desc Description of the project
   * @returns
   */
  constructor(id, team, client, created, deadline, name, desc) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.team = team;
    this.client = client;
    this.created = created;
    this.deadline = deadline;
    this.name = name;
    this.desc = desc;
    this.tasks = new CollectionDB(this.id, Project, ProjectTask);
  }
}
cereal.register(Project);
new Memoize(Project);
new MemoizePair(Project, ProjectTask);
