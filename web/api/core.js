import { Memoize } from "./interface/memoize.js";
import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import { Team } from "./model/team.js";
import { Project, ProjectTask } from "./model/project.js";
import { Client } from "./model/client.js";
import { Topic, Post, search, topics } from "./model/post.js";
import { users } from "./interface/db.js";
export { users, search, topics };

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

/**
 * @param {Number} id The TopicID
 * @returns {Promise<Topic>}
 */
export async function topic(id) {
  return Memoize.Type(Topic).get(id);
}
/**
 * @param {Number} id The TopicID
 * @returns {Promise<Post>}
 */
export async function post(id) {
  return Memoize.Type(Post).get(id);
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
  return await createMemoize(Task, task, ...arguments);
}

/**
 * Creates a new ProjectTask
 * @param {Task} task
 * @returns {Promise<ProjectTask>}
 */
export async function createProjectTask(task) {
  return await createMemoize(ProjectTask, projectTask, ...arguments);
}

/**
 * Creates a new user
 * @param {String} email Email Address
 * @param {Number} rank A UserRank
 * @param {String} name Users full name
 * @param {Number} [id] The ID to give this user
 * @returns {Promise<User>}
 */
export async function createUser(email, rank, name, id) {
  let obj = new User(await createID(id, user), ...arguments);
  return await Memoize.Type(User).create(obj);
}

/**
 * Creates a new team
 * @param {User} leader Team Leader User
 * @returns {Promise<Team>}
 */
export async function createTeam(leader) {
  return await createMemoize(Team, team, ...arguments);
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
  return await createMemoize(Client, client, ...arguments);
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
  return await createMemoize(
    Project,
    project,
    await createTeam(teamLeader),
    client,
    created,
    deadline,
    name,
    desc
  );
}

/**
 * Creates a new topic
 * @param {String} name The name of the topic
 * @returns {Promise<Topic>}
 */
export async function createTopic(name) {
  return await createMemoize(Topic, topic, ...arguments);
}

/**
 * Creates a new post
 * @param {Topic} topic The Topic this post is part of
 * @param {User} owner The User that created this post
 * @param {String} title The title of the post
 * @param {String} markdown The markdown contents of the post
 * @returns {Promise<Post>}
 */
export async function createPost(topic, owner, title, markdown) {
  const p = await createMemoize(Post, post, ...arguments, Date.now());
  topic._posts.add(p);
  return p;
}

// HELPER FAUX GENERATOR
// //TODO: Move this to faux / memoize

async function createMemoize(type, getter, ...args) {
  const obj = new type(await id_gen(getter), ...args);
  return await Memoize.Type(type).create(obj);
}

async function createID(id, getter) {
  if (id === undefined) {
    return await id_gen(getter);
  }
  return id;
}

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
