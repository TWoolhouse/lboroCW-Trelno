import { user } from "./core.js";
import { User } from "./model/user.js";

const KEY = "userid";

/**
 * Gets the currently logged in UserID from localStorage, sessionStorage and cookieStorage
 * @returns {Number | undefined} The currently logged in UserID
 */
function getUser() {
  return (
    localStorage.getItem(KEY) ??
    sessionStorage.getItem(KEY) ??
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${KEY}=`))
      ?.split("=")[1]
  );
}

/**
 * Sets the currently logged in UserID from localStorage, sessionStorage and cookieStorage
 * @param {Number} userId The currently logged in UserID
 */
function setUser(userId) {
  for (const storage of [localStorage, sessionStorage])
    storage.setItem(KEY, userId);
  document.cookie = `${KEY}=${userId}; Max-Age=${60 * 60 * 24 * 7}; path=/`;
}

const userId = getUser();

if (userId != undefined) setUser(userId);

export const currentUser = await user(userId);
console.log("Current", currentUser);

/**
 * Redirects to the log-in page if there is no currently signed-in user.
 */
export function redirectLogin() {
  if (currentUser != undefined) return;
  window.location.href = "/login/";
}

/**
 * Sets the currently logged-in user
 * @param {Number} user The UserID
 * @returns {Number}
 */
export function setActiveUser(user) {
  setUser(user);
  return user;
}

/**
 * Logout the current user.
 */
export function logout() {
  for (const storage of [localStorage, sessionStorage]) storage.removeItem(KEY);
  document.cookie = `${KEY}=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
}
