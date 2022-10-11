export class Task {
  /** @property {Number} id Unique Task ID */
  id;
  /** @property {Boolean} done Has this task been completed */
  done;
  /** @property {String} name Display Name */
  name;

  constructor(id, done, users) {
    this.id = id;
    this.done = done;
    this.users = users;
  }
}
