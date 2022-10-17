import * as cereal from "../interface/cereal.js";
import { Memoize } from "../interface/memoize.js";

/**
 * Enum for TaskRef source location
 * @readonly
 * @enum {Number}
 */
export const TaskSrc = {
  User: 0,
  Project: 1,
};

// TODO: When source == Project add extra fields (project, projectTask)
/**
 * @typedef TaskRef
 * @type {Object}
 * @property {Task} task The task
 * @property {Number} source A TaskSrc of where this task has come from
 */

export class Task {
  /** @property {Number} id Unique TaskID */
  id;
  /** @property {Boolean} done A flag indicating if the task is complete */
  done;
  /** @property {String} name Display name of the task */
  name;
  /** @property {String | null} desc An optional description of the task */
  desc;

  /**
   * @param {Number} id Unique TaskID
   * @param {Boolean} done A flag indicating if the task is complete
   * @param {String} name Display name of the task
   * @param {String} desc An optional description of the task
   * @returns {Task}
   */
  constructor(id, done, name, desc) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.done = done;
    this.name = name;
    this.desc = desc;
  }
}
cereal.register(Task);
new Memoize(Task);
