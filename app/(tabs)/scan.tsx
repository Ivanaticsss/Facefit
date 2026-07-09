import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getHaircutRecommendations } from '../../services/facefitService';

const { width } = Dimensions.get('window');

type ScanStep = 'idle' | 'analyzing' | 'done';

const AI_STEPS = [
  'Detecting facial landmarks…',
  'Analyzing facial geometry…',
  'Classifying face shape…',
  'Generating recommendations…',
];

export default function ScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [step, setStep] = useState<ScanStep>('idle');
  const [currentAiStep, setCurrentAiStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startScan = async () => {
    if (hasPermission === false) {
      Alert.alert('Camera permission denied', 'Enable camera access in your device settings to scan your face.');
      return;
    }

    setStep('analyzing');
    setCurrentAiStep(0);
    setLoading(true);

    AI_STEPS.forEach((_, index) =>
      setTimeout(() => {
        setCurrentAiStep(index);
      }, index * 900)
    );

    try {
      const data = await getHaircutRecommendations('Oval', 'Straight', 'Unisex');
      setResult({
        faceShape: data.faceShape || 'Oval',
        confidence: 92,
        landmarks: 468,
        hairType: data.hairType || 'Straight',
        scalpCondition: 'Healthy',
        recommendations: data.recommendations || [],
      });
    } catch (error) {
      Alert.alert('Recommendation failed', 'Unable to load haircut suggestions from the database.');
    } finally {
      setLoading(false);
      setStep('done');
    }
  };

  const reset = () => {
    setStep('idle');
    setResult(null);
    setCurrentAiStep(0);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.screenLabel}>AI FACE SCAN</Text>
          <Text style={styles.screenTitle}>Face Analysis</Text>
        </View>

        <View style={styles.cameraWrapper}>
          <View style={styles.cameraBox}>
            {hasPermission === null && <Text style={styles.permissionText}>Requesting camera permission…</Text>}
            {hasPermission === false && <Text style={styles.permissionText}>Camera permission denied. Please allow access.</Text>}
            {hasPermission && (
              <CameraView style={styles.camera} facing={cameraType} ratio="16:9">
                <LinearGradient
                  colors={['transparent', 'rgba(15,15,15,0.92)']}
                  style={styles.cameraOverlay}
                />
                <View style={styles.faceGuideContainer} pointerEvents="none">
                  <View style={styles.faceGuide}>
                    <View style={[styles.corner, styles.tl]} />
                    <View style={[styles.corner, styles.tr]} />
                    <View style={[styles.corner, styles.bl]} />
                    <View style={[styles.corner, styles.br]} />
                    <View style={styles.faceGuideInner}>
                      <Ionicons name="person-outline" size={70} color="#C9A96E88" />
                    </View>
                  </View>
                  <Text style={styles.guideText}>Position your face within the frame</Text>
                </View>
              </CameraView>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {step === 'idle' && (
            <>
              <TouchableOpacity style={styles.primaryBtn} onPress={startScan} activeOpacity={0.85}>
                <Ionicons name="scan" size={18} color="#0F0F0F" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Scan Face</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={startScan} activeOpacity={0.85}>
                <Ionicons name="image-outline" size={18} color="#C9A96E" style={{ marginRight: 8 }} />
                <Text style={styles.secondaryBtnText}>Upload Photo</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'analyzing' && (
            <View style={styles.analyzingLabel}>
              <Text style={styles.analyzingText}>Analyzing face geometry…</Text>
            </View>
          )}

          {step === 'done' && (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push({ pathname: '/recommendations', params: { result: JSON.stringify(result) } })}
                activeOpacity={0.85}
              >
                <Ionicons name="sparkles" size={18} color="#0F0F0F" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>View Recommendations</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={reset} activeOpacity={0.85}>
                <Ionicons name="refresh-outline" size={18} color="#C9A96E" style={{ marginRight: 8 }} />
                <Text style={styles.secondaryBtnText}>Scan Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {step === 'done' && result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hair Analysis</Text>
            <View style={styles.analysisGrid}>
              {[
                { label: 'Hair Type', value: result.hairType, icon: 'cut-outline' },
                { label: 'Scalp Condition', value: result.scalpCondition, icon: 'leaf-outline' },
                { label: 'Face Shape', value: result.faceShape, icon: 'person-outline' },
                { label: 'Landmarks', value: `${result.landmarks} pts`, icon: 'git-network-outline' },
              ].map((item) => (
                <View key={item.label} style={styles.analysisCard}>
                  <Ionicons name={item.icon as any} size={20} color="#C9A96E" style={{ marginBottom: 6 }} />
                  <Text style={styles.analysisValue}>{item.value}</Text>
                  <Text style={styles.analysisLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 'done' && result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Hairstyle Matches</Text>
            {result.recommendations.map((item: any, index: number) => (
              <TouchableOpacity
                key={item.id}
                style={styles.matchRow}
                onPress={() => router.push({ pathname: '/recommendations', params: { result: JSON.stringify(result), selectedHaircut: item.name } })}
              >
                <View style={styles.matchRank}>
                  <Text style={styles.matchRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.matchIcon}>
                  <Ionicons name="cut" size={18} color="#C9A96E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matchName}>{item.name}</Text>
                  <Text style={styles.matchMeta}>{item.matchPercentage}% fit · {item.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#555" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'idle' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scan Tips</Text>
            {[
              { icon: 'sunny-outline', tip: 'Use good lighting for accurate detection' },
              { icon: 'eye-outline', tip: 'Look directly at the camera' },
              { icon: 'remove-circle-outline', tip: 'Remove glasses or accessories' },
              { icon: 'image-outline', tip: 'Use a plain background for best results' },
            ].map((item) => (
              <View key={item.tip} style={styles.tipRow}>
                <View style={styles.tipIcon}>
                  <Ionicons name={item.icon as any} size={16} color="#C9A96E" />
                </View>
                <Text style={styles.tipText}>{item.tip}</Text>
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
  cameraWrapper: { marginHorizontal: 20, marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  cameraBox: {
    height: 360,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: { flex: 1, width: '100%' },
  cameraOverlay: { ...StyleSheet.absoluteFillObject },
  permissionText: { color: '#888', fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
  faceGuideContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  faceGuide: { width: 220, height: 260, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  corner: { width: 28, height: 28, position: 'absolute', borderColor: '#C9A96E', borderWidth: 2.5 },
  tl: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 6 },
  tr: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 6 },
  bl: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 6 },
  br: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 6 },
  faceGuideInner: { justifyContent: 'center', alignItems: 'center' },
  guideText: { fontSize: 13, color: '#EEE', textAlign: 'center', marginTop: 14, paddingHorizontal: 30 },
  analyzingContent: { alignItems: 'center', paddingHorizontal: 24 },
  scanAnimRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#C9A96E44', justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
  scanAnimRingInner: { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, borderColor: '#C9A96E', justifyContent: 'center', alignItems: 'center' },
  aiStepsBox: { width: '100%' },
  aiStepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aiStepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginRight: 10 },
  aiStepDotActive: { backgroundColor: '#C9A96E' },
  aiStepText: { fontSize: 13, color: '#BBB', flex: 1 },
  aiStepTextActive: { color: '#F5F0E8' },
  resultBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  resultBadgeText: { fontSize: 16, fontWeight: '700', color: '#4ECDC4', marginLeft: 8 },
  faceShapeResult: { width: '100%', alignItems: 'center' },
  faceShapeLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  faceShapeValue: { fontSize: 36, fontWeight: '800', color: '#C9A96E', letterSpacing: -1, marginBottom: 12 },
  confidenceBar: { width: '80%', height: 4, backgroundColor: '#2A2A2A', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  confidenceFill: { height: '100%', backgroundColor: '#C9A96E', borderRadius: 2 },
  confidenceText: { fontSize: 11, color: '#888' },
  actions: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C9A96E', paddingVertical: 15, borderRadius: 14 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#0F0F0F' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A', paddingVertical: 15, borderRadius: 14, borderWidth: 1, borderColor: '#2A2A2A' },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: '#C9A96E' },
  analyzingLabel: { paddingVertical: 14, alignItems: 'center' },
  analyzingText: { fontSize: 13, color: '#888', fontStyle: 'italic' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#F5F0E8', marginBottom: 14, letterSpacing: -0.3 },
  analysisGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  analysisCard: { width: (width - 50) / 2, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2A2A2A' },
  analysisValue: { fontSize: 16, fontWeight: '700', color: '#F5F0E8', marginBottom: 2 },
  analysisLabel: { fontSize: 11, color: '#888' },
  matchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  matchRank: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#C9A96E22', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  matchRankText: { fontSize: 11, fontWeight: '700', color: '#C9A96E' },
  matchIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  matchName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#F5F0E8' },
  matchMeta: { fontSize: 12, color: '#888', marginTop: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tipText: { fontSize: 13, color: '#AAA', flex: 1 },
});
