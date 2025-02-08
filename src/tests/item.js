import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Item } from '../modules/item.js';
import { memory } from '../database.js';

const service = new Item(memory());
const $ = [
  { name: 'i1', price: 10.5, metadata: '', quantity: 4 },
  { name: 'i2', price: 0.99, metadata: '2', quantity: 9, id: 3 },
];

describe(import.meta.filename, () => {
  it('return an empty array', () => assert.deepEqual(service.findAll(), []));

  it('return id 1 after inserting first record', () => {
    assert.equal(service.create($[0]), 1);
    $[0].id = 1;
  });

  it('return the id of the inserted record', () =>
    assert.equal(service.create($[1]), $[1].id));

  it('throw an error if the id exists', () =>
    assert.throws(() => service.create($[0])));

  it('return the inserted record', () =>
    assert.deepEqual(service.findAll(), $));

  it('update nicely if all parameters are okay', () => {
    $[0].metadata = '1';
    assert.ok(service.update(1, $[0]));
    assert.deepEqual(service.findAll(), $);
  });

  it('not update if the id does not exist', () =>
    assert.ok(!service.update(2, $[0])));

  it('delete nicely if the id exists', () => {
    assert.ok(service.delete(1));
    assert.deepEqual(service.findAll(), [$[1]]);
  });

  it('not delete if the id does not exist', () =>
    assert.ok(!service.delete(2)));

  it('return the record with id 3', () =>
    assert.deepEqual(service.findOne(3), $[1]));

  it('return undefined if id does not exist', () =>
    assert.equal(service.findOne(0), undefined));
});
