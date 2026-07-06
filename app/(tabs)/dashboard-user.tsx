import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  {
    label: 'Scan',
    icon: 'scan-outline',
    subtitle: 'Discover a new look',
    route: '/scan' as const,
    color: '#C9A96E',
  },
  {
    label: 'Saved',
    icon: 'bookmark-outline',
    subtitle: 'Your favorite styles',
    route: '/recommendations' as const,
    color: '#8B6FBE',
  },
  {
    label: 'Booking',
    icon: 'calendar-outline',
    subtitle: 'Salon appointments',
    route: '/salons' as const,
    color: '#4ECDC4',
  },
] as const;

const STATS = [
  { label: 'Scans', value: '8', accent: '#C9A96E' },
  { label: 'Matches', value: '24', accent: '#4ECDC4' },
  { label: 'Booked', value: '2', accent: '#8B6FBE' },
];

const RECENT_SCANS = [
  { title: 'Voluminous Waves', match: 92, date: 'Today', status: 'Recommended' },
  { title: 'Soft Curtain Fringe', match: 86, date: 'Yesterday', status: 'Saved' },
  { title: 'Sleek Side Part', match: 79, date: '2 days ago', status: 'Review' },
];

export default function UserDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />

      <LinearGradient
        colors={['#100F14', '#0C0C10']}
        style={styles.backgroundGradient}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topCard}>
          <View style={styles.topHeader}>
            <View>
              <Text style={styles.greeting}>Good afternoon</Text>
              <Text style={styles.title}>Lara, ready for a new style?</Text>
            </View>
            <View style={styles.badge}> 
              <Text style={styles.badgeText}>Pro</Text>
            </View>
          </View>

          <Text style={styles.heroCopy}>AI-powered recommendations tailored to your face shape and latest salon scans.</Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>Oval</Text>
              <Text style={styles.heroStatLabel}>Face shape</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>91%</Text>
              <Text style={styles.heroStatLabel}>Confidence</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.quickAction, { borderColor: action.color }]}
              onPress={() => router.push(action.route)}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}22` }]}> 
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{action.label}</Text>
                <Text style={styles.actionCopy}>{action.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top recommendation</Text>
            <TouchableOpacity onPress={() => router.push('/recommendations')}>
              <Text style={styles.sectionAction}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recommendationCard}>
            <View style={styles.recommendationMeta}>
              <Text style={styles.recommendationLabel}>Trending</Text>
              <Text style={styles.recommendationTitle}>Textured Pixie Cut</Text>
              <Text style={styles.recommendationCopy}>Short, layered texture that frames the face and boosts definition.</Text>
            </View>
            <View style={styles.recommendationFooter}>
              <View style={styles.matchBadge}>
                <Ionicons name="sparkles-outline" size={14} color="#F8E6D0" />
                <Text style={styles.matchText}>94% match</Text>
              </View>
              <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/recommendations')}>
                <Text style={styles.viewButtonText}>View style</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: item.accent }]}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent scans</Text>
            <TouchableOpacity onPress={() => router.push('/recommendations')}>
              <Text style={styles.sectionAction}>Manage</Text>
            </TouchableOpacity>
          </View>

          {RECENT_SCANS.map((scan) => (
            <View key={scan.title} style={styles.scanRow}>
              <View style={styles.scanInfo}>
                <Text style={styles.scanTitle}>{scan.title}</Text>
                <Text style={styles.scanSubtitle}>{scan.date} · {scan.status}</Text>
              </View>
              <View style={styles.scanMatch}>
                <Text style={styles.scanMatchPct}>{scan.match}%</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090D' },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  scroll: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 30 },
  topCard: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: '#15151B',
    borderWidth: 1,
    borderColor: '#212129',
    marginBottom: 20,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: { color: '#C9C7D0', fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: '#F4F0E8', fontSize: 26, lineHeight: 34, fontWeight: '800', marginTop: 6, maxWidth: width * 0.65 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#C9A96E33',
  },
  badgeText: { color: '#F5E6C6', fontSize: 11, fontWeight: '700' },
  heroCopy: { color: '#A8A1AA', fontSize: 14, lineHeight: 22, marginBottom: 18 },
  heroStats: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  heroStatCard: {
    flex: 1,
    backgroundColor: '#0F0F14',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F1F27',
  },
  heroStatValue: { color: '#F5F0E8', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  heroStatLabel: { color: '#7A7A8C', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.1 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  quickAction: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    backgroundColor: '#101019',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  actionText: { flex: 1 },
  actionTitle: { color: '#F4F0E8', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  actionCopy: { color: '#A8A1AA', fontSize: 12, lineHeight: 18 },
  sectionCard: {
    borderRadius: 28,
    backgroundColor: '#13131A',
    borderWidth: 1,
    borderColor: '#20202A',
    padding: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: { color: '#F4F0E8', fontSize: 15, fontWeight: '800' },
  sectionAction: { color: '#C9A96E', fontSize: 13, fontWeight: '700' },
  recommendationCard: {
    borderRadius: 24,
    backgroundColor: '#181823',
    padding: 20,
    borderWidth: 1,
    borderColor: '#23232F',
  },
  recommendationMeta: { marginBottom: 16 },
  recommendationLabel: { color: '#8A7F8F', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  recommendationTitle: { color: '#F4F0E8', fontSize: 20, fontWeight: '800', marginBottom: 10, lineHeight: 28 },
  recommendationCopy: { color: '#B4AEB7', fontSize: 13, lineHeight: 20 },
  recommendationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C9A96E14',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  matchText: { color: '#F4F0E8', fontSize: 12, fontWeight: '700' },
  viewButton: {
    backgroundColor: '#C9A96E',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  viewButtonText: { color: '#121113', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#0F0F14',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E1E28',
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#8F8A98', fontSize: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1.1 },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F28',
  },
  scanInfo: { flex: 1, marginRight: 12 },
  scanTitle: { color: '#F4F0E8', fontSize: 15, fontWeight: '700' },
  scanSubtitle: { color: '#A29FA6', fontSize: 12, marginTop: 4 },
  scanMatch: {
    minWidth: 64,
    alignItems: 'flex-end',
  },
  scanMatchPct: { color: '#C9A96E', fontSize: 16, fontWeight: '800' },
  sectionSpacer: { height: 16 },
});