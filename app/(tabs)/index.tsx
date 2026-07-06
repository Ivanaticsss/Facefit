import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import AdminDashboard from './dashboard-admin';
import HairstylistDashboard from './dashboard-hairstylist';
import UserDashboard from './dashboard-user';
import { type UserRole } from '../../services/authService';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role = (params.role as UserRole | undefined) ?? 'user';

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'hairstylist') {
    return <HairstylistDashboard />;
  }

  return <UserDashboard />;
}
