import { StyleSheet } from 'react-native';
import { palette, semantic } from '../../../constants/colors';
import { theme } from '../../../theme';
import { FONT } from '../../../constants/fonts';

/**
 * Button component styles.
 *
 * BEFORE:
 *   - paddingHorizontal: normalize(sm ? 3 : 10) — too small on large screens
 *   - paddingVertical: normalize(sm ? 5 : 13) — no minimum touch target guarantee
 *   - fontSize: normalize(14) — not on typography scale
 *   - icon fixed normalize(24)
 *
 * AFTER:
 *   - Full-width button uses flex:1 layout (fills parent)
 *   - Minimum height of MIN_TOUCH_TARGET (44dp) always enforced — accessibility
 *   - sm variant is slimmer but still meets a 36dp minimum
 *   - Font from theme.typography scale
 *   - Icon sizes from theme.spacing scale
 */
export const _styles = (disabled: boolean | undefined, sm: boolean | undefined) =>
  StyleSheet.create({
    container: {
      backgroundColor: disabled ? palette.main.pdisabled : palette.main.p500,
      paddingHorizontal: sm ? theme.spacing.sm : theme.spacing.md,
      paddingVertical: sm ? theme.spacing.xs / 2 : theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: sm ? 36 : theme.MIN_TOUCH_TARGET,
      gap: theme.spacing.xs,
    },
    text: {
      color: semantic.text.white,
      fontFamily: FONT.BOLD,
      fontSize: sm ? theme.typography.sm : theme.typography.body,
      textAlign: 'center',
    },
    icon: {
      tintColor: semantic.text.white,
      width: theme.spacing.lg,
      height: theme.spacing.lg,
    },
  });
