import { StyleSheet } from 'react-native';
import { design, labels, palette, semantic } from '../../constants/colors';
import { FONT } from '@/shared/constants/fonts.ts';
import { theme } from '@/shared/theme';

/**
 * CardProduct Styles
 *
 * BEFORE:
 *   - `width: normalize(176)` — hardcoded, overflowed on small screens and
 *     looked tiny on tablets
 *   - `height: normalize(115)` image container — fixed, distorted aspect ratio
 *     across devices
 *   - Inline `width: normalize(170)` in index.tsx conflicted with this sheet
 *   - No tablet-aware sizing
 *
 * AFTER:
 *   - Card width is driven externally via `getCardWidth()` in the parent
 *     list/grid and passed as a prop — this file only styles internals
 *   - Image container uses `aspectRatio: 1` so it's always square and
 *     proportional to the card width (no fixed height needed)
 *   - All spacing/border/shadow from theme tokens
 *   - Tablet: parent grid controls column count (2→3); card adapts automatically
 */
export const _styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    card: {
      // Width is intentionally NOT set here.
      // It is set by the parent (HorizontalProductList / grid) via style prop
      // so the card adapts to 2-column phone grids and 3-column tablet grids.
      backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    containerImage: {
      width: '100%',
      // aspectRatio instead of fixed height — always proportional to card width
      aspectRatio: 1.2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#FAFAFA',
    },
    image: {
      width: '65%',
      height: '75%',
      resizeMode: 'contain',
    },
    name: {
      fontFamily: FONT.LIGHT,
      color: isDarkMode ? semantic.text.white : semantic.text.black,
      fontSize: theme.typography.sm,
      marginBottom: theme.spacing.xs,
      height: theme.spacing.xl,  // Two-line height reserved — avoids layout shifts
    },
    category: {
      color: design.text1.color,
      backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
      paddingVertical: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs,
      alignSelf: 'flex-start',
      fontSize: theme.typography.xs,
      marginVertical: theme.spacing.xs,
    },
    price: {
      color: isDarkMode ? semantic.text.white : semantic.text.black,
      fontSize: theme.typography.body,
      fontFamily: FONT.SEMI_BOLD,
      marginBottom: theme.spacing.xs / 2,
    },
    special: {
      fontSize: theme.typography.xs,
      color: semantic.alert.danger.d500,
      textDecorationLine: 'line-through',
      marginTop: theme.spacing.xs / 2,
    },
    doorStep: {
      fontSize: theme.typography.xs,
      fontFamily: FONT.MEDIUM,
      color: isDarkMode ? semantic.text.white : palette.main.p500,
      marginTop: theme.spacing.xs / 2,
    },
    addToCart: {
      backgroundColor: semantic.alert.danger.d500,
      borderRadius: theme.borderRadius.full,
      width: theme.MIN_TOUCH_TARGET - 8,  // 36dp — still comfortable touch
      height: theme.MIN_TOUCH_TARGET - 8,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    expiryStyle: {
      color: labels.type1.textColor,
      backgroundColor: labels.type1.background,
      paddingVertical: 1,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs,
      fontSize: theme.typography.xs,
    },
    quantityStyle: {
      color: design.text1.color,
      backgroundColor: design.text1.background,
      paddingVertical: 1,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs,
      fontSize: theme.typography.xs,
    },
    outOfStockContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      zIndex: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
    },
    outOfStockBadge: {
      backgroundColor: '#D50000',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs,
      ...theme.shadows.sm,
    },
    outOfStockText: {
      color: '#FFFFFF',
      fontSize: theme.typography.sm,
      fontFamily: FONT.BOLD,
      textTransform: 'uppercase',
    },
    wishlistButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 20,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
      borderRadius: theme.borderRadius.full,
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    wishlistIcon: {
      width: theme.spacing.md,
      height: theme.spacing.md,
      tintColor: '#D50000',
    },
    contentPadding: {
      paddingHorizontal: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.xs,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
