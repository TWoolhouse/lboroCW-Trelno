import * as md from "../editor.js";

const converter = md.createConverter();
const updatePreview = converter.transferDOM(
  document.querySelector(`textarea[name="post"]`),
  document.querySelector("#preview")
);

const domForm = document.querySelector("#post-edit");
const domPreview = document.querySelector("#post-preview");

const switches = [md.switcher(domForm, domPreview)];

domForm.querySelectorAll(".preview-switch").forEach((element) =>
  element.addEventListener("click", () => {
    updatePreview();
    for (const switcher of switches) switcher.forward();
  })
);
domPreview.querySelector(".preview-switch").addEventListener("click", () => {
  for (const switcher of switches) switcher.backward();
});

for (const switcher of switches) switcher.backward();
