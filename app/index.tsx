import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '../src/hooks/useProducts';
import { Product } from '../src/types/product';

export default function HomeScreen() {
  const router = useRouter();
  const { products, loading, togglePurchased, removeProduct } = useProducts();

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      'Excluir item',
      `Deseja excluir "${name}" da lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeProduct(id) },
      ],
    );
  };

  const pendingItems = products.filter((p) => p.purchased === 0);
  const purchasedItems = products.filter((p) => p.purchased === 1);

  const total = products.reduce((sum, p) => {
    if (p.price && p.purchased === 0) return sum + p.price * p.quantity;
    return sum;
  }, 0);

  const renderItem = (item: Product) => (
    <View key={item.id} className="bg-white rounded-2xl mx-4 mb-3 p-4 shadow-sm flex-row items-center">
      <TouchableOpacity
        onPress={() => togglePurchased(item.id, item.purchased)}
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center flex-shrink-0 ${
          item.purchased === 1
            ? 'bg-orange-500 border-orange-500'
            : 'border-gray-300 bg-white'
        }`}
      >
        {item.purchased === 1 && (
          <Text className="text-white text-xs font-bold">✓</Text>
        )}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            item.purchased === 1 ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500">
          Qtd: {item.quantity}
          {item.price ? `  •  R$ ${item.price.toFixed(2)}` : ''}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.push(`/form?id=${item.id}`)}
          className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center"
        >
          <Text className="text-base">✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.name)}
          className="w-9 h-9 rounded-xl bg-red-100 items-center justify-center"
        >
          <Text className="text-base">❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
        <Text className="mt-3 text-gray-500">Carregando lista...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-orange-50">
      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListEmptyComponent={null}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {products.length === 0 ? (
              <View className="flex-1 items-center justify-center px-8 mt-32">
                <Text className="text-6xl mb-4">🛒</Text>
                <Text className="text-xl font-bold text-gray-700 text-center mb-2">
                  Lista vazia!
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Toque no botão + para adicionar itens.
                </Text>
              </View>
            ) : (
              <>
                {pendingItems.length > 0 && (
                  <>
                    <Text className="mx-4 mt-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      🛒 A comprar ({pendingItems.length})
                    </Text>
                    {pendingItems.map(renderItem)}
                  </>
                )}

                {pendingItems.length > 0 && purchasedItems.length > 0 && (
                  <View className="mx-4 my-3 h-px bg-gray-200" />
                )}

                {purchasedItems.length > 0 && (
                  <>
                    <Text className="mx-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      ✅ Comprados ({purchasedItems.length})
                    </Text>
                    {purchasedItems.map(renderItem)}
                  </>
                )}

                {total > 0 && (
                  <View className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-sm">
                    <Text className="text-sm text-gray-500">Total estimado (pendentes)</Text>
                    <Text className="text-xl font-bold text-orange-600">
                      R$ {total.toFixed(2)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        }
      />

      <TouchableOpacity
        onPress={() => router.push('/form')}
        className="absolute bottom-8 right-6 w-16 h-16 bg-orange-600 rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-4xl font-light" style={{ lineHeight: 46 }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}