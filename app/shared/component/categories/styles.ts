import { StyleSheet } from 'react-native';
import { palette, semantic } from "../../constants/colors";
import { theme } from "../../theme";

/**
 * Categories horizontal component styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const _styles = (isDarkMode: boolean | undefined) => StyleSheet.create({
  parentContainer: {
    marginRight: theme.spacing.sm,
  },
  container: {
    borderColor: isDarkMode ? semantic.fill.f01 : '#EEEEEE',
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    minHeight: theme.MIN_TOUCH_TARGET - 12, // Comfortable 32dp minimum touch area
  },
  containerActive: {
    backgroundColor: palette.main.p500,
    borderColor: palette.main.p500,
  },
  image: {
    width: 40,
    height: 40,
  },
  categoryName: {
    textAlign: 'center',
    fontSize: theme.typography.sm,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  categoryNameActive: {
    color: semantic.text.white,
  },
  listCategories: {
    marginTop: theme.spacing.md,
  },
  allCategories: {
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.MIN_TOUCH_TARGET + 8,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  textAll: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.sm,
  },
});
