import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const CastCard = ({ name, image }: { name: string, image: string }) => (
  <View style={styles.card}>
    <Image source={{ uri: image }} style={styles.image} />
    <Text style={styles.name} numberOfLines={2}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { alignItems: 'center', marginRight: 20, width: 80 },
  image: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  name: { color: '#E3E2E2', fontSize: 12, textAlign: 'center' }
});