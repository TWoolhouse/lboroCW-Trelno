/**
 * Event for a when the data of a collection sync has changed.
 * @template T
 */
export class CollectionEvent {
  /** @property {Array<T>} all All elements in the collection as of the event*/
  all;
  /** @property {Array<T>} add The elements that are new since the last event from this collection was fired*/
  add;
  /** @property {Array<T>} sub The elements that are no longer in the collection since the last event from this collection was fired*/
  sub;

  /**
   * @param {Array<T>} previous
   * @param {Array<T>} next
   */
  constructor(previous, next) {
    this.all = next;
    this.add = next.filter((it) => !previous.includes(it));
    this.sub = previous.filter((it) => !next.includes(it));
  }
}

/**
 * @template T
 * @callback Collection_OnChange
 * @param {CollectionEvent<T>} event
 * @returns {Promise<void>} Returns nothing
 */

/**
 * @template T
 */
export class Collection {
  /** @property {Array<T>} snapshot */
  snapshot;
  /** @property {Array<Collection_OnChange<T>>} onChangeFuncs */
  onChangeFuncs;

  /**
   * @param {...T} items
   */
  constructor(...items) {
    this.snapshot = items;
    this.onChangeFuncs = [];
  }

  [Symbol.iterator]() {
    return this.snapshot.values();
  }

  /**
   * Set the callback function for when the data of the Collection changes
   * @param {Collection_OnChange<T>} callback
   * @param {Boolean} [run] Run the callback immediately upon adding it.
   */
  onChange(callback, run = true) {
    this.onChangeFuncs.push(callback);
    if (run) callback(new CollectionEvent([], [...this.snapshot]));
    return this;
  }

  /**
   * Removes and active callback from the collection.
   * @param {Collection_OnChange<T>} callback The callback to remove
   */
  onChangeRemove(callback) {
    this.onChangeFuncs.splice(this.onChangeFuncs.indexOf(callback), 1);
  }

  /**
   * Add items to the collection
   * @param  {...T} items
   */
  add(...items) {
    if (!items.length) return;
    this.sync(() => {
      for (const item of items)
        if (this.snapshot.indexOf(item) == -1) this.snapshot.push(item);
    });
  }
  /**
   * Removes items from the collection
   * @param  {...T} items
   */
  remove(...items) {
    if (!items.length) return;
    this.sync(() => {
      for (const item of items) {
        let idx = this.snapshot.indexOf(item);
        if (idx < 0) continue;
        this.snapshot.splice(idx, 1);
      }
    });
  }

  /**
   * Replaces the entire collection with a new array
   * @param {...T} items Array to replace the current collection with
   */
  replace(...items) {
    this.sync(() => {
      this.snapshot = items;
    });
  }

  /**
   * Handles setting up and firing the CollectionEvent when editing the snapshot
   * @param {Collection_SyncCallback} func
   */
  sync(func) {
    let old = [...this.snapshot];
    func();
    let event = new CollectionEvent(old, [...this.snapshot]);
    for (const cb of this.onChangeFuncs) cb(event);
  }

  /**
   * @template T
   * @callback ChainFunc
   * @param {T} object
   * @returns {*}
   */

  /**
   * @param {ChainFunc<T>} add Function to convert when adding an element
   * @param {ChainFunc<T>} sub Function to convert when removing an element.
   * @returns {Collection_OnChange<T>}
   */
  chain(add, sub) {
    if (add === undefined) add = (i) => i;
    if (sub === undefined) sub = (i) => i;

    return (event) => {
      this.remove(...event.sub.map(sub));
      this.add(...event.add.map(add));
    };
  }
}
