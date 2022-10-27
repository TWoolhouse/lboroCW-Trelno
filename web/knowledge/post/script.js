import * as md from "./base.js";

const converter = md.createConverter();

document.querySelector("#preview").innerHTML = converter.convert("# Title");

document.querySelector("#post-edit").addEventListener("click", () => {
  window.location.href = "edit/?id=1";
});
