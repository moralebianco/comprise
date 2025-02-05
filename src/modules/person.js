import express from 'express';
import database from '../database.js';
import { isTypeOf } from '../util.js';

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
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM persons');
    // @ts-ignore
    return stmt.all();
  }

  /**
   * @param {string} id
   * @returns {Person_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM persons WHERE id=?');
    // @ts-ignore
    return stmt.get(id);
  }

  /** @param {string[]} roles */
  setRoles(id, roles) {
    this.db.prepare('DELETE FROM permissions WHERE admin_id=?').run(id);
    const stmt = this.db.prepare('INSERT INTO permissions VALUES (?, ?)');
    for (const role of roles) stmt.run(id, role.toUpperCase());
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
  .get('/:id', ({ params }, res) => {
    if (isTypeOf(params.id, '.+')) {
      const e = service.findOne(params.id);
      res.status(e ? 200 : 404).send(e);
    } else res.status(400).end();
  })
  .get('/', (_, res) => {
    res.send(service.findAll());
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
