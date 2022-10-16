import * as cereal from "../interface/cereal.js";
import { Memoize } from "../interface/memoize.js";

export const TaskSrc = {
  User: 0,
  Project: 1,
};

// TODO: When source == Project add extra fields (project, projectTask)
/**
 * @typedef TaskRef
 * @type {Object}
 * @property {Task} task
 * @property {Number} source A TaskSrc
 */

export class Task {
  constructor(id, done, name) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.done = done;
    this.name = name;
  }
}
cereal.register(Task);
new Memoize(Task);
