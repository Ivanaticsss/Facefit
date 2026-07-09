// Shared design tokens for FaceFit — pulled from the admin dashboard's
// palette so every screen (user / stylist / admin / tab bar) stays consistent.
//
// Suggested location in your project: constants/theme.ts
// (dashboards import it as `../../constants/theme`,
//  same relative depth as `../../components/app-shell`)

export const COLORS = {
  // Backgrounds
  bg: '#0A0A0A',
  bgGlowTop: '#1C1410',
  bgElevated: '#14100D',

  // Cards / surfaces
  card: 'rgba(255,255,255,0.045)',
  cardBorder: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.07)',

  // Text
  textPrimary: '#F5F0E8',
  textSecondary: '#B0A9A4',
  textTertiary: '#8A7F89',

  // Accent (the FaceFit gold)
  gold: '#C9A96E',
  goldLight: '#E9CE9A',
  goldDark: '#8D5A63',
  goldWash: 'rgba(201,169,110,0.14)',
  goldWashSoft: 'rgba(201,169,110,0.08)',

  // Status
  success: '#6FA97A',
  danger: '#B25454',
  info: '#4ECDC4',
  violet: '#8B6FBE',

  // On-gold (text/icons placed on top of the gold gradient)
  onGold: '#0F0F0F',
};

export const GRADIENTS = {
  gold: ['#E9CE9A', '#C9A96E', '#8D5A63'] as const,
  bgGlow: ['#1C1410', '#0A0A0A'] as const,
  card: ['#1A1512', '#100D0A'] as const,
};

export const RADII = {
  sm: 12,
  md: 18,
  lg: 22,
  xl: 28,
};

export type Role = 'admin' | 'hairstylist' | 'user';