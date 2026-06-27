import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Top AppBar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerLogo}>CINESTREAM</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          {/* Subtle background glow behind avatar */}
          <View style={styles.glowOverlay} />
          
          <View style={styles.avatarBorder}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.avatarImage} 
            />
          </View>
          
          <Text style={styles.userName}>Alex Mercer</Text>
          <Text style={styles.userEmail}>alex.mercer@cinestream.io</Text>

          {/* Quick Stats/Badges */}
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={[styles.badgeIcon, { color: '#f5c518' }]}>★</Text>
              <Text style={styles.badgeText}>PREMIUM</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={[styles.badgeIcon, { color: '#c8c6c5' }]}>👁</Text>
              <Text style={styles.badgeText}>142 WATCHED</Text>
            </View>
          </View>
        </View>

        {/* Menu Options Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>SETTINGS & PREFERENCES</Text>
          <View style={styles.cardContainer}>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconCircle}><Text style={styles.itemIcon}>👤</Text></View>
                <Text style={styles.itemText}>Account Settings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconCircle}><Text style={styles.itemIcon}>💳</Text></View>
                <Text style={styles.itemText}>My Plan</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconCircle}><Text style={styles.itemIcon}>⚙️</Text></View>
                <Text style={styles.itemText}>App Settings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SUPPORT</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconCircle}><Text style={styles.itemIcon}>❓</Text></View>
                <Text style={styles.itemText}>Help & Support</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Action */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121414' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: 'rgba(18, 20, 20, 0.8)', borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  headerButton: { padding: 4 }, // Corrigido 'pading' para 'padding'
  headerIcon: { color: '#f5c518', fontSize: 20 },
  headerLogo: { color: '#f5c518', fontSize: 22, fontWeight: '800', letterSpacing: -1 },
  scrollContent: { paddingBottom: 120 },
  profileHeader: { alignItems: 'center', paddingTop: 24, paddingBottom: 16 }, // Removido 'relative' inválido
  glowOverlay: { position: 'absolute', top: 24, width: 128, height: 128, backgroundColor: 'rgba(245, 197, 24, 0.1)', borderRadius: 64 }, // Removido 'blurRadius' do estilo
  avatarBorder: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: 'rgba(245, 197, 24, 0.2)', overflow: 'hidden', marginBottom: 16 },
  avatarImage: { width: '100%', height: '100%' }, // Removida ambiguidade para o componente Image
  userName: { color: '#e3e2e2', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  userEmail: { color: '#c8c6c5', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e2020', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, gap: 8 },
  badgeIcon: { fontSize: 14 },
  badgeText: { color: '#e3e2e2', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  menuSection: { paddingHorizontal: 20, marginTop: 16 },
  sectionTitle: { color: '#c8c6c5', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 },
  cardContainer: { backgroundColor: 'rgba(30, 32, 32, 0.5)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#38393a', alignItems: 'center', justifyContent: 'center' },
  itemIcon: { fontSize: 18 },
  itemText: { color: '#e3e2e2', fontSize: 16, fontWeight: '600' },
  chevron: { color: '#c8c6c5', fontSize: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginLeft: 72 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginHorizontal: 20, marginTop: 24, height: 54, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 180, 171, 0.3)', backgroundColor: 'rgba(255, 180, 171, 0.05)' },
  logoutIcon: { fontSize: 18 },
  logoutText: { color: '#ffb4ab', fontSize: 16, fontWeight: '600' }
});