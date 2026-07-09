import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getHaircutRecommendations, getSalonsForHaircut, type HaircutRecommendation, type Salon } from '../../services/facefitService';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Classic', 'Fade', 'Modern', 'Trending', 'Short'];

export default function RecommendationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedStyles, setSavedStyles] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [stylesData, setStylesData] = useState<HaircutRecommendation[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHaircut, setSelectedHaircut] = useState<string | null>(null);

  const parsedResult = useMemo(() => {
    if (typeof params.result === 'string') {
      try {
        return JSON.parse(params.result);
      } catch {
        return null;
      }
    }

    return null;
  }, [params.result]);

  const faceShape = parsedResult?.faceShape || 'Oval';
  const hairType = parsedResult?.hairType || 'Straight';
  const gender = parsedResult?.gender || 'Unisex';

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getHaircutRecommendations(faceShape, hairType, gender);
        setStylesData(result.recommendations || []);

        const initialHaircut = typeof params.selectedHaircut === 'string' ? params.selectedHaircut : result.recommendations?.[0]?.name;
        if (initialHaircut) {
          setSelectedHaircut(initialHaircut);
          const salonList = await getSalonsForHaircut(initialHaircut);
          setSalons(salonList);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [faceShape, hairType, gender, params.selectedHaircut]);

  const filtered = useMemo(() =>
    stylesData.filter((h) => activeCategory === 'All' || h.category === activeCategory || (activeCategory === 'Trending' && h.matchPercentage >= 90)),
    [activeCategory, stylesData]
  );

  const toggleSave = (id: number) => {
    setSavedStyles((prev) =>
      prev.includes(String(id)) ? prev.filter((s) => s !== String(id)) : [...prev, String(id)]
    );
  };

  const openSalons = async (haircutName: string) => {
    setSelectedHaircut(haircutName);
    setLoading(true);
    try {
      const salonList = await getSalonsForHaircut(haircutName);
      setSalons(salonList);
    } finally {
      setLoading(false);
    }
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

        <LinearGradient
          colors={['#2A1F10', '#1A1310']}
          style={styles.faceBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.faceBannerLeft}>
            <Text style={styles.faceBannerLabel}>YOUR FACE SHAPE</Text>
            <Text style={styles.faceBannerShape}>Oval</Text>
            <Text style={styles.faceBannerDesc}>Balanced proportions make oval faces highly versatile, so the recommendations below are ranked by how well each haircut fits your features.</Text>
          </View>
          <View style={styles.faceBannerRight}>
            <View style={styles.faceShapeCircle}>
              <Ionicons name="person" size={36} color="#C9A96E" />
            </View>
            <Text style={styles.faceBannerMatch}>{stylesData.length} matches</Text>
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

        <View style={styles.resultsRow}>
          <Text style={styles.resultsCount}>{filtered.length} hairstyles</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color="#C9A96E" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#C9A96E" />
            <Text style={styles.loadingText}>Loading recommendations from your database…</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {filtered.map((style) => {
              const isExpanded = expandedId === style.id;
              const isSaved = savedStyles.includes(String(style.id));

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
                    <Ionicons name="cut-outline" size={24} color="#C9A96E" />
                  </View>
                  <View style={styles.cardMeta}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardName}>{style.name}</Text>
                      <View style={styles.trendBadge}>
                        <Text style={styles.trendText}>HOT</Text>
                      </View>
                    </View>
                    <View style={styles.cardTags}>
                      <View style={styles.tagPill}>
                        <Text style={styles.tagText}>{style.category}</Text>
                      </View>
                      <View style={styles.tagPill}>
                        <Text style={styles.tagText}>{style.gender}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.matchCircle, { borderColor: getMatchColor(style.matchPercentage) }]}>
                      <Text style={[styles.matchPct, { color: getMatchColor(style.matchPercentage) }]}>{style.matchPercentage}%</Text>
                    </View>
                    <Text style={styles.matchLabel}>match</Text>
                  </View>
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.cardExpanded}>
                    <View style={styles.divider} />
                    <Text style={styles.cardDesc}>{style.description}</Text>
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={14} color="#888" />
                        <Text style={styles.detailLabel}> Maintenance</Text>
                        <Text style={styles.detailValue}>₱{style.price}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="resize-outline" size={14} color="#888" />
                        <Text style={styles.detailLabel}> Length</Text>
                        <Text style={styles.detailValue}>{style.durationMinutes} min</Text>
                      </View>
                    </View>
                    <View style={styles.faceShapeRow}>
                      <Text style={styles.detailLabel}>Best for: </Text>
                      <View style={styles.faceShapePill}>
                        <Text style={styles.faceShapeText}>{style.reason}</Text>
                      </View>
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
                      <TouchableOpacity style={styles.bookBtn} onPress={() => openSalons(style.name)}>
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
        )}

        {selectedHaircut && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salons for {selectedHaircut}</Text>
            {salons.length === 0 && !loading && <Text style={styles.emptyText}>No salons found for this haircut yet.</Text>}
            {salons.map((salon) => (
              <View key={salon.id} style={styles.salonCard}>
                <View style={styles.salonTopRow}>
                  <Text style={styles.salonName}>{salon.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#C9A96E" />
                    <Text style={styles.ratingText}>{salon.rating ?? 'New'}</Text>
                  </View>
                </View>
                <Text style={styles.salonMeta}>{salon.location || 'Location not listed'}</Text>
                <Text style={styles.salonMeta}>{salon.phone || 'No phone listed'}</Text>
                <Text style={styles.salonDesc}>{salon.description || 'Salon details coming soon.'}</Text>
              </View>
            ))}
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
  loadingBox: { paddingVertical: 24, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#888', fontSize: 13 },
  section: { paddingHorizontal: 20, marginTop: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#F5F0E8', marginBottom: 12 },
  salonCard: { backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 10 },
  salonTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  salonName: { fontSize: 14, fontWeight: '700', color: '#F5F0E8', flex: 1, marginRight: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A1F10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  ratingText: { fontSize: 11, color: '#C9A96E', fontWeight: '700', marginLeft: 4 },
  salonMeta: { fontSize: 12, color: '#AAA', marginBottom: 2 },
  salonDesc: { fontSize: 12, color: '#888', marginTop: 6, lineHeight: 16 },
  emptyText: { fontSize: 12, color: '#888' },
});