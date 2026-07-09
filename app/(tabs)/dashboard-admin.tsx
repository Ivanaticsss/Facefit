import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AppShell from '../../components/app-shell';
import type { AuthUser } from '../../services/authService';

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
  { label: 'Active users', value: '1,204', trend: '+8.2%', trendUp: true, icon: 'people-outline' },
  { label: 'Stylists', value: '82', trend: '+3.1%', trendUp: true, icon: 'cut-outline' },
];

type QuickAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Flagged scans', icon: 'flag-outline', route: '/recommendations' },
  { label: 'Stylists', icon: 'cut-outline', route: '/admin/stylists' },
  { label: 'Bookings', icon: 'calendar-outline', route: '/admin/bookings' },
  { label: 'Reports', icon: 'bar-chart-outline', route: '/admin/reports' },
];

const REPORTS = [
  { label: 'Monthly growth', value: '+18%', positive: true, progress: 0.72 },
  { label: 'Average booking', value: '4.3 / day', positive: true, progress: 0.58 },
  { label: 'Cancellation rate', value: '2.1%', positive: false, progress: 0.12 },
];

export default function AdminDashboard({ user }: Props) {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'Admin';

  return (
    <AppShell
      user={user}
      role="admin"
      title="Admin panel"
      subtitle={`Welcome back, ${firstName}`}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <LinearGradient colors={['#1C1410', '#0A0A0A']} style={styles.backgroundGlow} />
        <View style={styles.orbTopRight} pointerEvents="none" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.greeting}>ADMIN PANEL</Text>
                  <Text style={styles.title}>Manage FaceFit</Text>
                </View>
                <LinearGradient
                  colors={['#E9CE9A', '#C9A96E', '#8D5A63']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarBadge}
                >
                  <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.subtitle}>Monitor users, stylist activity, and platform analytics.</Text>
            </View>

            {/* Metric cards */}
            <View style={styles.metricRow}>
              {METRICS.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <View style={styles.metricIconWrap}>
                    <Ionicons name={metric.icon} size={16} color="#E9CE9A" />
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <View style={styles.metricFooter}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <View style={styles.trendPill}>
                      <Ionicons
                        name={metric.trendUp ? 'trending-up' : 'trending-down'}
                        size={11}
                        color={metric.trendUp ? '#6FA97A' : '#B25454'}
                      />
                      <Text
                        style={[
                          styles.trendText,
                          { color: metric.trendUp ? '#6FA97A' : '#B25454' },
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
                    <Ionicons name={action.icon} size={17} color="#E9CE9A" />
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
                colors={['#2A1D14', '#1A130E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryCard}
              >
                <View style={styles.primaryIconWrap}>
                  <Ionicons name="alert-circle-outline" size={20} color="#0F0F0F" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.primaryTitle}>Review flagged scans</Text>
                  <Text style={styles.primaryCopy}>
                    Inspect any issues or quality alerts from recent uploads.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#B0A9A4" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Reports */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reports</Text>
              <View style={styles.reportsCard}>
                {REPORTS.map((report, index) => (
                  <View
                    key={report.label}
                    style={[
                      styles.reportItem,
                      index === REPORTS.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={styles.reportTopRow}>
                      <Text style={styles.reportTitle}>{report.label}</Text>
                      <Text
                        style={[
                          styles.reportValue,
                          { color: report.positive ? '#F5F0E8' : '#D89A9A' },
                        ]}
                      >
                        {report.value}
                      </Text>
                    </View>
                    <View style={styles.reportTrack}>
                      <View
                        style={[
                          styles.reportFill,
                          {
                            width: `${report.progress * 100}%`,
                            backgroundColor: report.positive ? '#C9A96E' : '#B25454',
                          },
                        ]}
                      />
                    </View>
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
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  backgroundGlow: { ...StyleSheet.absoluteFillObject },
  orbTopRight: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#C9A96E',
    opacity: 0.1,
  },
  scroll: { padding: 20, paddingBottom: 36 },

  header: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  greeting: { fontSize: 11, color: '#8A7F89', letterSpacing: 1.7, marginBottom: 6, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: '#F5F0E8' },
  subtitle: { color: '#B0A9A4', fontSize: 13, lineHeight: 20 },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9A96E',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarInitial: { color: '#0F0F0F', fontWeight: '800', fontSize: 16 },

  metricRow: { flexDirection: 'row', gap: 12, marginBottom: 26 },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(201,169,110,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: { color: '#F5F0E8', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  metricFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { color: '#8A7F89', fontSize: 11.5 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  trendText: { fontSize: 11, fontWeight: '700' },

  sectionTitle: { color: '#F5F0E8', fontSize: 14, fontWeight: '700', marginBottom: 12 },

  quickActionRow: { gap: 10, paddingRight: 8 },
  quickActionChip: {
    width: 86,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickActionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(201,169,110,0.14)',
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
    borderColor: 'rgba(255,255,255,0.08)',
  },
  primaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E9CE9A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  primaryTitle: { color: '#F5F0E8', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  primaryCopy: { color: '#B0A9A4', fontSize: 12.5, lineHeight: 18 },

  section: { marginBottom: 12 },
  reportsCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
  },
  reportItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  reportTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reportTitle: { color: '#B0A9A4', fontSize: 13 },
  reportValue: { fontSize: 14, fontWeight: '700' },
  reportTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  reportFill: { height: '100%', borderRadius: 3 },
});