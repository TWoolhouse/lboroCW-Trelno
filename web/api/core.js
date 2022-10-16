import { Memoize } from "./interface/memoize.js";
import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import { Team } from "./model/team.js";

import {} from "../api/faux.js";

// TYPE GETTERS

/**
 * @param {Number} id The UserID
 * @returns {User}
 */
export async function user(id) {
  return Memoize.Type(User.name).get(id);
}

/**
 * @param {Number} id The TaskID
 * @returns {Task}
 */
export async function task(id) {
  return Memoize.Type(Task.name).get(id);
}

/**
 * @param {Number} id The TeamID
 * @returns {Team}
 */
export async function team(id) {
  return Memoize.Type(Team.name).get(id);
}

// TYPE FACTORIES

/**
 * Creates a new task
 * @param {Boolean} done
 * @param {String} name
 * @returns {Task}
 */
export async function task_create(done, name) {
  let id = 0;
  do {
    id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  } while ((await task(id)) != undefined);
  let t = new Task(id, done, name);
  return await Memoize.Type(Task.name).set(t);
}

import { memoized } from "./interface/memoize.js";
console.log(memoized);
