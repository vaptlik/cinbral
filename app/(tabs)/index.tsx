import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  ImageBackground, ActivityIndicator, useWindowDimensions, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MovieRow } from '../../components/MovieRow';
import {
  getPopularMovies, getTrendingMovies, getTopRatedMovies,
  getActionMovies, getComedyMovies, getHorrorMovies,
  getSciFiMovies, getAnimationMovies,
} from '../../services/api';
import { Movie } from '../../types';

const HERO_HEIGHT = 450;
const AUTO_SCROLL_INTERVAL = 5000;

export default function HomeScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [rows, setRows] = useState<{ title: string; movies: Movie[] }[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingRows, setLoadingRows] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef  = useRef(0);

  // 1ª fase: carrega só os trending (hero) rapidinho
  useEffect(() => {
    getTrendingMovies().then(t => {
      setHeroMovies(t.slice(0, 5));
      setLoadingHero(false);
    }).catch(console.error);
  }, []);

  // 2ª fase: carrega as linhas em segundo plano depois do hero
  useEffect(() => {
    if (loadingHero) return; // espera o hero carregar primeiro
    async function loadRows() {
      try {
        const [p, r, a, c, h, s, an] = await Promise.all([
          getPopularMovies(), getTopRatedMovies(),
          getActionMovies(), getComedyMovies(), getHorrorMovies(),
          getSciFiMovies(), getAnimationMovies(),
        ]);
        setRows([
          { title: 'Populares',          movies: p  },
          { title: 'Mais Bem Avaliados', movies: r  },
          { title: 'Ação',               movies: a  },
          { title: 'Comédia',            movies: c  },
          { title: 'Terror',             movies: h  },
          { title: 'Ficção Científica',  movies: s  },
          { title: 'Animação',           movies: an },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRows(false);
      }
    }
    loadRows();
  }, [loadingHero]);

  const goTo = useCallback((idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * SCREEN_WIDTH, animated: true });
    indexRef.current = idx;
    setHeroIndex(idx);
  }, [SCREEN_WIDTH]);

  // Auto scroll — só inicia depois que hero carregou
  useEffect(() => {
    if (heroMovies.length === 0) return;
    timerRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % heroMovies.length;
      goTo(next);
    }, AUTO_SCROLL_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [heroMovies, goTo]);

  if (loadingHero) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
    >
      {/* ── Hero Carrossel ── */}
      <View style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={32}
          decelerationRate="fast"
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            indexRef.current = idx;
            setHeroIndex(idx);
          }}
        >
          {heroMovies.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/movie/${item.id}`)}
            >
              <ImageBackground
                source={{ uri: item.backdropUrl }}
                style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}
                fadeDuration={200}
              >
                <View style={styles.heroGradient}>
                  <View style={styles.heroContent}>
                    <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
                    <Text style={styles.heroTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.genreContainer}>
                      {item.genres.slice(0, 2).map((g: string) => (
                        <Text key={g} style={styles.genreText}>{g}</Text>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => router.push(`/movie/${item.id}`)}>
                      <Text style={styles.buttonText}>Ver Detalhes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {heroMovies.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[styles.dot, i === heroIndex && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Categorias ── */}
      <View style={styles.mainContent}>
        <MovieRow title="Em Alta" movies={heroMovies} />
        {loadingRows ? (
          <ActivityIndicator color="#f5c518" style={{ marginTop: 40 }} />
        ) : (
          rows.map(row => (
            <MovieRow key={row.title} title={row.title} movies={row.movies} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#121414' },
  centered:       { flex: 1, backgroundColor: '#121414', alignItems: 'center', justifyContent: 'center' },
  heroGradient:   { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(18,20,20,0.45)' },
  heroContent:    { padding: 20, marginBottom: 48 },
  ratingText:     { color: '#FFF', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  heroTitle:      { color: '#FFF', fontSize: 34, fontWeight: '800', marginBottom: 16 },
  genreContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genreText:      { color: '#D1C5AC', backgroundColor: 'rgba(30,32,32,0.8)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  button:         { backgroundColor: '#f5c518', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, alignSelf: 'flex-start' },
  buttonText:     { color: '#3d2f00', fontWeight: 'bold' },
  dotsContainer:  { position: 'absolute', bottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot:            { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive:      { width: 20, backgroundColor: '#f5c518' },
  mainContent:    { marginTop: 10, paddingBottom: 80 },
});