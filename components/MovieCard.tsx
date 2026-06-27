import React from 'react';
import { StyleSheet, Text, Image, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { MovieCardProps } from '../types';

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed
      ]}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      <Image 
        source={{ uri: movie.posterUrl }} 
        style={styles.poster} 
        resizeMode="cover"
      />
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>★ {movie.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 210,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
    position: 'relative',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
});