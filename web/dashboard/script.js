import * as api from "../api/core.js";
import { navbar } from "../nav.js";
import { kanban } from "../kanban.js";

navbar();

kanban(
  document.querySelector("#kanban"),
  document.querySelector("#dialog-new-task"),
  null
);
