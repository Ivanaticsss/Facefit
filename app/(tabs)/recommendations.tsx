import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Short', 'Medium', 'Long', 'Curly', 'Trending'];

const HAIRSTYLES = [
  {
    id: '1',
    name: 'Classic Taper Fade',
    category: 'Short',
    faceShapes: ['Oval', 'Square'],
    match: 96,
    trending: true,
    desc: 'Clean, versatile cut with gradual fade on sides. Ideal for professional settings.',
    maintenance: 'Low',
    length: 'Short',
    icon: '💈',
    tags: ['Professional', 'Clean', 'Classic'],
  },
  {
    id: '2',
    name: 'Textured Quiff',
    category: 'Medium',
    faceShapes: ['Oval', 'Round'],
    match: 88,
    trending: true,
    desc: 'Voluminous top with textured finish. Adds height to round faces.',
    maintenance: 'Medium',
    length: 'Medium',
    icon: '✨',
    tags: ['Trendy', 'Volume', 'Modern'],
  },
  {
    id: '3',
    name: 'Side Part Undercut',
    category: 'Medium',
    faceShapes: ['Oval', 'Heart'],
    match: 85,
    trending: false,
    desc: 'Sharp side part with undercut. A timeless gentleman\'s look.',
    maintenance: 'Medium',
    length: 'Medium',
    icon: '🎩',
    tags: ['Formal', 'Sharp', 'Elegant'],
  },
  {
    id: '4',
    name: 'French Crop',
    category: 'Short',
    faceShapes: ['Round', 'Square'],
    match: 82,
    trending: true,
    desc: 'Short crop with fringe at the forehead. Suits most face shapes.',
    maintenance: 'Low',
    length: 'Short',
    icon: '🗼',
    tags: ['Minimal', 'Urban', 'Easy'],
  },
  {
    id: '5',
    name: 'Curtain Bangs',
    category: 'Medium',
    faceShapes: ['Heart', 'Oval'],
    match: 79,
    trending: true,
    desc: 'Parted bangs that frame the face naturally. Very popular right now.',
    maintenance: 'Medium',
    length: 'Medium',
    icon: '🎭',
    tags: ['Retro', 'Trendy', 'Soft'],
  },
  {
    id: '6',
    name: 'Buzz Cut',
    category: 'Short',
    faceShapes: ['Oval', 'Square', 'Round'],
    match: 75,
    trending: false,
    desc: 'Ultra-short all over. Bold and confident with minimal upkeep.',
    maintenance: 'Very Low',
    length: 'Short',
    icon: '⚡',
    tags: ['Bold', 'Low Maintenance', 'Strong'],
  },
];

const FACE_SHAPE_INFO = {
  shape: 'Oval',
  desc: 'Balanced proportions make oval faces the most versatile — almost any hairstyle works.',
  compatible: ['Classic Taper Fade', 'Textured Quiff', 'Side Part Undercut'],
};

