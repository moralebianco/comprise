import { readFileSync } from 'node:fs'
// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import express from 'express'

const app = express()
const db = new DatabaseSync('proj.db')

app.use(express.json())
db.exec(readFileSync('init.sql', 'utf8'))

/* Items CRUD */

app.post('/items', (req, res) => {
  const { name, price, metadata, quantity } = req.body
  const stmt = db.prepare('INSERT INTO items VALUES (?, ?, ?, ?)')
  res.send(stmt.run(name, price, metadata, quantity))
})

app.get('/items/:id', (req, res) => {
  const { id } = req.params
  const stmt = db.prepare('SELECT rowid, * FROM items WHERE rowid=?')
  res.send(stmt.get(parseInt(id)))
})

app.get('/items', (_, res) => {
  const stmt = db.prepare('SELECT rowid, * FROM items')
  res.send(stmt.all())
})

app.put('/items/:id', (req, res) => {
  const { id } = req.params
  const { name, price, metadata, quantity } = req.body
  const stmt = db.prepare(`
    INSERT INTO items (rowid, name, price, metadata, quantity) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (rowid) DO UPDATE SET
      name=excluded.name,
      price=excluded.price,
      metadata=excluded.metadata,
      quantity=excluded.quantity
    WHERE rowid=excluded.rowid
  `)
  res.send(stmt.run(parseInt(id), name, price, metadata, quantity))
})

app.delete('/items/:id', (req, res) => {
  const { id } = req.params
  const stmt = db.prepare('DELETE FROM items WHERE rowid=?')
  res.send(stmt.run(parseInt(id)))
})

app.get('/ping', (_, res) => res.send('pong'))

app.listen(3000)
