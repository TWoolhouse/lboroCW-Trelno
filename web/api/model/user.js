import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Task, TaskSrc } from "./task.js";

/** @typedef {import("./task.js").TaskRef} TaskRef */

const UserRank = {
  Employee: 0,
  TeamLeader: 1,
  ProjectManager: 2,
};

export class User {
  /** @property {Number} id Unique User ID */
  id;
  /** @property {String} email Email Address */
  email;
  /** @property {Number} rank UserRank in the company */
  rank;
  /** @property {String} name The users full name */
  name;
  /** @property {CollectionDB<Task>} tasks A collection of personal user tasks */
  tasks;

  /**
   * @param {Number} id Unique User ID
   * @param {String} email Email Address
   * @param {Number} rank UserRank in the company
   * @param {String} name The users full name
   * @returns {User}
   */
  constructor(id, email, rank, name) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.email = email;
    this.rank = rank;
    this.name = name;
    this.tasks = new CollectionDB(this.id, User.name, Task.name);
  }

  /**
   * Returns a list fo all tasks that this user has been assigned too, and the location they were assigned from.
   * @returns {Promise<Array<TaskRef>>} TaskRef objects contain a task, and the source that the task came from.
   */
  async tasklist() {
    return [
      ...this.tasks.snapshot.map((task) => {
        return { task: task, source: TaskSrc.User };
      }),
    ];
  }
}
cereal.register(User);
new Memoize(User);
new MemoizePair(User, Task);
