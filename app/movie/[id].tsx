import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMovieDetails } from '../../services/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../services/storage';
import { Movie } from '../../types';

const { width } = Dimensions.get('window');

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [data, inList] = await Promise.all([
          getMovieDetails(id),
          isInWatchlist(id),
        ]);
        setMovie(data);
        setSaved(inList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function toggleWatchlist() {
    if (!movie) return;
    if (saved) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
    setSaved(!saved);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#fff' }}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: movie.backdropUrl || movie.posterUrl }} style={styles.backdropImage} />
          <LinearGradient
            colors={['transparent', 'rgba(18,20,20,0.7)', '#121414']}
            style={styles.gradientOverlay}
          />
        </View>

        <View style={styles.metaContainer}>
          <Text style={styles.movieTitle}>{movie.title}</Text>

          <View style={styles.tagRow}>
            <Text style={styles.metaText}>{movie.year}</Text>
            {movie.duration && <>
              <View style={styles.dividerDot} />
              <Text style={styles.metaText}>{movie.duration}</Text>
            </>}
            <View style={styles.dividerDot} />
            <View style={styles.ratingBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
            </View>
          </View>

          {movie.genres.length > 0 && (
            <Text style={styles.genreText}>{movie.genres.join(' • ')}</Text>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.playButton} onPress={() => {
              if (Platform.OS === 'web') {
                router.push({ pathname: '/player', params: { id: movie!.id, type: 'filme' } });
              } else {
                Linking.openURL(`https://superflixapi.lifestyle/filme/${movie!.id}`);
              }
            }}>
              <Text style={styles.playIcon}>▶</Text>
              <Text style={styles.playButtonText}>Assistir Agora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.listButton, saved && styles.listButtonActive]}
              onPress={toggleWatchlist}
            >
              <Text style={styles.listIcon}>{saved ? '✓' : '＋'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.synopsisText}>{movie.plot}</Text>

          {movie.cast.length > 0 && <>
            <Text style={styles.sectionTitle}>Elenco Principal</Text>
            <Text style={styles.castText}>{movie.cast.join(' • ')}</Text>
          </>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  centered: { flex: 1, backgroundColor: '#121414', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(18,20,20,0.7)', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  backIcon: { color: '#E3E2E2', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  imageContainer: { width, height: width * 0.65, backgroundColor: '#1e2020' },
  backdropImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  metaContainer: { paddingHorizontal: 20, marginTop: -20 },
  movieTitle: { color: '#E3E2E2', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { color: '#b7b5b4', fontSize: 14, fontWeight: '600' },
  dividerDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#474746', marginHorizontal: 10 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#343535', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, gap: 4 },
  starIcon: { color: '#f5c518', fontSize: 12 },
  ratingText: { color: '#f5c518', fontSize: 12, fontWeight: '700' },
  genreText: { color: '#d1c5ac', fontSize: 14, marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  playButton: { flex: 1, height: 50, backgroundColor: '#f5c518', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  playIcon: { color: '#3d2f00', fontSize: 16 },
  playButtonText: { color: '#3d2f00', fontSize: 16, fontWeight: '700' },
  listButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1e2020', borderWidth: 1, borderColor: '#343535', alignItems: 'center', justifyContent: 'center' },
  listButtonActive: { backgroundColor: '#343535', borderColor: '#f5c518' },
  listIcon: { color: '#E3E2E2', fontSize: 20 },
  sectionTitle: { color: '#E3E2E2', fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  synopsisText: { color: '#b7b5b4', fontSize: 15, lineHeight: 22 },
  castText: { color: '#d1c5ac', fontSize: 14, lineHeight: 20, marginBottom: 20 },
});