import * as api from "../../api/core.js";
import { Collection } from "../../api/interface/collection.js";
import { navbar, HTMLasDOM } from "/nav.js";

navbar();

const searchesDOM = document.querySelector(".posts");

const searchResults = new Collection();
api.search().then((posts) => searchResults.replace(...posts));
searchResults.onChange((event) => {
  for (const post of event.add) {
    const element = HTMLasDOM(createPostSearchResultHTML(post));
    searchesDOM.appendChild(element);
    element.querySelector("main button").addEventListener("click", () => {
      window.location.href = `../post/?id=${post.id}`;
    });
  }
  for (const post of event.sub) {
    searchesDOM.querySelector(`#post-${post.id}.post`).remove();
  }
});

/**
 * Creates a search result from a post
 * @param {Post} post
 * @returns {String}
 */
function createPostSearchResultHTML(post) {
  return /*HTML*/ `<article class="card post">
    <aside>
      <div class="topic">
        <a href="./?topic=${post.topic.id}" class="btn-action">
          <p>${post.topic.name}</p>
          <span class="material-symbols-outlined">Topic</span>
        </a>
      </div>
      <div class="account">
        <img
        src="${post.owner.profilePicture()}"
        alt="User Profile Picture"
        />
        <a href="/profile/?id=${post.owner.id}" class="user-name">${
    post.owner.name
  }</a>
        <span class="user-rank">${post.owner.rankTitle()}</span>
      </div>
      <span>${post.created}</span>
    </aside>
    <main>
      <h3>${post.title}</h3>
      <hr />
      <div id="preview" class="preview-post">
        ${post.markdown}
      </div>
      <a href="../post/?id=${post.id}" class="btn-action">
        <p>View Post</p>
        <span class="material-symbols-outlined">visibility</span>
      </a>
    </main>
  </article>`;
}
