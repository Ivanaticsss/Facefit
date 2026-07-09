import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AppShell from '../../components/app-shell';
import type { AuthUser } from '../../services/authService';
import { COLORS, GRADIENTS } from '../../constants/theme';

type Props = {
  user?: AuthUser | null;
};

type Metric = {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

const METRICS: Metric[] = [
  { label: 'New requests', value: '12', trend: '+4', trendUp: true, icon: 'chatbubble-ellipses-outline' },
  { label: 'Today bookings', value: '24', trend: '+6', trendUp: true, icon: 'calendar-outline' },
];

type QuickAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Scan client', icon: 'camera-outline', route: '/scan' },
  { label: 'Clients', icon: 'person-add-outline', route: '/profile' },
  { label: 'Messages', icon: 'chatbubble-ellipses-outline', route: '/recommendations' },
];

const TODAY = [
  { label: 'Next appointment', value: '3:30 PM with Maya' },
  { label: 'Available chairs', value: '2 open' },
  { label: 'Requests to review', value: '12 pending' },
];

export default function HairstylistDashboard({ user }: Props) {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'Stylist';

  return (
    <AppShell
      user={user}
      role="hairstylist"
      title="Stylist dashboard"
      subtitle={`Welcome, ${firstName}`}
    >
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
                  <Text style={styles.greeting}>SALON STUDIO</Text>
                  <Text style={styles.title}>Hello, {firstName}</Text>
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
              <Text style={styles.subtitle}>Manage appointments, client scans, and style requests in one place.</Text>
            </View>

            {/* Metric cards */}
            <View style={styles.metricRow}>
              {METRICS.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <View style={styles.metricIconWrap}>
                    <Ionicons name={metric.icon} size={16} color={COLORS.goldLight} />
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <View style={styles.metricFooter}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <View style={styles.trendPill}>
                      <Ionicons
                        name={metric.trendUp ? 'trending-up' : 'trending-down'}
                        size={11}
                        color={metric.trendUp ? COLORS.success : COLORS.danger}
                      />
                      <Text
                        style={[
                          styles.trendText,
                          { color: metric.trendUp ? COLORS.success : COLORS.danger },
                        ]}
                      >
                        {metric.trend}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
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
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={styles.quickActionIconWrap}>
                    <Ionicons name={action.icon} size={17} color={COLORS.goldLight} />
                  </View>
                  <Text style={styles.quickActionLabel} numberOfLines={1}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Primary highlight card */}
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
                <View style={styles.primaryIconWrap}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.onGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.primaryTitle}>Client requests</Text>
                  <Text style={styles.primaryCopy}>
                    Review new hairstyle matches and respond quickly.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Today */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today</Text>
              <View style={styles.reportsCard}>
                {TODAY.map((item, index) => (
                  <View
                    key={item.label}
                    style={[
                      styles.todayRow,
                      index === TODAY.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text style={styles.todayLabel}>{item.label}</Text>
                    <Text style={styles.todayValue}>{item.value}</Text>
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
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
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

  metricRow: { flexDirection: 'row', gap: 12, marginBottom: 26 },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.goldWash,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 10 },
  metricFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { color: COLORS.textTertiary, fontSize: 11.5 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  trendText: { fontSize: 11, fontWeight: '700' },

  sectionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 12 },

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
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  primaryCard: {
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  primaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  primaryTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  primaryCopy: { color: COLORS.textSecondary, fontSize: 12.5, lineHeight: 18 },

  section: { marginBottom: 12 },
  reportsCard: {
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 16,
  },
  todayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  todayLabel: { color: COLORS.textSecondary, fontSize: 13 },
  todayValue: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700' },
});