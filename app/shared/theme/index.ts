/**
 * PSGDC – Centralized Theme System
 *
 * Single source of truth for:
 *   - spacing scale
 *   - typography scale
 *   - border radius
 *   - shadows
 *   - z-index
 *
 * All values go through the responsive helpers (moderateScale / fontScale)
 * so they automatically adapt across small Androids → tablets.
 *
 * USAGE:
 *   import { theme } from '@/shared/theme';
 *   style={{ padding: theme.spacing.md, fontSize: theme.typography.body }}
 */
import { Platform } from 'react-native';
import { moderateScale, fontScale, isTablet } from '../helpers';
import { FONT } from '../constants/fonts';

// ---------------------------------------------------------------------------
// Spacing Scale (in dp, responsive via moderateScale)
// xs   →  4dp
// sm   →  8dp
// md   → 16dp
// lg   → 24dp
// xl   → 32dp
// xxl  → 48dp
// ---------------------------------------------------------------------------
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
};

// ---------------------------------------------------------------------------
// Typography Scale (font sizes, all via fontScale so they grow
// slightly but not excessively on tablets)
// ---------------------------------------------------------------------------
export const typography = {
  /** Tiny labels, badges — 9dp */
  xs: fontScale(9),
  /** Small helper text — 11dp */
  sm: fontScale(11),
  /** Body / default text — 13dp */
  body: fontScale(13),
  /** Slightly larger body / list items — 14dp */
  md: fontScale(14),
  /** Sub-headings — 15dp */
  lg: fontScale(15),
  /** Section headings — 17dp */
  xl: fontScale(17),
  /** Page headings — 20dp */
  xxl: fontScale(20),
  /** Hero / display headings — 24dp */
  display: fontScale(24),
};

// ---------------------------------------------------------------------------
// Font families (re-exported for convenience)
// ---------------------------------------------------------------------------
export const fonts = {
  regular: FONT.NORMAL,
  medium: FONT.MEDIUM,
  semiBold: FONT.SEMI_BOLD,
  bold: FONT.BOLD,
  extraBold: FONT.EXTRA_BOLD,
  light: FONT.LIGHT,
};

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------
export const borderRadius = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  full: 9999,
};

// ---------------------------------------------------------------------------
// Shadows (platform-aware)
// ---------------------------------------------------------------------------
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
};

// ---------------------------------------------------------------------------
// Z-Index scale
// ---------------------------------------------------------------------------
export const zIndex = {
  base: 0,
  card: 1,
  overlay: 10,
  modal: 100,
  toast: 200,
};

// ---------------------------------------------------------------------------
// Touch target minimum (WCAG / HIG / Android guideline: 44dp)
// ---------------------------------------------------------------------------
export const MIN_TOUCH_TARGET = moderateScale(44);

// ---------------------------------------------------------------------------
// Layout: max content width for tablet centering
// ---------------------------------------------------------------------------
export const MAX_CONTENT_WIDTH = isTablet() ? 600 : undefined;

// ---------------------------------------------------------------------------
// Convenience: full theme object
// ---------------------------------------------------------------------------
export const theme = {
  spacing,
  typography,
  fonts,
  borderRadius,
  shadows,
  zIndex,
  MIN_TOUCH_TARGET,
  MAX_CONTENT_WIDTH,
};

export default theme;
