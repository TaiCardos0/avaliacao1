/**
 * src/hooks/useProducts.ts
 * Hook customizado com toda a lógica da lista de mercado
 */

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
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const togglePurchased = useCallback(
    async (id: number, currentPurchased: number) => {
      const newPurchased = currentPurchased === 0 ? 1 : 0;
      await ProductRepository.togglePurchased(id, newPurchased);
      await loadProducts();
    },
    [loadProducts],
  );

  const removeProduct = useCallback(
    async (id: number) => {
      await ProductRepository.deleteProduct(id);
      await loadProducts();
    },
    [loadProducts],
  );

  return {
    products,
    loading,
    togglePurchased,
    removeProduct,
    reload: loadProducts,
  };
}