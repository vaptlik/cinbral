import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { MovieRow } from '../../components/MovieRow';
import { Movie } from '../../types';

// Dados fictícios para demonstração
const POPULAR_MOVIES: Movie[] = [
  { id: '1', title: 'Action Movie', posterUrl: 'https://via.placeholder.com/180x270', rating: 9.0, year: 2024, plot: '', cast: [], genres: [] },
  { id: '2', title: 'Thriller', posterUrl: 'https://via.placeholder.com/180x270', rating: 8.2, year: 2024, plot: '', cast: [], genres: [] },
  { id: '3', title: 'Epic History', posterUrl: 'https://via.placeholder.com/180x270', rating: 8.7, year: 2023, plot: '', cast: [], genres: [] },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.heroContainer}>
        <ImageBackground 
          source={{ uri: 'https://via.placeholder.com/600x800' }} 
          style={styles.heroImage}
        >
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ 8.4</Text>
              </View>
              <Text style={styles.heroTitle}>Dune: Part Two</Text>
              <View style={styles.genreContainer}>
                <Text style={styles.genreText}>Sci-Fi</Text>
                <Text style={styles.genreText}>Adventure</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <MovieRow title="Filmes Populares" movies={POPULAR_MOVIES} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  heroContainer: { width: '100%', height: 450 },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(18,20,20,0.6)' },
  heroContent: { padding: 20, marginBottom: 20 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  heroTitle: { color: '#FFF', fontSize: 40, fontWeight: '800', marginBottom: 16 },
  genreContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genreText: { color: '#D1C5AC', backgroundColor: '#1e2020', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  button: { backgroundColor: '#f5c518', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, alignSelf: 'flex-start' },
  buttonText: { color: '#3d2f00', fontWeight: 'bold' },
  mainContent: { marginTop: 10, paddingBottom: 80 }
});