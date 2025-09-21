import { assert } from 'chai';
import { reduceStore } from '../reduceStore';
import { Event, StoreObject } from '../defs';

describe('reduceStore', function() {
  it('Should run an update correctly', function() {
    const newStore = reduceStore(
      {
        event: Event.CHANGED,
        doc: {
          _id: '123',
          __typename: 'update',
          newField: 'new',
        },
      },
      [
        {
          _id: '123',
          __typename: 'current',
          title: 'abc',
        },
        {
          _id: '124',
          __typename: 'current',
          title: 'abcd',
        },
      ]
    );

    assert.isArray(newStore);
    const newStoreArray = newStore as StoreObject[];
    assert.lengthOf(newStoreArray, 2);
    assert.isObject(newStoreArray[0]);
    assert.isDefined((newStoreArray[0] as Record<string, unknown>).title);
    assert.isDefined((newStoreArray[0] as Record<string, unknown>).newField);
    // assert.equal('current', newStore[0].__typename);
  });
});
