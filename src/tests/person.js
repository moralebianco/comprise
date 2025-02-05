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
  it('findAll', () => {
    assert.deepEqual(service.findAll(), [N]);
  });

  it('create', () => {
    assert.doesNotThrow(() => service.create($[0]));
    assert.doesNotThrow(() => service.create($[1]));
  });

  it('findAll', () => assert.deepEqual(service.findAll(), [N, ...$]));

  it('create (fail)', () => {
    assert.throws(() => {
      service.create($[0]);
    });
  });

  it('setRoles', () => {
    assert.doesNotThrow(() => {
      service.setRoles('10B1', ['ADMIN', 'CASHIER']);
    });
  });

  it('setRoles (fail)', () => {
    assert.throws(() => {
      service.setRoles('', ['CAHISER']);
    });
  });

  it('getRoles', () => {
    assert.deepEqual(service.getRoles('10B1'), ['ADMIN', 'CASHIER']);
  });

  it('setRoles (fail)', () => {
    assert.throws(() => {
      service.setRoles('10B1', ['BAD']);
    });
  });

  it('update', () => {
    $[0] = { ...$[0], phone: '+1 304 001' };
    assert.ok(service.update('10B1', { ...$[0], roles: [] }));
  });

  it('update (fail)', () => {
    assert.ok(!service.update('WTH', { ...$[0], roles: [] }));
  });

  it('delete', () => {
    assert.ok(service.delete('208A'));
    assert.equal(service.findAll().length, 2);
  });

  it('delete (fail)', () => assert.ok(!service.delete('BAD')));

  it('delete (fail)', () => {
    assert.throws(() => {
      service.delete('0');
    });
  });

  it('findOne', () => {
    assert.deepEqual(service.findOne('10B1'), $[0]);
  });
});
