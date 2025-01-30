import express from 'express';
import { clone, isTypeOf, snakeToCamel } from '../util.js';
import database from '../database.js';

const E = {
  checkoutId: 1,
  customerId: '.+',
  price: 0.1,
  datetime: 1,
};

const I = {
  itemId: 1,
  customerId: '.+',
  price: 0.1,
  quantity: 1,
};

/**
 * @typedef {typeof E} Sale_
 *
 * @typedef {typeof I} SaleItem
 */

export class Sale {
  /** @param {import('node:sqlite').DatabaseSync} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {Omit<Sale_, "price" | "datetime">} sale
   * @returns {number}
   */
  create({ checkoutId, customerId }) {
    const stmt = this.db.prepare(
      'INSERT INTO sales VALUES (?, ?, ?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(checkoutId, customerId, 0, Date.now()).id;
  }

  /** @returns {Sale_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM sales');
    return stmt.all().map((sale) => clone(sale, snakeToCamel));
  }

  /**
   * @param {number} id
   * @returns {Sale_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM sales WHERE id=?');
    return clone(stmt.get(id), snakeToCamel);
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
    let stmt = this.db.prepare('REPLACE INTO sales_detail VALUES (?, ?, ?, ?)');
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
  .get('/:id', ({ params }, res) => {
    if (isTypeOf(+params.id, 1)) {
      const e = service.findOne(+params.id);
      res.status(e ? 200 : 404).send(e);
    } else res.status(400).end();
  })
  .get('/:id/items', ({ params }, res) => {
    if (isTypeOf(+params.id, 1)) {
      res.send(service.getItems(+params.id));
    } else res.status(400).end();
  })
  .get('/', (_, res) => {
    res.send(service.findAll());
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
