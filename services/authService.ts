import { Platform } from 'react-native';
import Constants from 'expo-constants';

export type UserRole = 'admin' | 'user' | 'hairstylist';

export type AuthUser = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: UserRole;
};

function getApiHost() {
  const debuggerHost = Constants.manifest?.debuggerHost as string | undefined;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }

  return '192.168.50.164';
}

const API_BASE_URL = `http://${getApiHost()}/facefit`;

function parseApiResponse(response: Response) {
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: text };
    }
  });
}

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

function buildFormBody(params: Record<string, string>) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export async function loginUser(username: string, password: string) {
  const body = buildFormBody({ username, password });

  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });

  const result = await parseApiResponse(response);

  if (response.ok && result.success) {
    return { success: true, role: result.role ?? resolveRole(username) };
  }

  return { success: false, message: result.message || 'Unable to log in' };
}

export async function registerUser(fullName: string, email: string, username: string, password: string) {
  const body = buildFormBody({ full_name: fullName, email, username, password });

  const response = await fetch(`${API_BASE_URL}/register.php`, {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });

  const result = await parseApiResponse(response);
  return { success: response.ok && result.success, message: result.message || 'Unable to create account' };
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/dashboard.php`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
