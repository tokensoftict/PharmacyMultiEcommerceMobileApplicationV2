import { StyleSheet } from 'react-native'
import { design } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts";
import { theme } from "@/shared/theme";

/**
 * HeaderBack / HeaderWithIcon Styles (Latest Design Refactor)
 *
 * Refactored using centralized theme tokens instead of normalize() calls.
 */
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: design.text1.background,
    alignItems: 'center',
    width: '100%',
    height: 56,
    paddingHorizontal: theme.spacing.sm + 2,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: theme.MIN_TOUCH_TARGET,
  },
  title: {
    fontSize: theme.typography.xl,
    fontFamily: FONT.MEDIUM,
    color: design.text1.color,
    marginLeft: theme.spacing.sm,
    flex: 1,
  }
});
