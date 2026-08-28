/**
 * PSGDC Font System
 *
 * Defines the Poppins font family variants used throughout the app.
 *
 * IMPORTANT: On iOS, React Native resolves fontWeight through the fontFamily
 * string (e.g. 'Poppins-Bold' already implies bold weight). Never use the
 * `fontWeight` prop with a custom font family — it produces inconsistent
 * results across platforms.
 *
 * Use FONT constants and let the font file handle the weight.
 */
export const FONT = {
  NORMAL: 'Poppins-Regular',
  BOLD: 'Poppins-Bold',
  EXTRA_BOLD: 'Poppins-ExtraBold',
  MEDIUM: 'Poppins-Medium',
  SEMI_BOLD: 'Poppins-SemiBold',
  LIGHT: 'Poppins-Light',
} as const;

/**
 * Semantic font weight aliases — maps design intent to font family.
 * Use these instead of raw fontWeight numbers.
 *
 * USAGE:
 *   fontFamily: FONT_WEIGHT.heading   // → Poppins-Bold
 *   fontFamily: FONT_WEIGHT.body      // → Poppins-Regular
 */
export const FONT_WEIGHT = {
  /** Regular body text */
  body: FONT.NORMAL,
  /** Slightly emphasised text */
  medium: FONT.MEDIUM,
  /** UI labels, sub-headings */
  semibold: FONT.SEMI_BOLD,
  /** Headings, CTAs */
  heading: FONT.BOLD,
  /** Hero headings, display text */
  display: FONT.EXTRA_BOLD,
  /** De-emphasised, captions */
  light: FONT.LIGHT,
} as const;
