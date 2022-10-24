import { user } from "./core.js";

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

export const currentUser = await user(1);
console.log("Current", currentUser);

/**
 * Redirects to the log-in page if there is no currently signed-in user.
 */
export function redirectLogin() {
  return;
  // FIXME: Currently just sets a user as the logged in user and reloads the page
  if (currentUser != undefined) return;
  setUser(1);
  window.location.reload();
}
