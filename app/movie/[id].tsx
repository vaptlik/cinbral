import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock de dados detalhados (Em um cenário real, você buscaria isso usando o {id})
const MOVIE_DETAILS = {
  id: '1',
  title: 'Interstellar',
  year: '2014',
  duration: '2h 49min',
  rating: '8.7',
  genre: 'Ficção Científica, Drama',
  synopsis: 'As reservas naturais da Terra estão se esgotando e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie humana.',
  backdrop: 'https://via.placeholder.com/600x400', // Imagem de fundo horizontal
  cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine']
};

export default function MovieDetailsScreen() {
  // Captura o ID enviado pela rota anterior
  const { id } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <View style={styles.container}>
      {/* Botão de Voltar Flutuante */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Seção do Topo: Imagem de Destaque + Gradiente */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: MOVIE_DETAILS.backdrop }} style={styles.backdropImage} />
          <LinearGradient
            colors={['transparent', 'rgba(18, 20, 20, 0.6)', '#121414']}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Informações Principais */}
        <View style={styles.metaContainer}>
          <Text style={styles.movieTitle}>{MOVIE_DETAILS.title}</Text>
          
          {/* Tags de Detalhes (Ano, Duração, Nota) */}
          <View style={styles.tagRow}>
            <Text style={styles.yearText}>{MOVIE_DETAILS.year}</Text>
            <View style={styles.dividerDot} />
            <Text style={styles.durationText}>{MOVIE_DETAILS.duration}</Text>
            <View style={styles.dividerDot} />
            <View style={styles.ratingBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>{MOVIE_DETAILS.rating}</Text>
            </View>
          </View>

          <Text style={styles.genreText}>{MOVIE_DETAILS.genre}</Text>

          {/* Botões de Ação Principais */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
              <Text style={styles.playButtonText}>Assistir Agora</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.listButton, isSaved && styles.listButtonActive]} 
              onPress={() => setIsSaved(!isSaved)}
            >
              <Text style={styles.listIcon}>{isSaved ? '✓' : '＋'}</Text>
            </TouchableOpacity>
          </View>

          {/* Sinopse */}
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.synopsisText}>{MOVIE_DETAILS.synopsis}</Text>

          {/* Elenco / Detalhes Adicionais */}
          <Text style={styles.sectionTitle}>Elenco Principal</Text>
          <Text style={styles.castText}>
            {MOVIE_DETAILS.cast.join(' • ')}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(18, 20, 20, 0.7)', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  backIcon: { color: '#E3E2E2', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  imageContainer: { width: width, height: width * 0.7, backgroundColor: '#1e2020' },
  backdropImage: { width: '100%', height: '100%', objectFit: 'cover' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  metaContainer: { paddingHorizontal: 20, marginTop: -20 },
  movieTitle: { color: '#E3E2E2', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  yearText: { color: '#b7b5b4', fontSize: 14, fontWeight: '600' },
  durationText: { color: '#b7b5b4', fontSize: 14, fontWeight: '600' },
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
  castText: { color: '#d1c5ac', fontSize: 14, lineHeight: 20, marginBottom: 20 }
});