import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '../services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !username || !password) {
      Alert.alert('Incomplete form', 'Please fill in all fields before continuing.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(fullName, email, username, password);
      if (result.success) {
        Alert.alert('Account created', 'Your FaceFit account is ready. Please sign in.');
        router.replace('/login');
      } else {
        Alert.alert('Registration failed', result.message || 'Unable to create account.');
      }
    } catch (error: any) {
      Alert.alert('Registration failed', error?.message || 'Unable to reach the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1310', '#0F0F0F']} style={styles.backgroundGlow} />
      <View style={styles.card}>
        <Text style={styles.heading}>Create your FaceFit account</Text>
        <Text style={styles.subheading}>Join the salon experience with secure access and personalized styling.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Alexandra Johnson"
            placeholderTextColor="#7A7A7A"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="alexandra@studio.com"
            placeholderTextColor="#7A7A7A"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>USERNAME</Text>
          <TextInput
            style={styles.input}
            placeholder="alex_johnson"
            placeholderTextColor="#7A7A7A"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#7A7A7A"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
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
    padding: 24,
    backgroundColor: '#0F0F0F',
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
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
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F5F0E8',
    marginBottom: 8,
  },
  subheading: {
    color: '#B8B2BB',
    lineHeight: 22,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
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
  button: {
    backgroundColor: '#8D5A63',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  buttonText: {
    color: '#F5F0E8',
    fontWeight: '800',
    letterSpacing: 1,
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
    color: '#C9A96E',
    fontSize: 12,
    fontWeight: '700',
  },
});