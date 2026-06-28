import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { searchMovies, getPopularMovies } from '../../services/api';
import { Movie } from '../../types';

const CATEGORIES = [
  { id: '28',  name: 'Ação',              color: '#7f1d1d' },
  { id: '35',  name: 'Comédia',           color: '#a16207' },
  { id: '18',  name: 'Drama',             color: '#1e3a8a' },
  { id: '53',  name: 'Suspense',          color: '#581c87' },
  { id: '878', name: 'Ficção Científica', color: '#14532d' },
  { id: '27',  name: 'Terror',            color: '#1c1917' },
];

type FilterType = 'todos' | 'filmes' | 'series';

const MAX_WIDTH = 900;

export default function SearchScreen() {
  const { width: winWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(winWidth, MAX_WIDTH) : winWidth;

  const numCols = isWeb ? Math.floor(contentWidth / 140) : 2;
  const cardWidth = isWeb
    ? Math.floor((contentWidth - 32 - (numCols - 1) * 12) / numCols)
    : (winWidth - 32 - 12) / 2;

  // Estados de controle da busca e do Debounce
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  useEffect(() => {
    getPopularMovies().then(setPopular).catch(console.error);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    setLoading(true);
    try {
      setResults(await searchMovies(q));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Controla a pausa na digitação (Aguardará 600ms antes de disparar tudo)
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery('');
      setResults([]);
      setActiveFilter('todos');
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      doSearch(query);
    }, 600);

    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // A tela só muda para o modo pesquisa se o estado de pausa "debouncedQuery" tiver texto
  const isSearching = debouncedQuery.trim().length > 0;

  // Lógica de filtragem com correção do tipo para "filme"
  const getFilteredResults = () => {
    if (activeFilter === 'filmes') {
      return results.filter(m => m.mediaType === 'filme');
    }
    if (activeFilter === 'series') {
      return results.filter(m => m.mediaType === 'serie');
    }
    return results;
  };

  const MovieCardItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={[styles.resultCard, { width: cardWidth }]}
      onPress={() => {
        if (item.mediaType === 'serie') {
          router.push({ pathname: '/serie/[id]', params: { id: item.id } });
        } else {
          router.push({ pathname: '/movie/[id]', params: { id: item.id, mediaType: 'filme' } });
        }
      }}
    >
      <Image source={{ uri: item.posterUrl }} style={[styles.resultPoster, { width: cardWidth, height: cardWidth * 1.5 }]} />
      <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.resultYear}>{item.year}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho de Busca */}
      <View style={[styles.header, isWeb && { alignItems: 'center' }]}>
        <View style={[styles.searchBar, isWeb && { maxWidth: MAX_WIDTH, width: '100%' }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Busque filmes, séries..."
            placeholderTextColor="#8e8e93"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (!text.trim()) setDebouncedQuery('');
            }}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setDebouncedQuery(''); }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pílulas de Filtros (Estilo WhatsApp) */}
        {isSearching && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={[styles.filterContainer, isWeb && { maxWidth: MAX_WIDTH, width: '100%' }]}
          >
            {(['todos', 'filmes', 'series'] as FilterType[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  activeFilter === filter && styles.filterPillActive
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Estado 1: Tela Inicial (Categorias e Populares) */}
      {!isSearching && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={isWeb && { alignItems: 'center' }}>
          <View style={isWeb ? { width: MAX_WIDTH } : { width: '100%' }}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color }]}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Populares</Text>
            <View style={[styles.grid, { paddingHorizontal: 16 }]}>
              {popular.slice(0, 20).map(item => (
                <MovieCardItem key={item.id} item={item} />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Estado 2: Carregando Busca */}
      {query.trim().length > 0 && loading && (
        <View style={styles.centered}>
          <ActivityIndicator color="#f5c518" />
        </View>
      )}

      {/* Estado 3: Exibição dos Resultados Filtrados */}
      {isSearching && !loading && (
        <ScrollView contentContainerStyle={[styles.listContent, isWeb && { alignItems: 'center' }]}>
          <View style={isWeb ? { width: MAX_WIDTH } : { width: '100%' }}>
            <Text style={styles.resultsTitle}>
              Resultados para <Text style={styles.highlightText}>"{debouncedQuery}"</Text>
            </Text>
            
            <View style={[styles.grid, { paddingHorizontal: 16 }]}>
              {getFilteredResults().map(item => (
                <MovieCardItem key={item.id} item={item} />
              ))}
            </View>

            {getFilteredResults().length === 0 && (
              <Text style={styles.emptyText}>Nenhum conteúdo nesta categoria.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414', paddingTop: 60 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#1e2020', gap: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e2020', borderRadius: 25, paddingHorizontal: 16, height: 48 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: '#E3E2E2', fontSize: 16 },
  clearIcon: { color: '#8e8e93', fontSize: 18, padding: 4 },
  
  // Pílulas de filtro
  filterContainer: { flexDirection: 'row', gap: 10, marginTop: 4 },
  filterPill: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1e2020' },
  filterPillActive: { backgroundColor: '#2196F3' }, // Azul idêntico à imagem enviada
  filterText: { color: '#8e8e93', fontSize: 15, fontWeight: '600' },
  filterTextActive: { color: '#FFF', fontWeight: '700' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  sectionTitle: { color: '#E3E2E2', fontSize: 18, fontWeight: '600', marginLeft: 16, marginTop: 24, marginBottom: 12 },
  categoriesContent: { paddingLeft: 16, paddingRight: 8, gap: 12 },
  categoryCard: { width: 140, height: 90, borderRadius: 12, justifyContent: 'flex-end', padding: 12 },
  categoryName: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 100 },
  listContent: { paddingBottom: 100 },
  resultsTitle: { color: '#E3E2E2', fontSize: 16, marginVertical: 16, paddingHorizontal: 16 },
  highlightText: { color: '#f5c518', fontWeight: 'bold' },
  emptyText: { color: '#b7b5b4', textAlign: 'center', marginTop: 40 },
  resultCard: { marginBottom: 4 },
  resultPoster: { borderRadius: 12, backgroundColor: '#1e2020' },
  resultTitle: { color: '#E3E2E2', fontSize: 14, fontWeight: '600', marginTop: 8 },
  resultYear: { color: '#b7b5b4', fontSize: 12, marginTop: 2 },
});