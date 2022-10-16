import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { User } from "./user.js";

export class Team {
  constructor(id, leader, name) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.leader = leader;
    this.name = name;
    this.users = new CollectionDB(this.id, Team.name, User.name);
  }
}
cereal.register(Team);
new Memoize(Team);
new MemoizePair(Team, User);
