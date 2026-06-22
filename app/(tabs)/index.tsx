import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FACE_SHAPES = [
  { shape: 'Oval', icon: '⬭', desc: 'Balanced proportions, suits most styles' },
  { shape: 'Round', icon: '⬤', desc: 'Soft curves, longer cuts work best' },
  { shape: 'Square', icon: '⬛', desc: 'Strong jaw, textured styles soften features' },
  { shape: 'Heart', icon: '♡', desc: 'Wide forehead, chin-length cuts flatter' },
];

const QUICK_ACTIONS = [
  { label: 'Scan Face', icon: 'scan-outline', route: '/scan', color: '#C9A96E' },
  { label: 'My Styles', icon: 'sparkles-outline', route: '/(tabs)/recommendations', color: '#8B6FBE' },
  { label: 'Book Salon', icon: 'calendar-outline', route: '/salons', color: '#4ECDC4' },
  { label: 'Hair Health', icon: 'leaf-outline', route: '/profile', color: '#FF6B6B' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <LinearGradient
          colors={['#0F0F0F', '#1A1310']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.userName}>Welcome to FACE-FIT</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/profile')}>
              <Ionicons name="notifications-outline" size={22} color="#C9A96E" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Hero CTA */}
          <View style={styles.heroBanner}>
            <LinearGradient
              colors={['#2A1F10', '#1A1310']}
              style={styles.heroBannerInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroTextCol}>
                <Text style={styles.heroEyebrow}>AI-POWERED</Text>
                <Text style={styles.heroTitle}>Find Your{'\n'}Perfect Cut</Text>
                <Text style={styles.heroSub}>
                  Scan your face. Get personalized haircut recommendations tailored to your face shape.
                </Text>
                <TouchableOpacity
                  style={styles.heroBtn}
                  onPress={() => router.push('/scan')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="scan" size={16} color="#0F0F0F" style={{ marginRight: 6 }} />
                  <Text style={styles.heroBtnText}>Scan Now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.heroIconCol}>
                <View style={styles.heroIconRing}>
                  <Ionicons name="person" size={52} color="#C9A96E" />
                </View>
                <View style={styles.heroIconOrbit} />
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickIcon, { backgroundColor: action.color + '22' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Face Shape Guide */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Face Shapes</Text>
            <TouchableOpacity onPress={() => router.push('../(tabs)/recommendations')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shapeScroll}>
            {FACE_SHAPES.map((item) => (
              <TouchableOpacity key={item.shape} style={styles.shapeCard} activeOpacity={0.8}>
                <Text style={styles.shapeIcon}>{item.icon}</Text>
                <Text style={styles.shapeName}>{item.shape}</Text>
                <Text style={styles.shapeDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How FACE-FIT Works</Text>
          <View style={styles.stepsContainer}>
            {[
              { step: '1', title: 'Scan Your Face', desc: 'Upload or capture a photo. Our AI analyzes 468 facial landmarks.', icon: 'camera-outline' },
              { step: '2', title: 'AI Analysis', desc: 'MobileNetV2 classifies your face shape with high accuracy.', icon: 'analytics-outline' },
              { step: '3', title: 'Get Recommendations', desc: 'Receive ranked hairstyle suggestions tailored to your features.', icon: 'sparkles-outline' },
              { step: '4', title: 'Book a Salon', desc: 'Find nearby salons and book appointments directly.', icon: 'calendar-outline' },
            ].map((item, index) => (
              <View key={item.step} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepNum}>{item.step}</Text>
                  </View>
                  {index < 3 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Ionicons name={item.icon as any} size={18} color="#C9A96E" style={{ marginRight: 6 }} />
                    <Text style={styles.stepTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll: { paddingBottom: 20 },

  // Header
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 13, color: '#888', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '700', color: '#F5F0E8', letterSpacing: -0.5 },
  notifBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center' },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C9A96E', position: 'absolute', top: 8, right: 8, borderWidth: 1.5, borderColor: '#1E1E1E' },

  // Hero
  heroBanner: { marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  heroBannerInner: { padding: 22, flexDirection: 'row', borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  heroTextCol: { flex: 1, paddingRight: 12 },
  heroEyebrow: { fontSize: 10, color: '#C9A96E', letterSpacing: 2.5, fontWeight: '700', marginBottom: 6 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#F5F0E8', lineHeight: 30, marginBottom: 10, letterSpacing: -0.5 },
  heroSub: { fontSize: 12, color: '#888', lineHeight: 17, marginBottom: 16 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#C9A96E', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start' },
  heroBtnText: { fontSize: 13, fontWeight: '700', color: '#0F0F0F' },
  heroIconCol: { justifyContent: 'center', alignItems: 'center', width: 90 },
  heroIconRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2A1F10', borderWidth: 2, borderColor: '#C9A96E', justifyContent: 'center', alignItems: 'center' },
  heroIconOrbit: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: '#C9A96E33', borderStyle: 'dashed', position: 'absolute' },

  // Section
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#F5F0E8', marginBottom: 14, letterSpacing: -0.3 },
  seeAll: { fontSize: 13, color: '#C9A96E', fontWeight: '600' },

  // Quick Actions
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: (width - 50) / 2, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  quickIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  quickLabel: { fontSize: 14, fontWeight: '600', color: '#F5F0E8' },

  // Face Shapes
  shapeScroll: { marginLeft: -20, paddingLeft: 20 },
  shapeCard: { width: 140, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, marginRight: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  shapeIcon: { fontSize: 28, marginBottom: 8 },
  shapeName: { fontSize: 15, fontWeight: '700', color: '#F5F0E8', marginBottom: 4 },
  shapeDesc: { fontSize: 11, color: '#888', lineHeight: 15 },

  // Steps
  stepsContainer: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#2A2A2A' },
  stepRow: { flexDirection: 'row', marginBottom: 6 },
  stepLeft: { alignItems: 'center', width: 36, marginRight: 14 },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C9A96E22', borderWidth: 1.5, borderColor: '#C9A96E', justifyContent: 'center', alignItems: 'center' },
  stepNum: { fontSize: 12, fontWeight: '800', color: '#C9A96E' },
  stepLine: { width: 1.5, flex: 1, backgroundColor: '#2A2A2A', marginTop: 4, marginBottom: 4, minHeight: 20 },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#F5F0E8' },
  stepDesc: { fontSize: 12, color: '#888', lineHeight: 17 },
});