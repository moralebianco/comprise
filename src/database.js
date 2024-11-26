import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

if (!process.env.DB_NAME) {
  throw new Error()
}

export const db = new DatabaseSync(process.env.DB_NAME)

db.exec(readFileSync('init.sql', 'utf8'))