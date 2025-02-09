import express from 'express';
import { clone, isTypeOf, PAGE, snakeToCamel } from '../util.js';
import database from '../database.js';

const E = {
  adminId: 1,
  supplierId: 1,
  price: 0,
  datetime: 0,
};

const I = {
  itemId: 1,
  orderId: 0,
  price: 0.1,
  quantity: 1,
};

/**
 * @typedef {typeof I} OrderItem
 *
 * @typedef {typeof E & { items?: OrderItem[] }} Order_
 */

export class Order {
  /** @param {import('node:sqlite').DatabaseSync} db */
  constructor(db) {
    this.db = db;
  }

  /** @param {Order_} order */
  create({ adminId, supplierId }) {
    const stmt = this.db.prepare(
      'INSERT INTO orders (admin_id, supplier_id) VALUES (?, ?) RETURNING id'
    );
    // @ts-ignore
    return stmt.get(adminId, supplierId).id;
  }

  findAll({ limit = 100, offset = 0 } = {}) {
    const stmt = this.db.prepare(
      'SELECT * FROM ORDER BY datetime orders LIMIT ? OFFSET ?'
    );
    return stmt.all(limit, offset).map((order) => clone(order, snakeToCamel));
  }

  /** @param {number} id */
  findOne(id, { items = false } = {}) {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE id=?');
    const obj = clone(stmt.get(id), snakeToCamel);
    if (obj) {
      if (items) obj.items = this.getItems(id);
    }
    return obj;
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
    this.db.prepare('DELETE FROM orders_detail WHERE order_id=?').run(orderId);
    let stmt = this.db.prepare('INSERT INTO orders_detail VALUES (?, ?, ?, ?)');
    for (const { itemId, price, quantity } of items)
      stmt.run(itemId, orderId, price, quantity);
    stmt = this.db.prepare('UPDATE orders SET price=? WHERE id=?');
    stmt.run(
      items.reduce((acc, { price, quantity }) => price * quantity + acc, 0),
      orderId
    );
  }

  /** @param {number} id */
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
