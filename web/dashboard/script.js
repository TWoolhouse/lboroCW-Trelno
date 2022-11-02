import * as api from "../api/core.js";
import { redirectLogin } from "../api/active.js";
import { navbar } from "../nav.js";
import { kanban } from "../kanban.js";

redirectLogin();
navbar();

kanban(
  document.querySelector("#kanban"),
  document.querySelector("#dialog-new-task"),
  null
);
