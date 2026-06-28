import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, useWindowDimensions, FlatList, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getTvDetails, getTvSeasons, getTvSeasonEpisodes, TmdbEpisode, TmdbSeason } from '../../services/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../services/storage';
import { Movie } from '../../types';

const IMG_W500 = 'https://image.tmdb.org/t/p/w500';
const IMG_STILL = 'https://image.tmdb.org/t/p/w300';
const MAX_WIDTH = 1100;

export default function SerieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: winWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const [serie, setSerie]           = useState<Movie | null>(null);
  const [seasons, setSeasons]       = useState<TmdbSeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes]     = useState<TmdbEpisode[]>([]);
  const [saved, setSaved]           = useState(false);
  const [loading, setLoading]       = useState(true);
  const [epLoading, setEpLoading]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [data, seasonsData, inList] = await Promise.all([
          getTvDetails(id),
          getTvSeasons(id),
          isInWatchlist(id),
        ]);
        setSerie(data);
        setSaved(inList);
        // Filtra temporadas válidas (sem season 0 = especiais)
        const validSeasons = seasonsData.seasons.filter(s => s.season_number > 0);
        setSeasons(validSeasons);
        if (validSeasons.length > 0) setSelectedSeason(validSeasons[0].season_number);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const loadEpisodes = useCallback(async (season: number) => {
    setEpLoading(true);
    try {
      const eps = await getTvSeasonEpisodes(id, season);
      setEpisodes(eps);
    } catch (e) {
      console.error(e);
    } finally {
      setEpLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (selectedSeason) loadEpisodes(selectedSeason);
  }, [selectedSeason, loadEpisodes]);

  async function toggleWatchlist() {
    if (!serie) return;
    if (saved) { await removeFromWatchlist(serie.id); } else { await addToWatchlist(serie); }
    setSaved(!saved);
  }

  function watchEpisode(ep: number) {
    const url = `https://superflixapi.lifestyle/serie/${id}/${selectedSeason}/${ep}`;
    
    if (Platform.OS === 'web') {
      router.push({ pathname: '/player', params: { id, type: 'serie', season: selectedSeason, episode: ep } });
    } else {
      Linking.openURL(url);
    }
  }

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#f5c518" /></View>
  );
  if (!serie) return (
    <View style={styles.centered}><Text style={{ color: '#fff' }}>Série não encontrada.</Text></View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={[styles.hero, isWeb && { alignItems: 'center' }]}>
          <Image source={{ uri: serie.backdropUrl || serie.posterUrl }} style={styles.heroBg} blurRadius={isWeb ? 8 : 0} />
          <LinearGradient
            colors={isWeb ? ['rgba(18,20,20,0.3)', 'rgba(18,20,20,0.85)', '#121414'] : ['transparent', 'rgba(18,20,20,0.8)', '#121414']}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={[styles.heroContent, isWeb && { maxWidth: MAX_WIDTH, flexDirection: 'row', gap: 40, paddingHorizontal: 40 }]}>
            <Image source={{ uri: serie.posterUrl }} style={[styles.poster, isWeb && styles.posterWeb]} />

            <View style={styles.info}>
              <View style={styles.serieBadge}><Text style={styles.serieBadgeText}>SÉRIE</Text></View>
              <Text style={styles.title}>{serie.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{serie.year}</Text>
                {serie.duration && <><View style={styles.dot} /><Text style={styles.metaText}>{serie.duration}</Text></>}
                <View style={styles.dot} />
                <Text style={styles.ratingText}>★ {serie.rating.toFixed(1)}</Text>
              </View>
              {serie.genres.length > 0 && <Text style={styles.genres}>{serie.genres.join(' • ')}</Text>}

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.watchBtn} onPress={() => watchEpisode(1)}>
                  <Text style={styles.watchIcon}>▶</Text>
                  <Text style={styles.watchText}>Assistir E1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.listBtn, saved && styles.listBtnActive]} onPress={toggleWatchlist}>
                  <Text style={styles.listIcon}>{saved ? '✓' : '＋'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.synopsis}>{serie.plot}</Text>
              {serie.cast.length > 0 && <>
                <Text style={styles.sectionTitle}>Elenco</Text>
                <Text style={styles.cast}>{serie.cast.join(' • ')}</Text>
              </>}
            </View>
          </View>
        </View>

        {/* ── Seletor de Temporadas ── */}
        <View style={[styles.section, isWeb && { alignItems: 'center' }]}>
          <View style={isWeb ? { width: '100%', maxWidth: MAX_WIDTH, paddingHorizontal: 20 } : {}}>
            <Text style={styles.sectionTitle}>Temporadas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seasonsRow}>
              {seasons.map(s => (
                <TouchableOpacity
                  key={s.season_number}
                  style={[styles.seasonBtn, selectedSeason === s.season_number && styles.seasonBtnActive]}
                  onPress={() => setSelectedSeason(s.season_number)}
                >
                  <Text style={[styles.seasonBtnText, selectedSeason === s.season_number && styles.seasonBtnTextActive]}>
                    T{s.season_number}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Episódios ── */}
            <Text style={styles.sectionTitle}>
              Episódios — {seasons.find(s => s.season_number === selectedSeason)?.name ?? `Temporada ${selectedSeason}`}
            </Text>

            {epLoading ? (
              <ActivityIndicator color="#f5c518" style={{ marginTop: 20 }} />
            ) : (
              episodes.map(ep => (
                <TouchableOpacity key={ep.episode_number} style={styles.epCard} onPress={() => watchEpisode(ep.episode_number)}>
                  {ep.still_path ? (
                    <Image source={{ uri: `${IMG_STILL}${ep.still_path}` }} style={styles.epThumb} />
                  ) : (
                    <View style={[styles.epThumb, styles.epThumbPlaceholder]}>
                      <Text style={{ color: '#474746', fontSize: 24 }}>▶</Text>
                    </View>
                  )}
                  <View style={styles.epInfo}>
                    <Text style={styles.epNumber}>Ep. {ep.episode_number}</Text>
                    <Text style={styles.epTitle} numberOfLines={1}>{ep.name}</Text>
                    {ep.runtime && <Text style={styles.epMeta}>{ep.runtime}min</Text>}
                    <Text style={styles.epOverview} numberOfLines={2}>{ep.overview || 'Sem descrição.'}</Text>
                  </View>
                  <View style={styles.epPlayBtn}>
                    <Text style={styles.epPlayIcon}>▶</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#121414' },
  centered:           { flex: 1, backgroundColor: '#121414', alignItems: 'center', justifyContent: 'center' },
  backButton:         { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(18,20,20,0.7)', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  backIcon:           { color: '#E3E2E2', fontSize: 20, fontWeight: 'bold' },
  hero:               { minHeight: 400, justifyContent: 'flex-end', paddingBottom: 30 },
  heroBg:             { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  heroContent:        { paddingHorizontal: 20, paddingTop: 80 },
  poster:             { width: 120, height: 180, borderRadius: 12, marginBottom: 16 },
  posterWeb:          { width: 200, height: 300, marginTop: 40, flexShrink: 0 },
  info:               { flex: 1 },
  serieBadge:         { backgroundColor: '#f5c518', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8 },
  serieBadgeText:     { color: '#3d2f00', fontSize: 11, fontWeight: '800' },
  title:              { color: '#E3E2E2', fontSize: 26, fontWeight: '800', marginBottom: 10 },
  metaRow:            { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  metaText:           { color: '#b7b5b4', fontSize: 13 },
  dot:                { width: 4, height: 4, borderRadius: 2, backgroundColor: '#474746' },
  ratingText:         { color: '#f5c518', fontSize: 13, fontWeight: '700' },
  genres:             { color: '#d1c5ac', fontSize: 13, marginBottom: 20 },
  actionRow:          { flexDirection: 'row', gap: 12, marginBottom: 16 },
  watchBtn:           { flex: 1, height: 48, backgroundColor: '#f5c518', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  watchIcon:          { color: '#3d2f00', fontSize: 14 },
  watchText:          { color: '#3d2f00', fontSize: 15, fontWeight: '700' },
  listBtn:            { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e2020', borderWidth: 1, borderColor: '#343535', alignItems: 'center', justifyContent: 'center' },
  listBtnActive:      { backgroundColor: '#343535', borderColor: '#f5c518' },
  listIcon:           { color: '#E3E2E2', fontSize: 20 },
  synopsis:           { color: '#b7b5b4', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  cast:               { color: '#d1c5ac', fontSize: 13, lineHeight: 20 },
  section:            { paddingBottom: 80 },
  sectionTitle:       { color: '#E3E2E2', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 20 },
  seasonsRow:         { gap: 8, paddingBottom: 4 },
  seasonBtn:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e2020', borderWidth: 1, borderColor: '#343535' },
  seasonBtnActive:    { backgroundColor: '#f5c518', borderColor: '#f5c518' },
  seasonBtnText:      { color: '#b7b5b4', fontWeight: '600' },
  seasonBtnTextActive:{ color: '#3d2f00' },
  epCard:             { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e2020', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  epThumb:            { width: 120, height: 70, resizeMode: 'cover' },
  epThumbPlaceholder: { backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  epInfo:             { flex: 1, padding: 10 },
  epNumber:           { color: '#b7b5b4', fontSize: 11, marginBottom: 2 },
  epTitle:            { color: '#E3E2E2', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  epMeta:             { color: '#b7b5b4', fontSize: 11, marginBottom: 4 },
  epOverview:         { color: '#8e8e93', fontSize: 12, lineHeight: 16 },
  epPlayBtn:          { paddingHorizontal: 14 },
  epPlayIcon:         { color: '#f5c518', fontSize: 20 },
});