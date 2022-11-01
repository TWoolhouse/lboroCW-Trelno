import { Memoize } from "./memoize.js";
import { TaskSrc } from "../model/task.js";

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

async function allAs(mapping, name, ...names) {
  return await Promise.all(
    all(name, ...names).map(async (id) => {
      return mapping(await Memoize.Name(name).get(id));
    })
  );
}

export async function allProjects() {
  return await allAs((project) => project, "Project");
}

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

export async function userProjectTasks(userId) {
  return (
    await allAs((projectTask) => {
      return {
        task: projectTask.task,
        source: TaskSrc.Project,
        projectTask: projectTask,
        // project:
      };
    }, "ProjectTask")
  ).filter((ref) => {
    return ref.projectTask.assignees.snapshot.find((user) => user.id == userId);
  });
}

export async function userProjects(userId) {
  const teams = (await userTeams(userId)).map((ref) => ref.team);
  return (await allAs((p) => p, "Project")).filter((project) =>
    teams.includes(project.team)
  );
}
