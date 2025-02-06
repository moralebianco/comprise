import express from 'express';
import { clone, isTypeOf, PAGE, snakeToCamel } from '../util.js';
import database from '../database.js';

const E = {
  checkoutId: 1,
  customerId: '.',
  price: 0,
  datetime: 0,
};

const I = {
  itemId: 1,
  saleId: 0,
  price: 0.1,
  quantity: 1,
};

/**
 * @typedef {typeof I} SaleItem
 *
 * @typedef {typeof E & { items?: SaleItem[] }} Sale_
 */

export class Sale {
  /** @param {import('node:sqlite').DatabaseSync} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {Sale_} sale
   * @returns {number}
   */
  create({ checkoutId, customerId }) {
    const stmt = this.db.prepare(
      'INSERT INTO sales (checkout_id, customer_id) VALUES (?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(checkoutId, customerId).id;
  }

  /** @returns {Sale_[]} */
  findAll({ limit = 100, offset = 0 } = {}) {
    const stmt = this.db.prepare(
      'SELECT * FROM sales ORDER BY datetime LIMIT ? OFFSET ?'
    );
    return stmt.all(limit, offset).map((sale) => clone(sale, snakeToCamel));
  }

  /**
   * @param {number} id
   * @returns {Sale_ | undefined}
   */
  findOne(id, { items = false } = {}) {
    const stmt = this.db.prepare('SELECT * FROM sales WHERE id=?');
    const obj = clone(stmt.get(id), snakeToCamel);
    if (obj) {
      if (items) obj.items = this.getItems(id);
    }
    return obj;
  }

  /**
   * @param {number} saleId
   * @returns {Array<SaleItem>}
   */
  getItems(saleId) {
    const stmt = this.db.prepare('SELECT * FROM sales_detail WHERE sale_id=?');
    return stmt.all(saleId).map((sale) => clone(sale, snakeToCamel));
  }

  /**
   * @param {number} saleId
   * @param {Array<SaleItem>} items
   */
  setItems(saleId, items) {
    this.db.prepare('DELETE FROM sales_detail WHERE sale_id=?').run(saleId);
    let stmt = this.db.prepare('INSERT INTO sales_detail VALUES (?, ?, ?, ?)');
    for (const { itemId, price, quantity } of items)
      stmt.run(itemId, saleId, price, quantity);
    stmt = this.db.prepare('UPDATE sales SET price=? WHERE id=?');
    stmt.run(
      items.reduce((acc, { price, quantity }) => price * quantity + acc, 0),
      saleId
    );
  }

  /**
   * @param {number} id
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM sales WHERE id=?');
    return stmt.run(id).changes > 0;
  }
}

const service = new Sale(database);

export default express
  .Router()
  .post('/', ({ body }, res) => {
    if (isTypeOf(body, E)) {
      res.status(201).send(service.create(body));
    } else res.status(400).end();
  })
  .get('/:id', ({ params, query }, res) => {
    if (isTypeOf(+params.id, 1)) {
      const e = service.findOne(+params.id, query);
      res.status(e ? 200 : 404).send(e);
    } else res.status(400).end();
  })
  .get('/:id/items', ({ params }, res) => {
    if (isTypeOf(+params.id, 1)) {
      res.send(service.getItems(+params.id));
    } else res.status(400).end();
  })
  .get('/', ({ query }, res) => {
    if (isTypeOf(query, PAGE)) {
      res.send(service.findAll(query));
    } else res.status(400).end();
  })
  .put('/:id/items', ({ params, body: { items } }, res) => {
    if (isTypeOf(+params.id, 1) && isTypeOf(items, [I])) {
      res.status(204).send(service.setItems(+params.id, items));
    } else res.status(400).end();
  })
  .delete('/:id', ({ params }, res) => {
    if (isTypeOf(+params.id, 1)) {
      res.send(service.delete(+params.id));
    } else res.status(400).end();
  });
