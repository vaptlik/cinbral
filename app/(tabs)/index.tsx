import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MovieRow } from '../../components/MovieRow';
import { getPopularMovies, getTrendingMovies, getTopRatedMovies } from '../../services/api';
import { Movie } from '../../types';

export default function HomeScreen() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [hero, setHero] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [t, p, r] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);
        setTrending(t);
        setPopular(p);
        setTopRated(r);
        setHero(t[0] ?? null);
      } catch (e) {
        console.error('Erro ao carregar filmes:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {hero && (
        <TouchableOpacity onPress={() => router.push(`/movie/${hero.id}`)}>
          <ImageBackground source={{ uri: hero.backdropUrl }} style={styles.heroImage}>
            <View style={styles.heroGradient}>
              <View style={styles.heroContent}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {hero.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.heroTitle} numberOfLines={2}>{hero.title}</Text>
                <View style={styles.genreContainer}>
                  {hero.genres.slice(0, 2).map(g => (
                    <Text key={g} style={styles.genreText}>{g}</Text>
                  ))}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => router.push(`/movie/${hero.id}`)}>
                  <Text style={styles.buttonText}>Ver Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}

      <View style={styles.mainContent}>
        <MovieRow title="Em Alta" movies={trending} />
        <MovieRow title="Populares" movies={popular} />
        <MovieRow title="Mais Bem Avaliados" movies={topRated} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  centered: { flex: 1, backgroundColor: '#121414', alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: '100%', height: 450 },
  heroGradient: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(18,20,20,0.6)' },
  heroContent: { padding: 20, marginBottom: 20 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  heroTitle: { color: '#FFF', fontSize: 36, fontWeight: '800', marginBottom: 16 },
  genreContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genreText: { color: '#D1C5AC', backgroundColor: '#1e2020', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  button: { backgroundColor: '#f5c518', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, alignSelf: 'flex-start' },
  buttonText: { color: '#3d2f00', fontWeight: 'bold' },
  mainContent: { marginTop: 10, paddingBottom: 80 },
});