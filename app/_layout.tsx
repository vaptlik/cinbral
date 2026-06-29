import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, StatusBar } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.root}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121414' } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movie/[id]" />
          <Stack.Screen name="serie/[id]" />
          <Stack.Screen
            name="player"
            options={{
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: '#000' },
            }}
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121414' },
});