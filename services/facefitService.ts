import api from '../api/axiosConfig';

export type HaircutRecommendation = {
  id: number;
  name: string;
  category: string;
  gender: string;
  description: string;
  price: number;
  durationMinutes: number;
  matchPercentage: number;
  reason: string;
};

export type Salon = {
  id: number;
  name: string;
  rating: number | null;
  reviews: number | null;
  category: string | null;
  years_in_business: string | null;
  location: string | null;
  status: string | null;
  phone: string | null;
  website: boolean;
  onsite_services: boolean;
  description: string | null;
};

export async function getHaircutRecommendations(faceShape = 'Oval', hairType = 'Straight', gender = 'Unisex') {
  const response = await api.get('/recommendations', {
    params: { faceShape, hairType, gender },
  });

  return response.data as {
    success: boolean;
    faceShape: string;
    hairType: string;
    gender: string;
    recommendations: HaircutRecommendation[];
  };
}

export async function getSalonsForHaircut(haircutName: string) {
  const response = await api.get('/salons', {
    params: { haircut: haircutName },
  });

  return (response.data?.salons ?? []) as Salon[];
}

export async function getUserScans(userId: number) {
  const response = await api.get(`/users/${userId}/scans`);
  return (response.data?.scans ?? []) as Array<any>;
}

export async function getUserSavedStyles(userId: number) {
  const response = await api.get(`/users/${userId}/saved`);
  return (response.data?.saved ?? []) as Array<any>;
}

export async function getUserBookings(userId: number) {
  const response = await api.get(`/users/${userId}/bookings`);
  return (response.data?.bookings ?? []) as Array<any>;
}

export async function saveStyleForUser(userId: number, haircutId: number) {
  const response = await api.post('/saved', { user_id: userId, haircut_id: haircutId });
  return response.data;
}

export async function createBooking(payload: { user_id: number; salon_id: number; haircut_id?: number | null; appointment_at?: string | null; price?: number | null; }) {
  const response = await api.post('/bookings', payload);
  return response.data;
}

export async function saveScan(payload: { user_id: number; haircut_id?: number | null; face_shape?: string | null; hair_type?: string | null; match_percentage?: number | null; }) {
  const response = await api.post('/scans', payload);
  return response.data;
}
