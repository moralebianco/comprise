// @ts-nocheck
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

function make(location = ':memory:') {
  const db = new DatabaseSync(location, { allowExtension: true });
  db.loadExtension('./fts5.so');
  db.exec(readFileSync('init.sql', 'utf8'));
  return db;
}

export default make(process.env.DB_NAME);
