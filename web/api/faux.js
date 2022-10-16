import { Memoize } from "./interface/memoize.js";
import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import { Team } from "./model/team.js";

await (async () => {
  // TODO: Temporary Faux database saved in session storage
  if (sessionStorage.getItem("FAUX") != null) return;
  sessionStorage.setItem("FAUX", "1");
  let t1 = await Memoize.Type("Task").set(new Task(1, false, "Task 1"));
  let t2 = await Memoize.Type("Task").set(new Task(2, true, "Task 2"));
  let t3 = await Memoize.Type("Task").set(new Task(3, false, "Task 3"));

  let u1 = await Memoize.Type("User").set(new User(1, "king@makeitall.co.uk"));
  u1.tasks.add(t2);
  let u2 = await Memoize.Type("User").set(new User(2, "serf@makeitall.co.uk"));

  await Memoize.Type("Team").set(new Team(1, u1, "My Cool Team"));
})();
