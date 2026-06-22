import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HAIR_HISTORY = [
  { date: 'Jun 14, 2026', style: 'Classic Taper Fade', salon: 'Craft & Blade', rating: 5, icon: '💈' },
  { date: 'May 2, 2026', style: 'Textured Quiff', salon: 'Styled by Ana', rating: 4, icon: '✨' },
  { date: 'Mar 20, 2026', style: 'French Crop', salon: 'Craft & Blade', rating: 5, icon: '🗼' },
];

const PROFILE = {
  name: 'Juan dela Cruz',
  email: 'juan@email.com',
  faceShape: 'Oval',
  hairType: 'Straight',
  hairTexture: 'Fine',
  scalpCondition: 'Healthy',
  skinTone: 'Medium',
  eyeColor: 'Brown',
  bodyType: 'Average',
  totalScans: 7,
  savedStyles: 4,
  bookings: 3,
};

const SETTINGS = [
  { icon: 'notifications-outline', label: 'Notifications', hasSwitch: true },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Data Consent', hasSwitch: false },
  { icon: 'lock-closed-outline', label: 'Change Password', hasSwitch: false },
  { icon: 'language-outline', label: 'Language', hasSwitch: false },
  { icon: 'help-circle-outline', label: 'Help & Support', hasSwitch: false },
  { icon: 'log-out-outline', label: 'Sign Out', hasSwitch: false, danger: true },
];

