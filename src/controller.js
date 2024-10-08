import express from 'express'
import { db } from './database.js'
import { ItemUc, PeopleUc, SupplierUc, SaleUc } from './use-cases/index.js'

export const app = express()

app.use(express.json())

;(() => {  // items
  const router = express.Router();
  const uc = new ItemUc(db)

  router.post('/', (req, res) => {
    const { name, price, metadata, quantity } = req.body
    res.send(uc.create({ name, price, metadata, quantity }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.findOne(parseInt(id)))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id', (req, res) => {
    const { id } = req.params
    const { name, price, metadata, quantity } = req.body
    if (uc.findOne(parseInt(id)))
      res.send(uc.update(parseInt(id), { name, price, metadata, quantity }))
    else
      res.send(uc.create({ name, price, metadata, quantity }))
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.delete(parseInt(id)))
  })

  app.use('/items', router)
})()

;(() => { // people
  const router = express.Router();
  const uc = new PeopleUc(db)

  router.post('/', (req, res) => {
    const { id, role, names, phone } = req.body
    res.send(uc.create({ id, role, names, phone }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.findOne(id))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id', (req, res) => {
    const { id } = req.params
    const { role, names, phone } = req.body
    if (uc.findOne(id))
      res.send(uc.update(id, { role, names, phone }))
    else
      res.send(uc.create({ id, role, names, phone }))
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.delete(id))
  })

  app.use('/people', router)
})()

;(() => { // suppliers
  const router = express.Router();
  const uc = new SupplierUc(db)

  router.post('/', (req, res) => {
    const { id, name, phone, email } = req.body
    res.send(uc.create({ id, name, phone, email }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.findOne(id))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id', (req, res) => {
    const { id } = req.params
    const { name, phone, email } = req.body
    if (uc.findOne(id))
      res.send(uc.update(id, { name, phone, email }))
    else
      res.send(uc.create({ id, name, phone, email }))
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.delete(id))
  })

  app.use('/suppliers', router)
})()

;(() => { // sales
  const router = express.Router()
  const uc = new SaleUc(db)

  router.post('/', (req, res) => {
    const { checkoutId, customerId } = req.body
    res.send(uc.create({ checkoutId, customerId }))
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.findOne(parseInt(id)))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.delete('/:id', (req, res) => {
    const { id } = req.params
    res.send(uc.delete(parseInt(id)))
  })

  app.use('/sales', router)
})()