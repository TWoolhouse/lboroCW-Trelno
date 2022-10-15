import * as cereal from "../interface/cereal.js";

export class Task {
  constructor(id, done, name) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.done = done;
    this.name = name;
  }
}
cereal.register(Task);
