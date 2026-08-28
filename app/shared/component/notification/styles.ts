import { StyleSheet } from "react-native";
import { semantic } from "@/shared/constants/colors";
import { theme } from "../../theme";

/**
 * Notification list component item styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    ...theme.shadows.sm,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
    padding: theme.spacing.sm,
  },
  containerInfo: {
    flex: 1,
  },
  iconContainer: {
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
    marginRight: theme.spacing.sm,
    width: theme.MIN_TOUCH_TARGET + 8, // 52dp aspect square
    height: theme.MIN_TOUCH_TARGET + 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  iconSize: {
    tintColor: isDarkMode ? "#FFF" : "#000",
    width: theme.spacing.lg,
    height: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sm,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  description: {
    color: semantic.text.grey,
    marginTop: theme.spacing.xs / 2,
    fontSize: theme.typography.xs,
  },
});
