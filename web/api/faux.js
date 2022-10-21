import { Memoize } from "./interface/memoize.js";
import { User, UserRank } from "./model/user.js";
import { Task, TaskState } from "./model/task.js";
import { Team } from "./model/team.js";
import { Project } from "./model/project.js";
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
    range(random(11, 5))
      .map((id) => {
        id = task_count++;
        const t = new Task(
          id,
          random(3, 0),
          `Task ${id}`,
          `Task Desc ${id} User`
        );
        users[0].tasks.add(t);
        return t;
      })
      .map((task) => Memoize.Type(Task).create(task))
  );

  const assignees = await Promise.all(
    range(6)
      .map((id) => {
        return new Assignees(id);
      })
      .map((assignees) => Memoize.Type(Assignees).create(assignees))
  );

  const team_leaders = [];
  const teams = await Promise.all(
    range(3)
      .map(async (id) => {
        const us = await Promise.all(
          range(random(25, 15))
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
                range(random(7, 2))
                  .map((id) => {
                    id = task_count++;
                    return new Task(
                      id,
                      random(3, 0),
                      `Task ${id}`,
                      `Description: User Task}`
                    );
                  })
                  .map((task) => Memoize.Type(Task).create(task))
              );
              u.tasks.add(...tasks);
              return u;
            })
        );
        users.push(...us);
        const t = new Team(
          id,
          users[random(users.length, 1)],
          `Team ${id}`,
          `Team Description ${id}`
        );
        team_leaders.push(t.leader);
        t.users.add(
          ...us.filter((user) => (user.id != 1) & !team_leaders.includes(user))
        );
        assignees[random(assignees.length)].teams.add(t);
        return t;
      })
      .map(async (team) => await Memoize.Type(Team).create(await team))
  );

  const projects = await Promise.all(
    range(2)
      .map((id) => {
        return new Project(
          id,
          users[0],
          new Date(2022, 9, random(31, 1)),
          new Date(2022, 11, random(31, 1)),
          `Project ${id}`,
          assignees[id - 1]
        );
      })
      .map((project) => Memoize.Type(Project).create(project))
  );

  // await Memoize.Type(Team).create(new Team(1, u1, "My Cool Team"));

  // let a1 = await Memoize.Type(Assignees).create(new Assignees(1));

  // await Memoize.Type(Project).create(
  //   new Project(1, u1, new Date(2022, 9, 3), Date.now(), "Best Project", a1)
  // );
})();
