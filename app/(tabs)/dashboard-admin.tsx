import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0C101C" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Admin panel</Text>
          <Text style={styles.title}>Manage FaceFit</Text>
          <Text style={styles.subtitle}>Monitor users, stylist activity, and platform analytics.</Text>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>1,204</Text>
            <Text style={styles.metricLabel}>Active users</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>82</Text>
            <Text style={styles.metricLabel}>Stylists</Text>
          </View>
        </View>

        <View style={styles.cardSection}>
          <TouchableOpacity style={styles.primaryCard} onPress={() => router.push('/recommendations')}>
            <Text style={styles.primaryTitle}>Review flagged scans</Text>
            <Text style={styles.primaryCopy}>Inspect any issues or quality alerts from recent uploads.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/profile')}>
            <Ionicons name="settings-outline" size={20} color="#7AC4D9" />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>User management</Text>
              <Text style={styles.actionSubtitle}>Approve stylists or update member access.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#7A7A7A" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          <View style={styles.reportItem}>
            <Text style={styles.reportTitle}>Monthly growth</Text>
            <Text style={styles.reportValue}>+18%</Text>
          </View>
          <View style={styles.reportItem}>
            <Text style={styles.reportTitle}>Average booking</Text>
            <Text style={styles.reportValue}>4.3 / day</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C101C' },
  scroll: { padding: 20, paddingBottom: 30 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 13, color: '#8DA9C0', marginBottom: 6 },
  title: { fontSize: 30, fontWeight: '800', color: '#F7F9FF', marginBottom: 10 },
  subtitle: { color: '#A5B0C7', fontSize: 14, lineHeight: 20 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  metricCard: { flex: 1, borderRadius: 22, padding: 18, backgroundColor: '#111727' },
  metricValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  metricLabel: { color: '#A5B0C7', fontSize: 12 },
  cardSection: { marginBottom: 22 },
  primaryCard: { borderRadius: 22, backgroundColor: '#15243E', padding: 22, marginBottom: 16 },
  primaryTitle: { color: '#E8F5FF', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  primaryCopy: { color: '#B5C4D7', fontSize: 13, lineHeight: 20 },
  actionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, backgroundColor: '#142339', borderWidth: 1, borderColor: '#1B2E48' },
  actionText: { flex: 1, marginLeft: 14 },
  actionTitle: { color: '#F7F9FF', fontSize: 14, fontWeight: '700' },
  actionSubtitle: { color: '#9FB1C6', fontSize: 12, marginTop: 3, lineHeight: 18 },
  section: { marginBottom: 18 },
  sectionTitle: { color: '#F7F9FF', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  reportItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1B293B' },
  reportTitle: { color: '#A5B0C7', fontSize: 13 },
  reportValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});