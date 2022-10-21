import * as cereal from "../interface/cereal.js";
import { Memoize, MemoizePair } from "../interface/memoize.js";
import { User } from "./user.js";
import { Team } from "./team.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Collection } from "../interface/collection.js";

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
    if (!cereal.cereal(this, id)) {
      this.id = id;
      this.users = new CollectionDB(this.id, Assignees, User);
      this.teams = new CollectionDB(this.id, Assignees, Team);
    }
    this._event_handlers = {};
    this._all = new Collection();
    this.users.onChange(this._all.chain());
    this.teams.onChange((event) => {
      for (const team of event.sub)
        team.users.onChangeRemove(this._event_handlers[team.id]);
      for (const team of event.add) {
        const cb = this._all.chain();
        this._event_handlers[team.id] = cb;
        team.users.onChange(cb);
      }
    });
  }

  /**
   * Amalgamation of all users from all locations.
   * @returns {Collection<User>} All users.
   */
  all() {
    return this._all;
  }

  static cereal = {
    ignore: ["_all", "_event_handlers"],
  };
}
cereal.register(Assignees);
new Memoize(Assignees);
new MemoizePair(Assignees, User);
new MemoizePair(Assignees, Team);
