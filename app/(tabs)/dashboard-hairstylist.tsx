import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HairstylistDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120F1E" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello stylist</Text>
          <Text style={styles.title}>Your salon studio</Text>
          <Text style={styles.subtitle}>Manage appointments, client scans, and style requests in one place.</Text>
        </View>

        <View style={styles.cardSection}>
          <TouchableOpacity style={styles.primaryCard} onPress={() => router.push('/recommendations')}>
            <Text style={styles.primaryTitle}>Client requests</Text>
            <Text style={styles.primaryCopy}>Review new hairstyle matches and respond quickly.</Text>
          </TouchableOpacity>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>New requests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Today bookings</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          {(
            [
              { icon: 'camera-outline', title: 'Scan client face', subtitle: 'Open the scanner to capture a new look.', route: '/scan' as const },
              { icon: 'person-add-outline', title: 'Client list', subtitle: 'See your current client queue.', route: '/profile' as const },
              { icon: 'chatbubble-ellipses-outline', title: 'Message clients', subtitle: 'Send updates for confirmed styles.', route: '/recommendations' as const },
            ] as const
          ).map((item) => (
            <TouchableOpacity key={item.title} style={styles.actionItem} onPress={() => router.push(item.route)}>
              <Ionicons name={item.icon as any} size={20} color="#D3A05A" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#7A7A7A" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.todayRow}>
            <Text style={styles.todayLabel}>Next appointment</Text>
            <Text style={styles.todayValue}>3:30 PM with Maya</Text>
          </View>
          <View style={styles.todayRow}>
            <Text style={styles.todayLabel}>Available chairs</Text>
            <Text style={styles.todayValue}>2 open</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0913' },
  scroll: { padding: 20, paddingBottom: 32 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 13, color: '#91858A', marginBottom: 6 },
  title: { fontSize: 30, fontWeight: '800', color: '#FEF6E0', marginBottom: 10 },
  subtitle: { color: '#B7A8AE', fontSize: 14, lineHeight: 20 },
  cardSection: { marginBottom: 24 },
  primaryCard: { borderRadius: 22, backgroundColor: '#1C1423', padding: 22, marginBottom: 18 },
  primaryTitle: { color: '#F8E6D0', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  primaryCopy: { color: '#C9B5AC', fontSize: 13, lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statCard: { flex: 1, borderRadius: 18, padding: 18, backgroundColor: '#14101A' },
  statNumber: { color: '#E7D1AE', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  statLabel: { color: '#8C7D8A', fontSize: 12 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#F8E6D0', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  actionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, backgroundColor: '#130D18', borderWidth: 1, borderColor: '#2A2331', marginBottom: 12 },
  actionText: { flex: 1, marginLeft: 14 },
  actionTitle: { color: '#F8E6D0', fontSize: 14, fontWeight: '700' },
  actionSubtitle: { color: '#968A9C', fontSize: 12, marginTop: 3, lineHeight: 18 },
  todayRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomColor: '#211827', borderBottomWidth: 1 },
  todayLabel: { color: '#9B8C99', fontSize: 13 },
  todayValue: { color: '#FEF6E0', fontSize: 13, fontWeight: '700' },
});