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
  it('findAll', () => assert.deepEqual(service.findAll(), []));

  it('create', () => {
    assert.equal(service.create($[0]), 1);
    $[0].id = 1;
    assert.equal(service.create($[1]), $[1].id);
  });

  it('create (fail)', () => {
    assert.throws(() => {
      service.create($[0]);
    });
  });

  it('findAll', () => assert.deepEqual(service.findAll(), $));

  it('update', () => {
    $[0].metadata = '1';
    assert.ok(service.update(1, $[0]));
    assert.deepEqual(service.findAll(), $);
  });

  it('update (fail)', () => {
    assert.ok(!service.update(2, $[0]));
  });

  it('delete', () => {
    assert.ok(service.delete(1));
    assert.deepEqual(service.findAll(), [$[1]]);
  });

  it('delete (fail)', () => assert.ok(!service.delete(2)));

  it('findOne', () => assert.deepEqual(service.findOne(3), $[1]));

  it('findOne (fail)', () => {
    assert.equal(service.findOne(0), undefined);
  });
});
