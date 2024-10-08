// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import { clone, snakeToCamel } from '../util.js'

/**
 * @typedef {{
 *  adminId: number,
 *  supplierId: string,
 *  price: number,
 *  datetime: number
 * }} Order
 * 
 * @typedef {{
 *  itemId: number,
 *  price: number,
 *  quantity: number
 * }} OrderItem
 */

export class OrderUc {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Omit<Order, "price" | "datetime">} order 
   * @returns 
   */
  create({ adminId, supplierId }) {
    const stmt = this.db.prepare('INSERT INTO orders VALUES (?, ?, ?, ?) RETURNING rowid')
    return stmt.get(adminId, supplierId, 0, Date.now()).rowid
  }

  /** @returns {Order[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT rowid, * FROM orders')
    return stmt.all().map(order => clone(order, snakeToCamel))
  }

  /**
   * @param {number} id 
   * @returns {Order | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT rowid, * FROM orders WHERE rowid=?')
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
    stmt = this.db.prepare('UPDATE orders SET price=? WHERE rowid=?')
    stmt.run(items.reduce((acc, { price, quantity }) => price * quantity + acc, 0), orderId)
  }

  /**
   * @param {number} id
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM orders WHERE rowid=?')
    return stmt.run(id).changes > 0
  }
}