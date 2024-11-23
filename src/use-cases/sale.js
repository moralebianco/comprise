// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import { clone, snakeToCamel } from '../util.js'

/**
 * @typedef {{
 *  checkoutId: number,
 *  customerId: string,
 *  price: number,
 *  datetime: number
 * }} Sale_
 * 
 * @typedef {{
 *  itemId: number,
 *  price: number,
 *  quantity: number
 * }} SaleItem
 */

export class Sale {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Omit<Sale_, "price" | "datetime">} sale
   * @returns {number}
   */
  create({ checkoutId, customerId }) {
    const stmt = this.db.prepare('INSERT INTO sales VALUES (?, ?, ?, ?) RETURNING id')
    return stmt.get(checkoutId, customerId, 0, Date.now()).id
  }

  /** @returns {Sale_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM sales')
    return stmt.all().map(sale => clone(sale, snakeToCamel))
  }

  /**
   * @param {number} id
   * @returns {Sale_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM sales WHERE id=?')
    return clone(stmt.get(id), snakeToCamel)
  }

  /**
   * @param {number} saleId 
   * @returns {Array<SaleItem>}
   */
  getItems(saleId) {
    const stmt = this.db.prepare('SELECT * FROM sales_detail WHERE sale_id=?')
    return stmt.all(saleId).map(sale => clone(sale, snakeToCamel))
  }

  /**
   * @param {number} saleId
   * @param {Array<SaleItem>} items
   */
  setItems(saleId, items) {
    let stmt = this.db.prepare('REPLACE INTO sales_detail VALUES (?, ?, ?, ?)')
    for (const { itemId, price, quantity } of items)
      stmt.run(itemId, saleId, price, quantity)
    stmt = this.db.prepare('UPDATE sales SET price=? WHERE id=?')
    stmt.run(items.reduce((acc, { price, quantity }) => price * quantity + acc, 0), saleId)
  }

  /**
   * @param {number} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM sales WHERE id=?')
    return stmt.run(id).changes > 0
  }
}