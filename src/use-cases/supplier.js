// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

/**
 * @typedef {{
 *  id: string,
 *  name: string,
 *  phone: string,
 *  email: string
 * }} Supplier
 */

export class SupplierUc {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Supplier} supplier
   * @returns {string} 
   */
  create({ id, name, phone, email }) {
    const stmt = this.db.prepare('INSERT INTO suppliers VALUES (?, ?, ?, ?) RETURNING id')
    return stmt.get(id, name, phone, email).id
  }

  /** @returns {Supplier[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM suppliers')
    return stmt.all()
  }

  /** 
   * @param {string} id 
   * @returns {Supplier | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM suppliers WHERE id=?')
    return stmt.get(id)
  }

  /**
   * @param {string} id
   * @param {Omit<Supplier, "id">} supplier
   * @returns {boolean}
   */
  update(id, { name, phone, email }) {
    const stmt = this.db.prepare('UPDATE suppliers SET name=?, phone=?, email=? WHERE id=?')
    return stmt.run(name, phone, email, id).changes > 0
  }

  /**
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM suppliers WHERE id=?')
    return stmt.run(id).changes > 0
  }
}