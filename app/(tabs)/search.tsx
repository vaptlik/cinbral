import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
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

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega populares uma vez ao montar
  useEffect(() => {
    getPopularMovies().then(setPopular).catch(console.error);
  }, []);

  // Busca com debounce ao digitar
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await searchMovies(q);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const isSearching = query.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Busque filmes, séries..."
            placeholderTextColor="#8e8e93"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Estado: sem busca — mostra categorias + populares */}
      {!isSearching && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color }]}>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Populares</Text>
          <View style={styles.grid}>
            {popular.slice(0, 12).map(item => (
              <TouchableOpacity key={item.id} style={styles.resultCard} onPress={() => router.push(`/movie/${item.id}`)}>
                <Image source={{ uri: item.posterUrl }} style={styles.resultPoster} />
                <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.resultYear}>{item.year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Estado: buscando */}
      {isSearching && loading && (
        <View style={styles.centered}>
          <ActivityIndicator color="#f5c518" />
        </View>
      )}

      {isSearching && !loading && (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsTitle}>
              Resultados para <Text style={styles.highlightText}>"{query}"</Text>
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultCard} onPress={() => router.push(`/movie/${item.id}`)}>
              <Image source={{ uri: item.posterUrl }} style={styles.resultPoster} />
              <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.resultYear}>{item.year}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414', paddingTop: 60 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#1e2020' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e2020', borderRadius: 25, paddingHorizontal: 16, height: 48 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: '#E3E2E2', fontSize: 16 },
  clearIcon: { color: '#8e8e93', fontSize: 18, padding: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  sectionTitle: { color: '#E3E2E2', fontSize: 18, fontWeight: '600', marginLeft: 16, marginTop: 24, marginBottom: 12 },
  categoriesContent: { paddingLeft: 16, paddingRight: 8, gap: 12 },
  categoryCard: { width: 140, height: 90, borderRadius: 12, justifyContent: 'flex-end', padding: 12 },
  categoryName: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12, paddingBottom: 100 },
  gridRow: { justifyContent: 'space-between', marginBottom: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  resultsTitle: { color: '#E3E2E2', fontSize: 16, marginVertical: 16 },
  highlightText: { color: '#f5c518', fontWeight: 'bold' },
  emptyText: { color: '#b7b5b4', textAlign: 'center', marginTop: 40 },
  resultCard: { width: '47%' },
  resultPoster: { width: '100%', aspectRatio: 2 / 3, borderRadius: 12, backgroundColor: '#1e2020' },
  resultTitle: { color: '#E3E2E2', fontSize: 14, fontWeight: '600', marginTop: 8 },
  resultYear: { color: '#b7b5b4', fontSize: 12, marginTop: 2 },
});