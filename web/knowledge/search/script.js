import * as api from "../../api/core.js";
import { Collection } from "../../api/interface/collection.js";
import { HTMLasDOM } from "/nav.js";
import { createConverter } from "../post/base.js";
import { topics } from "./topic.js";

const md = createConverter(3);

const searchesDOM = document.querySelector(".posts");
const searchFormDOM = document.querySelector("form.search");
const searchResults = new Collection();

const urlParams = new URLSearchParams(window.location.search);
api
  .search(urlParams.get("q"), urlParams.get("topic"))
  .then((posts) => searchResults.replace(...posts));

searchResults.onChange((event) => {
  for (const post of event.add)
    searchesDOM.appendChild(HTMLasDOM(createPostSearchResultHTML(post)));
  for (const post of event.sub)
    searchesDOM.querySelector(`#post-${post.id}.post`).remove();
});

searchFormDOM.querySelector("input").value = urlParams.get("q");
topics().then((select) => {
  select.value = urlParams.get("topic") ?? "";
});

/**
 * Creates a search result from a post
 * @param {Post} post
 * @returns {String}
 */
function createPostSearchResultHTML(post) {
  return /*HTML*/ `<article class="card post">
    <aside>
      <a href="./?topic=${post.topic.id}" class="topic btn-action">
        <p>${post.topic.name}</p>
        <span class="material-symbols-outlined">topic</span>
      </a>
      <div class="account">
        <a href="/profile/?id=${post.owner.id}" class="user-name">
        <img
        src="${post.owner.profilePicture()}"
        alt="User Profile Picture"
        class="profile-pic"
        />
        </a>
        <a href="/profile/?id=${post.owner.id}" class="user-name">${
    post.owner.name
  }</a>
        <span class="user-rank">${post.owner.rankTitle()}</span>
      </div>
      <span>${new Date(post.created).toLocaleDateString()}</span>
    </aside>
    <main>
      <h2>${post.title}</h2>
      <hr />
      <div id="preview" class="preview-post">
        ${md.convert(post.markdown)}
      </div>
      <a href="../post/?id=${post.id}" class="btn-action">
        <p>View Post</p>
        <span class="material-symbols-outlined">visibility</span>
      </a>
    </main>
  </article>`;
}
