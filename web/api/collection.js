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
  /** @property {Collection_OnChange<T>} onChangeFunc */
  onChangeFunc;

  /**
   * @param {Collection_OnChange<T>} onChange
   */
  constructor(onChange) {
    this.snapshot = [];
    this.onChangeFunc = onChange;
  }

  /**
   * Set the callback function for when the data of the Collection changes
   * @param {Collection_OnChange<T>} callback
   */
  onChange(callback) {
    this.onChangeFunc = callback;
  }

  /**
   * Add items to the collection
   * @param  {...T} items
   */
  add(...items) {
    let old = [...this.snapshot];
    for (const item of items) this.snapshot.push(item);
    this.onChangeFunc(new CollectionEvent(old, [...this.snapshot]));
  }
  /**
   * Removes items from the collection
   * @param  {...T} items
   */
  remove(...items) {
    let old = [...this.snapshot];
    for (const item of items) {
      let idx = this.snapshot.indexOf(item);
      if (idx < 0) continue;
      this.snapshot.splice(idx, 1);
    }
    this.onChangeFunc(new CollectionEvent(old, [...this.snapshot]));
  }
}
