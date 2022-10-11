import { User } from "./user.js";

/**
 * Fakes a DB call and returns temp example objects
 * @param {string} email
 * @param {string} password
 * @returns success and user object if valid credentials, else error
 */
export function login(email, password) {
  if (email == "king@make-it-all.co.uk" && password == "password") {
    return {
      status: "success",
      user: new User(1, "king@make-it-all.co.uk", 1),
    };
  } else if (email == "serf@make-it-all.co.uk" && password == "pswd") {
    return {
      status: "success",
      user: new User(2, "serf@make-it-all.co.uk", 6),
    };
  } else {
    return {
      status: "error",
      message: "Invalid credentials",
    };
  }
}
