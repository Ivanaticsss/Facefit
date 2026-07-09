import * as SecureStore from 'expo-secure-store';
import api from '../api/axiosConfig';

export type UserRole = 'admin' | 'user' | 'hairstylist';

export type AuthUser = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: UserRole;
};

export function resolveRole(username: string): UserRole {
  const normalized = username.trim().toLowerCase();

  if (normalized === 'admin') {
    return 'admin';
  }

  if (normalized === 'stylist' || normalized.includes('stylist')) {
    return 'hairstylist';
  }

  return 'user';
}

const SESSION_KEY = 'facefit-session';

export async function saveSession(user: AuthUser) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
}

export async function getStoredSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function loginUser(username: string, password: string, requestedRole?: UserRole) {
  try {
    const response = await api.post('/login', { username, password });

    if (response.data?.success) {
      const user = response.data.user as AuthUser | undefined;
      const actualRole = (user?.role as UserRole | undefined) ?? resolveRole(username);

      if (requestedRole && requestedRole !== actualRole) {
        return {
          success: false,
          message: `This account is registered as ${actualRole} and cannot sign in as ${requestedRole}.`,
          role: actualRole,
          user,
        };
      }

      if (user) {
        await saveSession(user);
      }

      return {
        success: true,
        role: actualRole,
        user,
      };
    }

    return { success: false, message: response.data?.message || 'Unable to log in' };
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Network error';
    return { success: false, message };
  }
}

export async function registerUser(fullName: string, email: string, username: string, password: string, role: UserRole = 'user') {
  try {
    const response = await api.post('/register', { full_name: fullName, email, username, password, role });

    return {
      success: response.data?.success,
      message: response.data?.message || 'Unable to create account',
    };
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Network error';
    return { success: false, message };
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}
