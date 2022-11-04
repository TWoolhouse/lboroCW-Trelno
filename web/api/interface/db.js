import { Memoize } from "./memoize.js";
import { TaskSrc } from "../model/task.js";

/** @typedef {import("../model/user.js").User} User */
/** @typedef {import("../model/task.js").TaskRef} TaskRef */
/** @typedef {import("../model/task.js").Team} Team */
/** @typedef {import("../model/project.js").Project} Project */
/** @typedef {import("../model/client.js").Client} Client */
/** @typedef {import("../model/post.js").Post} Post */
/** @typedef {import("../model/post.js").Topic} Topic */

const dbStorage = sessionStorage;

function table(...names) {
  return `db-${names.join("-")}#`;
}

export function all(...names) {
  const name = table(...names);
  return Object.entries(dbStorage)
    .filter(([key, _]) => key.startsWith(name))
    .map(([key, _]) => key.substring(name.length));
}

async function allAsIs(name, ...names) {
  return await Promise.all(
    all(name, ...names).map((id) => Memoize.Name(name).get(id))
  );
}

async function allAs(mapping, name, ...names) {
  return await Promise.all(
    all(name, ...names).map(async (id) => {
      return mapping(await Memoize.Name(name).get(id));
    })
  );
}

/**
 * Returns all Projects in the system
 * @returns {Promise<Array<Project>>}
 */
export async function allProjects() {
  return await allAsIs("Project");
}

/**
 * Returns all of the Teams that a user is in.
 * @param {Number} userId
 * @returns {Promise<Array<Team>>}
 */
export async function userTeams(userId) {
  return (
    await allAs((team) => {
      return {
        team: team,
        leader: false,
      };
    }, "Team")
  ).filter((ref) => {
    if (ref.team.leader.id == userId) {
      ref.leader = true;
      return true;
    }
    return ref.team.users.snapshot.find((user) => user.id == userId);
  });
}

/**
 * Returns a list of TaskRefs of ProjectTasks that a user is a part of.
 * @param {Number} userId
 * @returns {Promise<Array<TaskRef>>}
 */
export async function userProjectTasks(userId) {
  return (
    await allAs((project) => {
      return project.tasks.snapshot.map((pt) => {
        return {
          task: pt.task,
          source: TaskSrc.Project,
          projectTask: pt,
          project: project,
        };
      });
    }, "Project")
  )
    .flat()
    .filter((ref) => {
      return (
        ref.project.team.leader.id == userId ||
        ref.projectTask.assignees.snapshot.find((user) => user.id == userId)
      );
    });
}

/**
 * Returns all projects that a user is a part of.
 * @param {Number} userId
 * @returns {Promise<Array<Project>>}
 */
export async function userProjects(userId) {
  const teams = (await userTeams(userId)).map((ref) => ref.team);
  return (await allAsIs("Project")).filter((project) =>
    teams.includes(project.team)
  );
}

/**
 * Gets every Post that is part of a specific Topic
 * @param {Number} topicId
 * @returns {Promise<Array<Post>>}
 */
export async function topicPosts(topicId) {
  return (await posts()).filter((post) => post.topic.id == topicId);
}

/**
 * Returns every Post in the system.
 * @returns {Promise<Array<Post>>}
 */
export async function posts() {
  return await allAsIs("Post");
}

/**
 * Returns every Topic in the system.
 * @returns {Promise<Array<Topic>>}
 */
export async function topics() {
  return await allAsIs("Topic");
}

/**
 * Returns every User in the system.
 * @returns {Promise<Array<User>>}
 */
export async function users() {
  return await allAsIs("User");
}

/**
 * Returns every Client in the system.
 * @returns {Promise<Array<Client>>}
 */
export async function clients() {
  return await allAsIs("Client");
}
