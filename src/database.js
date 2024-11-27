import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

if (!process.env.DB_NAME) throw new Error();

const database = new DatabaseSync(process.env.DB_NAME);

database.exec(readFileSync('init.sql', 'utf8'));

export default database;
