import * as db from "./login";

export class User {
  /** @property {Number} id Unique User ID */
  id;
  /** @property {String} email Email Address */
  email;
  /** @property {Number} rank User rank in the company */
  rank;

  /**
   * @param {Number} id Unique User ID
   * @param {String} email Email Address
   * @param {Number} rank User rank in the company
   */
  constructor(id, email, rank) {
    this.id = id;
    this.email = email;
    this.rank = rank;
  }

  /**
   * Obtains the user if the email & password are in the database
   * @param {String} email User email
   * @param {String} password User password
   * @returns {User} Returns the User or null
   */
  static login(email, password) {
    let res = db.login(email, password);
    if (res.status == "success") return res.user;
    return null;
  }
}
