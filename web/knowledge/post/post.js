import * as api from "../../api/core.js";
const urlParams = new URLSearchParams(window.location.search);
export const post = await api.post(urlParams.get("id"));

console.log("Post", post);
if (post == undefined) window.location.href = "/dashboard/";

const ownerDOM = document.querySelector(".account-post");
ownerDOM.querySelectorAll("a").forEach((link) => {
  link.href = `/profile/?id=${post.owner.id}`;
});
ownerDOM.querySelector(".user-name").innerHTML = post.owner.name;
ownerDOM.querySelector(".user-rank").innerHTML = post.owner.rankTitle();
ownerDOM.querySelector("img").src = post.owner.profilePicture();

document.querySelector("#post-date").innerHTML = new Date(
  post.created
).toLocaleDateString();
