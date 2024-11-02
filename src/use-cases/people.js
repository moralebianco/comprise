// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

/**
 * @typedef {{
 *  id: string,
 *  role: number,
 *  names: string,
 *  phone: string
 * }} People_
 */

export class People {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {People_} people
   * @returns {string} 
   */
  create({ id, role, names, phone }) {
    const stmt = this.db.prepare('INSERT INTO people VALUES (?, ?, ?, ?) RETURNING id')
    return stmt.get(id, role, names, phone).id
  }

  /** @returns {People_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM people')
    return stmt.all()
  }

  /** 
   * @param {string} id 
   * @returns {People_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM people WHERE id=?')
    return stmt.get(id)
  }

  /**
   * @param {string} id
   * @param {Omit<People_, "id">} people
   * @returns {boolean}
   */
  update(id, { role, names, phone }) {
    const stmt = this.db.prepare('UPDATE people SET role=?, names=?, phone=? id=?')
    return stmt.run(role, names, phone, id).changes > 0
  }

  /**
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM people WHERE id=?')
    return stmt.run(id).changes > 0
  }
}