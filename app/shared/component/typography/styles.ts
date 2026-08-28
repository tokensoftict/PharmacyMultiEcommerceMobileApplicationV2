import { StyleSheet } from 'react-native';
import { FONT } from '../../constants/fonts';
import { theme } from '../../theme';

/**
 * Typography base styles.
 *
 * BEFORE: Single normalize(12) size for ALL text — no hierarchy.
 * AFTER:  Uses theme.typography.body (14dp, moderateScale) as the default,
 *         which grows slightly on large phones/tablets while staying readable
 *         on small screens.
 *
 * The Typography component accepts a `style` prop to override on a per-use
 * basis — these are just the sensible defaults.
 */
export const _styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    text: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: theme.typography.body,
      fontFamily: FONT.MEDIUM,  // Medium weight — more readable than Regular
    },
  });
