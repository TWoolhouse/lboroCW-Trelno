import { Memoize } from "./interface/memoize.js";
import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import { Team } from "./model/team.js";
import { Project, ProjectTask } from "./model/project.js";
import { Client } from "./model/client.js";

import { faux } from "../api/faux.js";

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
 * @param {Number} id The ProjectTaskID
 * @returns {Promise<ProjectTask>}
 */
export async function projectTask(id) {
  return Memoize.Type(ProjectTask).get(id);
}

/**
 * @param {Number} id The TeamID
 * @returns {Promise<Team>}
 */
export async function team(id) {
  return Memoize.Type(Team).get(id);
}

/**
 * @param {Number} id The ProjectID
 * @returns {Promise<Project>}
 */
export async function project(id) {
  return Memoize.Type(Project).get(id);
}

/**
 * @param {Number} id The ClientID
 * @returns {Promise<Client>}
 */
export async function client(id) {
  return Memoize.Type(Client).get(id);
}

// TYPE FACTORIES

/**
 * Creates a new task
 * @param {Number} state TaskState
 * @param {String} name The display name of the task
 * @param {Number} deadline The deadline of the project in unix epoch time
 * @param {Number} manhours The estimated man hours to complete the task.
 * @param {String} [description] An optional description of the task
 * @returns {Promise<Task>}
 */
export async function createTask(state, name, deadline, manhours, description) {
  let t = new Task(
    await id_gen(task),
    state,
    name,
    deadline,
    manhours,
    description
  );
  return await Memoize.Type(Task).create(t);
}

/**
 * Creates a new ProjectTask
 * @param {Task} task
 * @returns {Promise<ProjectTask>}
 */
export async function createProjectTask(task) {
  let t = new ProjectTask(await id_gen(projectTask), task);
  return await Memoize.Type(ProjectTask).create(t);
}

/**
 * Creates a new user
 * @param {String} email Email Address
 * @param {Number} rank A UserRank
 * @param {String} name Users full name
 * @returns {Promise<User>}
 */
export async function createUser(email, rank, name) {
  let obj = new User(await id_gen(user), email, rank, name);
  return await Memoize.Type(User).create(obj);
}

/**
 * Creates a new team
 * @param {User} leader Team Leader Uesr
 * @returns {Promise<Team>}
 */
export async function createTeam(leader) {
  let obj = new Team(await id_gen(team), leader);
  return await Memoize.Type(Team).create(obj);
}

/**
 * Creates a new client
 * @param {Number} id TeamID
 * @param {String} name Name of the client company
 * @param {String} representative Name of the client's representative
 * @param {String} address Postal address
 * @param {String} website Website for the company
 * @param {String} [email] Email address
 * @param {String} [phone] Phone number
 * @returns {Promise<Client>}
 */
export async function createClient(
  name,
  representative,
  address,
  website,
  email,
  phone
) {
  let obj = new Client(
    await id_gen(client),
    name,
    representative,
    address,
    website,
    email,
    phone
  );
  return await Memoize.Type(Client).create(obj);
}

/**
 * @param {User} teamLeader The project manager
 * @param {Client} client The client the project is for.
 * @param {Number} created Datetime the project was created
 * @param {Number} deadline Datetime the project should be completed by
 * @param {String} name Display name of the project
 * @param {String} [desc] Project description
 * @returns {Promise<Project>}
 */
export async function createProject(
  teamLeader,
  client,
  created,
  deadline,
  name,
  desc
) {
  let obj = new Project(
    await id_gen(project),
    await createTeam(teamLeader),
    client,
    created,
    deadline,
    name,
    desc
  );
  return await Memoize.Type(Project).create(obj);
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

// import { memoized } from "./interface/memoize.js";
await faux();
// console.log(memoized);
