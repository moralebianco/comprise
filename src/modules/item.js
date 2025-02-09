import express from 'express';
import database from '../database.js';
import { isTypeOf, PAGE } from '../util.js';

const E = {
  id: 0,
  name: '.',
  price: 0.1,
  metadata: '',
  quantity: 1,
};

/**
 * @typedef {typeof E} Item_
 */

export class Item {
  /** @param {import('node:sqlite').DatabaseSync} db */
  constructor(db) {
    this.db = db;
  }

  /** @param {import('../types.js').Optional<Item_, 'id'>} item */
  create({ id, name, price, metadata, quantity }) {
    const stmt = this.db.prepare(
      'INSERT INTO items VALUES (?, ?, ?, ?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(id ?? null, name, price, metadata, quantity).id;
  }

  /** @param {string} q query */
  search(q) {
    // prettier-ignore
    q = q.trim().split(/\s+/).map((t) => t + '*').join(' OR ');
    const stmt = this.db.prepare(
      'SELECT rowid AS id FROM items_fts(?) ORDER BY rank LIMIT 25'
    );
    // @ts-ignore
    return stmt.all(q).map(({ id }) => this.findOne(id));
  }

  findAll({ limit = 100, offset = 0 } = {}) {
    const stmt = this.db.prepare('SELECT * FROM items LIMIT ? OFFSET ?');
    return stmt.all(limit, offset);
  }

  /** @param {number} id */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM items WHERE id=?');
    return stmt.get(id);
  }

  /**
   * @param {number} id
   * @param {import('../types.js').Optional<Item_, 'id'>} item
   */
  update(id, { name, price, metadata, quantity }) {
    const stmt = this.db.prepare(
      'UPDATE items SET name=?, price=?, metadata=?, quantity=? WHERE id=?'
    );
    return stmt.run(name, price, metadata, quantity, id).changes > 0;
  }

  /** @param {number} id */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM items WHERE id=?');
    return stmt.run(id).changes > 0;
  }
}

const service = new Item(database);

export default express
  .Router()
  .post('/', ({ body }, res) => {
    if (isTypeOf(body, E)) {
      res.status(201).send(service.create(body));
    } else res.status(400).send();
  })
  .get('/:id', ({ params }, res) => {
    if (isTypeOf(+params.id, 1)) {
      const e = service.findOne(+params.id);
      res.status(e ? 200 : 404).send(e);
    } else res.status(400).end();
  })
  .get('/', ({ query }, res) => {
    if (isTypeOf(query.q, '.')) {
      res.send(service.search(query.q));
    } else if (isTypeOf(query, PAGE)) {
      res.send(service.findAll(query));
    } else res.status(400).end();
  })
  .put('/:id', ({ params, body }, res) => {
    if (isTypeOf(+params.id, 1) && isTypeOf(body, E)) {
      if (service.findOne(+params.id))
        res.send(service.update(+params.id, body));
      else res.status(201).send(service.create(body));
    } else res.status(400).end();
  })
  .delete('/:id', ({ params }, res) => {
    if (isTypeOf(+params.id, 1)) res.send(service.delete(+params.id));
    else res.status(400).end();
  });
