import { currentUser, setActiveUser } from "../api/active.js";

if (currentUser) window.location.href = "/dashboard/";

const users = [
  {
    email: "king@make-it-all.co.uk",
    password: "pleasegiveusgoodmarks",
    id: 1,
  },
  {
    email: "queen@make-it-all.co.uk",
    password: "QueenPassword",
    id: 2,
  },
  {
    email: "dilip@make-it-all.co.uk",
    password: "DilipPassword",
    id: 3,
  },
  {
    email: "emma@make-it-all.co.uk",
    password: "EmmaPassword",
    id: 4,
  },
  {
    email: "alice@make-it-all.co.uk",
    password: "AlicePassword",
    id: 5,
  },
  {
    email: "bert@make-it-all.co.uk",
    password: "BertPassword",
    id: 6,
  },
  {
    email: "clara@make-it-all.co.uk",
    password: "ClaraPassword",
    id: 7,
  },
];

/**
 * Tries to login the user.
 * @param {string} email
 * @param {string} password
 * @returns success and the UserID if valid credentials, else error
 */
export async function login(email, password) {
  if (!email.endsWith("@make-it-all.co.uk"))
    return {
      status: "error",
      message: "Invalid Email",
    };

  const match = users.filter(
    (user) => user.email == email && user.password == password
  )[0];

  if (match) {
    setActiveUser(match.id);
    return {
      status: "success",
      user: match.id,
    };
  } else {
    return {
      status: "error",
      message: "Invalid credentials",
    };
  }
}
