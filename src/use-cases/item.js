// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

/**
 * @typedef {{
 *  name: string,
 *  price: number,
 *  metadata: string,
 *  quantity: number
 * }} Item
 */

export class ItemUc {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Item} item 
   * @returns {boolean}
   */
  create({ name, price, metadata, quantity }) {
    const stmt = this.db.prepare('INSERT INTO items VALUES (?, ?, ?, ?)')
    return stmt.run(name, price, metadata, quantity).changes > 0
  }

  /** @returns {Item[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT rowid, * FROM items')
    return stmt.all()
  }

  /** 
   * @param {number} id 
   * @returns {Item | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT rowid, * FROM items WHERE rowid=?')
    return stmt.get(id)
  }

  /**
   * @param {number} id
   * @param {Item} item
   * @returns {boolean}
   */
  update(id, { name, price, metadata, quantity }) {
    const stmt = this.db.prepare(`
      INSERT INTO items (rowid, name, price, metadata, quantity) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (rowid) DO UPDATE SET
        name=excluded.name,
        price=excluded.price,
        metadata=excluded.metadata,
        quantity=excluded.quantity
      WHERE rowid=excluded.rowid
    `)
    return stmt.run(id, name, price, metadata, quantity).changes > 0
  }

  /**
   * @param {number} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM items WHERE rowid=?')
    return stmt.run(id).changes > 0
  }
}