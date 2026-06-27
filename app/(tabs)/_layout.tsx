import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

// Mini componente para renderizar ícones baseados em texto/emoji de forma limpa
// Nota: Se futuramente instalar o @expo/vector-icons, poderá substituí-los aqui.
function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, { opacity: focused ? 1 : 0.6 }]}>
        {icon}
      </Text>
    </View>
  );
}

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
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />

      {/* Aba Busca (search.tsx) */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Busca',
          tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} />,
        }}
      />

      {/* Aba Minha Lista (watchlist.tsx) */}
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Minha Lista',
          tabBarIcon: ({ focused }) => <TabIcon icon="🔖" focused={focused} />,
        }}
        />
        {/* Nova Aba Profile adicionada aqui */}
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Perfil', tabBarIcon: () => <Text style={{fontSize: 20}}>👤</Text> }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
});