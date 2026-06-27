import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { getWatchlist, removeFromWatchlist } from '../../services/storage';
import { Movie } from '../../types';

export default function WatchlistScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useFocusEffect(
    useCallback(() => {
      getWatchlist().then(setMovies);
    }, [])
  );

  async function handleRemove(id: string) {
    await removeFromWatchlist(id);
    setMovies(prev => prev.filter(m => m.id !== id));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerIcon}>🎬</Text>
        <Text style={styles.headerTitle}>Minha Lista</Text>
        <View style={{ width: 32 }} />
      </View>

      {movies.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyTitle}>Lista vazia</Text>
          <Text style={styles.emptySubtitle}>Salve filmes para assistir depois</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Salvos</Text>
              <Text style={styles.sectionSubtitle}>{movies.length} títulos</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieCard} onPress={() => router.push(`/movie/${item.id}`)}>
              <Image source={{ uri: item.posterUrl }} style={styles.posterImage} />
              <LinearGradient
                colors={['transparent', 'rgba(18,20,20,0.95)']}
                style={styles.cardGradient}
              >
                <View style={styles.ratingRow}>
                  <Text style={styles.starIcon}>★</Text>
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.movieYear}>{item.year}</Text>
              </LinearGradient>
              <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#1e2020' },
  headerIcon: { fontSize: 20 },
  headerTitle: { color: '#f5c518', fontSize: 18, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { color: '#e3e2e2', fontSize: 20, fontWeight: '700' },
  emptySubtitle: { color: '#b7b5b4', fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  infoSection: { marginTop: 20, marginBottom: 16 },
  sectionTitle: { color: '#e3e2e2', fontSize: 24, fontWeight: '700' },
  sectionSubtitle: { color: '#d1c5ac', fontSize: 14, marginTop: 4 },
  gridRow: { justifyContent: 'space-between', marginBottom: 16 },
  movieCard: { width: '48%', aspectRatio: 2 / 3, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1e2020' },
  posterImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  starIcon: { color: '#f5c518', fontSize: 12 },
  ratingText: { color: '#e3e2e2', fontSize: 12, fontWeight: '700' },
  movieTitle: { color: '#e3e2e2', fontSize: 14, fontWeight: '600' },
  movieYear: { color: '#d1c5ac', fontSize: 12, marginTop: 2 },
  removeBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  removeIcon: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});