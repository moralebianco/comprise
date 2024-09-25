import express from 'express'
import { db } from './database.js'
/* Use Cases */
import { ItemUc } from './use-cases/item.js'

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