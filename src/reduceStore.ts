import { ReactiveEvent, StoreObject, Event } from './defs';

export function reduceStore(
  reactiveEvent: ReactiveEvent,
  store: StoreObject[] | StoreObject | null
): StoreObject[] | StoreObject | null {
  if (store instanceof Array) {
    return reduceStoreArray(reactiveEvent, store);
  }
  return reduceStoreObject(reactiveEvent, store);
}

export function reduceStoreObject(
  reactiveEvent: ReactiveEvent,
  store: StoreObject | null
): StoreObject | null {
  const { event, doc } = reactiveEvent;
  const { ...rest } = doc;

  if (event === Event.ADDED) {
    // check if it exists

    if (store) {
      return Object.assign({}, store, rest);
    } else {
      return doc;
    }
  }

  if (event === Event.CHANGED) {
    return Object.assign({}, store || {}, rest, { __typename: doc.__typename });
  }

  if (event === Event.REMOVED) {
    return null;
  }

  // This should never happen, but TypeScript requires it
  return store;
}

export function reduceStoreArray(
  reactiveEvent: ReactiveEvent,
  store: StoreObject[]
): StoreObject[] {
  const { event, doc } = reactiveEvent;

  if (!doc._id) {
    throw new Error(
      'The document does not have _id set, is it present in the subscription?'
    );
  }

  if (event === Event.ADDED) {
    // check if it exists
    const { idx, found } = findIndexInStore(store, doc._id);

    if (found && idx !== undefined) {
      return [...store.slice(0, idx), found, ...store.slice(idx + 1)];
    }

    return [doc, ...store];
  }

  if (event === Event.CHANGED) {
    const { idx, found } = findIndexInStore(store, doc._id);

    if (!found) {
      return store;
    }

    const newFound = Object.assign({}, found, doc);
    return [...store.slice(0, idx!), newFound, ...store.slice(idx! + 1)];
  }

  if (event === Event.REMOVED) {
    return store.filter(item => item._id !== doc._id);
  }

  // This should never happen, but TypeScript requires it
  return store;
}

/**
 * @param store
 * @param _id
 */
function findIndexInStore(store: StoreObject[], _id: string | number): { idx: number | undefined; found: StoreObject | undefined } {
  let foundIdx: number | undefined;
  const found = store.find((item, idx) => {
    if (item._id === _id) {
      foundIdx = idx;
      return true;
    }
    return false;
  });

  return { idx: foundIdx, found };
}
