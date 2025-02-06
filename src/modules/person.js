import express from 'express';
import database from '../database.js';
import { isTypeOf, PAGE } from '../util.js';

const E = {
  id: '.',
  roles: [''],
  names: '.',
  phone: '.',
};

/**
 * @typedef {typeof E} Person_
 */

export class Person {
  /** @param {import('node:sqlite').DatabaseSync} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {import('../types.js').Optional<Person_, 'roles'>} person
   */
  create({ id, roles, names, phone }) {
    const stmt = this.db.prepare('INSERT INTO persons VALUES (?, ?, ?)');
    // @ts-ignore
    stmt.get(id, names, phone);
    if (roles) this.setRoles(id, roles);
  }

  /** @returns {Person_[]} */
  findAll({ limit = 100, offset = 0 } = {}) {
    const stmt = this.db.prepare('SELECT * FROM persons LIMIT ? OFFSET ?');
    // @ts-ignore
    return stmt.all(limit, offset);
  }

  /**
   * @param {string} id
   * @returns {Person_ | undefined}
   */
  findOne(id, { roles = false } = {}) {
    const stmt = this.db.prepare('SELECT * FROM persons WHERE id=?');
    const obj = /** @type {Person_} */ (stmt.get(id));
    if (obj) {
      if (roles) obj.roles = this.getRoles(id);
    }
    return obj;
  }

  /** @param {string[]} roles */
  setRoles(id, roles) {
    this.db.prepare('DELETE FROM permissions WHERE admin_id=?').run(id);
    const stmt = this.db.prepare('INSERT INTO permissions VALUES (?, ?)');
    for (const role of roles) stmt.run(id, role.toUpperCase());
  }

  /** @returns {string[]} */
  getRoles(id) {
    const stmt = this.db.prepare('SELECT * FROM permissions WHERE admin_id=?');
    // @ts-ignore
    return stmt.all(id).map(({ role }) => role);
  }

  /**
   * @param {string} id
   * @param {Omit<Person_, "id">} person
   * @returns {boolean}
   */
  update(id, { names, phone, roles }) {
    const stmt = this.db.prepare(
      'UPDATE persons SET names=?, phone=? WHERE id=?'
    );
    // TODO fix atomicity
    this.setRoles(id, roles);
    return stmt.run(names, phone, id).changes > 0;
  }

  /**
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM persons WHERE id=?');
    return stmt.run(id).changes > 0;
  }
}

const service = new Person(database);

export default express
  .Router()
  .post('/', ({ body }, res) => {
    if (isTypeOf(body, E)) {
      res.status(201).send(service.create(body));
    } else res.status(400).end();
  })
  .get('/:id', ({ params, query }, res) => {
    if (isTypeOf(params.id, '.+')) {
      const e = service.findOne(params.id, query);
      res.status(e ? 200 : 404).send(e);
    } else res.status(400).end();
  })
  .get('/', ({ query }, res) => {
    if (isTypeOf(query, PAGE)) {
      res.send(service.findAll(query));
    } else res.status(400).end();
  })
  .put('/:id', ({ params, body }, res) => {
    if (isTypeOf(params.id, '.+') && isTypeOf(body, E)) {
      if (service.findOne(params.id)) res.send(service.update(params.id, body));
      else res.status(201).send(service.create(body));
    } else res.status(400).end();
  })
  .delete('/:id', ({ params }, res) => {
    if (isTypeOf(params.id, '.+')) {
      res.send(service.delete(params.id));
    } else res.status(400).end();
  });
