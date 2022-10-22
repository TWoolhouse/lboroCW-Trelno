import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { User } from "./user.js";

export class Team {
  /** @property {Number} id TeamID */
  id;
  /** @property {User} leader The Team Leader (should have rank to respect that) */
  leader;
  /** @property {String} name Display name of the Team */
  name;
  /** @property {String} desc Extra information about the team */
  desc;
  /** @property {CollectionDB<User>} users A collection of Users that are within the team */
  users;

  /**
   * @param {Number} id TeamID
   * @param {User} leader The Team Leader (should have rank to respect that)
   * @param {String} name Display name of the Team
   * @param {String} [desc] Extra information about the team
   * @returns {Team}
   */
  constructor(id, leader, name, desc) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.leader = leader;
    this.name = name;
    this.desc = desc;
    this.users = new CollectionDB(this.id, Team, User);
  }
}
cereal.register(Team);
new Memoize(Team);
new MemoizePair(Team, User);
