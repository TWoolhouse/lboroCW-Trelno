import * as cereal from "../interface/cereal.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";

/** @typedef {import("./project.js").Project} Project */
/** @typedef {import("./project.js").ProjectTask} ProjectTask */

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
 * @property {ProjectTask} [projectTask] The project task this task belongs to
 * @property {Project} [project] The project this task belongs to
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
  /** @property {Number} workerhours The estimated man hours to complete the task. */
  workerhours;
  /** @property {CollectionDB<Task>} subtasks Tasks subtasks as a collection of more Tasks. */
  subtasks;

  /**
   * @param {Number} id Unique TaskID
   * @param {Number} state A TaskState
   * @param {String} name Display name of the task
   * @param {Number} deadline The deadline of the project in unix epoch
   * @param {Number} workerhours The estimated man hours to complete the task.
   * @param {String} [desc] An optional description of the task
   * @returns {Task}
   */
  constructor(id, state, name, deadline, workerhours, desc) {
    if (!cereal.cereal(this, id)) {
      this.id = id;
      this.state = state;
      this.name = name;
      this.deadline = deadline;
      this.workerhours = workerhours;
      this.desc = desc;
      this.subtasks = new CollectionDB(this.id, Task, Task);
    }
  }

  /**
   * Get the total number of workerhours including un-completed subtasks.
   * @returns {Number}
   */
  activeWorkerHours() {
    if (this.subtasks.snapshot.length <= 0) return +this.workerhours;
    return +this.subtasks.snapshot.reduce(
      (total, subtask) =>
        subtask.state < TaskState.Done ? +total + +subtask.workerhours : total,
      0
    );
  }
}
cereal.register(Task);
new Memoize(Task);
new MemoizePair(Task, Task);
