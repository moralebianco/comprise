import express from 'express';
import database from '../database.js';
import { isTypeOf, PAGE } from '../util.js';

const E = {
  id: '.',
  name: '.',
  phone: '.',
  email: '.',
};

/**
 * @typedef {typeof E} Supplier_
 */

export class Supplier {
  /** @param {import('node:sqlite').DatabaseSync} db  */
  constructor(db) {
    this.db = db;
  }

  /** @param {Supplier_} supplier */
  create({ id, name, phone, email }) {
    const stmt = this.db.prepare(
      'INSERT INTO suppliers VALUES (?, ?, ?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(id, name, phone, email).id;
  }

  findAll({ limit = 100, offset = 0 } = {}) {
    const stmt = this.db.prepare('SELECT * FROM suppliers LIMIT ? OFFSET ?');
    return stmt.all(limit, offset);
  }

  /** @param {string} id */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM suppliers WHERE id=?');
    return stmt.get(id);
  }

  /**
   * @param {string} id
   * @param {Omit<Supplier_, "id">} supplier
   */
  update(id, { name, phone, email }) {
    const stmt = this.db.prepare(
      'UPDATE suppliers SET name=?, phone=?, email=? WHERE id=?'
    );
    return stmt.run(name, phone, email, id).changes > 0;
  }

  /** @param {string} id */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM suppliers WHERE id=?');
    return stmt.run(id).changes > 0;
  }
}

const service = new Supplier(database);

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
