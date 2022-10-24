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

/**
 * Enum for the Task State
 * @readonly
 * @enum {Number}
 */
export const TaskState = {
  Ready: 0,
  Active: 1,
  Done: 2,
};

export class Task {
  /** @property {Number} id Unique TaskID */
  id;
  /** @property {Number} state A TaskState */
  state;
  /** @property {String} name Display name of the task */
  name;
  /** @property {String | null} desc An optional description of the task */
  desc;
  /** @property {Number} deadline The deadline of the project in unix epoch */
  deadline;

  /**
   * @param {Number} id Unique TaskID
   * @param {Number} state A TaskState
   * @param {String} name Display name of the task
   * @property {Number} deadline The deadline of the project in unix epoch
   * @param {String} [desc] An optional description of the task
   * @returns {Task}
   */
  constructor(id, state, name, deadline, desc) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.state = state;
    this.name = name;
    this.deadline = deadline;
    this.desc = desc;
  }
}
cereal.register(Task);
new Memoize(Task);
