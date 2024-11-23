// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

/**
 * @typedef {{
 *  name: string,
 *  price: number,
 *  metadata: string,
 *  quantity: number
 * }} Item_
 */

export class Item {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Item_ & { id?: number }} item 
   * @returns {number}
   */
  create({ id, name, price, metadata, quantity }) {
    const stmt = this.db.prepare('INSERT INTO items VALUES (?, ?, ?, ?, ?) RETURNING id')
    return stmt.get(id ?? null, name, price, metadata, quantity).id
  }

  /** @returns {Item_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM items')
    return stmt.all()
  }

  /** 
   * @param {number} id 
   * @returns {Item_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM items WHERE id=?')
    return stmt.get(id)
  }

  /**
   * @param {number} id
   * @param {Item_} item
   * @returns {boolean}
   */
  update(id, { name, price, metadata, quantity }) {
    const stmt = this.db.prepare('UPDATE items SET name=?, price=?, metadata=?, quantity=? WHERE id=?')
    return stmt.run(name, price, metadata, quantity, id).changes > 0
  }

  /**
   * @param {number} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM items WHERE id=?')
    return stmt.run(id).changes > 0
  }
}