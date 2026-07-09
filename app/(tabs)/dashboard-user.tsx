import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AppShell from '../../components/app-shell';
import type { AuthUser } from '../../services/authService';
import { COLORS, GRADIENTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { label: 'Scan', icon: 'scan-outline', subtitle: 'Discover a new look', route: '/scan' as const },
  { label: 'Saved', icon: 'bookmark-outline', subtitle: 'Your favorite styles', route: '/recommendations' as const },
  { label: 'Booking', icon: 'calendar-outline', subtitle: 'Salon appointments', route: '/salons' as const },
] as const;

const STATS = [
  { label: 'Scans', value: '8' },
  { label: 'Matches', value: '24' },
  { label: 'Booked', value: '2' },
];

const RECENT_SCANS = [
  { title: 'Voluminous Waves', match: 92, date: 'Today', status: 'Recommended' },
  { title: 'Soft Curtain Fringe', match: 86, date: 'Yesterday', status: 'Saved' },
  { title: 'Sleek Side Part', match: 79, date: '2 days ago', status: 'Review' },
];

type Props = {
  user?: AuthUser | null;
};

export default function UserDashboard({ user }: Props) {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <AppShell user={user} role="user" title="Your dashboard" subtitle={`Hello, ${firstName}`}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        <LinearGradient colors={GRADIENTS.bgGlow} style={styles.backgroundGlow} />
        <View style={styles.orbTopRight} pointerEvents="none" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.greeting}>GOOD AFTERNOON</Text>
                  <Text style={styles.title}>{firstName}, ready for a new style?</Text>
                </View>
                <LinearGradient
                  colors={GRADIENTS.gold}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarBadge}
                >
                  <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.subtitle}>AI-powered recommendations tailored to your face shape and latest salon scans.</Text>

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

            {/* Quick actions */}
            <Text style={styles.sectionTitle}>Quick actions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionRow}
              style={{ marginBottom: 22 }}
            >
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.quickActionChip}
                  activeOpacity={0.85}
                  onPress={() => router.push(action.route)}
                >
                  <View style={styles.quickActionIconWrap}>
                    <Ionicons name={action.icon as any} size={17} color={COLORS.goldLight} />
                  </View>
                  <Text style={styles.quickActionLabel} numberOfLines={1}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Top recommendation */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top recommendation</Text>
                <TouchableOpacity onPress={() => router.push('/recommendations')}>
                  <Text style={styles.sectionAction}>See all</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/recommendations')}
                style={styles.primaryCardWrap}
              >
                <LinearGradient
                  colors={GRADIENTS.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryCard}
                >
                  <Text style={styles.recommendationLabel}>TRENDING</Text>
                  <Text style={styles.primaryTitle}>Textured Pixie Cut</Text>
                  <Text style={styles.primaryCopy}>
                    Short, layered texture that frames the face and boosts definition.
                  </Text>
                  <View style={styles.recommendationFooter}>
                    <View style={styles.matchBadge}>
                      <Ionicons name="sparkles-outline" size={14} color={COLORS.textPrimary} />
                      <Text style={styles.matchText}>94% match</Text>
                    </View>
                    <View style={styles.viewButtonWrap}>
                      <Text style={styles.viewButtonText}>View style</Text>
                      <Ionicons name="chevron-forward" size={14} color={COLORS.onGold} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.metricRow}>
              {STATS.map((item) => (
                <View key={item.label} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{item.value}</Text>
                  <Text style={styles.metricLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Recent scans */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent scans</Text>
                <TouchableOpacity onPress={() => router.push('/recommendations')}>
                  <Text style={styles.sectionAction}>Manage</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.reportsCard}>
                {RECENT_SCANS.map((scan, index) => (
                  <View
                    key={scan.title}
                    style={[
                      styles.scanRow,
                      index === RECENT_SCANS.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.scanTitle}>{scan.title}</Text>
                      <Text style={styles.scanSubtitle}>{scan.date} · {scan.status}</Text>
                    </View>
                    <Text style={styles.scanMatchPct}>{scan.match}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  backgroundGlow: { ...StyleSheet.absoluteFillObject },
  orbTopRight: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.gold,
    opacity: 0.1,
  },
  scroll: { padding: 20, paddingBottom: 36 },

  header: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  greeting: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 1.7, marginBottom: 6, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 30, maxWidth: width * 0.7 },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 18 },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarInitial: { color: COLORS.onGold, fontWeight: '800', fontSize: 16 },

  heroStats: { flexDirection: 'row', gap: 12 },
  heroStatCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  heroStatValue: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 6 },
  heroStatLabel: { color: COLORS.textTertiary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },

  sectionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionAction: { color: COLORS.gold, fontSize: 12.5, fontWeight: '700' },
  section: { marginBottom: 24 },

  quickActionRow: { gap: 10, paddingRight: 8 },
  quickActionChip: {
    width: 92,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickActionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.goldWash,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: { color: '#D8D2CC', fontSize: 11, fontWeight: '600', textAlign: 'center' },

  primaryCardWrap: {
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  primaryCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  recommendationLabel: { color: COLORS.textTertiary, fontSize: 11, letterSpacing: 1.5, marginBottom: 10, fontWeight: '700' },
  primaryTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 10, lineHeight: 28 },
  primaryCopy: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 18 },
  recommendationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.goldWashSoft,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  matchText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700' },
  viewButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  viewButtonText: { color: COLORS.onGold, fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },

  metricRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  metricValue: { color: COLORS.goldLight, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  metricLabel: { color: COLORS.textTertiary, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.8 },

  reportsCard: {
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 16,
  },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  scanTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  scanSubtitle: { color: COLORS.textTertiary, fontSize: 11.5, marginTop: 3 },
  scanMatchPct: { color: COLORS.gold, fontSize: 15, fontWeight: '800', marginLeft: 12 },
});