import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
// Importando os ícones nativos do Expo
import { Ionicons } from '@expo/vector-icons'; 

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f5c518',     // Cor primária ativa (Amarelo)
        tabBarInactiveTintColor: '#c8c6c5',   // Cor secundária inativa (Cinza)
        tabBarStyle: {
          backgroundColor: '#1e2020',         // surface-container
          borderTopWidth: 1,
          borderTopColor: 'rgba(78, 70, 51, 0.2)', // outline-variant/20
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Inter',
        },
      }}
    >
      {/* Aba Home (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* Aba Busca (search.tsx) */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* Aba Minha Lista (watchlist.tsx) */}
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Minha Lista',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* Aba Perfil (profile.tsx) */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }} 
      />
    </Tabs>
  );
}