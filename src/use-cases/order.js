// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import { clone, snakeToCamel } from '../util.js'

/**
 * @typedef {{
 *  adminId: number,
 *  supplierId: string,
 *  price: number,
 *  datetime: number
 * }} Order_
 * 
 * @typedef {{
 *  itemId: number,
 *  price: number,
 *  quantity: number
 * }} OrderItem
 */

export class Order {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Omit<Order_, "price" | "datetime">} order 
   * @returns 
   */
  create({ adminId, supplierId }) {
    const stmt = this.db.prepare('INSERT INTO orders VALUES (?, ?, ?, ?) RETURNING id')
    return stmt.get(adminId, supplierId, 0, Date.now()).id
  }

  /** @returns {Order_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM orders')
    return stmt.all().map(order => clone(order, snakeToCamel))
  }

  /**
   * @param {number} id 
   * @returns {Order_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE id=?')
    return clone(stmt.get(id), snakeToCamel)
  }

  /**
   * @param {number} orderId 
   * @returns {Array<OrderItem>}
   */
  getItems(orderId) {
    const stmt = this.db.prepare('SELECT * FROM orders_detail WHERE order_id=?')
    return stmt.all(orderId).map(order => clone(order, snakeToCamel))
  }

  /**
   * @param {number} orderId 
   * @param {Array<OrderItem>} items 
   */
  setItems(orderId, items) {
    let stmt = this.db.prepare('REPLACE INTO orders_detail VALUES (?, ?, ?, ?)')
    for (const { itemId, price, quantity } of items)
      stmt.run(itemId, orderId, price, quantity)
    stmt = this.db.prepare('UPDATE orders SET price=? WHERE id=?')
    stmt.run(items.reduce((acc, { price, quantity }) => price * quantity + acc, 0), orderId)
  }

  /**
   * @param {number} id
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM orders WHERE id=?')
    return stmt.run(id).changes > 0
  }
}