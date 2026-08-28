import { StyleSheet, Platform } from "react-native";
import { semantic } from "@/shared/constants/colors";
import { FONT } from "@/shared/constants/fonts";
import { theme } from "@/shared/theme";

/**
 * Cart Screen Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 320,
  },
  summaryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
  },
  summaryIndicator: {
    width: 40,
    height: 4,
    backgroundColor: isDarkMode ? '#334155' : '#E2E8F0',
    borderRadius: theme.borderRadius.full,
    alignSelf: 'center',
    marginBottom: theme.spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs / 2,
  },
  summaryLabel: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#334155' : '#E2E8F0',
    paddingTop: theme.spacing.xs,
    marginTop: theme.spacing.xs / 2,
    marginBottom: theme.spacing.sm,
  },
  totalLabelContainer: {
    flex: 1,
  },
  totalTitle: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
  },
  totalSubtitle: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: theme.typography.lg,
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  btnClear: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.MIN_TOUCH_TARGET,
  },
  btnClearText: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#94A3B8' : '#475569',
  },
  btnCheckout: {
    flex: 2,
    backgroundColor: semantic.alert.danger.d500,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.MIN_TOUCH_TARGET,
    ...theme.shadows.sm,
    shadowColor: semantic.alert.danger.d500,
  },
  btnCheckoutText: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyImageWrapper: {
    width: 160,
    height: 160,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#F1F5F9',
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyImage: {
    width: '60%',
    height: '60%',
  },
  emptyTitle: {
    fontSize: theme.typography.md,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