export default function RecommendationsScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedStyles, setSavedStyles] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = HAIRSTYLES.filter(
    (h) => activeCategory === 'All' || h.category === activeCategory || (activeCategory === 'Trending' && h.trending)
  );

  const toggleSave = (id: string) => {
    setSavedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return '#4ECDC4';
    if (match >= 80) return '#C9A96E';
    return '#888';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenLabel}>AI RECOMMENDATIONS</Text>
          <Text style={styles.screenTitle}>Your Styles</Text>
        </View>

        {/* Face Shape Banner */}
        <LinearGradient
          colors={['#2A1F10', '#1A1310']}
          style={styles.faceBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.faceBannerLeft}>
            <Text style={styles.faceBannerLabel}>YOUR FACE SHAPE</Text>
            <Text style={styles.faceBannerShape}>{FACE_SHAPE_INFO.shape}</Text>
            <Text style={styles.faceBannerDesc}>{FACE_SHAPE_INFO.desc}</Text>
          </View>
          <View style={styles.faceBannerRight}>
            <View style={styles.faceShapeCircle}>
              <Ionicons name="person" size={36} color="#C9A96E" />
            </View>
            <Text style={styles.faceBannerMatch}>{HAIRSTYLES.filter((h) => h.faceShapes.includes('Oval')).length} matches</Text>
          </View>
        </LinearGradient>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsCount}>{filtered.length} hairstyles</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color="#C9A96E" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Hairstyle Cards */}
        <View style={styles.cardsContainer}>
          {filtered.map((style) => {
            const isExpanded = expandedId === style.id;
            const isSaved = savedStyles.includes(style.id);

            return (
              <TouchableOpacity
                key={style.id}
                style={styles.styleCard}
                onPress={() => setExpandedId(isExpanded ? null : style.id)}
                activeOpacity={0.9}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconBox}>
                    <Text style={{ fontSize: 28 }}>{style.icon}</Text>
                  </View>
                  <View style={styles.cardMeta}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardName}>{style.name}</Text>
                      {style.trending && (
                        <View style={styles.trendBadge}>
                          <Text style={styles.trendText}>HOT</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.cardTags}>
                      {style.tags.map((tag) => (
                        <View key={tag} style={styles.tagPill}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.matchCircle, { borderColor: getMatchColor(style.match) }]}>
                      <Text style={[styles.matchPct, { color: getMatchColor(style.match) }]}>{style.match}%</Text>
                    </View>
                    <Text style={styles.matchLabel}>match</Text>
                  </View>
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.cardExpanded}>
                    <View style={styles.divider} />
                    <Text style={styles.cardDesc}>{style.desc}</Text>
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={14} color="#888" />
                        <Text style={styles.detailLabel}> Maintenance</Text>
                        <Text style={styles.detailValue}>{style.maintenance}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="resize-outline" size={14} color="#888" />
                        <Text style={styles.detailLabel}> Length</Text>
                        <Text style={styles.detailValue}>{style.length}</Text>
                      </View>
                    </View>
                    <View style={styles.faceShapeRow}>
                      <Text style={styles.detailLabel}>Best for: </Text>
                      {style.faceShapes.map((fs) => (
                        <View key={fs} style={styles.faceShapePill}>
                          <Text style={styles.faceShapeText}>{fs}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
                        onPress={() => toggleSave(style.id)}
                      >
                        <Ionicons
                          name={isSaved ? 'bookmark' : 'bookmark-outline'}
                          size={16}
                          color={isSaved ? '#0F0F0F' : '#C9A96E'}
                        />
                        <Text style={[styles.saveBtnText, isSaved && styles.saveBtnTextActive]}>
                          {isSaved ? 'Saved' : 'Save Style'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bookBtn}>
                        <Ionicons name="calendar-outline" size={16} color="#0F0F0F" style={{ marginRight: 6 }} />
                        <Text style={styles.bookBtnText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Chevron */}
                <View style={styles.chevronRow}>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#555"
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll: { paddingBottom: 30 },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 20 },
  screenLabel: { fontSize: 10, color: '#C9A96E', letterSpacing: 2.5, fontWeight: '700', marginBottom: 4 },
  screenTitle: { fontSize: 26, fontWeight: '800', color: '#F5F0E8', letterSpacing: -0.5 },

  // Face Banner
  faceBanner: { marginHorizontal: 20, borderRadius: 16, padding: 18, marginBottom: 20, flexDirection: 'row', borderWidth: 1, borderColor: '#2A2A2A' },
  faceBannerLeft: { flex: 1 },
  faceBannerLabel: { fontSize: 9, color: '#C9A96E', letterSpacing: 2, fontWeight: '700', marginBottom: 4 },
  faceBannerShape: { fontSize: 28, fontWeight: '800', color: '#F5F0E8', letterSpacing: -0.5, marginBottom: 4 },
  faceBannerDesc: { fontSize: 11, color: '#888', lineHeight: 15 },
  faceBannerRight: { alignItems: 'center', justifyContent: 'center', paddingLeft: 16 },
  faceShapeCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2A1F10', borderWidth: 1.5, borderColor: '#C9A96E', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  faceBannerMatch: { fontSize: 11, color: '#C9A96E', fontWeight: '600' },

  // Categories
  categoryScroll: { marginBottom: 16 },
  categoryPill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  categoryPillActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  categoryText: { fontSize: 13, color: '#888', fontWeight: '600' },
  categoryTextActive: { color: '#0F0F0F' },

  // Results
  resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  resultsCount: { fontSize: 13, color: '#888' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontSize: 13, color: '#C9A96E', fontWeight: '600' },

  // Cards
  cardsContainer: { paddingHorizontal: 20, gap: 12 },
  styleCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardIconBox: { width: 54, height: 54, borderRadius: 14, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardMeta: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#F5F0E8', flex: 1 },
  trendBadge: { backgroundColor: '#FF6B6B22', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#FF6B6B55' },
  trendText: { fontSize: 9, fontWeight: '800', color: '#FF6B6B', letterSpacing: 1 },
  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tagPill: { backgroundColor: '#2A2A2A', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 10, color: '#888' },
  cardRight: { alignItems: 'center', marginLeft: 8 },
  matchCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  matchPct: { fontSize: 12, fontWeight: '800' },
  matchLabel: { fontSize: 9, color: '#555', marginTop: 2 },

  // Expanded
  cardExpanded: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginBottom: 12 },
  cardDesc: { fontSize: 13, color: '#AAA', lineHeight: 18, marginBottom: 12 },
  detailsRow: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#666' },
  detailValue: { fontSize: 12, color: '#C9A96E', fontWeight: '600', marginLeft: 4 },
  faceShapeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 },
  faceShapePill: { backgroundColor: '#C9A96E22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginLeft: 4, borderWidth: 1, borderColor: '#C9A96E55' },
  faceShapeText: { fontSize: 11, color: '#C9A96E', fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 10 },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#C9A96E' },
  saveBtnActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  saveBtnText: { fontSize: 13, fontWeight: '700', color: '#C9A96E', marginLeft: 6 },
  saveBtnTextActive: { color: '#0F0F0F' },
  bookBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#C9A96E' },
  bookBtnText: { fontSize: 13, fontWeight: '700', color: '#0F0F0F' },

  // Chevron
  chevronRow: { alignItems: 'center', marginTop: 8 },
});