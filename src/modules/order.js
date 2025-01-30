import express from 'express';
import { clone, isTypeOf, snakeToCamel } from '../util.js';
import database from '../database.js';

const E = {
  adminId: 1,
  supplierId: 1,
  price: 0.1,
  datetime: 1,
};

const I = {
  itemId: 1,
  price: 0.1,
  quantity: 1,
};

/**
 * @typedef {typeof E} Order_
 *
 * @typedef {typeof I} OrderItem
 */

export class Order {
  /** @param {import('node:sqlite').DatabaseSync} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {Omit<Order_, "price" | "datetime">} order
   * @returns
   */
  create({ adminId, supplierId }) {
    const stmt = this.db.prepare(
      'INSERT INTO orders VALUES (?, ?, ?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(adminId, supplierId, 0, Date.now()).id;
  }

  /** @returns {Order_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM orders');
    return stmt.all().map((order) => clone(order, snakeToCamel));
  }

  /**
   * @param {number} id
   * @returns {Order_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE id=?');
    return clone(stmt.get(id), snakeToCamel);
  }

  /**
   * @param {number} orderId
   * @returns {Array<OrderItem>}
   */
  getItems(orderId) {
    const stmt = this.db.prepare(
      'SELECT * FROM orders_detail WHERE order_id=?'
    );
    return stmt.all(orderId).map((order) => clone(order, snakeToCamel));
  }

  /**
   * @param {number} orderId
   * @param {Array<OrderItem>} items
   */
  setItems(orderId, items) {
    let stmt = this.db.prepare(
      'REPLACE INTO orders_detail VALUES (?, ?, ?, ?)'
    );
    for (const { itemId, price, quantity } of items)
      stmt.run(itemId, orderId, price, quantity);
    stmt = this.db.prepare('UPDATE orders SET price=? WHERE id=?');
    stmt.run(
      items.reduce((acc, { price, quantity }) => price * quantity + acc, 0),
      orderId
    );
  }

  /**
   * @param {number} id
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM orders WHERE id=?');
    return stmt.run(id).changes > 0;
  }
}

const service = new Order(database);

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
