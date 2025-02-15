import { openDb } from './db';

export async function initDb() {
  const db = await openDb();

  // Crea la tabla persons (usuarios)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL
    );
  `);

  // Crea la tabla payments (pagos) con una relación a persons
  await db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      isPaid INTEGER NOT NULL,  -- 0 para false, 1 para true
      personId INTEGER,
      FOREIGN KEY(personId) REFERENCES persons(id)
    );
  `);
}
