import { Platform, StyleSheet } from "react-native";
import { labels, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts.ts";
import { theme } from "@/shared/theme";

/**
 * ProductCard Styles (Latest Modern Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to scale beautifully on any screen size.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    width: theme.MAX_CONTENT_WIDTH ? (theme.MAX_CONTENT_WIDTH - theme.spacing.lg) / 3 : 165, // Base default width, adapts dynamically if overriden
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    margin: theme.spacing.xs, // Adds spacing gap back between cards
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f02 : '#f0f0f0',
    position: 'relative',
    ...theme.shadows.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2, // Maintain consistent responsive image ratio
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  badgeContainer: {
    position: 'absolute',
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    flexDirection: 'column',
    gap: theme.spacing.xs / 2,
  },
  badge: {
    paddingHorizontal: theme.spacing.xs * 1.5,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs,
  },
  badgeText: {
    color: semantic.text.white,
    fontSize: theme.typography.xs - 4,
    fontFamily: FONT.BOLD,
  },
  expiryBadge: {
    backgroundColor: labels.type1.background,
  },
  expiryText: {
    color: labels.type1.textColor,
  },
  quantityBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  info: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs / 2,
  },
  name: {
    fontFamily: FONT.MEDIUM,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    fontSize: theme.typography.sm,
    height: theme.typography.sm * 2.8, // Dynamic height reserve for two-line safety
    marginBottom: theme.spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: theme.typography.body,
    fontFamily: FONT.SEMI_BOLD,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  oldPrice: {
    fontSize: theme.typography.xs,
    color: semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginLeft: theme.spacing.sm,
  },
  doorStep: {
    fontSize: theme.typography.xs - 0.5,
    color: isDarkMode ? semantic.alert.success.s300 : palette.main.p500,
    marginTop: theme.spacing.xs,
    fontFamily: FONT.MEDIUM,
  },
  addToCart: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: '#D50000',
    width: theme.MIN_TOUCH_TARGET - 12, // 32dp layout size
    height: theme.MIN_TOUCH_TARGET - 12,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: semantic.text.white,
    ...theme.shadows.sm,
  },
  outOfStockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  outOfStockBadge: {
    backgroundColor: '#D50000',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
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
    zIndex: 250,
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
    borderRadius: theme.borderRadius.full,
    width: theme.spacing.xl,
    height: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  wishlistIcon: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    tintColor: '#D50000',
  },
});
