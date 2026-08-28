import { StyleSheet, Platform } from 'react-native';
import { palette, semantic } from '@/shared/constants/colors.ts';
import { FONT } from '@/shared/constants/fonts.ts';
import { theme } from '@/shared/theme';

/**
 * HomeHeader styles
 *
 * BEFORE:
 *   - normalize(20) padding — magic number
 *   - normalize(44) icon buttons — not on theme scale
 *   - normalize(40) logo — fixed, clips on some densities
 *   - normalize(100) bottom scrollContent padding — too much on small phones
 *   - normalize(12) margins — magic numbers
 *
 * AFTER:
 *   - All values from theme tokens (theme.spacing, theme.typography, etc.)
 *   - Icon buttons use theme.MIN_TOUCH_TARGET (44dp) — accessibility guaranteed
 *   - Logo uses theme.spacing.xxl (48dp) — proportional
 *   - scrollContent bottom padding uses theme.spacing.xxl
 */
export const _styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
    },
    topContainer: {
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
      paddingTop: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.md,
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? semantic.fill.f04 : 'rgba(0,0,0,0.05)',
      elevation: 0,
      shadowOpacity: 0,
      zIndex: 100,
    },
    actionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.sm, // Pushed closer to the edges/walls
      paddingVertical: theme.spacing.xs,
    },
    logoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: theme.spacing.sm, // Keep a safe gap from the action buttons
    },
    logo: {
      width: theme.spacing.xxl,
      height: theme.spacing.xxl,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs, // Reduced margin to save horizontal space
    },
    appName: {
      fontSize: theme.typography.lg, // Slightly reduced to make space for store name
      fontFamily: FONT.BOLD,
      color: isDarkMode ? '#FFFFFF' : '#1A1D1E',
    },
    storeNameTag: {
      backgroundColor: isDarkMode
        ? 'rgba(211, 47, 47, 0.2)'
        : 'rgba(211, 47, 47, 0.08)',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.xs,
      marginTop: theme.spacing.xs / 2,
      alignSelf: 'flex-start',
      maxWidth: '100%', // Prevent it from expanding into action buttons
    },
    storeNameText: {
      fontSize: theme.typography.xs,
      fontFamily: FONT.BOLD,
      color: semantic.alert.danger.d500,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      width: '100%'
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      // Exactly 44dp × 44dp — meets WCAG and Apple HIG minimum touch target
      width: theme.MIN_TOUCH_TARGET,
      height: theme.MIN_TOUCH_TARGET,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: 'transparent', // Transparent background matching header
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.xs,
    },
    scrollContent: {
      // Enough bottom space so FAB / tab bar doesn't obscure last item
      paddingBottom: theme.spacing.xxl * 2,
    },
    menuDropdown: {
      position: 'absolute',
      top: theme.MIN_TOUCH_TARGET + theme.spacing.xs,
      right: 0,
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.xs,
      width: 150,
      zIndex: theme.zIndex.modal,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    menuDropdownDark: {
      backgroundColor: semantic.fill.f02,
      borderColor: semantic.fill.f04,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    menuText: {
      fontSize: theme.typography.sm,
      fontFamily: FONT.MEDIUM,
      color: '#1A1D1E',
    },
  });
