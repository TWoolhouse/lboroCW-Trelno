import { Collection } from "./collection";
import { Task, TaskSrc } from "./task";

/** @typedef {import('./task.js').TaskRef} TaskRef */

export class User {
  /** @property {Number} id Unique User ID */
  id;
  /** @property {String} email Email Address */
  email;
  /** @property {Number} rank User rank in the company */
  rank;
  /** @property {String} name The users full name */
  name;
  /** @property {Collection<Task>} tasks*/
  tasks;

  /**
   * @param {Number} id Unique User ID
   * @param {String} email Email Address
   * @param {Number} rank User rank in the company
   * @param {String} name The users full name
   * @param {Array<Task>} [tasks] A list of tasks
   */
  constructor(id, email, rank, name, tasks = []) {
    this.id = id;
    this.email = email;
    this.rank = rank;
    this.name = name;
    this.tasks = new Collection(...tasks);
  }

  /**
   * Returns a list fo all tasks that this user has been assigned too, and the location they were assigned from.
   * @returns {Array<TaskRef>} TaskRef objects contain a task, and the source that the task came from.
   */
  tasklist() {
    return [
      ...this.tasks.map((task) => {
        return { task: task, source: TaskSrc.User };
      }),
    ];
  }
}
