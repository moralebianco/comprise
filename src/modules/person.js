import express from 'express'
import { DatabaseSync } from 'node:sqlite'
import database from '../database.js'

/**
 * @typedef {{
 *  id: string,
 *  roles: string[],
 *  names: string,
 *  phone: string
 * }} Person_
 */

export class Person {
  /** @param {DatabaseSync} db  */
  constructor(db) {
    this.db = db
  }

  /**
   * @param {Person_} person
   * @returns {string} 
   */
  create({ id, names, phone }) {
    const stmt = this.db.prepare('INSERT INTO persons VALUES (?, ?, ?) RETURNING id')
    // @ts-ignore
    return stmt.get(id, names, phone).id
  }

  /** @returns {Person_[]} */
  findAll() {
    const stmt = this.db.prepare('SELECT * FROM persons')
    // @ts-ignore
    return stmt.all()
  }

  /** 
   * @param {string} id 
   * @returns {Person_ | undefined}
   */
  findOne(id) {
    const stmt = this.db.prepare('SELECT * FROM persons WHERE id=?')
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
   * @param {Omit<Person_, "id">} person
   * @returns {boolean}
   */
  update(id, { names, phone, roles }) {
    const stmt = this.db.prepare('UPDATE persons SET names=?, phone=? WHERE id=?')
    // TODO fix atomicity
    return stmt.run(names, phone, id).changes > 0 && this.addRoles(id, roles);
  }

  /**
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM persons WHERE id=?')
    return stmt.run(id).changes > 0
  }
}

const service = new Person(database)

export default express.Router()
  .post('/', (req, res) => {
    res.send(service.create(req.body))
  })
  .get('/:id', (req, res) => {
    res.send(service.findOne(req.params.id))
  })
  .get('/', (_, res) => {
    res.send(service.findAll())
  })
  .put('/:id', (req, res) => {
    if (service.findOne(req.params.id))
      res.send(service.update(req.params.id, req.body))
    else
      res.send(service.create(req.body))
  })
  .delete('/:id', (req, res) => {
    res.send(service.delete(req.params.id))
  })