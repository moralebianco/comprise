import express from 'express'
import { db } from './database.js'
import { Item, Order, People, Sale, Supplier } from './use-cases/index.js'

export const app = express()

app.use(express.json())

;(() => {  // items
  const router = express.Router();
  const uc = new Item(db)

  router.post('/', (req, res) => {
    res.send(uc.create(req.body))
  })

  router.get('/:id', (req, res) => {
    res.send(uc.findOne(parseInt(req.params.id)))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id', (req, res) => {
    if (uc.findOne(parseInt(req.params.id)))
      res.send(uc.update(parseInt(req.params.id), req.body))
    else
      res.send(uc.create(req.body))
  })

  router.delete('/:id', (req, res) => {
    res.send(uc.delete(parseInt(req.params.id)))
  })

  app.use('/items', router)
})()

;(() => { // orders
  const router = express.Router()
  const uc = new Order(db)

  router.post('/', (req, res) => {
    res.send(uc.create(req.body))
  })

  router.get('/:id', (req, res) => {
    res.send(uc.findOne(parseInt(req.params.id)))
  })

  router.get('/:id/items', (req, res) => {
    res.send(uc.getItems(parseInt(req.params.id)))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id/items', (req, res) => {
    res.send(uc.setItems(parseInt(req.params.id), req.body.items))
  })

  router.delete('/:id', (req, res) => {
    res.send(uc.delete(parseInt(req.params.id)))
  })

  app.use('/orders', router)
})()

;(() => { // people
  const router = express.Router();
  const uc = new People(db)

  router.post('/', (req, res) => {
    res.send(uc.create(req.body))
  })

  router.get('/:id', (req, res) => {
    res.send(uc.findOne(req.params.id))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id', (req, res) => {
    if (uc.findOne(req.params.id))
      res.send(uc.update(req.params.id, req.body))
    else
      res.send(uc.create(req.body))
  })

  router.delete('/:id', (req, res) => {
    res.send(uc.delete(req.params.id))
  })

  app.use('/people', router)
})()

;(() => { // sales
  const router = express.Router()
  const uc = new Sale(db)

  router.post('/', (req, res) => {
    res.send(uc.create(req.body))
  })

  router.get('/:id', (req, res) => {
    res.send(uc.findOne(parseInt(req.params.id)))
  })

  router.get('/:id/items', (req, res) => {
    res.send(uc.getItems(parseInt(req.params.id)))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id/items', (req, res) => {
    res.send(uc.setItems(parseInt(req.params.id), req.body.items))
  })

  router.delete('/:id', (req, res) => {
    res.send(uc.delete(parseInt(req.params.id)))
  })

  app.use('/sales', router)
})()

;(() => { // suppliers
  const router = express.Router();
  const uc = new Supplier(db)

  router.post('/', (req, res) => {
    res.send(uc.create(req.body))
  })

  router.get('/:id', (req, res) => {
    res.send(uc.findOne(req.params.id))
  })

  router.get('/', (_, res) => {
    res.send(uc.findAll())
  })

  router.put('/:id', (req, res) => {
    if (uc.findOne(req.params.id))
      res.send(uc.update(req.params.id, req.body))
    else
      res.send(uc.create(req.body))
  })

  router.delete('/:id', (req, res) => {
    res.send(uc.delete(req.params.id))
  })

  app.use('/suppliers', router)
})()