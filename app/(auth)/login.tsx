import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { loginUser, resolveRole, type UserRole } from '../../services/authService';

const ROLE_OPTIONS: Array<{ label: string; value: UserRole; icon: keyof typeof Ionicons.glyphMap }> = [
  { label: 'Admin', value: 'admin', icon: 'shield-checkmark-outline' },
  { label: 'Client', value: 'user', icon: 'person-outline' },
  { label: 'Stylist', value: 'hairstylist', icon: 'cut-outline' },
];

// Base sizes were designed for a 390pt-wide phone (iPhone 12/13/14).
const BASE_WIDTH = 390;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
function scale(size: number, width: number, factor = 0.35) {
  const ratio = width / BASE_WIDTH;
  return Math.round(size + (size * ratio - size) * factor);
}

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('admin@facefit.test');
  const [password, setPassword] = useState('Admin123!');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  // --- Entrance choreography ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // --- Ambient floating orbs ---
  const orbA = useRef(new Animated.Value(0)).current;
  const orbB = useRef(new Animated.Value(0)).current;

  // --- Segmented role control ---
  const [pillLayouts, setPillLayouts] = useState<Record<number, { x: number; width: number }>>({});
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();

    const loop = (val: Animated.Value, distance: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    loop(orbA, 18, 6000);
    loop(orbB, 14, 7400);
  }, []);

  useEffect(() => {
    const idx = ROLE_OPTIONS.findIndex((o) => o.value === selectedRole);
    const layout = pillLayouts[idx];
    if (layout) {
      Animated.parallel([
        Animated.spring(indicatorX, { toValue: layout.x, useNativeDriver: false, friction: 9, tension: 70 }),
        Animated.spring(indicatorWidth, { toValue: layout.width, useNativeDriver: false, friction: 9, tension: 70 }),
      ]).start();
    }
  }, [selectedRole, pillLayouts]);

  const pressIn = () => Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true, friction: 6 }).start();
  const pressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();

  // --- Responsive derived values ---
  const isCompact = width < 360;
  const isShort = height < 700;
  const isTablet = width >= 600;

  const responsive = useMemo(() => {
    return {
      cardMaxWidth: isTablet ? 440 : width - 40 <= 440 ? width - 40 : 440,
      cardPadding: isCompact ? 20 : 26,
      cardRadius: isCompact ? 26 : 32,
      logoSize: isCompact ? 46 : 54,
      heroTitleSize: clamp(scale(24, width), 20, 26),
      heroSubtitleSize: clamp(scale(13, width), 12, 14),
      groupGap: isShort ? 14 : 18,
      inputPaddingV: isCompact ? 12 : 15,
      inputFontSize: clamp(scale(14, width), 13, 15),
      buttonPaddingV: isCompact ? 14 : 17,
      buttonFontSize: clamp(scale(14, width), 13, 15),
      showSubtitle: !(isShort && isCompact),
    };
  }, [width, height, isCompact, isShort, isTablet]);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(identifier.trim(), password, selectedRole);
      if (result.success) {
        const role = (result.role as UserRole | undefined) ?? resolveRole(identifier);
        router.replace({ pathname: '/(tabs)', params: { role } } as any);
      } else {
        Alert.alert('Login failed', result.message || 'Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Login failed', error?.message || 'Unable to reach the backend.');
    } finally {
      setLoading(false);
    }
  };

  const onPillLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width: w } = e.nativeEvent.layout;
    setPillLayouts((prev) => ({ ...prev, [index]: { x, width: w } }));
  };

  const orbATranslate = orbA.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  const orbBTranslate = orbB.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <View style={styles.container}>
        <LinearGradient colors={['#221812', '#100C0A', '#0A0A0A']} style={styles.backgroundGlow} />

        {/* Ambient floating color orbs */}
        <Animated.View
          style={[styles.orbTopRight, { transform: [{ translateY: orbATranslate }] }]}
        />
        <Animated.View
          style={[styles.orbBottomLeft, { transform: [{ translateY: orbBTranslate }] }]}
        />
        <View style={styles.grainOverlay} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 16) + (isShort ? 8 : 20),
              paddingBottom: Math.max(insets.bottom, 16) + 20,
              paddingHorizontal: isCompact ? 16 : 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand lockup, sits above the card */}
          <Animated.View style={[styles.brandLockup, { opacity: headerFade }]}>
            <LinearGradient
              colors={['#E9CE9A', '#C9A96E', '#8D5A63']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.logoBadge, { width: responsive.logoSize, height: responsive.logoSize }]}
            >
              <Ionicons name="sparkles" size={responsive.logoSize * 0.42} color="#0F0F0F" />
            </LinearGradient>
            <Text style={styles.brandWordmark}>FaceFit</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.cardShadowWrap,
              {
                maxWidth: responsive.cardMaxWidth,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 45 : 90}
              tint="dark"
              style={[
                styles.card,
                { padding: responsive.cardPadding, borderRadius: responsive.cardRadius },
              ]}
            >
              <View style={{ marginBottom: responsive.groupGap + 4 }}>
                <Text style={[styles.heroTitle, { fontSize: responsive.heroTitleSize }]}>
                  Welcome back
                </Text>
                {responsive.showSubtitle && (
                  <Text style={[styles.heroSubtitle, { fontSize: responsive.heroSubtitleSize }]}>
                    Sign in to pick up your recommendations and bookings.
                  </Text>
                )}
              </View>

              <View style={[styles.inputGroup, { marginBottom: responsive.groupGap }]}>
                <Text style={styles.inputLabel}>EMAIL / USERNAME</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'email' && styles.inputWrapperActive,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={focusedField === 'email' ? '#E9CE9A' : '#7A7A7A'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      { paddingVertical: responsive.inputPaddingV, fontSize: responsive.inputFontSize },
                    ]}
                    placeholder="admin@facefit.test"
                    placeholderTextColor="#5A5A5A"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { marginBottom: responsive.groupGap }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.forgotLink}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'password' && styles.inputWrapperActive,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={focusedField === 'password' ? '#E9CE9A' : '#7A7A7A'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      { paddingVertical: responsive.inputPaddingV, fontSize: responsive.inputFontSize },
                    ]}
                    placeholder="Admin123!"
                    placeholderTextColor="#5A5A5A"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#7A7A7A"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.inputGroup, { marginBottom: responsive.groupGap + 2 }]}>
                <Text style={styles.inputLabel}>SIGNING IN AS</Text>
                <View style={styles.segmentTrack}>
                  <Animated.View
                    style={[
                      styles.segmentIndicator,
                      { left: indicatorX, width: indicatorWidth },
                    ]}
                  />
                  {ROLE_OPTIONS.map((option, index) => {
                    const active = option.value === selectedRole;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        onLayout={onPillLayout(index)}
                        style={styles.segmentPill}
                        onPress={() => setSelectedRole(option.value)}
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name={option.icon}
                          size={13}
                          color={active ? '#0F0F0F' : '#B8B2BB'}
                          style={{ marginRight: 5 }}
                        />
                        <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#6E4650', '#6E4650'] : ['#E9CE9A', '#C9A96E', '#8D5A63']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, { paddingVertical: responsive.buttonPaddingV }]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#0F0F0F" />
                    ) : (
                      <>
                        <Text style={[styles.buttonText, { fontSize: responsive.buttonFontSize }]}>
                          SIGN IN
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="#0F0F0F" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                  <Ionicons name="logo-google" size={18} color="#F5F0E8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                  <Ionicons name="logo-apple" size={20} color="#F5F0E8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                  <Ionicons name="finger-print-outline" size={19} color="#F5F0E8" />
                </TouchableOpacity>
              </View>

              <View style={styles.rowLinks}>
                <Text style={styles.linkPrompt}>New to FaceFit?</Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.linkAction}>Create an account</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  orbTopRight: {
    position: 'absolute',
    top: -100,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#C9A96E',
    opacity: 0.16,
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: -120,
    left: -110,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#8D5A63',
    opacity: 0.16,
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLockup: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoBadge: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#C9A96E',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  brandWordmark: {
    color: '#F5F0E8',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  cardShadowWrap: {
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    elevation: 14,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 24,
    color: '#F5F0E8',
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#B0A9A4',
    lineHeight: 20,
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    color: '#8A7F89',
    fontSize: 11,
    letterSpacing: 1.7,
    marginBottom: 8,
  },
  forgotLink: {
    color: '#E9CE9A',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputWrapperActive: {
    borderColor: '#C9A96E',
    backgroundColor: 'rgba(201,169,110,0.08)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#F5F0E8',
    paddingVertical: 15,
    fontSize: 14,
  },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    padding: 4,
    position: 'relative',
  },
  segmentIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: '#C9A96E',
    borderRadius: 12,
  },
  segmentPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  segmentText: {
    color: '#B8B2BB',
    fontSize: 12,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#0F0F0F',
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 54,
    shadowColor: '#C9A96E',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonText: {
    color: '#0F0F0F',
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  dividerText: {
    color: '#6B6469',
    fontSize: 11,
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 22,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  linkPrompt: {
    color: '#8A7F89',
    fontSize: 12,
  },
  linkAction: {
    color: '#E9CE9A',
    fontSize: 12,
    fontWeight: '800',
  },
});