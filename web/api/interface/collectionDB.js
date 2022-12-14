import * as cereal from "./cereal.js";
import { Collection } from "./collection.js";
import { Memoize, pairname } from "./memoize.js";

export class CollectionDB extends Collection {
  /**
   *
   * @param {Number} pid
   * @param {Object} ptype
   * @param {String} ptype.name
   * @param {Object} type
   * @param {String} type.name
   * @param  {...any} items
   */
  constructor(pid, ptype, type, ...items) {
    super(...items);
    this.typeinfo = {
      type: type.name,
      pid: pid,
      parent: ptype.name,
    };
    this.onChange((event) => {
      for (const item of event.add) {
        Memoize.Name(pairname(this.typeinfo.parent, this.typeinfo.type)).add(
          this.typeinfo.pid,
          item.id
        );
      }
      for (const item of event.sub) {
        Memoize.Name(pairname(this.typeinfo.parent, this.typeinfo.type)).sub(
          this.typeinfo.pid,
          item.id
        );
      }
    }, false);
  }

  static cereal = {
    serialise(collection) {
      return collection.typeinfo;
    },
    async deserialise(object) {
      let data = await Memoize.Name(pairname(object.parent, object.type)).get(
        object.pid
      );
      return new CollectionDB(
        object.pid,
        { name: object.parent },
        { name: object.type },
        ...data
      );
    },
  };
}
cereal.register(CollectionDB);
