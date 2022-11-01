/** @typedef {import("./api/model/user.js").User} User */

const _wrapper = document.createElement("div");
/**
 * Converts the HTML into a DOM Node
 * @param {String} html The HTML String
 * @returns {Node} A Node
 */
export function HTMLasDOM(html) {
  _wrapper.innerHTML = html.trim();
  const element = _wrapper.firstChild;
  element.remove();
  return element;
}

document.querySelector("#logout").addEventListener("click", () => {
  logout();
  window.location.href = "/login/";
});

/**
 * Sets the information of the currently signed-in user
 * @param {User} user
 */
export function accountInfo(user) {
  const info = document.querySelector("header .account-info");
  info.querySelector("#user-name").innerHTML = user.name;
  info.querySelector("#user-rank").innerHTML = user.rankTitle();
  info.querySelector("img").src = user.profilePicture();
}
