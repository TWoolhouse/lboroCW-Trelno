import { Memoize } from "./interface/memoize.js";
import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import { Team } from "./model/team.js";

import {} from "../api/faux.js";

/** @typedef {import("./model/user.js").UserRank} UserRank */

// TYPE GETTERS

/**
 * @param {Number} id The UserID
 * @returns {Promise<User>}
 */
export async function user(id) {
  return Memoize.Type(User).get(id);
}

/**
 * @param {Number} id The TaskID
 * @returns {Promise<Task>}
 */
export async function task(id) {
  return Memoize.Type(Task).get(id);
}

/**
 * @param {Number} id The TeamID
 * @returns {Promise<Team>}
 */
export async function team(id) {
  return Memoize.Type(Team).get(id);
}

// TYPE FACTORIES

/**
 * Creates a new task
 * @param {Number} state TaskState
 * @param {String} name The display name of the task
 * @param {String} [description] An optional description of the task
 * @returns {Promise<Task>}
 */
export async function createTask(done, name, description) {
  let t = new Task(id_gen(task), done, name, description);
  return await Memoize.Type(Task).set(t);
}

/**
 * Creates a new user
 * @param {String} email Email Address
 * @param {Number} rank A UserRank
 * @param {String} name Users full name
 * @returns {Promise<User>}
 */
export async function createUser(email, rank, name) {
  let obj = new User(id_gen(user), email);
  return await Memoize.Type(User).set(obj);
}

/**
 * Creates a new team
 * @param {User} leader Team Leader Uesr
 * @param {String} name Users full name
 * @returns {Promise<Team>}
 */
export async function createTeam(leader, name) {
  let obj = new Team(id_gen(team), leader, name);
  return await Memoize.Type(Team).set(obj);
}

// HELPER FAUX GENERATOR
// //TODO: Move this to faux / memoize

/**
 * Creates a new ID for the type
 * @param {*} func Type Getter
 * @returns {Number} Random Unique ID
 */
async function id_gen(func) {
  let id = 0;
  do {
    id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  } while ((await func(id)) != undefined);
  return id;
}

import { memoized } from "./interface/memoize.js";
console.log(memoized);
