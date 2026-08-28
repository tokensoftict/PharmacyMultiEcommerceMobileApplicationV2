import { StyleSheet } from "react-native";
import { palette } from "../../../shared/constants/colors.ts";
import { theme } from "@/shared/theme";

/**
 * Otp Validation Screen Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
  },
  containerEmail: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  textEmail: {
    color: palette.main.p500,
  },
  titleImageContainer: {
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  form: {
    marginBottom: theme.spacing.md,
  },
  containerBtns: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: theme.spacing.md,
  },
});
