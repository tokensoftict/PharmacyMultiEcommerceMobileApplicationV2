import { StyleSheet } from "react-native";
import { palette } from "../../../shared/constants/colors.ts";
import { theme } from "@/shared/theme";

/**
 * ForgotPassword Styles (Latest Design Refactor)
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
  containerTitle: {
    marginVertical: theme.spacing.md,
  },
  formControl: {
    marginBottom: theme.spacing.md,
  },
  titleImageContainer: {
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: theme.spacing.md,
  },
  textEmail: {
    color: palette.main.p500,
  },
  containerEmail: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.typography.md,
    color: '#64748B',
    lineHeight: 22,
  },
  form: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
});
