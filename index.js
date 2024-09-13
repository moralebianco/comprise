import { readFileSync } from 'node:fs'
// @ts-ignore
import { DatabaseSync } from 'node:sqlite'
import express from 'express'

const app = express()
const db = new DatabaseSync('proj.db')

db.exec(readFileSync('init.sql', 'utf8'))

app.get('/ping', (_, res) => res.send('pong'))

app.listen(3000)
