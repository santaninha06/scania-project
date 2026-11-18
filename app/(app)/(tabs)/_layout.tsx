import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notas',
          tabBarIcon: ({ size }) => (
            <Ionicons name="receipt-outline" color={colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ size }) => (
            <Ionicons name="scan-outline" color={colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ size }) => (
            <Ionicons name="pie-chart-outline" color={colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size }) => (
            <Ionicons name="person-outline" color={colors.primary} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
