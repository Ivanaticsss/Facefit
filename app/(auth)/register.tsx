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
import { registerUser, type UserRole } from '../../services/authService';

const ROLE_OPTIONS: Array<{ label: string; value: UserRole; icon: keyof typeof Ionicons.glyphMap }> = [
  { label: 'Client / User', value: 'user', icon: 'person-outline' },
  { label: 'Hairstylist', value: 'hairstylist', icon: 'cut-outline' },
];

// Base sizes were designed for a 390pt-wide phone (iPhone 12/13/14).
const BASE_WIDTH = 390;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
function scale(size: number, width: number, factor = 0.35) {
  const ratio = width / BASE_WIDTH;
  return Math.round(size + (size * ratio - size) * factor);
}

type FieldKey = 'fullName' | 'email' | 'username' | 'password';

function passwordStrength(pw: string): { label: string; score: number; color: string } {
  if (!pw) return { label: '', score: 0, color: 'transparent' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', score, color: '#B25454' };
  if (score === 2 || score === 3) return { label: 'Good', score, color: '#C9A96E' };
  return { label: 'Strong', score, color: '#6FA97A' };
}

export default function RegisterScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);

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

    const loop = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    loop(orbA, 6000);
    loop(orbB, 7400);
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
      heroTitleSize: clamp(scale(23, width), 19, 25),
      heroSubtitleSize: clamp(scale(13, width), 12, 14),
      groupGap: isShort ? 12 : 16,
      inputPaddingV: isCompact ? 12 : 15,
      inputFontSize: clamp(scale(14, width), 13, 15),
      buttonPaddingV: isCompact ? 14 : 17,
      buttonFontSize: clamp(scale(14, width), 13, 15),
      showSubtitle: !(isShort && isCompact),
    };
  }, [width, height, isCompact, isShort, isTablet]);

  const strength = passwordStrength(password);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Incomplete form', 'Please fill in all fields before continuing.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(fullName.trim(), email.trim(), username.trim(), password, selectedRole);
      if (result.success) {
        Alert.alert('Account created', 'Your FaceFit account is ready. Please sign in.');
        router.replace('/(auth)/login');
      } else {
        Alert.alert('Registration failed', result.message || 'Unable to create account.');
      }
    } catch (error: any) {
      Alert.alert('Registration failed', error?.message || 'Unable to reach the backend.');
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

  const renderInput = (opts: {
    field: FieldKey;
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    icon: keyof typeof Ionicons.glyphMap;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'words';
    secure?: boolean;
    marginBottom: number;
  }) => (
    <View style={[styles.inputGroup, { marginBottom: opts.marginBottom }]}>
      <Text style={styles.inputLabel}>{opts.label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focusedField === opts.field && styles.inputWrapperActive,
        ]}
      >
        <Ionicons
          name={opts.icon}
          size={18}
          color={focusedField === opts.field ? '#E9CE9A' : '#7A7A7A'}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            { paddingVertical: responsive.inputPaddingV, fontSize: responsive.inputFontSize },
          ]}
          placeholder={opts.placeholder}
          placeholderTextColor="#5A5A5A"
          value={opts.value}
          onChangeText={opts.onChangeText}
          keyboardType={opts.keyboardType ?? 'default'}
          autoCapitalize={opts.autoCapitalize ?? 'none'}
          secureTextEntry={opts.secure && !showPassword}
          onFocus={() => setFocusedField(opts.field)}
          onBlur={() => setFocusedField(null)}
        />
        {opts.secure && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7A7A7A" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <View style={styles.container}>
        <LinearGradient colors={['#221812', '#100C0A', '#0A0A0A']} style={styles.backgroundGlow} />

        <Animated.View style={[styles.orbTopRight, { transform: [{ translateY: orbATranslate }] }]} />
        <Animated.View style={[styles.orbBottomLeft, { transform: [{ translateY: orbBTranslate }] }]} />

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
          <Animated.View style={[styles.brandLockup, { opacity: headerFade }]}>
            <LinearGradient
              colors={['#E9CE9A', '#C9A96E', '#8D5A63']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.logoBadge, { width: responsive.logoSize, height: responsive.logoSize }]}
            >
              <Ionicons name="person-add" size={responsive.logoSize * 0.4} color="#0F0F0F" />
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
              <View style={{ marginBottom: responsive.groupGap + 6 }}>
                <Text style={[styles.heroTitle, { fontSize: responsive.heroTitleSize }]}>
                  Create your account
                </Text>
                {responsive.showSubtitle && (
                  <Text style={[styles.heroSubtitle, { fontSize: responsive.heroSubtitleSize }]}>
                    Join FaceFit to get personalized recommendations and bookings.
                  </Text>
                )}
              </View>

              {renderInput({
                field: 'fullName',
                label: 'FULL NAME',
                placeholder: 'Your full name',
                value: fullName,
                onChangeText: setFullName,
                icon: 'person-outline',
                autoCapitalize: 'words',
                marginBottom: responsive.groupGap,
              })}

              {renderInput({
                field: 'email',
                label: 'EMAIL',
                placeholder: 'you@example.com',
                value: email,
                onChangeText: setEmail,
                icon: 'mail-outline',
                keyboardType: 'email-address',
                marginBottom: responsive.groupGap,
              })}

              {renderInput({
                field: 'username',
                label: 'USERNAME',
                placeholder: 'your_username',
                value: username,
                onChangeText: setUsername,
                icon: 'at-outline',
                marginBottom: responsive.groupGap,
              })}

              {renderInput({
                field: 'password',
                label: 'PASSWORD',
                placeholder: 'Choose a password',
                value: password,
                onChangeText: setPassword,
                icon: 'lock-closed-outline',
                secure: true,
                marginBottom: password ? 8 : responsive.groupGap,
              })}

              {!!password && (
                <View style={[styles.strengthWrap, { marginBottom: responsive.groupGap + 4 }]}>
                  <View style={styles.strengthTrack}>
                    <View
                      style={[
                        styles.strengthFill,
                        { width: `${(strength.score / 4) * 100}%`, backgroundColor: strength.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                </View>
              )}

              <View style={[styles.inputGroup, { marginBottom: responsive.groupGap + 6 }]}>
                <Text style={styles.inputLabel}>SIGNING UP AS</Text>
                <View style={styles.segmentTrack}>
                  <Animated.View
                    style={[styles.segmentIndicator, { left: indicatorX, width: indicatorWidth }]}
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
                          size={14}
                          color={active ? '#0F0F0F' : '#B8B2BB'}
                          style={{ marginRight: 6 }}
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
                  onPress={handleRegister}
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
                          CREATE ACCOUNT
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="#0F0F0F" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.footerLink}>Sign in</Text>
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
    fontSize: 23,
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
    marginBottom: 16,
  },
  inputLabel: {
    color: '#8A7F89',
    fontSize: 11,
    letterSpacing: 1.7,
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
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 44,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  footerLink: {
    color: '#E9CE9A',
    fontSize: 12,
    fontWeight: '700',
  },
});