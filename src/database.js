// @ts-nocheck
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

function make(location) {
  const db = new DatabaseSync(location, { allowExtension: true });
  db.loadExtension('./fts5.so');
  db.exec(readFileSync('init.sql', 'utf8'));
  return db;
}

export const memory = () => make(':memory:');

export default make(process.env.DB_NAME);
