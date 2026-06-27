import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Mock de dados da coleção do usuário
const SAVED_MOVIES = [
  { id: '1', title: 'Oppenheimer', year: '2023', rating: '8.6', poster: 'https://via.placeholder.com/180x270' },
  { id: '2', title: 'Dune: Part Two', year: '2024', rating: '8.8', poster: 'https://via.placeholder.com/180x270' },
  { id: '3', title: 'The Dark Knight', year: '2008', rating: '9.0', poster: 'https://via.placeholder.com/180x270' },
  { id: '4', title: 'Inception', year: '2010', rating: '8.8', poster: 'https://via.placeholder.com/180x270' },
  { id: '5', title: 'Spider-Verse', year: '2018', rating: '8.4', poster: 'https://via.placeholder.com/180x270' },
];

export default function WatchlistScreen() {
  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerIcon}>🎬</Text>
        <Text style={styles.headerTitle}>Minha Lista</Text>
        <TouchableOpacity style={styles.avatarButton}>
          <Text style={styles.avatarIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Canvas Grid */}
      <FlatList
        data={SAVED_MOVIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.infoSection}>
            <View>
              <Text style={styles.sectionTitle}>Itens Salvos</Text>
              <Text style={styles.sectionSubtitle}>{SAVED_MOVIES.length} títulos na sua coleção</Text>
            </View>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortIcon}>↕</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.movieCard}
            onPress={() => router.push(`/movie/${item.id}`)}
          >
            <Image source={{ uri: item.poster }} style={styles.posterImage} />
            
            {/* Cinematic Gradient Overlays */}
            <LinearGradient
              colors={['transparent', 'rgba(18, 20, 20, 0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.ratingRow}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.movieYear}>{item.year}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: 'rgba(18, 20, 20, 0.9)', borderBottomWidth: 1, borderColor: '#1e2020' },
  headerIcon: { fontSize: 20 },
  headerTitle: { color: '#f5c518', fontSize: 18, fontWeight: '600' },
  avatarButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(30, 32, 32, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  avatarIcon: { fontSize: 14, color: '#d1c5ac' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  infoSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20, marginBottom: 16 },
  sectionTitle: { color: '#e3e2e2', fontSize: 24, fontWeight: '700' },
  sectionSubtitle: { color: '#d1c5ac', fontSize: 14, marginTop: 4 },
  sortButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(30, 32, 32, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  sortIcon: { color: '#e3e2e2', fontSize: 16 },
  gridRow: { justifyContent: 'space-between', marginBottom: 16 },
  movieCard: { width: '48%', aspectRatio: 2 / 3, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1e2020' },
  posterImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  starIcon: { color: '#f5c518', fontSize: 12 },
  ratingText: { color: '#e3e2e2', fontSize: 12, fontWeight: '700' },
  movieTitle: { color: '#e3e2e2', fontSize: 16, fontWeight: '600' },
  movieYear: { color: '#d1c5ac', fontSize: 14, marginTop: 2 },
});