import { StyleSheet } from "react-native";
import { design, labels, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts";
import { theme } from "@/shared/theme";
import { getScreen } from "@/shared/helpers";

/**
 * SmallCardProduct Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system. The card width is set responsively
 * using screen width proportions to ensure cards align properly in row grids
 * and never "jump around" or shift across different device viewport sizes.
 */
export const _styles = (isDarkMode: boolean) => {
  const { width } = getScreen();
  // Card width calculation — accounts for ALL nesting layers:
  //   holder paddingHorizontal:     spacing.sm * 2  = 16dp
  //   categoryBody paddingHorizontal: spacing.sm * 2 = 16dp
  //   card marginHorizontal (xs/2 each side, 3 cards): spacing.xs * 3 = 12dp
  //   Total deduction: 44dp  →  each card gets (width - 44) / 3
  const numColumns = 3;
  const totalDeduction =
    theme.spacing.sm * 2   // holder left+right padding
    + theme.spacing.sm * 2 // categoryBody left+right padding
    + (theme.spacing.xs / 2) * 2 * numColumns; // card marginHorizontal × 3 cards
  const cardWidth = Math.floor((width - totalDeduction) / numColumns);

  return StyleSheet.create({
    container: {
      width: cardWidth > 90 ? cardWidth : 110, // wider min bounding
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.xs,
      marginHorizontal: theme.spacing.xs / 2,
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFFFFF',
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.xs,
      borderWidth: 1,
      borderColor: isDarkMode ? 'transparent' : '#F0F0F0',
      ...theme.shadows.sm,
    },
    containerImage: {
      width: '100%',
      aspectRatio: 1.2, // Clean relative image dimensioning (no jumping)
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '85%',
      height: '85%',
      resizeMode: 'contain',
    },
    name: {
      fontSize: theme.typography.xs,
      color: isDarkMode ? semantic.text.white : '#1A1D1E',
      fontFamily: FONT.MEDIUM,
      height: theme.typography.xs * 3.2, // Safe two-line reservation
      lineHeight: theme.typography.xs * 1.3,
      marginTop: theme.spacing.xs / 2,
    },
    category: {
      color: semantic.text.white,
      backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
      paddingVertical: 1,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs / 2,
      alignSelf: 'flex-start',
      fontSize: theme.typography.xs - 2,
      marginVertical: 1,
    },
    expiry: {
      backgroundColor: labels.type1.background,
      color: labels.type1.textColor,
      paddingVertical: 1,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs / 2,
      alignSelf: 'flex-start',
      fontSize: theme.typography.xs - 2,
      marginVertical: 1,
    },
    price: {
      color: '#D50000',
      fontSize: theme.typography.xs, // Reduced from sm to xs (9dp)
      fontFamily: FONT.BOLD,
      marginTop: theme.spacing.xs / 2,
    },
    special: {
      fontSize: theme.typography.xs - 2, // Reduced by 2dp
      color: '#9A9A9A',
      textDecorationLine: "line-through",
      fontFamily: FONT.NORMAL,
    },
    doorStep: {
      fontSize: theme.typography.xs - 2,
      color: isDarkMode ? semantic.text.white : palette.main.p500,
    },
    badgeContainer: {
      flexDirection: 'column',
      marginTop: theme.spacing.xs / 2,
      gap: 2,
    },
    stockBadge: {
      backgroundColor: '#E8F5E9',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.xs / 2,
      alignSelf: 'flex-start',
    },
    stockText: {
      fontSize: theme.typography.xs - 1,
      color: '#2E7D32',
      fontFamily: FONT.MEDIUM,
    },
    expiryBadge: {
      backgroundColor: '#FFF3E0',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.xs / 2,
      alignSelf: 'flex-start',
    },
    expiryText: {
      fontSize: theme.typography.xs - 1,
      color: '#EF6C00',
      fontFamily: FONT.MEDIUM,
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
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.xs / 2,
      ...theme.shadows.sm,
    },
    outOfStockText: {
      color: '#FFFFFF',
      fontSize: theme.typography.xs - 1,
      fontFamily: FONT.BOLD,
      textTransform: 'uppercase',
    },
    wishlistButton: {
      position: 'absolute',
      top: 6,          // clear spacing from top wall
      right: 6,        // clear spacing from right wall
      zIndex: 20,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.92)',
      borderRadius: theme.borderRadius.full,
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    wishlistIcon: {
      width: 14,
      height: 14,
      tintColor: '#D50000',
    },
  });
};
