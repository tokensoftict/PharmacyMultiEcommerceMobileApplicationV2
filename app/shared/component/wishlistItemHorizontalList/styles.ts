import { StyleSheet } from "react-native";
import { semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts";
import { theme } from "@/shared/theme";

/**
 * WishlistItemHorizontalList Styles (Latest Design Refactor)
 *
 * Refactored using centralized theme tokens instead of normalize() calls.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs / 2,
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs + 2,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: isDarkMode ? 'transparent' : '#F1F5F9',
  },
  containerImage: {
    width: 72,
    height: 72,
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8F9FA',
    borderRadius: theme.borderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  containerInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.md,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? semantic.text.white : '#1A1D1E',
    flex: 1,
    lineHeight: theme.typography.md * 1.3,
  },
  removeButton: {
    padding: theme.spacing.xs / 2,
  },
  trashIcon: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    tintColor: '#D50000',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs / 2,
  },
  price: {
    fontSize: theme.typography.lg,
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
  quantityBadge: {
    backgroundColor: isDarkMode ? semantic.fill.f04 : '#E8F5E9',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  quantityText: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.MEDIUM,
    color: isDarkMode ? semantic.text.white : '#2E7D32',
  },
  doorStep: {
    fontSize: theme.typography.xs,
    color: '#757575',
    fontFamily: FONT.NORMAL,
    marginTop: theme.spacing.xs,
  },
});
