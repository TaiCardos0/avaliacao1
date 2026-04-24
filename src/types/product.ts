export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number | null;
  purchased: number;
  createdAt: string;
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