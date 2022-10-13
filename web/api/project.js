import { ProxyFactory } from "./proxy.js";

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
    this.id = id;
    this.manager = manager;
    this.created = created;
    this.deadline = deadline;
    this.name = name;
    this.tasks = tasks;
    this.assigned = assigned;

    return ProxyFactory({
      set: {
        created: () => false,
      },
    })(this);
  }
}
