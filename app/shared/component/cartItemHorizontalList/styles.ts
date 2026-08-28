import { StyleSheet } from "react-native";
import { design, labels, palette, semantic } from "../../constants/colors";
import { FONT } from "../../constants/fonts";
import { theme } from "../../theme";

/**
 * CartItemHorizontalList Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to look clean, readable, and align perfectly.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
    ...theme.shadows.sm,
  },
  containerImage: {
    width: 80, // Responsive layout bound
    height: 90,
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  containerInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  actions: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    marginBottom: theme.spacing.xs / 2,
  },
  priceTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  price: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
  },
  totalPrice: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
  doorStep: {
    fontSize: theme.typography.xs - 1,
    fontFamily: FONT.MEDIUM,
    color: semantic.alert.danger.d500,
    marginBottom: theme.spacing.xs,
  },
  otherInfo: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  category: {
    color: isDarkMode ? '#60A5FA' : '#0284C7',
    backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.1)' : '#F0F9FF',
    paddingHorizontal: theme.spacing.xs * 1.5,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs / 2,
    fontSize: theme.typography.xs - 2,
    fontFamily: FONT.BOLD,
  },
  expiry: {
    color: isDarkMode ? '#94A3B8' : '#475569',
    backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : '#F1F5F9',
    paddingHorizontal: theme.spacing.xs * 1.5,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs / 2,
    fontSize: theme.typography.xs - 2,
    fontFamily: FONT.BOLD,
  },
  special: {
    fontSize: theme.typography.xs - 1,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  specialHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs / 2,
  },
  dependentBadge: {
    backgroundColor: semantic.alert.danger.d500,
    paddingHorizontal: theme.spacing.xs * 1.5,
    paddingVertical: theme.spacing.xs / 4,
    borderRadius: theme.borderRadius.xs / 2,
    alignSelf: 'flex-start',
  },
  dependentBadgeText: {
    color: '#FFF',
    fontSize: theme.typography.xs - 3,
    fontFamily: FONT.BOLD,
  },
  dependentNote: {
    fontSize: theme.typography.xs - 2,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: theme.spacing.xs / 2,
  },
  linkedContainer: {
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.85,
  }
});
