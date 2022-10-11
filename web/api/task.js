export class Task {
  /** @property {Number} id Unique Task ID */
  id;
  /** @property {Boolean} done Has this task been completed */
  done;
  /** @property {String} name Display Name */
  name;

  /**
   *
   * @param {Number} id The database ID of this task
   * @param {Boolean} done Has this task been completed
   * @param {String} name Display name for the task.
   */
  constructor(id, done, name) {
    this.id = id;
    this.done = done;
    this.name = name;
  }
}
