import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as ProductRepository from '../database/productRepository';
import { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProductRepository.getProducts();
      setProducts(data);
    } catch (error) {
      console.log('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  async function togglePurchased(id: number, current: number) {
    const novo = current === 0 ? 1 : 0;
    await ProductRepository.togglePurchased(id, novo);
    await loadProducts();
  }

  async function removeProduct(id: number) {
    await ProductRepository.deleteProduct(id);
    await loadProducts();
  }

  return {
    products,
    loading,
    togglePurchased,
    removeProduct,
  };
}