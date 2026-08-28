import { StyleSheet } from "react-native";
import { palette, semantic } from "../../../shared/constants/colors.ts";
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts";

/**
 * Categories Screen Styles (Latest Design Refactor)
 *
 * Padding structure mirrors brands/ so SmallCardProduct card-width
 * formula (which deducts 44dp total) remains accurate:
 *   holder paddingHorizontal:     spacing.sm * 2 = 16dp
 *   categoryBody paddingHorizontal: spacing.sm * 2 = 16dp
 *   card marginHorizontal (xs/2 per side × 3 cards): 12dp
 *   Total deduction: 44dp  →  3 cards fit perfectly in one row.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    holder: {
        flexDirection: "column",
        alignItems: "stretch",          // was flex-start — caused card to shrink
        paddingHorizontal: theme.spacing.sm, // was lg (24) — now matches brands (8)
        paddingVertical: theme.spacing.xs / 2,
        backgroundColor: isDarkMode ? '#1A1A2E' : '#F8F9FA',
    },
    searchWrapper: {
        paddingHorizontal: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        backgroundColor: '#fff',
        marginTop: -theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    categoryHeader: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        height: 48,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAccent: {
        width: theme.spacing.xs,
        height: theme.spacing.md,
        backgroundColor: '#D50000',
        borderRadius: theme.borderRadius.xs / 2,
        marginRight: theme.spacing.xs,
    },
    seeAll: {
        color: semantic.alert.danger.d500,
        fontSize: theme.typography.xs,
        fontFamily: FONT.BOLD,
    },
    categoryName: {
        color: semantic.text.black,
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
    },
    categoryHolder: {
        width: '100%',
        alignSelf: 'stretch',
        marginBottom: theme.spacing.xs,
    },
    categoryBody: {
        width: '100%',
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    cardWrapper: {
        width: '33.33%',              // 3 exact columns — no pixel math needed
        paddingHorizontal: theme.spacing.xs / 2,
        paddingBottom: theme.spacing.xs,
    },
});
