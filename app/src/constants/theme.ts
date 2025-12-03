import { fs, sp, radius } from '../utils/scale';

export const colors = {
  // Background
  background: '#09090B',

  // Surfaces
  surface: '#27272A',
  surfaceLight: '#3F3F46',

  // Text
  textPrimary: '#FAFAFA',
  textSecondary: '#71717A',
  textMuted: '#52525B',

  // Gradient (Purple to Blue)
  gradientStart: '#943EFF',
  gradientEnd: '#2938DC',

  // Status colors
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',

  // Border
  border: '#27272A',
  borderLight: '#3F3F46',
};

export const gradients = {
  primary: ['#943EFF', '#2938DC'] as const,
  primaryReverse: ['#2938DC', '#943EFF'] as const,
  surfaceOverlay: ['rgba(148, 62, 255, 0.05)', 'rgba(41, 56, 220, 0.05)'] as const,
};

export const spacing = {
  xs: sp(4),
  sm: sp(8),
  md: sp(12),
  lg: sp(16),
  xl: sp(24),
  xxl: sp(32),
};

export const borderRadius = {
  sm: radius(8),
  md: radius(12),
  lg: radius(16),
  xl: radius(24),
  full: radius(50),
};

export const fontSize = {
  xs: fs(11),
  sm: fs(13),
  md: fs(16),
  lg: fs(17),
  xl: fs(20),
  xxl: fs(24),
};

export const fontFamily = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',
};
