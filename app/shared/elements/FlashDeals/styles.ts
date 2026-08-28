import { StyleSheet } from 'react-native';
import { semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";
import { theme } from "@/shared/theme";
import { getScreen, getNumColumns } from "@/shared/helpers";

/**
 * FlashDeals Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to scale cleanly on all screen sizes,
 * including tablets and foldable devices.
 */
export const _styles = (isDarkMode: boolean) => {
  const numCols = getNumColumns(2, 3);
  const paddingLeftRight = theme.spacing.md * 2; // Reduced FlatList paddingHorizontal
  const totalGapSpace = theme.spacing.sm * (numCols - 1); // reduced gap
  const { width } = getScreen();
  const cardWidth = Math.floor((width - paddingLeftRight - totalGapSpace) / numCols);

  return StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md, // Reduced vertical spacing
    },
    timerBadge: {
        backgroundColor: '#D50000',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.xs,
        marginLeft: theme.spacing.sm,
    },
    timerText: {
        color: '#fff',
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
    },
    cardContainer: {
        width: cardWidth,
        backgroundColor: isDarkMode ? semantic.fill.f01 : '#fff',
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm, // Reduced vertical spacing
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: isDarkMode ? semantic.fill.f02 : '#FFEAEA',
        ...theme.shadows.sm,
    },
    cardInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardContent: {
        flex: 1,
        marginRight: theme.spacing.xs,
    },
    badge: {
        backgroundColor: '#FFF1F1',
        paddingHorizontal: theme.spacing.xs * 1.5,
        paddingVertical: theme.spacing.xs / 2,
        borderRadius: theme.borderRadius.xs,
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    badgeText: {
        fontSize: theme.typography.xs,
        color: '#D50000',
        fontFamily: FONT.BOLD,
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.MEDIUM,
        color: isDarkMode ? semantic.text.white : '#1A1D1E',
        marginBottom: theme.spacing.xs / 2,
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currency: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
        color: '#D50000',
    },
    productPrice: {
        fontSize: theme.typography.xl,
        fontFamily: FONT.BOLD,
        color: '#D50000',
    },
    fireIconWrapper: {
        width: theme.spacing.xl + 8, // 40dp Equivalent
        height: theme.spacing.xl + 8,
        backgroundColor: '#FFF1F1',
        borderRadius: theme.borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fireIcon: {
        fontSize: theme.typography.xl,
    },
    progressContainer: {
        marginTop: theme.spacing.sm,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs / 2,
    },
    progressText: {
        fontSize: theme.typography.xs,
        color: '#64748B',
        fontFamily: FONT.MEDIUM,
    },
    progressBarBg: {
      height: 6,
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#F1F5F9',
      borderRadius: theme.borderRadius.xs / 2,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#D50000',
      borderRadius: theme.borderRadius.xs / 2,
    },
  });
};
