import { getDatabase } from './database';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product';

export async function getProducts() {
  const db = await getDatabase();
  return db.getAllAsync<Product>('SELECT * FROM products ORDER BY createdAt DESC');
}

export async function getProductById(id: number) {
  const db = await getDatabase();
  return db.getFirstAsync<Product>('SELECT * FROM products WHERE id = ?', id);
}

export async function createProduct(input: CreateProductInput) {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
    'INSERT INTO products (name, quantity, price, purchased, createdAt) VALUES (?, ?, ?, 0, ?)',
    input.name,
    input.quantity,
    input.price,
    createdAt
  );

  return await getProductById(result.lastInsertRowId);
}

export async function updateProduct(input: UpdateProductInput) {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?',
    input.name,
    input.quantity,
    input.price,
    input.id
  );
}

export async function togglePurchased(id: number, purchased: number) {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE products SET purchased = ? WHERE id = ?',
    purchased,
    id
  );
}

export async function deleteProduct(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM products WHERE id = ?', id);
}