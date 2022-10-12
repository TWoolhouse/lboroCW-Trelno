import { ProxyFactory } from "./proxy.js";

export const TaskSrc = {
  User: 0,
  Project: 1,
};

/**
 * @typedef TaskRef
 * @type {Object}
 * @property {Task} task
 * @property {Number} source A TaskSrc
 */

export class Task extends ProxyFactory({
  get: {},
  set: {
    done(target, value) {
      // Update the server
      return true;
    },
  },
}) {
  /** @property {Number} id Unique Task ID */
  id;
  /** @property {Boolean} done Has this task been completed */
  done;
  /** @property {String} name Display Name */
  name;

  /**
   * @param {Number} id The database ID of this task
   * @param {Boolean} done Has this task been completed
   * @param {String} name Display name for the task.
   */
  constructor(id, done, name) {
    super();
    this.id = id;
    this.done = done;
    this.name = name;
  }
}
