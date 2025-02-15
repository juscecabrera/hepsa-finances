import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Abre (o crea) la base de datos en el archivo database.sqlite
export async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
}
