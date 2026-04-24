import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ea580c' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        contentStyle: { backgroundColor: '#fff7ed' },
        headerBackTitle: '',
      }}
    >
      <Stack.Screen name="index" options={{ title: '🛒 Lista de Mercado' }} />
      <Stack.Screen name="form" options={{ title: 'Novo Item' }} />
    </Stack>
  );
}