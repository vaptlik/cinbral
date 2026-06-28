import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMovieDetails, getTvDetails } from '../../services/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../services/storage';
import { Movie } from '../../types';

const MAX_WIDTH = 1100;

export default function MovieDetailsScreen() {
  const { width: winWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType?: string }>();
  const isSerie = mediaType === 'serie';

  const [movie, setMovie] = useState<Movie | null>(null);
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [data, inList] = await Promise.all([
          isSerie ? getTvDetails(id) : getMovieDetails(id),
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
  }, [id, isSerie]);

  async function toggleWatchlist() {
    if (!movie) return;
    if (saved) { await removeFromWatchlist(movie.id); }
    else { await addToWatchlist(movie); }
    setSaved(!saved);
  }

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#f5c518" /></View>
  );

  if (!movie) return (
    <View style={styles.centered}><Text style={{ color: '#fff' }}>Conteúdo não encontrado.</Text></View>
  );

  const type = movie.mediaType ?? (isSerie ? 'serie' : 'filme');

  const ActionButtons = () => (
    <View style={styles.actionRow}>
      <TouchableOpacity style={styles.playButton} onPress={() => {
        if (Platform.OS === 'web') {
          router.push({ pathname: '/player', params: { id: movie!.id, type } });
        } else {
          Linking.openURL(`https://superflixapi.lifestyle/${type}/${movie!.id}`);
        }
      }}>
        <Text style={styles.playIcon}>▶</Text>
        <Text style={styles.playButtonText}>Assistir Agora</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.listButton, saved && styles.listButtonActive]} onPress={toggleWatchlist}>
        <Text style={styles.listIcon}>{saved ? '✓' : '＋'}</Text>
      </TouchableOpacity>
    </View>
  );

  const MetaInfo = () => (
    <>
      <View style={styles.tagRow}>
        <Text style={styles.metaText}>{movie.year}</Text>
        {movie.duration && <><View style={styles.dividerDot} /><Text style={styles.metaText}>{movie.duration}</Text></>}
        <View style={styles.dividerDot} />
        <View style={styles.ratingBadge}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
        </View>
        {isSerie && <><View style={styles.dividerDot} /><View style={styles.typeBadge}><Text style={styles.typeBadgeText}>SÉRIE</Text></View></>}
      </View>
      {movie.genres.length > 0 && <Text style={styles.genreText}>{movie.genres.join(' • ')}</Text>}
    </>
  );

  const InfoContent = () => (
    <>
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <MetaInfo />
      <ActionButtons />
      <Text style={styles.sectionTitle}>Sinopse</Text>
      <Text style={styles.synopsisText}>{movie.plot}</Text>
      {movie.cast.length > 0 && <>
        <Text style={styles.sectionTitle}>Elenco Principal</Text>
        <Text style={styles.castText}>{movie.cast.join(' • ')}</Text>
      </>}
    </>
  );

  // ── Web layout: poster left + info right ─────────────────────────────────
  if (isWeb) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.webHero}>
            <Image source={{ uri: movie.backdropUrl || movie.posterUrl }} style={styles.webHeroBg} blurRadius={8} />
            <LinearGradient colors={['rgba(18,20,20,0.3)', 'rgba(18,20,20,0.85)', '#121414']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.webContent, { maxWidth: MAX_WIDTH }]}>
              <Image source={{ uri: movie.posterUrl }} style={styles.webPoster} />
              <View style={styles.webInfo}><InfoContent /></View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Mobile layout: backdrop top + info below ──────────────────────────────
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: movie.backdropUrl || movie.posterUrl }} style={styles.backdropImage} />
          <LinearGradient colors={['transparent', 'rgba(18,20,20,0.7)', '#121414']} style={styles.gradientOverlay} />
        </View>
        <View style={styles.metaContainer}><InfoContent /></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#121414' },
  centered:         { flex: 1, backgroundColor: '#121414', alignItems: 'center', justifyContent: 'center' },
  backButton:       { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(18,20,20,0.7)', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  backIcon:         { color: '#E3E2E2', fontSize: 20, fontWeight: 'bold' },
  webHero:          { minHeight: 500, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 },
  webHeroBg:        { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  webContent:       { flexDirection: 'row', alignItems: 'flex-start', gap: 40, paddingHorizontal: 40, width: '100%' },
  webPoster:        { width: 220, height: 330, borderRadius: 16, flexShrink: 0, marginTop: 60 },
  webInfo:          { flex: 1, paddingTop: 60 },
  scrollContent:    { paddingBottom: 40 },
  imageContainer:   { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#1e2020' },
  backdropImage:    { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay:  { ...StyleSheet.absoluteFillObject },
  metaContainer:    { paddingHorizontal: 20, marginTop: -20 },
  movieTitle:       { color: '#E3E2E2', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  tagRow:           { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  metaText:         { color: '#b7b5b4', fontSize: 14, fontWeight: '600' },
  dividerDot:       { width: 4, height: 4, borderRadius: 2, backgroundColor: '#474746' },
  ratingBadge:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#343535', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, gap: 4 },
  starIcon:         { color: '#f5c518', fontSize: 12 },
  ratingText:       { color: '#f5c518', fontSize: 12, fontWeight: '700' },
  typeBadge:        { backgroundColor: '#f5c518', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeBadgeText:    { color: '#3d2f00', fontSize: 11, fontWeight: '800' },
  genreText:        { color: '#d1c5ac', fontSize: 14, marginBottom: 24 },
  actionRow:        { flexDirection: 'row', gap: 12, marginBottom: 28 },
  playButton:       { flex: 1, height: 50, backgroundColor: '#f5c518', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  playIcon:         { color: '#3d2f00', fontSize: 16 },
  playButtonText:   { color: '#3d2f00', fontSize: 16, fontWeight: '700' },
  listButton:       { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1e2020', borderWidth: 1, borderColor: '#343535', alignItems: 'center', justifyContent: 'center' },
  listButtonActive: { backgroundColor: '#343535', borderColor: '#f5c518' },
  listIcon:         { color: '#E3E2E2', fontSize: 20 },
  sectionTitle:     { color: '#E3E2E2', fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  synopsisText:     { color: '#b7b5b4', fontSize: 15, lineHeight: 22 },
  castText:         { color: '#d1c5ac', fontSize: 14, lineHeight: 20, marginBottom: 20 },
});