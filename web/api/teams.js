import { Collection } from "./collection";

/** @typedef {import('./user.js').User} User */

export class Team {
  /** @property {User} leader The team leader*/
  leader;
  /** @property {Collection<User>} users */
  users;

  /**
   *
   * @param {User} leader The team leader
   * @param {...User} users The users part of the team
   */
  constructor(leader, ...users) {
    this.leader = leader;
    this.users = new Collection(...users);
  }
}
