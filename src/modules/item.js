import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import database from '../database.js';

/**
 * @typedef {{
 *  name: string,
 *  price: number,
 *  metadata: string,
 *  quantity: number
 * }} Item_
 */

export class Item {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {Item_ & { id?: number }} item
   * @returns {number}
   */
  create({ id, name, price, metadata, quantity }) {
    const stmt = this.db.prepare(
      'INSERT INTO items VALUES (?, ?, ?, ?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(id ?? null, name, price, metadata, quantity).id;
  }

  /** @returns {Item_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM items');
    // @ts-ignore
    return stmt.all();
  }

  /**
   * @param {number} id
   * @returns {Item_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM items WHERE id=?');
    // @ts-ignore
    return stmt.get(id);
  }

  /**
   * @param {number} id
   * @param {Item_} item
   * @returns {boolean}
   */
  update(id, { name, price, metadata, quantity }) {
    const stmt = this.db.prepare(
      'UPDATE items SET name=?, price=?, metadata=?, quantity=? WHERE id=?'
    );
    return stmt.run(name, price, metadata, quantity, id).changes > 0;
  }

  /**
   * @param {number} id
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM items WHERE id=?');
    return stmt.run(id).changes > 0;
  }
}

const service = new Item(database);

export default express
  .Router()
  .post('/', (req, res) => {
    res.status(201).send(service.create(req.body));
  })
  .get('/:id', (req, res) => {
    const e = service.findOne(parseInt(req.params.id));
    res.status(e ? 200 : 404).send(e);
  })
  .get('/', (_, res) => {
    res.send(service.findAll());
  })
  .put('/:id', (req, res) => {
    if (service.findOne(parseInt(req.params.id)))
      res.send(service.update(parseInt(req.params.id), req.body));
    else res.status(201).send(service.create(req.body));
  })
  .delete('/:id', (req, res) => {
    res.send(service.delete(parseInt(req.params.id)));
  });
