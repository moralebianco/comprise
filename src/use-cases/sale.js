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
   * @param {number} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM sales WHERE rowid=?')
    return stmt.run(id).changes > 0
  }
}