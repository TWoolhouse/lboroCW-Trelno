import { post } from "./post.js";
import * as md from "./base.js";
import { currentUser } from "../../api/active.js";
import { UserRank } from "../../api/model/user.js";

const converter = md.createConverter();
document.querySelector("#preview").innerHTML = converter.convert(post.markdown);

const editDOM = document.querySelector("#post-edit");
if (
  currentUser.id != post.owner.id &&
  currentUser.rank < UserRank.ProjectManager
)
  editDOM.classList.add("hidden");
else
  editDOM.addEventListener("click", () => {
    window.location.href = `edit/?id=${post.id}`;
  });
document.querySelector("#post-title").innerHTML = post.title;

const topicDOM = document.querySelector("#post-topic");
topicDOM.href = `../search/?topic=${post.topic.id}`;
topicDOM.querySelector("p").innerHTML = post.topic.name;
