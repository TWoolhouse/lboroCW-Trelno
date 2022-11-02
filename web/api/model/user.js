import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Task, TaskSrc } from "./task.js";
import { Collection } from "../interface/collection.js";
import {
  allProjects,
  userProjects,
  userProjectTasks,
  userTeams,
} from "../interface/db.js";

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
      this.tasks = new CollectionDB(this.id, User, Task);
    }
    this._tasklist = new Collection();
    this._projectlist = new Collection();

    this.tasks.onChange(
      this._tasklist.chain(
        (task) => {
          return { task: task, source: TaskSrc.User };
        },
        (task) => this._tasklist.snapshot.find((ref) => ref.task == task)
      )
    );
  }

  /**
   * Obtains the url of this users profile picture.
   * @param {Number} size The size (in pixels) of the image
   * @returns {String} The URL to the profile picture
   */
  profilePicture(size = 50) {
    return `https://ui-avatars.com/api/?name=${encodeURI(
      this.name
    )}&background=random&size=${size}&format=svg`;
  }

  /**
   * @returns {String} Returns the title of the users rank
   */
  rankTitle() {
    switch (this.rank) {
      case UserRank.ProjectManager:
        return "Manager";
      case UserRank.TeamLeader:
        return "Team Leader";
      case UserRank.Employee: // Fallthrough
      default:
        return "Employee";
    }
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
   * Returns a collection of all the projects that this user is a part of.
   * If they are a manager, it returns all of the projects in the system.
   * @returns {Collection<Project>}
   */
  projectlist() {
    if (this.rank >= UserRank.ProjectManager) {
      allProjects().then((values) => {
        this._projectlist.add(...values);
      });
    } else {
      userProjects(this.id).then((values) => {
        this._projectlist.add(...values);
      });
    }
    return this._projectlist;
  }

  static cereal = {
    ignore: ["_tasklist", "_projectlist"],
  };
}
cereal.register(User);
new Memoize(User);
new MemoizePair(User, Task);
