import { StyleSheet } from "react-native";
import { design, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts.ts";
import { theme } from "@/shared/theme";

/**
 * CardProductHorizontal Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  containerImage: {
    width: 100, // Normalized responsive aspect constraints
    height: 140,
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: theme.typography.md,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    maxHeight: theme.typography.md * 2.8,
    height: theme.typography.md * 2.8,
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs / 2,
    alignSelf: 'flex-start',
    fontSize: theme.typography.xs - 2,
    marginVertical: theme.spacing.xs,
  },
  price: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    marginBottom: theme.spacing.xs / 2,
  },
  special: {
    fontSize: theme.typography.xs,
    color: semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: theme.spacing.xs / 2,
  },
  specialHolder: {
    flexDirection: 'row'
  },
  doorStep: {
    fontSize: theme.typography.xs - 2,
    color: isDarkMode ? semantic.text.white : palette.main.p500,
  },
  totalPrice: {
    marginTop: theme.spacing.xs,
    color: palette.main.p500,
    fontSize: theme.typography.lg,
    fontFamily: FONT.BOLD,
  },
  containerInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  containerCant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cant: {
    backgroundColor: palette.main.p500,
    width: theme.spacing.lg,
    height: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cantText: {
    color: semantic.text.white,
    fontSize: theme.typography.sm,
  },
  outOfStockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  outOfStockBadge: {
    backgroundColor: '#D50000',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs / 2,
    ...theme.shadows.sm,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: theme.typography.xs,
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
  },
  wishlistButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 20,
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
    borderRadius: theme.borderRadius.full,
    width: theme.spacing.md * 1.5,
    height: theme.spacing.md * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  wishlistIcon: {
    width: theme.spacing.sm * 1.5,
    height: theme.spacing.sm * 1.5,
    tintColor: '#D50000',
  },
});
