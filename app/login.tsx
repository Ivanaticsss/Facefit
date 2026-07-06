import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginUser, resolveRole, type UserRole } from '../services/authService';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginUser(username, password);
      if (result.success) {
        const role = (result.role as UserRole) ?? resolveRole(username);
        router.replace(`/dashboard-${role}` as const);
      } else {
        Alert.alert('Login failed', result.message || 'Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Login failed', error?.message || 'Unable to reach the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1310', '#0F0F0F']} style={styles.backgroundGlow} />
      <View style={styles.card}>
        <View style={styles.heroTop}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>FF</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Welcome Back</Text>
            <Text style={styles.heroSubtitle}>Secure access to your FaceFit recommendations and bookings.</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL / USERNAME</Text>
          <TextInput
            style={styles.input}
            placeholder="alexandra@studio.com"
            placeholderTextColor="#7A7A7A"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#7A7A7A"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.forgotButton} onPress={() => Alert.alert('Forgotten?', 'Please contact support to reset your access key.')}> 
          <Text style={styles.forgotText}>Forgotten?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'SIGN IN'}</Text>
        </TouchableOpacity>

        <View style={styles.rowLinks}>
          <Text style={styles.smallCopy}>New to the clinic?</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/register' })}>
            <Text style={styles.linkAction}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerBox}>
          <Text style={styles.footerTitle}>Demo accounts</Text>
          <Text style={styles.footerText}>admin / Admin123!</Text>
          <Text style={styles.footerText}>user / User123!</Text>
          <Text style={styles.footerText}>stylist / Stylist123!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    padding: 24,
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#262626',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#1F150E',
    borderWidth: 1.5,
    borderColor: '#C9A96E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    color: '#C9A96E',
    fontWeight: '800',
    fontSize: 22,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 26,
    color: '#F5F0E8',
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#B8B2BB',
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: '#8A7F89',
    fontSize: 11,
    letterSpacing: 1.7,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    color: '#F5F0E8',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#C9A96E',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#8D5A63',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonText: {
    color: '#F5F0E8',
    fontWeight: '800',
    letterSpacing: 1,
  },
  rowLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  smallCopy: {
    color: '#999',
    fontSize: 12,
  },
  linkAction: {
    color: '#F5F0E8',
    fontSize: 12,
    fontWeight: '700',
  },
  footerBox: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#101010',
    borderWidth: 1,
    borderColor: '#232323',
  },
  footerTitle: {
    color: '#C9A96E',
    fontWeight: '700',
    marginBottom: 10,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
});
