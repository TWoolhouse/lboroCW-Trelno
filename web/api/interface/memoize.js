export const memoized = [];

import { serialise, deserialise, protoName } from "./cereal.js";

export function pairname(name_a, name_b) {
  return `${name_a}-${name_b}`;
}

const ProxyIdentity = Symbol("ProxyIdentity");
const ProxyIdentityCheck = Symbol("ProxyIdentityCheck");
// TODO: Use actual proxies that update the fields
function NewProxy(object) {
  return new Proxy(object, {
    // get(target, property, proxy) {
    //   if (target === ProxyIdentity) return proxy;
    //   if (target === ProxyIdentityCheck) return true;
    //   return Reflect.get(...arguments);
    // },
    set(target, property, value, proxy) {
      const res = Reflect.set(...arguments);
      Memoize.Name(protoName(target)).update(target, property, value);
      return res;
    },
  });
}

class DB {
  constructor(type) {
    this._key = type.name;
  }
  key(id) {
    return `db-${this._key}#${id}`;
  }
  async get(id) {
    return sessionStorage.getItem(this.key(id));
  }
  async create(id, value) {
    sessionStorage.setItem(this.key(id), value);
  }
}

class Cache {
  constructor(type) {
    this._key = type.name;
    this.db = new DB(type);
  }
  key(id) {
    return `${this._key}#${id}`;
  }
  async get(id) {
    let storage = localStorage.getItem(this.key(id));
    if (storage != undefined) return await deserialise(JSON.parse(storage));
    let res = await this.db.get(id);
    if (res == undefined) return undefined;
    localStorage.setItem(this.key(id), res);
    return await deserialise(JSON.parse(res));
  }

  async update(id, object, property, value) {
    // FIXME: Currently works as to save an object the whole thing must be serialised again
    await this.create(id, object);
  }

  async create(id, value) {
    let serial = JSON.stringify(serialise(value));
    localStorage.setItem(this.key(id), serial);
    await this.db.create(id, serial);
  }
}

export class Memoize {
  /**
   * @param {String} name
   * @returns {Memoize | MemoizePair}
   */
  static Type(type) {
    return memoized[type.name];
  }
  static Name(name) {
    return memoized[name];
  }

  constructor(type) {
    if (memoized[type.name]) return memoized[type.name];
    memoized[type.name] = this;
    this.store = {};
    this.cache = new Cache(type);
  }

  async get(id) {
    let bucket = this.store[id];
    if (bucket !== undefined) return bucket.proxy;
    let cached = await this.cache.get(id);
    if (cached == undefined) return undefined;
    let stored = (this.store[id] = {
      value: cached,
      proxy: NewProxy(cached, {}),
      cached: Date.now(),
    });
    return stored.proxy;
  }

  async update(object, property, value) {
    let bucket = this.store[object.id];
    if (bucket === undefined) return this.create(object);
    await this.cache.update(object.id, object, property, value);
    return bucket.proxy;
  }

  async create(object) {
    let bucket = {
      value: object,
      proxy: NewProxy(object, {}),
      cached: Date.now(),
    };
    this.store[object.id] = bucket;
    await this.cache.create(object.id, object);
    return bucket.proxy;
  }
}

class DBPair {
  constructor(type_a, type_b) {
    this._key = pairname(type_a.name, type_b.name);
  }
  key(id) {
    return `db-${this._key}#${id}`;
  }
  async get(id) {
    return sessionStorage.getItem(this.key(id));
  }
  async add(id, object) {
    let key = this.key(id);
    let arr = JSON.parse(sessionStorage.getItem(key) ?? "[]");
    if (!arr.includes(object)) {
      arr.push(object);
      sessionStorage.setItem(key, JSON.stringify(arr));
    }
  }
  async sub(id, object) {
    let key = this.key(id);
    let arr = JSON.parse(sessionStorage.getItem(key) ?? "[]");
    arr.splice(arr.indexOf(object), 1);
    sessionStorage.setItem(key, JSON.stringify(arr));
  }
}

class CachePair {
  constructor(type_a, type_b) {
    this._key = pairname(type_a.name, type_b.name);
    this.db = new DBPair(type_a, type_b);
  }
  key(id) {
    return `${this._key}#${id}`;
  }
  async get(id) {
    let storage = localStorage.getItem(this.key(id));
    if (storage != undefined) return JSON.parse(storage);
    let res = await this.db.get(id);
    if (res == undefined) return [];
    localStorage.setItem(this.key(id), res);
    return JSON.parse(res);
  }
  async add(id, object) {
    let key = this.key(id);
    let arr = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!arr.includes(object)) {
      arr.push(object);
      let serial = JSON.stringify(arr);
      localStorage.setItem(key, serial);
    }
    await this.db.add(id, object);
  }
  async sub(id, object) {
    let key = this.key(id);
    let arr = JSON.parse(localStorage.getItem(key) ?? "[]");
    arr.splice(arr.indexOf(object), 1);
    let serial = JSON.stringify(arr);
    localStorage.setItem(key, serial);
    await this.db.sub(id, object);
  }
}

export class MemoizePair {
  static name(name_a, name_b) {
    return `${name_a}-${name_b}`;
  }
  constructor(type_a, type_b) {
    let name = pairname(type_a.name, type_b.name);
    if (memoized[name]) return memoized[name];
    memoized[name] = this;
    this.store = {};
    this.memoized = memoized[type_b.name];
    this.cache = new CachePair(type_a, type_b);
  }

  async get(id) {
    let bucket = this.store[id];
    if (bucket != undefined) return bucket.values;
    let cached = await this.cache.get(id);
    let arr = await Promise.all(cached.map((v) => this.memoized.get(v)));
    this.store[id] = {
      values: arr,
      cached: Date.now(),
    };
    return arr;
  }

  async add(id, object) {
    let bucket = this.store[id] ?? {
      values: [],
    };
    if (!bucket.values.includes(object)) bucket.values.push(object);
    bucket.cached = Date.now();
    this.store[id] = bucket;
    await this.cache.add(id, object);
    return object;
  }
  async sub(id, object) {
    let bucket = this.store[id] ?? {
      values: [],
      cached: Date.now(),
    };
    this.store[id] = bucket;
    await this.cache.sub(id, object);
    return object;
  }
}
