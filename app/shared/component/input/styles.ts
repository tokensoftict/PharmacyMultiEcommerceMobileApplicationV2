import { StyleSheet } from 'react-native';
import { semantic } from '../../constants/colors';
import { theme } from '../../theme';

/**
 * Input component styles.
 *
 * BEFORE:
 *   - Fixed height: normalize(150) for multiline — clipped on small screens
 *   - Magic number padding values (normalize(12), normalize(5), etc.)
 *   - Font size normalize(13) — inconsistent with typography system
 *   - Label fontSize normalize(16) — too large as a label
 *
 * AFTER:
 *   - Multiline uses minHeight instead of fixed height (content can grow)
 *   - All padding/margin from theme.spacing tokens
 *   - Font sizes from theme.typography scale
 *   - Touch target respects MIN_TOUCH_TARGET (44dp)
 */
export const _styles = (isFocus: boolean, isDarkMode: boolean, multiline: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      borderRadius: theme.borderRadius.sm,
      backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginTop: theme.spacing.xs,
      // Focus ring
      borderWidth: 1.5,
      borderColor: isFocus
        ? '#D32F2F'
        : isDarkMode
          ? 'rgba(255,255,255,0.08)'
          : 'transparent',
      // Ensure minimum touch target height for single-line inputs
      minHeight: multiline ? theme.MIN_TOUCH_TARGET * 2.5 : theme.MIN_TOUCH_TARGET,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
      color: isDarkMode ? semantic.text.white : semantic.text.black,
      fontSize: theme.typography.body,
      // multiline: align text to top and allow natural growth
      ...(multiline
        ? { textAlignVertical: 'top', minHeight: theme.MIN_TOUCH_TARGET * 2.5 }
        : {}),
    },
    label: {
      fontSize: theme.typography.md,
      fontFamily: undefined, // inherits Typography default (FONT.NORMAL)
      color: semantic.text.grey,
    },
  });
