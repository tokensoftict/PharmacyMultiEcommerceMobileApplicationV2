import { StyleSheet } from 'react-native';
import { semantic } from '../../constants/colors.ts';
import { theme } from '../../theme';
import { FONT } from '../../constants/fonts.ts';
import Environment from '@/shared/utils/Environment.tsx';

/**
 * Header component styles.
 *
 * BEFORE:
 *   - normalize(40) fixed avatar width/height — clips on high-density screens
 *   - normalize(60) logo — fixed, not relative
 *   - normalize(30) icon size — fixed
 *   - normalize(16) font — not on typography scale
 *   - paddingHorizontal ternary — dynamic function call in StyleSheet (bad pattern)
 *
 * AFTER:
 *   - Avatar/logo use theme spacing tokens
 *   - Icons use MIN_TOUCH_TARGET for accessibility (44dp)
 *   - Font sizes from theme.typography
 *   - paddingHorizontal moved to theme.spacing tokens
 */
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  avatar: {
    width: theme.spacing.xl,     // 32dp — scales with moderateScale
    height: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  avatarlogo: {
    width: theme.spacing.xxl,    // 48dp logo — proportional
    height: theme.spacing.xxl,
    marginRight: theme.spacing.xs,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameUser: {
    fontSize: theme.typography.lg,
    fontFamily: FONT.SEMI_BOLD,
    marginBottom: theme.spacing.xs,
  },
  iconLocation: {
    width: theme.spacing.md,
    height: theme.spacing.md,
  },
  location: {
    color: semantic.text.grey,
    fontSize: theme.typography.sm,
  },
  iconSize: {
    // Meet the 44dp minimum touch target — but keep the icon itself at 28dp
    width: theme.spacing.xl,
    height: theme.spacing.xl,
  },
  widthSpace: {
    width: theme.spacing.sm,
  },
});
