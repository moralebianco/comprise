import express from 'express'
import { db } from './database.js'
/* Use Cases */
import { ItemUc } from './use-cases/item.js'
import { PeopleUc } from './use-cases/people.js';
import { SupplierUc } from './use-cases/supplier.js';

export const app = express()

app.use(express.json())

/* Items API */
;(() => {
  const router = express.Router();
  const item = new ItemUc(db)

  router.post('/', (req, res) => {
    const { name, price, metadata, quantity } = req.body
    res.send(item.create({ name, price, metadata, quantity }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(item.findOne(parseInt(id)))
  })

  router.get('/', (_, res) => {
    res.send(item.findAll())
  })

  router.put('/:id', (req, res) => {
    const { id } = req.params
    const { name, price, metadata, quantity } = req.body
    res.send(item.update(parseInt(id), { name, price, metadata, quantity }))
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(item.delete(parseInt(id)))
  })

  app.use('/items', router)
})()

/* People API */
;(() => {
  const router = express.Router();
  const people = new PeopleUc(db)

  router.post('/', (req, res) => {
    const { id, role, names, phone } = req.body
    res.send(people.create({ id, role, names, phone }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(people.findOne(id))
  })

  router.get('/', (_, res) => {
    res.send(people.findAll())
  })

  router.put('/:id', (req, res) => {
    const { id } = req.params
    const { role, names, phone } = req.body
    res.send(people.update(id, { role, names, phone }))
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(people.delete(id))
  })

  app.use('/people', router)
})()

/* Supplier API */
;(() => {
  const router = express.Router();
  const supplier = new SupplierUc(db)

  router.post('/', (req, res) => {
    const { id, name, phone, email } = req.body
    res.send(supplier.create({ id, name, phone, email }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(supplier.findOne(id))
  })

  router.get('/', (_, res) => {
    res.send(supplier.findAll())
  })

  router.put('/:id', (req, res) => {
    const { id } = req.params
    const { name, phone, email } = req.body
    res.send(supplier.update(id, { name, phone, email }))
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(supplier.delete(id))
  })

  app.use('/suppliers', router)
})()