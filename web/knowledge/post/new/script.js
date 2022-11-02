import { currentUser } from "../../../api/active.js";
import * as api from "../../../api/core.js";
import * as md from "../editor.js";

const converter = md.createConverter();
const updatePreview = converter.transferDOM(
  document.querySelector(`textarea[name="post"]`),
  document.querySelector("#preview")
);

const domForm = document.querySelector("#post-edit");
const domPreview = document.querySelector("#post-preview");

const switches = [md.switcher(domForm, domPreview)];

for (const switcher of switches) switcher.backward();

domForm.querySelectorAll(".preview-switch").forEach((element) =>
  element.addEventListener("click", () => {
    updatePreview();
    for (const switcher of switches) switcher.forward();
  })
);
domPreview.querySelector(".preview-switch").addEventListener("click", () => {
  for (const switcher of switches) switcher.backward();
});

api.top

document
  .querySelector("form.post-edit")
  .addEventListener("submit", async (event) => {
    const form = event.target;

    const topic = await api.topic(form.querySelector('[name="topic"]').value);

    const post = await api.createPost(
      topic,
      currentUser,
      form.querySelector('[name="title"]').value,
      form.querySelector('[name="post"]').value
    );

    form.action = `../?id=${post.id}`;
  });
