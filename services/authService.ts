import { Platform } from 'react-native';

export type UserRole = 'admin' | 'user' | 'hairstylist';

export type AuthUser = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: UserRole;
};

const API_BASE_URL = (() => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2/facefit';
  }
  return 'http://localhost/facefit';
})();

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

export async function loginUser(username: string, password: string) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  const result = await parseApiResponse(response);

  if (response.ok && result.success) {
    return { success: true, role: result.role ?? resolveRole(username) };
  }

  return { success: false, message: result.message || 'Unable to log in' };
}

export async function registerUser(fullName: string, email: string, username: string, password: string) {
  const formData = new FormData();
  formData.append('full_name', fullName);
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/register.php`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
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
