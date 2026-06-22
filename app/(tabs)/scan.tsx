import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type ScanStep = 'idle' | 'analyzing' | 'done';

const AI_STEPS = [
  'Detecting facial landmarks…',
  'Analyzing facial geometry…',
  'Classifying face shape…',
  'Generating recommendations…',
];

const RESULT_MOCK = {
  faceShape: 'Oval',
  confidence: 91,
  landmarks: 468,
  hairType: 'Straight',
  scalpCondition: 'Healthy',
  topMatches: ['Classic Taper Fade', 'Textured Quiff', 'Side Part Undercut'],
};

export default function ScanScreen() {
  const router = useRouter();
  const [step, setStep] = useState<ScanStep>('idle');
  const [currentAiStep, setCurrentAiStep] = useState(0);
  const [result, setResult] = useState<typeof RESULT_MOCK | null>(null);

  const startScan = () => {
    setStep('analyzing');
    setCurrentAiStep(0);

    const intervals = AI_STEPS.map((_, i) =>
      setTimeout(() => setCurrentAiStep(i), i * 900)
    );

    setTimeout(() => {
      setResult(RESULT_MOCK);
      setStep('done');
    }, AI_STEPS.length * 900 + 300);
  };

  const reset = () => {
    setStep('idle');
    setResult(null);
    setCurrentAiStep(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenLabel}>AI FACE SCAN</Text>
          <Text style={styles.screenTitle}>Face Analysis</Text>
        </View>

        {/* Camera Preview Area */}
        <View style={styles.cameraWrapper}>
          <LinearGradient
            colors={['#1A1310', '#0F0F0F']}
            style={styles.cameraBox}
          >
            {step === 'idle' && (
              <View style={styles.idleContent}>
                <View style={styles.faceGuide}>
                  {/* Corner guides */}
                  <View style={[styles.corner, styles.tl]} />
                  <View style={[styles.corner, styles.tr]} />
                  <View style={[styles.corner, styles.bl]} />
                  <View style={[styles.corner, styles.br]} />
                  <View style={styles.faceGuideInner}>
                    <Ionicons name="person-outline" size={72} color="#C9A96E44" />
                  </View>
                </View>
                <Text style={styles.guideText}>Position your face within the frame</Text>
              </View>
            )}

            {step === 'analyzing' && (
              <View style={styles.analyzingContent}>
                <View style={styles.scanAnimRing}>
                  <View style={styles.scanAnimRingInner}>
                    <Ionicons name="scan" size={48} color="#C9A96E" />
                  </View>
                </View>
                <View style={styles.aiStepsBox}>
                  {AI_STEPS.map((s, i) => (
                    <View key={s} style={styles.aiStepRow}>
                      <View style={[styles.aiStepDot, i <= currentAiStep && styles.aiStepDotActive]} />
                      <Text style={[styles.aiStepText, i <= currentAiStep && styles.aiStepTextActive]}>
                        {s}
                      </Text>
                      {i < currentAiStep && (
                        <Ionicons name="checkmark" size={14} color="#C9A96E" style={{ marginLeft: 4 }} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {step === 'done' && result && (
              <View style={styles.doneContent}>
                <View style={styles.resultBadge}>
                  <Ionicons name="checkmark-circle" size={32} color="#4ECDC4" />
                  <Text style={styles.resultBadgeText}>Analysis Complete</Text>
                </View>
                <View style={styles.faceShapeResult}>
                  <Text style={styles.faceShapeLabel}>Detected Face Shape</Text>
                  <Text style={styles.faceShapeValue}>{result.faceShape}</Text>
                  <View style={styles.confidenceBar}>
                    <View style={[styles.confidenceFill, { width: `${result.confidence}%` }]} />
                  </View>
                  <Text style={styles.confidenceText}>{result.confidence}% confidence · {result.landmarks} landmarks mapped</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Action Buttons */}
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
              <Text style={styles.analyzingText}>MediaPipe Face Mesh + MobileNetV2 running…</Text>
            </View>
          )}

          {step === 'done' && (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push('/recommendations')}
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

        {/* Hair Analysis Results */}
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

        {/* Top Matches Preview */}
        {step === 'done' && result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Hairstyle Matches</Text>
            {result.topMatches.map((match, i) => (
              <View key={match} style={styles.matchRow}>
                <View style={styles.matchRank}>
                  <Text style={styles.matchRankText}>#{i + 1}</Text>
                </View>
                <View style={styles.matchIcon}>
                  <Ionicons name="cut" size={18} color="#C9A96E" />
                </View>
                <Text style={styles.matchName}>{match}</Text>
                <Ionicons name="chevron-forward" size={16} color="#555" />
              </View>
            ))}
          </View>
        )}

        {/* Tips */}
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

  // Camera Box
  cameraWrapper: { marginHorizontal: 20, marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  cameraBox: { height: 340, borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A', justifyContent: 'center', alignItems: 'center' },

  // Idle
  idleContent: { alignItems: 'center' },
  faceGuide: { width: 200, height: 240, justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative' },
  corner: { width: 24, height: 24, position: 'absolute', borderColor: '#C9A96E', borderWidth: 2.5 },
  tl: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 4 },
  faceGuideInner: { justifyContent: 'center', alignItems: 'center' },
  guideText: { fontSize: 13, color: '#888', textAlign: 'center' },

  // Analyzing
  analyzingContent: { alignItems: 'center', paddingHorizontal: 24 },
  scanAnimRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#C9A96E44', justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
  scanAnimRingInner: { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, borderColor: '#C9A96E', justifyContent: 'center', alignItems: 'center' },
  aiStepsBox: { width: '100%' },
  aiStepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aiStepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginRight: 10 },
  aiStepDotActive: { backgroundColor: '#C9A96E' },
  aiStepText: { fontSize: 13, color: '#555', flex: 1 },
  aiStepTextActive: { color: '#F5F0E8' },

  // Done
  doneContent: { alignItems: 'center', paddingHorizontal: 24 },
  resultBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  resultBadgeText: { fontSize: 16, fontWeight: '700', color: '#4ECDC4', marginLeft: 8 },
  faceShapeResult: { width: '100%', alignItems: 'center' },
  faceShapeLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  faceShapeValue: { fontSize: 36, fontWeight: '800', color: '#C9A96E', letterSpacing: -1, marginBottom: 12 },
  confidenceBar: { width: '80%', height: 4, backgroundColor: '#2A2A2A', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  confidenceFill: { height: '100%', backgroundColor: '#C9A96E', borderRadius: 2 },
  confidenceText: { fontSize: 11, color: '#888' },

  // Actions
  actions: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C9A96E', paddingVertical: 15, borderRadius: 14 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#0F0F0F' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A', paddingVertical: 15, borderRadius: 14, borderWidth: 1, borderColor: '#2A2A2A' },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: '#C9A96E' },
  analyzingLabel: { paddingVertical: 14, alignItems: 'center' },
  analyzingText: { fontSize: 13, color: '#888', fontStyle: 'italic' },

  // Section
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#F5F0E8', marginBottom: 14, letterSpacing: -0.3 },

  // Analysis Grid
  analysisGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  analysisCard: { width: (width - 50) / 2, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2A2A2A' },
  analysisValue: { fontSize: 16, fontWeight: '700', color: '#F5F0E8', marginBottom: 2 },
  analysisLabel: { fontSize: 11, color: '#888' },

  // Match Rows
  matchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  matchRank: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#C9A96E22', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  matchRankText: { fontSize: 11, fontWeight: '700', color: '#C9A96E' },
  matchIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  matchName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#F5F0E8' },

  // Tips
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2A1F10', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tipText: { fontSize: 13, color: '#AAA', flex: 1 },
});