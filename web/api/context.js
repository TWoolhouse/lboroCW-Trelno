export const memoized = {};

import { Memoize, MemoizePair } from "./interface/memoize.js";

import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import { Team } from "./model/team.js";

new Memoize(User);
new Memoize(Team);
new Memoize(Task);
new MemoizePair(User, Task);
new MemoizePair(Team, User);

console.log("Memoization", memoized);

export function pairname(name_a, name_b) {
  return `${name_a}-${name_b}`;
}

/**
 * @param {Number} id The UserID
 * @returns {User}
 */
export async function user(id) {
  return memoized.User.get(id);
}
/**
 * @param {Number} id The TeamID
 * @returns {Team}
 */
export async function team(id) {
  return memoized.Team.get(id);
}
/**
 * @param {Number} id The TaskID
 * @returns {Task}
 */
export async function task(id) {
  return memoized.Task.get(id);
}
export async function create_user(user) {
  return memoized.User.set(user);
}

// TODO: Temporary Faux database saved in session storage
if (sessionStorage.getItem("FAUX") == null) {
  sessionStorage.setItem("FAUX", "1");
  memoized.Task.set(new Task(1, false, "Task 1"));
  memoized.Task.set(new Task(2, true, "Task 2"));
  memoized.Task.set(new Task(3, false, "Task 3"));

  memoized.User.set(new User(1, "king@makeitall.co.uk"));
  (await user(1)).tasks.add(await task(2));
  memoized.User.set(new User(2, "serf@makeitall.co.uk"));

  memoized.Team.set(new Team(1, await user(1), "My Cool Team"));
}

// let userid =
//   localStorage.getItem("userid") ??
//   document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("userid="))
//     ?.split("=")[1];
