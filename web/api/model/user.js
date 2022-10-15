import * as cereal from "../interface/cereal.js";
import { CollectionDB } from "../interface/collectionDB.js";
import { Task } from "./task.js";

export class User {
  constructor(id, email) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.email = email;
    this.tasks = new CollectionDB(this.id, User.name, Task.name);
  }
}
cereal.register(User);
