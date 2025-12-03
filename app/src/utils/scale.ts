/**
 * Production-ready responsive scaling utilities
 * Using react-native-size-matters
 * Base design: 390 x 844 (iPhone 14 Pro - Figma design)
 */

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Re-export base functions
export { scale, verticalScale, moderateScale };

// Short aliases
export const s = scale;           // Width-based scaling (1:1)
export const vs = verticalScale;  // Height-based scaling (1:1)
export const ms = moderateScale;  // Moderate scaling (default 0.5 factor)

/**
 * Font scaling - slower scale to prevent text from becoming too large/small
 * Factor: 0.3 (30% of the difference)
 */
export const fs = (size: number) => moderateScale(size, 0.3);

/**
 * Spacing/padding scaling - moderate scale
 * Factor: 0.5 (50% of the difference)
 */
export const sp = (size: number) => moderateScale(size, 0.5);

/**
 * Icon scaling - 1:1 with screen width
 */
export const icon = (size: number) => scale(size);

/**
 * Border radius scaling - slower scale for consistency
 * Factor: 0.3
 */
export const radius = (size: number) => moderateScale(size, 0.3);

/**
 * Line height scaling - matches font scaling
 * Factor: 0.3
 */
export const lh = (size: number) => moderateScale(size, 0.3);

/**
 * Component height scaling - moderate scale
 * Factor: 0.4
 */
export const height = (size: number) => moderateScale(size, 0.4);

/**
 * Clamped scaling - prevents values from going too small or too large
 * Useful for critical UI elements
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Font size with min/max bounds
 * Prevents accessibility issues on extreme screen sizes
 */
export const fsClamped = (size: number, minSize?: number, maxSize?: number) => {
  const scaled = fs(size);
  const min = minSize ?? size * 0.8;  // Default min: 80% of original
  const max = maxSize ?? size * 1.3;  // Default max: 130% of original
  return clamp(scaled, min, max);
};

/**
 * Spacing with min/max bounds
 */
export const spClamped = (size: number, minSize?: number, maxSize?: number) => {
  const scaled = sp(size);
  const min = minSize ?? size * 0.7;
  const max = maxSize ?? size * 1.4;
  return clamp(scaled, min, max);
};
