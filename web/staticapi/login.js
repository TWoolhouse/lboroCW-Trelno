/**
 * Fakes a DB call and returns temp example objects
 * @param {string} email
 * @param {string} password
 * @returns success and user object if valid credentials, else error
 */
export function login(email, password) {
  // TODO I will clean this up, once the user class is sorted
  if (email == "king@make-it-all.co.uk" && password == "password") {
    return {
      status: "success",
      user: {
        id: 1,
        name: "King",
        email: "king@make-it-all.co.uk",
        type: "manager",
      },
    };
  } else if (email == "serf@make-it-all.co.uk" && password == "pswd") {
    return {
      status: "success",
      user: {
        id: 2,
        name: "Serf",
        email: "serf@make-it-all.co.uk",
        type: "employee",
      },
    };
  } else {
    return {
      status: "error",
      message: "Invalid credentials",
    };
  }
}
