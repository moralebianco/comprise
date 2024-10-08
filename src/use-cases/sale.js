// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import { clone, snakeToCamel } from '../util.js'

/**
 * @typedef {{
 *  checkoutId: number,
 *  customerId: string,
 *  price: number,
 *  datetime: number
 * }} Sale
 * 
 * @typedef {{
 *  itemId: number,
 *  price: number,
 *  quantity: number
 * }} SaleItem
 */

export class SaleUc {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Omit<Sale, "price" | "datetime">} sale
   * @returns {number}
   */
  create({ checkoutId, customerId }) {
    const stmt = this.db.prepare('INSERT INTO sales VALUES (?, ?, ?, ?) RETURNING rowid')
    return stmt.get(checkoutId, customerId, 0, Date.now()).rowid
  }

  /** @returns {Sale[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT rowid, * FROM sales')
    return stmt.all().map(sale => clone(sale, snakeToCamel))
  }

  /**
   * @param {number} id
   * @returns {Sale | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT rowid, * FROM sales WHERE rowid=?')
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
    stmt = this.db.prepare('UPDATE sales SET price=? WHERE rowid=?')
    stmt.run(items.reduce((acc, { price, quantity }) => price * quantity + acc, 0), saleId)
  }

  /**
   * @param {number} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM sales WHERE rowid=?')
    return stmt.run(id).changes > 0
  }
}