/**
 * src/types/product.ts
 * Tipos da entidade Produto (item da lista de mercado)
 */

export interface Product {
  id: number;
  name: string;        // nome do item (ex: "Arroz")
  quantity: number;    // quantidade (ex: 2)
  price: number | null; // preço estimado (opcional)
  purchased: number;   // 0 = não comprado, 1 = comprado
  createdAt: string;   // data de criação ISO 8601
}

export interface CreateProductInput {
  name: string;
  quantity: number;
  price: number | null;
}

export interface UpdateProductInput {
  id: number;
  name: string;
  quantity: number;
  price: number | null;
}