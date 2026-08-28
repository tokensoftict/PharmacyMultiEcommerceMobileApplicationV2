import { StyleSheet } from "react-native";
import { palette, semantic } from "../../../shared/constants/colors.ts";
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts";

/**
 * Brands Screen Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    holder: {
        flexDirection: "column",
        alignItems: "stretch",
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs / 2,
        backgroundColor: semantic.text.reallightgrey,
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
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        borderStyle: 'solid',
        borderColor: semantic.text.borderColor,
        borderBottomWidth: 2,
        height: 48,
    },
    seeAll: {
        color: semantic.alert.danger.d500,
        fontFamily: FONT.BOLD,
        fontSize: theme.typography.xs,
    },
    categoryName: {
        color: semantic.text.black,
        fontFamily: FONT.BOLD,
        fontSize: theme.typography.sm,
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
        width: '33.33%',              // 3 exact columns — immune to screen size
        paddingHorizontal: theme.spacing.xs / 2,
        paddingBottom: theme.spacing.xs,
    },
});
