import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function PlayerScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'filme' | 'serie' }>();

  const url = type === 'serie'
    ? `https://superflixapi.lifestyle/serie/${id}#noLink`
    : `https://superflixapi.lifestyle/filme/${id}#noLink`;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <iframe
        src={url}
        style={{ flex: 1, border: 'none', width: '100%', height: '100%' } as any}
        allow="autoplay *; encrypted-media *; picture-in-picture *; fullscreen *; clipboard-write *; accelerometer *; gyroscope *; web-share *"
        allowFullScreen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backButton: {
    position: 'absolute', top: 16, left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  backIcon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});