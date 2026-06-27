import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { router } from 'expo-router';

// Mock de Categorias Expandido
const CATEGORIES = [
  { id: '1', name: 'Ação', color: ['#7f1d1d', '#dc2626'], image: 'https://via.placeholder.com/150/7f1d1d' },
  { id: '2', name: 'Comédia', color: ['#a16207', '#eab308'], image: 'https://via.placeholder.com/150/a16207' },
  { id: '3', name: 'Drama', color: ['#1e3a8a', '#2563eb'], image: 'https://via.placeholder.com/150/1e3a8a' },
  { id: '4', name: 'Suspense', color: ['#581c87', '#1f2937'], image: 'https://via.placeholder.com/150/581c87' },
  { id: '5', name: 'Ficção Científica', color: ['#14532d', '#16a34a'], image: 'https://via.placeholder.com/150/14532d' },
  { id: '6', name: 'Terror', color: ['#000000', '#450a0a'], image: 'https://via.placeholder.com/150/000000' },
];

// Mock de Resultados da Busca
const SEARCH_RESULTS = [
  { id: '1', title: 'Cybernetic Echoes', year: '2024', posterUrl: 'https://via.placeholder.com/180x270' },
  { id: '2', title: 'Sands of Time', year: '2023', posterUrl: 'https://via.placeholder.com/180x270' },
  { id: '3', title: 'The Verdict', year: '2022', posterUrl: 'https://via.placeholder.com/180x270' },
  { id: '4', title: 'Whispering Pines', year: '2024', posterUrl: 'https://via.placeholder.com/180x270' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Search Header Input */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Busque por filmes, séries ou atores..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Condicional State Render */}
      {searchQuery.trim().length === 0 ? (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Categorias Populares com Rolagem Horizontal */}
          <Text style={styles.sectionTitle}>Categorias Populares</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity key={category.id} style={[styles.categoryCard, { backgroundColor: category.color[0] }]}>
               {/* Linha 60 corrigida no search.tsx */}
              <Image 
                source={{ uri: category.image }} 
                style={[styles.categoryImage, { opacity: 0.4 }]} 
              />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Buscas Recentes */}
          <Text style={styles.sectionTitle}>Buscas Recentes</Text>
          <View style={styles.recentContainer}>
            <TouchableOpacity style={styles.recentItem} onPress={() => setSearchQuery('O Poderoso Chefão')}>
              <Text style={styles.historyIcon}>🕒</Text>
              <Text style={styles.recentText}>O Poderoso Chefão</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentItem} onPress={() => setSearchQuery('Christopher Nolan')}>
              <Text style={styles.historyIcon}>🕒</Text>
              <Text style={styles.recentText}>Diretor Christopher Nolan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* Results State Matrix Grid */
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            Resultados para "<Text style={styles.highlightText}>{searchQuery}</Text>"
          </Text>
          <FlatList
            data={SEARCH_RESULTS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.resultCard} 
                onPress={() => router.push(`/movie/${item.id}`)}
              >
                <Image source={{ uri: item.posterUrl }} style={styles.resultPoster} />
                <Text style={styles.resultMovieTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.resultMovieYear}>{item.year}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
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
  scrollContainer: { flex: 1 },
  sectionTitle: { color: '#E3E2E2', fontSize: 18, fontWeight: '600', marginLeft: 16, marginTop: 24, marginBottom: 12 },
  categoriesContent: { paddingLeft: 16, paddingRight: 8, gap: 12 },
  categoryCard: { width: 140, height: 90, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end', padding: 12, marginRight: 4 },
  categoryImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  categoryName: { color: '#FFF', fontWeight: '600', fontSize: 16, zIndex: 1 },
  recentContainer: { paddingHorizontal: 16, gap: 8 },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  historyIcon: { fontSize: 16, marginRight: 12, color: '#b7b5b4' },
  recentText: { color: '#b7b5b4', fontSize: 16 },
  resultsContainer: { flex: 1, paddingHorizontal: 16 },
  resultsTitle: { color: '#E3E2E2', fontSize: 16, marginVertical: 16 },
  highlightText: { color: '#f5c518', fontWeight: 'bold' },
  gridRow: { justifyContent: 'space-between', marginBottom: 16 },
  resultCard: { width: '48%' },
  resultPoster: { width: '100%', aspectRatio: 2 / 3, borderRadius: 12, backgroundColor: '#1e2020' },
  resultMovieTitle: { color: '#E3E2E2', fontSize: 14, fontWeight: '600', marginTop: 8 },
  resultMovieYear: { color: '#b7b5b4', fontSize: 12, marginTop: 2 },
});