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
  let t1 = await Memoize.Type(Task).set(new Task(1, TaskState.Ready, "Task 1"));
  let t2 = await Memoize.Type(Task).set(
    new Task(2, TaskState.Active, "Task 2")
  );
  let t3 = await Memoize.Type(Task).set(new Task(3, TaskState.Done, "Task 3"));

  let u1 = await Memoize.Type(User).set(
    new User(1, "king@makeitall.co.uk", UserRank.ProjectManager, "King Firat")
  );
  u1.tasks.add(t2);
  let u2 = await Memoize.Type(User).set(
    new User(2, "serf@makeitall.co.uk", UserRank.Employee, "Serf Boi")
  );

  await Memoize.Type(Team).set(new Team(1, u1, "My Cool Team"));

  let a1 = await Memoize.Type(Assignees).set(new Assignees(1));

  await Memoize.Type(Project).set(
    new Project(1, u1, new Date(2022, 9, 3), Date.now(), "Best Project", a1)
  );
})();
