import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { MovieCard } from './MovieCard';
import { MovieRowProps } from '../types';

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.rowTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {movies.map((movie) => (
          <View key={movie.id} style={styles.cardWrapper}>
            <MovieCard movie={movie} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  cardWrapper: {
    paddingHorizontal: 4,
  },
});