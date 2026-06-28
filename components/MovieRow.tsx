import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { MovieCard } from './MovieCard';
import { MovieRowProps } from '../types';

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  // Pré-carrega os posters de todas as linhas em disco assim que os dados chegam
  useEffect(() => {
    if (movies.length === 0) return;
    const urls = movies.map(m => ({ uri: m.posterUrl }));
   Image.prefetch(movies.map(m => m.posterUrl), 'disk').catch(() => {});
  }, [movies]);

  return (
    <View style={styles.container}>
      <Text style={styles.rowTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        removeClippedSubviews={false}
      >
        {movies.map(movie => (
          <View key={movie.id} style={styles.cardWrapper}>
            <MovieCard movie={movie} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:      { marginVertical: 12 },
  rowTitle:       { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10, paddingHorizontal: 16 },
  scrollContainer:{ paddingHorizontal: 12 },
  cardWrapper:    { paddingHorizontal: 4 },
});