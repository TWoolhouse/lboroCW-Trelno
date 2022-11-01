import * as cereal from "../interface/cereal.js";
import { Memoize } from "../interface/memoize.js";

export class Client {
  /** @property {Number} id TeamID */
  id;
  /** @property {String} name Name of the client company */
  name;
  /** @property {String} representative Name of the client's representative */
  representative;
  /** @property {String} address Postal address */
  address;
  /** @property {String} website Website for the company */
  website;
  /** @property {String} [email] Email address */
  email;
  /** @property {String} [phone] Phone number */
  phone;

  /**
   * @param {Number} id TeamID
   * @param {String} name Name of the client company
   * @param {String} representative Name of the client's representative
   * @param {String} address Postal address
   * @param {String} website Website for the company
   * @param {String} [email] Email address
   * @param {String} [phone] Phone number
   * @returns {Client}
   */
  constructor(id, name, representative, address, website, email, phone) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.name = name;
    this.representative = representative;
    this.address = address;
    this.website = website;
    this.email = email;
    this.phone = phone;
  }
}
cereal.register(Client);
new Memoize(Client);