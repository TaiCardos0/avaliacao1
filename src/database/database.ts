import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (db !== null) {
    return db;
  }

  db = await SQLite.openDatabaseAsync('mercado.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL,
      purchased INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );
  `);

  return db;
}