import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Person } from '../modules/person.js';
import { memory } from '../database.js';

const service = new Person(memory());
const N = { id: '0', names: 'null', phone: null };
const $ = [
  { id: '10B1', names: 'Mary', phone: '' },
  { id: '208A', names: 'Newton', phone: '+1 123 456' },
];

describe(import.meta.filename, () => {
  it('return an array with the default record', () =>
    assert.deepEqual(service.findAll(), [N]));

  it('not throw errors inserting valid records', () => {
    assert.doesNotThrow(() => service.create($[0]));
    assert.doesNotThrow(() => service.create($[1]));
  });

  it('return an array with the three records', () =>
    assert.deepEqual(service.findAll(), [N, ...$]));

  it('throw an error if the record was saved before', () =>
    assert.throws(() => service.create($[0])));

  it('not throw an error inserting valid roles', () =>
    assert.doesNotThrow(() => service.setRoles('10B1', ['ADMIN', 'CASHIER'])));

  it("throw an error if the id is ''", () =>
    assert.throws(() => service.setRoles('', ['CAHISER'])));

  it('return an array with the roles if id exists', () =>
    assert.deepEqual(service.getRoles('10B1'), ['ADMIN', 'CASHIER']));

  it('throw an error if there is an invalid role', () =>
    assert.throws(() => service.setRoles('10B1', ['BAD'])));

  it('update nicely if all parameters are okay', () => {
    $[0] = { ...$[0], phone: '+1 304 001' };
    assert.ok(service.update('10B1', { ...$[0], roles: [] }));
  });

  it('not update if the id does not exist', () =>
    assert.ok(!service.update('WTH', { ...$[0], roles: [] })));

  it('delete nicely if the id exists', () => {
    assert.ok(service.delete('208A'));
    assert.equal(service.findAll().length, 2);
  });

  it('not delete if the id does not exist', () =>
    assert.ok(!service.delete('BAD')));

  it('throw an error trying to delete the default record', () =>
    assert.throws(() => service.delete('0')));

  it("return the recod with id '10B1'", () =>
    assert.deepEqual(service.findOne('10B1'), $[0]));
});
