import { StyleSheet } from 'react-native';
import { palette, semantic } from '../../../constants/colors';
import { theme } from '../../../theme';
import { FONT } from '../../../constants/fonts';

/**
 * ButtonOutline styles — updated to match the latest design system.
 *
 * Changes from the old version:
 *   - Uses theme.spacing / theme.typography / theme.borderRadius tokens (no more raw normalize())
 *   - Removed stray `import * as domain from "domain"` (Node.js module — had no effect in RN)
 *   - Border color reflects disabled state using palette token
 *   - minHeight enforces WCAG 44dp touch target
 *   - sm variant for compact contexts (e.g. inline actions)
 *   - Text no longer uses `flex: 1` so it stays centred without layout side-effects
 *   - Icon tint colour now follows the branded red, not white
 */
export const _styles = (
    disabled: boolean | undefined,
    isDarkMode: boolean,
    sm?: boolean,
) =>
    StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? 'transparent' : 'transparent',
            paddingHorizontal: sm ? theme.spacing.sm : theme.spacing.md,
            paddingVertical: sm ? theme.spacing.xs / 2 : theme.spacing.xs,
            borderRadius: theme.borderRadius.sm,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: disabled
                ? (isDarkMode ? '#3A3A3C' : '#CBD5E1')
                : palette.main.p500,
            minHeight: sm ? 36 : theme.MIN_TOUCH_TARGET,
            gap: theme.spacing.xs,
        },
        text: {
            color: disabled
                ? (isDarkMode ? '#4A4A4A' : '#94A3B8')
                : palette.main.p500,
            fontFamily: FONT.BOLD,
            fontSize: sm ? theme.typography.sm : theme.typography.body,
            textAlign: 'center',
        },
        icon: {
            tintColor: disabled
                ? (isDarkMode ? '#4A4A4A' : '#94A3B8')
                : palette.main.p500,
            width: theme.spacing.lg,
            height: theme.spacing.lg,
        },
    });
