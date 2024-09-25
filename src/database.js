import { readFileSync } from 'node:fs'
// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

export const db = new DatabaseSync('proj.db')

db.exec(readFileSync('init.sql', 'utf8'))