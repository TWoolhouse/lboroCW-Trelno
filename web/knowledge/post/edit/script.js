import * as md from "../editor.js";
import { post } from "../post.js";

const converter = md.createConverter();
const updatePreview = converter.transferDOM(
  document.querySelector(`textarea[name="post"]`),
  document.querySelector("#preview")
);

const domForm = document.querySelector("#post form");
const domPreview = document.querySelector("#preview");

const switches = [
  md.switcher(domForm, domPreview),
  md.switcher(
    document.querySelector(".preview-switch-into"),
    document.querySelector(".preview-switch-from")
  ),
  md.switcher(
    document.querySelector(".title-card"),
    document.querySelector(".title-card.hidden")
  ),
];
for (const switcher of switches) switcher.backward();

document.querySelector(".preview-switch-into").addEventListener("click", () => {
  updatePreview();
  for (const switcher of switches) switcher.forward();
});

document.querySelector(".preview-switch-from").addEventListener("click", () => {
  for (const switcher of switches) switcher.backward();
});

document.querySelector("button.save").addEventListener("click", () => {
  window.location.href = "/knowledge/post/";
});

document.querySelector(".btn-action.save").addEventListener("click", () => {
  window.location.href = `../?id=${post.id}`;
});
