// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

/**
 * @typedef {{
 *  id: string,
 *  role: number,
 *  names: string,
 *  phone: string
 * }} People
 */

export class PeopleUc {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {People} people
   * @returns {boolean} 
   */
  create({ id, role, names, phone }) {
    const stmt = this.db.prepare('INSERT INTO people VALUES (?, ?, ?, ?)')
    return stmt.run(id, role, names, phone).changes > 0
  }

  /** @returns {People[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM people')
    return stmt.all()
  }

  /** 
   * @param {string} id 
   * @returns {People | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM people WHERE id=?')
    return stmt.get(id)
  }

  /**
   * @param {string} id
   * @param {Omit<People, "id">} people
   * @returns {boolean}
   */
  update(id, { role, names, phone }) {
    const stmt = this.db.prepare(`
      INSERT INTO people (id, role, names, phone) VALUES (?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        role=excluded.role,
        names=excluded.names,
        phone=excluded.phone
      WHERE id=excluded.id
    `)
    return stmt.run(id, role, names, phone).changes > 0
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