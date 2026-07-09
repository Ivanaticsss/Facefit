import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AdminDashboard from './dashboard-admin';
import HairstylistDashboard from './dashboard-hairstylist';
import UserDashboard from './dashboard-user';
import { getStoredSession, type AuthUser, type UserRole } from '../../services/authService';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await getStoredSession();
      setSessionUser(stored);
      setLoading(false);
    };

    load();
  }, []);

  const role = (params.role as UserRole | undefined) ?? sessionUser?.role ?? 'user';

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F' }}>
        <ActivityIndicator size="large" color="#C9A96E" />
      </View>
    );
  }

  if (role === 'admin') {
    return <AdminDashboard user={sessionUser} />;
  }

  if (role === 'hairstylist') {
    return <HairstylistDashboard user={sessionUser} />;
  }

  return <UserDashboard user={sessionUser} />;
}
