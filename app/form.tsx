import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import * as ProductRepository from '../src/database/productRepository';

export default function FormScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Item' : 'Novo Item',
    });
  }, [isEditing, navigation]);

  useEffect(() => {
    if (!isEditing) return;

    async function loadProduct() {
      try {
        const product = await ProductRepository.getProductById(Number(id));
        if (!product) {
          Alert.alert('Erro', 'Item nao encontrado.');
          router.back();
          return;
        }
        setName(product.name);
        setQuantity(String(product.quantity));
        setPrice(product.price ? String(product.price) : '');
      } catch (error) {
        Alert.alert('Erro', 'Nao foi possivel carregar o item.');
        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEditing, router]);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Atencao', 'Informe o nome do item.');
      return;
    }

    const qtd = parseInt(quantity) || 1;
    const preco = price.trim() ? parseFloat(price.replace(',', '.')) : null;

    setSaving(true);
    try {
      if (isEditing) {
        await ProductRepository.updateProduct({
          id: Number(id),
          name: name.trim(),
          quantity: qtd,
          price: preco,
        });
      } else {
        await ProductRepository.createProduct({
          name: name.trim(),
          quantity: qtd,
          price: preco,
        });
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel salvar o item.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-orange-50"
        contentContainerClassName="px-4 pt-6 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Nome do item *
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex: Arroz, Feijão, Leite..."
          placeholderTextColor="#9ca3af"
          className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200 mb-5"
          maxLength={100}
          autoCapitalize="words"
        />

        <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Quantidade
        </Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="1"
          placeholderTextColor="#9ca3af"
          className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200 mb-5"
          keyboardType="numeric"
          maxLength={5}
        />

        <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Preço estimado (opcional)
        </Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Ex: 5,99"
          placeholderTextColor="#9ca3af"
          className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200 mb-8"
          keyboardType="decimal-pad"
          maxLength={10}
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`rounded-xl py-4 items-center ${
            saving ? 'bg-orange-300' : 'bg-orange-600'
          }`}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-base">
              {isEditing ? '💾 Salvar Alterações' : '➕ Adicionar à Lista'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}