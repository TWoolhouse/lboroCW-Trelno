import { Memoize } from "./interface/memoize.js";
import { User, UserRank } from "./model/user.js";
import { Task, TaskState } from "./model/task.js";
import { Team } from "./model/team.js";
import { Project, ProjectTask } from "./model/project.js";
import { Assignees } from "./model/assignees.js";

await (async () => {
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

  let task_count = 1;
  let user_count = 2;
  const users = [
    await Memoize.Type(User).create(
      new User(1, "king@makeitall.co.uk", UserRank.ProjectManager, "King Firat")
    ),
  ];

  await Promise.all(
    range(random(11, 5)).map(async (id) => {
      id = task_count++;
      const t = await Memoize.Type(Task).create(
        new Task(id, random(3, 0), `Task ${id}`, `Task Desc ${id} User`)
      );
      users[0].tasks.add(t);
      return t;
    })
  );

  let assignees_count = 1;
  const assignees = await Promise.all(
    range(2).map((id) => {
      id = assignees_count++;
      return Memoize.Type(Assignees).create(new Assignees(id));
    })
  );

  const team_leaders = [];
  const teams = await Promise.all(
    range(1).map(async (id) => {
      const us = await Promise.all(
        range(random(2, 1))
          .map((id) => {
            id = user_count++;
            return new User(
              id,
              `u${id}@makeitall.co.uk`,
              random(3, 0),
              `UserName ${id}`
            );
          })
          .map(async (user) => {
            const u = await Memoize.Type(User).create(user);
            const tasks = await Promise.all(
              range(random(7, 2)).map((id) => {
                id = task_count++;
                return Memoize.Type(Task).create(
                  new Task(
                    id,
                    random(3, 0),
                    `Task ${id}`,
                    `Description: User Task}`
                  )
                );
              })
            );
            u.tasks.add(...tasks);
            return u;
          })
      );
      users.push(...us);
      const t = await Memoize.Type(Team).create(
        new Team(
          id,
          users[random(users.length, 1)],
          `Team ${id}`,
          `Team Description ${id}`
        )
      );
      team_leaders.push(t.leader);
      t.users.add(
        ...us.filter((user) => (user.id != 1) & !team_leaders.includes(user))
      );
      assignees[random(assignees.length)].teams.add(t);
      return t;
    })
  );

  let project_task_count = 1;
  const projects = await Promise.all(
    range(2)
      .map(async (id) => {
        let project = new Project(
          id,
          users[0],
          new Date(2022, 9, random(31, 1)),
          new Date(2022, 11, random(31, 1)),
          `Project ${id}`,
          assignees[id - 1]
        );
        project.tasks.add(
          ...(await Promise.all(
            range(random(4, 2)).map((id) => {
              const pid = project_task_count++;
              const tid = task_count++;
              let t = new Task(
                tid,
                random(3, 0),
                `Task ${tid}`,
                `Task Desc ${tid} Project`
              );
              let assign = new Assignees(assignees_count++);
              for (const user of project.assignees.all())
                if (Math.random() > 0.5) assign.users.add(user);

              return Memoize.Type(Task)
                .create(t)
                .then((t) => {
                  return Memoize.Type(Assignees)
                    .create(assign)
                    .then((assign) => {
                      return Memoize.Type(ProjectTask).create(
                        new ProjectTask(pid, t, assign)
                      );
                    });
                });
            })
          ))
        );
        return project;
      })
      .map(async (project) => await Memoize.Type(Project).create(await project))
  );
})();
