import { Dimensions, Platform, StyleSheet } from "react-native";
import { semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts";
import { theme } from "@/shared/theme";

/**
 * Checkout Stepper Styles (Latest Design Refactor)
 *
 * Refactored using centralized theme tokens — no normalize() calls.
 * _styles is a plain function (not a class), call as _styles(isDarkMode).
 */
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
  },

  // ── Step Progress Header ──────────────────────────────────────────────────
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    margin: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.md,
  },
  stepHeader: {
    flex: 1,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#64748B' : '#94A3B8',
    textAlign: 'center',
    marginBottom: theme.spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepTitleActive: {
    color: semantic.alert.danger.d500,
  },
  stepLine: {
    height: 4,
    width: '80%',
    backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
    borderRadius: theme.borderRadius.xs / 2,
  },
  stepLineActive: {
    backgroundColor: semantic.alert.danger.d500,
  },

  // ── Slide Content Area ────────────────────────────────────────────────────
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  stepsContainer: {
    flexDirection: 'row',
    height: '100%',
    width: SCREEN_WIDTH * 4,
  },
  step: {
    width: SCREEN_WIDTH,
  },

  // ── Navigation Bar ────────────────────────────────────────────────────────
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
  },
  nav: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  button: {
    flexDirection: 'row',
    backgroundColor: semantic.alert.danger.d500,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,   // pill shape
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs / 2,
    ...theme.shadows.md,
    shadowColor: semantic.alert.danger.d500,
  },
  buttonDisabled: {
    backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs / 2,
  },
  buttonSecondaryText: {
    color: isDarkMode ? '#94A3B8' : '#64748B',
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
