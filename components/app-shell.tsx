import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { AuthUser, UserRole } from '../services/authService';
import { clearSession } from '../services/authService';

type AppShellProps = {
  children: React.ReactNode;
  user?: AuthUser | null;
  role?: UserRole;
  title?: string;
  subtitle?: string;
};

export default function AppShell({ children, user, role, title, subtitle }: AppShellProps) {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const resolvedRole = role ?? user?.role ?? 'user';

  const items = useMemo(
    () => [
      {
        label: 'Home',
        icon: 'home-outline' as const,
        onPress: () => {
          setDrawerVisible(false);
          router.push({ pathname: '/(tabs)', params: { role: resolvedRole } });
        },
      },
      {
        label: 'Profile',
        icon: 'person-outline' as const,
        onPress: () => {
          setDrawerVisible(false);
          router.push({ pathname: '/profile', params: { role: resolvedRole } });
        },
      },
      {
        label: 'Settings',
        icon: 'settings-outline' as const,
        onPress: () => {
          setDrawerVisible(false);
          router.push({ pathname: '/profile', params: { role: resolvedRole, tab: 'settings' } });
        },
      },
    ],
    [resolvedRole, router]
  );

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu-outline" size={22} color="#F5F0E8" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{title ?? 'FaceFit'}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {children}

      <Modal transparent visible={drawerVisible} animationType="fade" onRequestClose={() => setDrawerVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setDrawerVisible(false)} />
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#C9A96E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.drawerName}>{user?.full_name || 'FaceFit User'}</Text>
              <Text style={styles.drawerEmail}>{user?.email || 'Signed in'}</Text>
            </View>
          </View>

          {items.map((item) => (
            <TouchableOpacity key={item.label} style={styles.drawerItem} onPress={item.onPress}>
              <Ionicons name={item.icon} size={18} color="#C9A96E" />
              <Text style={styles.drawerItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0F0F0F',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { color: '#F5F0E8', fontSize: 17, fontWeight: '700' },
  headerSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: '#151515',
    paddingTop: 54,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#2A2A2A',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2A1F10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerName: { color: '#F5F0E8', fontSize: 16, fontWeight: '700' },
  drawerEmail: { color: '#888', fontSize: 12, marginTop: 2 },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  drawerItemText: { color: '#F5F0E8', marginLeft: 12, fontSize: 14, fontWeight: '600' },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  logoutText: { color: '#FF6B6B', marginLeft: 12, fontSize: 14, fontWeight: '700' },
});
