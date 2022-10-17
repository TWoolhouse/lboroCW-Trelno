import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { User } from "./user.js";
import { Team } from "./team.js";
import { CollectionDB } from "../interface/collectionDB.js";

export class Assignees {
  /** @property {Number} id AssigneesID */
  id;
  /** @property {CollectionDB<User>} users */
  users;
  /** @property {CollectionDB<Team>} teams */
  teams;

  /**
   * @param {Number} id AssigneesID
   * @returns {Assignees}
   */
  constructor(id) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.users = new CollectionDB(this.id, Assignees.name, User.name);
    this.teams = new CollectionDB(this.id, Assignees.name, Team.name);
  }

  /**
   * Amalgamation of all users from all locations.
   * @returns {Array<User>}
   */
  all() {
    return [...this.users, ...this.teams];
  }
}
cereal.register(Assignees);
new Memoize(Assignees);
new MemoizePair(Assignees, User);
new MemoizePair(Assignees, Team);
