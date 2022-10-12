/**
 * @param {Object} proxies
 * @param {Object} proxies.get
 * @param {Object} proxies.set
 */
export function ProxyFactory(proxies) {
  for (const prop of ["get", "set"]) {
    if (proxies[prop] === undefined) proxies[prop] = {};
  }
  class DBProxy {
    constructor() {
      return new Proxy(this, {
        get(_target, p) {
          let func = proxies.get[p];
          if (func !== undefined && !func(...arguments));
          return Reflect.get(...arguments);
        },
        set(target, p, value) {
          let func = proxies.set[p];
          if (func !== undefined && !func(target, value));
          return Reflect.set(...arguments);
        },
      });
    }
  }
  return DBProxy;
}
