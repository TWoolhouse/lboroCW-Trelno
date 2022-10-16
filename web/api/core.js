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
  let t = new Task(id_gen(task), done, name);
  return await Memoize.Type(Task.name).set(t);
}

/**
 * Creates a new user
 * @param {String} email
 * @param {UserType} rank
 * @param {String} name
 * @returns {User}
 */
export async function create_user(email, rank, name) {
  let obj = new User(id_gen(user), email);
  return await Memoize.Type(User).set(obj);
}

// HELPER FAUX GENERATOR
// //TODO: Move this to faux / memoize

async function id_gen(func) {
  let id = 0;
  do {
    id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  } while ((await func(id)) != undefined);
  return id;
}

// Set the USERID Cookie and local storage // Get it when loaded
// let userid =
//   localStorage.getItem("userid") ??
//   document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("userid="))
//     ?.split("=")[1];

import { memoized } from "./interface/memoize.js";
console.log(memoized);
