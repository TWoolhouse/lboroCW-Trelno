import * as api from "./core.js";
import { Memoize } from "./interface/memoize.js";
import { TaskState } from "./model/task.js";
import { User, UserRank } from "./model/user.js";

export async function faux() {
  // TODO: Temporary Faux database saved in session storage
  if (sessionStorage.getItem("FAUX") != null) return;
  sessionStorage.setItem("FAUX", "1");

  const random = (max, min = 0) => {
    return Math.min(max - 1, Math.floor(Math.random() * (max - min) + min));
  };

  const range = (count) => {
    const arr = [];
    for (let index = 0; index < count; index++) {
      arr.push(index + 1);
    }
    return arr;
  };

  // Needed cause I need to ensure that user ID 1 always exists as it's the fallback.
  const firat = await Memoize.Type(User).create(
    new User(1, "king@makeitall.co.uk", UserRank.ProjectManager, "King Firat")
  );
  const leaders = [
    await api.createUser("gary@makeitall.co.uk", UserRank.TeamLeader, "Gary"),
    await api.createUser(
      "mohammed@makeitall.co.uk",
      UserRank.TeamLeader,
      "Mohammed"
    ),
  ];

  /** @const {Array<User>} users */
  const users = [firat, ...leaders];

  for (const it of range(random(8, 5))) {
    firat.tasks.add(
      await api.createTask(
        random(TaskState.Done + 1, TaskState.Ready),
        `Task #${it}`,
        Date.parse(`2022-${random(13, 11)}-${random(31, 1)}`),
        random(10, 1),
        "User Task Description"
      )
    );
  }

  const clients = [
    await api.createClient(
      "Lboro",
      "VC Nick",
      "LE113UQ",
      "lboro.ac.uk",
      "cotrw@lunet.lboro.ac.uk",
      "020 7935 0341"
    ),
  ];

  const projects = [
    await api.createProject(
      leaders[0],
      clients[0],
      Date.now(),
      Date.parse(`2022-${random(13, 11)}-${random(31, 1)}`),
      "Really Cool Idea",
      "This is a really cool idea for a project ngl."
    ),
  ];

  projects[0].team.users.add(
    await api.createUser("coah@makeitall.co.uk", UserRank.Employee, "Adam"),
    await api.createUser("coa?@makeitall.co.uk", UserRank.Employee, "Arshad"),
    await api.createUser("cocc@makeitall.co.uk", UserRank.Employee, "Calin"),
    await api.createUser("coj?@makeitall.co.uk", UserRank.Employee, "Jack"),
    await api.createUser("cor?@makeitall.co.uk", UserRank.Employee, "Rowan"),
    await api.createUser("cotrw@makeitall.co.uk", UserRank.Employee, "Tom")
  );

  for (const it of range(random(8, 2))) {
    projects[0].tasks.add(
      await api.createProjectTask(
        await api.createTask(
          random(TaskState.Done + 1, TaskState.Ready),
          "Task Project",
          Date.parse(`2022-${random(13, 11)}-${random(31, 1)}`),
          random(7, 1),
          "Project Task Description"
        )
      )
    );
  }
}
