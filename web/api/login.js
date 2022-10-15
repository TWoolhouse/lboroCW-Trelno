import { User } from "../api/user.js";

/**
 * Fakes a DB call and returns temp example objects
 * @param {string} email
 * @param {string} password
 * @returns success and userid number if valid credentials, else error
 */
export async function login(email, password) {
  let response = (() => {
    if (email == "king@make-it-all.co.uk" && password == "password") {
      return 1;
    } else if (email == "serf@make-it-all.co.uk" && password == "pswd") {
      return 1;
    }
    return null;
  })();
  if (response) {
    localStorage.setItem("userid", response);
    return {
      status: "success",
      user: response,
    };
  } else {
    return {
      status: "error",
      message: "Invalid credentials",
    };
  }
}
