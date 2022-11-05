import { currentUser, logout, redirectLogin } from "./api/active.js";
import { UserRank } from "./api/model/user.js";

const _wrapper = document.createElement("div");
/**
 * Converts the HTML into a DOM Node
 * @param {String} html The HTML String
 * @returns {Element} An Element
 */
export function HTMLasDOM(html) {
  _wrapper.innerHTML = html.trim();
  const element = _wrapper.firstChild;
  element.remove();
  return element;
}

function loggingOut() {
  document.querySelectorAll(".logout").forEach((element) => {
    element.addEventListener("click", () => {
      logout();
      window.location.href = "/login/";
    });
  });
}

function mobileNavigation() {
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  mobileNavToggle.addEventListener("click", () => {
    const navMenu = document.querySelector(".side-menu");
    navMenu.toggleAttribute("data-open");
    mobileNavToggle.toggleAttribute("data-open");

    if (navMenu.getAttribute("data-open") !== null) {
      mobileNavToggle.innerHTML = "close";
    } else {
      mobileNavToggle.innerHTML = "menu";
    }
  });
}

function accountInfo() {
  const info = document.querySelector("header .account-info");
  info.querySelector("#user-name").innerHTML = currentUser.name;
  info.querySelector("#user-rank").innerHTML = currentUser.rankTitle();
  info.querySelector("img").src = currentUser.profilePicture();
}

function managerView() {
  if (!(currentUser.rank > UserRank.Employee))
    for (const selector of ['.side-menu [href="/manager/"]'])
      document.querySelector(selector).parentElement.classList.add("hidden");
}

export function navbar() {
  redirectLogin();
  mobileNavigation();
  loggingOut();
  managerView();
  accountInfo();
}
