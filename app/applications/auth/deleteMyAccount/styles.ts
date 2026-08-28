import { StyleSheet } from "react-native";
import { labels, palette, semantic } from "../../../shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";
import { theme } from "@/shared/theme";

/**
 * DeleteMyAccount Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  formControl: {
    marginTop: theme.spacing.md,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.display,
    marginBottom: theme.spacing.sm,
    color: '#D9534F',
    textAlign: 'center',
    fontFamily: FONT.BOLD,
  },
  warning: {
    fontSize: theme.typography.sm,
    color: '#333',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    fontFamily: FONT.NORMAL,
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.sm,
    color: '#444',
  },
  button: {
    backgroundColor: '#D9534F',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.sm,
    shadowColor: '#D9534F',
    marginBottom: theme.spacing.sm,
  },
  button2: {
    backgroundColor: '#2ecc71',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.sm,
    shadowColor: '#2ecc71',
    marginBottom: theme.spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.typography.body,
    fontFamily: FONT.BOLD,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: labels.type4.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText2: {
    color: labels.type4.textColor,
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    flex: 1,
    textAlign: 'center',
  },
});
