import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Task, TaskSrc } from "./task.js";

/** @typedef {import("./task.js").TaskRef} TaskRef */

export class User {
  constructor(id, email) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.email = email;
    this.tasks = new CollectionDB(this.id, User.name, Task.name);
  }

  /**
   * Returns a list fo all tasks that this user has been assigned too, and the location they were assigned from.
   * @returns {Array<TaskRef>} TaskRef objects contain a task, and the source that the task came from.
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
