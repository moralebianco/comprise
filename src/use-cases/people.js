import { DatabaseSync } from 'node:sqlite'

/**
 * @typedef {{
 *  id: string,
 *  roles: string[],
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
  create({ id, names, phone }) {
    const stmt = this.db.prepare('INSERT INTO people VALUES (?, ?, ?) RETURNING id')
    // @ts-ignore
    return stmt.get(id, names, phone).id
  }

  /** @returns {People_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM people')
    // @ts-ignore
    return stmt.all()
  }

  /** 
   * @param {string} id 
   * @returns {People_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM people WHERE id=?')
    // @ts-ignore
    return stmt.get(id)
  }

  addRoles(id, roles) {
    const stmt = this.db.prepare('INSERT INTO permissions VALUES (?, ?)')
    for (const role of roles) {
      stmt.run(id, role.toUpperCase())
    }
    return true;
  }

  /**
   * @param {string} id
   * @param {Omit<People_, "id">} people
   * @returns {boolean}
   */
  update(id, { names, phone, roles }) {
    const stmt = this.db.prepare('UPDATE people SET names=?, phone=? WHERE id=?')
    // TODO fix atomicity
    return stmt.run(names, phone, id).changes > 0 && this.addRoles(id, roles);
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