import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync(process.env.DB_NAME);

database.exec(readFileSync('init.sql', 'utf8'));

export default database;
