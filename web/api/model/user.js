import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Task, TaskSrc } from "./task.js";
import { Collection } from "../interface/collection.js";
import { userProjects, userProjectTasks, userTeams } from "../interface/db.js";

/** @typedef {import("./team.js").Team} Team */
/** @typedef {import("./project.js").Project} Project */
/** @typedef {import("./task.js").TaskRef} TaskRef */

export const UserRank = {
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
    if (!cereal.cereal(this, id)) {
      this.id = id;
      this.email = email;
      this.rank = rank;
      this.name = name;
      this.tasks = new CollectionDB(this.id, User.name, Task.name);
    }
    this._tasklist = new Collection();
    this._teamlist = new Collection();
    this._projectlist = new Collection();

    this.tasks.onChange((event) => {
      this._tasklist.remove(
        ...event.sub.map((task) =>
          this._tasklist.snapshot.find((value) => value.task == task)
        )
      );
      this._tasklist.add(
        ...event.add.map((task) => {
          return { task: task, source: TaskSrc.User };
        })
      );
    });
  }

  /**
   * Returns a collection of all tasks that this user has been assigned too, and the location they were assigned from.
   * @returns {Collection<TaskRef>} TaskRef objects contain a task, and the source that the task came from.
   */
  tasklist() {
    userProjectTasks(this.id).then((values) => {
      this._tasklist.add(...values);
    });
    return this._tasklist;
  }

  /**
   * @typedef TeamRef
   * @type {Object}
   * @property {Team} team The team
   * @property {Boolean} leader Is this user the leader of the team
   */

  /**
   * Returns a collection of all the teams that this user is a part of.
   * @returns {Collection<TeamRef>}
   */
  teamlist() {
    userTeams(this.id).then((values) => {
      this._teamlist.add(...values);
    });
    return this._teamlist;
  }

  /**
   * @typedef ProjectRef
   * @type {Object}
   * @property {Project} project The project
   * @property {Boolean} leader Is this user the leader of the project
   */

  /**
   * Returns a collection of all the teams that this user is a part of.
   * @returns {Collection<ProjectRef>}
   */
  projectlist() {
    userProjects(this.id).then((values) => {
      this._projectlist.add(...values);
    });
    return this._projectlist;
  }

  static cereal = {
    ignore: ["_tasklist", "_teamlist", "_projectlist"],
  };
}
cereal.register(User);
new Memoize(User);
new MemoizePair(User, Task);
