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

  const userKing = await api.createUser(
    "king@make-it-all.co.uk",
    UserRank.ProjectManager,
    "Neumann",
    1
  );
  const userQueen = await api.createUser(
    "queen@make-it-all.co.uk",
    UserRank.ProjectManager,
    "Queen",
    2
  );

  const leaders = [
    await api.createUser(
      "dilip@make-it-all.co.uk",
      UserRank.TeamLeader,
      "Dilip",
      3
    ),
    await api.createUser(
      "Emma@make-it-all.co.uk",
      UserRank.TeamLeader,
      "Emma",
      4
    ),
  ];

  const employees = [
    await api.createUser(
      "alice@make-it-all.co.uk",
      UserRank.Employee,
      "Alice",
      5
    ),
    await api.createUser(
      "bert@make-it-all.co.uk",
      UserRank.Employee,
      "Bert",
      6
    ),
    await api.createUser(
      "clara@make-it-all.co.uk",
      UserRank.Employee,
      "Clara",
      7
    ),
  ];

  /** @const {Array<User>} users */
  const users = [userKing, userQueen, ...leaders];

  for (const it of range(random(8, 5))) {
    userKing.tasks.add(
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
      "Loughborough University",
      "Firat Batmaz",
      "Haslegrave Building, University Rd, Loughborough LE11 3TP",
      "lboro.ac.uk",
      "F.Batmaz@lboro.ac.uk",
      "+44 (0) 1509 222 699"
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
    await api.createUser("coah@make-it-all.co.uk", UserRank.Employee, "Adam"),
    await api.createUser("coa?@make-it-all.co.uk", UserRank.Employee, "Arshad"),
    await api.createUser("cocc@make-it-all.co.uk", UserRank.Employee, "Calin"),
    await api.createUser("coj?@make-it-all.co.uk", UserRank.Employee, "Jack"),
    await api.createUser("cor?@make-it-all.co.uk", UserRank.Employee, "Rowan"),
    await api.createUser("cotrw@make-it-all.co.uk", UserRank.Employee, "Tom")
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
