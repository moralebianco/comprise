import { readFileSync } from 'node:fs'
// @ts-ignore
import { DatabaseSync } from 'node:sqlite'

export const db = new DatabaseSync(process.env.DB_NAME)

db.exec(readFileSync('init.sql', 'utf8'))