export class User {
  /** @property {Number} id Unique User ID */
  id;
  /** @property {String} email Email Address */
  email;
  /** @property {Number} rank User rank in the company */
  rank;
  /** @property {String} name The users full name */
  name;

  /**
   * @param {Number} id Unique User ID
   * @param {String} email Email Address
   * @param {Number} rank User rank in the company
   * @param {String} name The users full name
   */
  constructor(id, email, rank, name) {
    this.id = id;
    this.email = email;
    this.rank = rank;
    this.name = name;
  }
}
