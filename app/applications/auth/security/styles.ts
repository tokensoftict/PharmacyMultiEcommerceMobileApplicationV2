import { StyleSheet } from "react-native";
import { labels, palette } from "../../../shared/constants/colors";
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts";

/**
 * Security Screen Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  containerEmail: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  textEmail: {
    color: palette.main.p500,
    fontSize: theme.typography.md,
    fontFamily: FONT.BOLD,
  },
  formControl: {
    marginBottom: theme.spacing.md,
  },
  titleImageContainer: {
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  form: {
    marginTop: theme.spacing.md,
  },
  containerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: theme.spacing.md,
  },
  addToCartButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: labels.type4.background,
  },
  buttonText: {
    color: labels.type4.textColor,
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    flex: 1,
    textAlign: 'center',
  },
});