export default function ProfileScreen() {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings'>('profile');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <LinearGradient colors={['#1A1310', '#0F0F0F']} style={styles.header}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={42} color="#C9A96E" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{PROFILE.name}</Text>
              <Text style={styles.userEmail}>{PROFILE.email}</Text>
              <View style={styles.faceShapeTag}>
                <Ionicons name="scan-outline" size={12} color="#C9A96E" style={{ marginRight: 4 }} />
                <Text style={styles.faceShapeTagText}>{PROFILE.faceShape} Face · {PROFILE.hairType} Hair</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color="#C9A96E" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { value: PROFILE.totalScans, label: 'Scans' },
              { value: PROFILE.savedStyles, label: 'Saved' },
              { value: PROFILE.bookings, label: 'Bookings' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          {(['profile', 'history', 'settings'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Profile</Text>
            <View style={styles.profileGrid}>
              {[
                { label: 'Face Shape', value: PROFILE.faceShape, icon: 'person-outline' },
                { label: 'Hair Type', value: PROFILE.hairType, icon: 'cut-outline' },
                { label: 'Hair Texture', value: PROFILE.hairTexture, icon: 'layers-outline' },
                { label: 'Scalp', value: PROFILE.scalpCondition, icon: 'leaf-outline' },
                { label: 'Skin Tone', value: PROFILE.skinTone, icon: 'color-palette-outline' },
                { label: 'Eye Color', value: PROFILE.eyeColor, icon: 'eye-outline' },
              ].map((item) => (
                <View key={item.label} style={styles.profileCard}>
                  <Ionicons name={item.icon as any} size={18} color="#C9A96E" style={{ marginBottom: 6 }} />
                  <Text style={styles.profileCardValue}>{item.value}</Text>
                  <Text style={styles.profileCardLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Hair Preferences</Text>
            <View style={styles.prefContainer}>
              {[
                { label: 'Preferred Length', value: 'Short – Medium' },
                { label: 'Style Inspiration', value: 'Clean & Modern' },
                { label: 'Maintenance', value: 'Low to Medium' },
                { label: 'Allergies', value: 'None noted' },
              ].map((item) => (
                <View key={item.label} style={styles.prefRow}>
                  <Text style={styles.prefLabel}>{item.label}</Text>
                  <Text style={styles.prefValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Hair Health</Text>
            <View style={styles.healthContainer}>
              {[
                { label: 'Overall Health', value: 85, color: '#4ECDC4' },
                { label: 'Scalp Condition', value: 90, color: '#C9A96E' },
                { label: 'Damage Risk', value: 15, color: '#FF6B6B' },
              ].map((item) => (
                <View key={item.label} style={styles.healthRow}>
                  <Text style={styles.healthLabel}>{item.label}</Text>
                  <View style={styles.healthBarBg}>
                    <View style={[styles.healthBarFill, { width: `${item.value}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={[styles.healthPct, { color: item.color }]}>{item.value}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hair History</Text>
            {HAIR_HISTORY.map((item, i) => (
              <View key={i} style={styles.historyCard}>
                <View style={styles.historyIcon}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyStyle}>{item.style}</Text>
                  <Text style={styles.historySalon}>{item.salon}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <View style={styles.historyRating}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Ionicons key={s} name="star" size={12} color={s < item.rating ? '#C9A96E' : '#333'} />
                  ))}
                </View>
              </View>
            ))}

            <Text style={styles.sectionTitle}>AI Consent & Privacy</Text>
            <View style={styles.consentCard}>
              <View style={styles.consentRow}>
                <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.consentTitle}>Data Privacy Active</Text>
                  <Text style={styles.consentDesc}>Your facial data is used only for recommendations and is not shared.</Text>
                </View>
              </View>
              <View style={styles.consentToggleRow}>
                {[
                  'AI Recommendations',
                  'Hair Analysis Storage',
                  'Trend Tracking',
                ].map((item) => (
                  <View key={item} style={styles.consentToggle}>
                    <Text style={styles.consentToggleLabel}>{item}</Text>
                    <View style={styles.consentToggleDot} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <View style={styles.section}>
            {SETTINGS.map((setting, i) => (
              <TouchableOpacity
                key={setting.label}
                style={[styles.settingRow, setting.danger && styles.settingRowDanger]}
              >
                <View style={[styles.settingIcon, setting.danger && styles.settingIconDanger]}>
                  <Ionicons
                    name={setting.icon as any}
                    size={18}
                    color={setting.danger ? '#FF6B6B' : '#C9A96E'}
                  />
                </View>
                <Text style={[styles.settingLabel, setting.danger && styles.settingLabelDanger]}>
                  {setting.label}
                </Text>
                {setting.hasSwitch ? (
                  <Switch
                    value={notifEnabled}
                    onValueChange={setNotifEnabled}
                    trackColor={{ false: '#333', true: '#C9A96E55' }}
                    thumbColor={notifEnabled ? '#C9A96E' : '#666'}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#555" />
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.appInfoBox}>
              <Text style={styles.appInfoTitle}>FACE-FIT</Text>
              <Text style={styles.appInfoSub}>Version 1.0.0 · BS Information Technology, 2026</Text>
              <Text style={styles.appInfoSub}>Powered by MobileNetV2 · MediaPipe Face Mesh</Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll: { paddingBottom: 30 },

  // Header
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 20 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2A1F10', borderWidth: 2.5, borderColor: '#C9A96E', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '800', color: '#F5F0E8', marginBottom: 2 },
  userEmail: { fontSize: 13, color: '#888', marginBottom: 6 },
  faceShapeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A1F10', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  faceShapeTagText: { fontSize: 11, color: '#C9A96E', fontWeight: '600' },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, justifyContent: 'space-around', borderWidth: 1, borderColor: '#2A2A2A' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#F5F0E8', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },

  // Tabs
  tabRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, marginBottom: 20, backgroundColor: '#1A1A1A', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#2A2A2A' },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#C9A96E' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#888' },
  tabTextActive: { color: '#0F0F0F' },

  // Section
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#F5F0E8', marginBottom: 14, letterSpacing: -0.3 },

  // Profile Grid
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  profileCard: { width: (width - 50) / 3 - 4, backgroundColor: '#1A1A1A', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2A2A2A', alignItems: 'center' },
  profileCardValue: { fontSize: 13, fontWeight: '700', color: '#F5F0E8', marginBottom: 2, textAlign: 'center' },
  profileCardLabel: { fontSize: 10, color: '#888', textAlign: 'center' },

  // Preferences
  prefContainer: { backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#2A2A2A' },
  prefRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  prefLabel: { fontSize: 13, color: '#888' },
  prefValue: { fontSize: 13, color: '#F5F0E8', fontWeight: '600' },

  // Health
  healthContainer: { backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#2A2A2A' },
  healthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  healthLabel: { fontSize: 12, color: '#888', width: 110 },
  healthBarBg: { flex: 1, height: 5, backgroundColor: '#2A2A2A', borderRadius: 3, overflow: 'hidden', marginHorizontal: 10 },
  healthBarFill: { height: '100%', borderRadius: 3 },
  healthPct: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },

  // History
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  historyIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  historyInfo: { flex: 1 },
  historyStyle: { fontSize: 14, fontWeight: '700', color: '#F5F0E8', marginBottom: 2 },
  historySalon: { fontSize: 12, color: '#888', marginBottom: 2 },
  historyDate: { fontSize: 11, color: '#555' },
  historyRating: { flexDirection: 'row', gap: 2 },

  // Consent
  consentCard: { backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#4ECDC422' },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  consentTitle: { fontSize: 14, fontWeight: '700', color: '#F5F0E8', marginBottom: 2 },
  consentDesc: { fontSize: 12, color: '#888', lineHeight: 16 },
  consentToggleRow: { gap: 8 },
  consentToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  consentToggleLabel: { fontSize: 13, color: '#AAA' },
  consentToggleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ECDC4' },

  // Settings
  settingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  settingRowDanger: { borderColor: '#FF6B6B22' },
  settingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingIconDanger: { backgroundColor: '#FF6B6B22' },
  settingLabel: { flex: 1, fontSize: 14, color: '#F5F0E8', fontWeight: '500' },
  settingLabelDanger: { color: '#FF6B6B' },

  // App Info
  appInfoBox: { alignItems: 'center', paddingVertical: 20, marginTop: 10 },
  appInfoTitle: { fontSize: 16, fontWeight: '800', color: '#C9A96E', letterSpacing: 2, marginBottom: 4 },
  appInfoSub: { fontSize: 11, color: '#555', textAlign: 'center', marginBottom: 2 },
});