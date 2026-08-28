import { StyleSheet } from 'react-native';
import { semantic } from '@/shared/constants/colors.ts';
import { FONT } from '@/shared/constants/fonts';
import { theme } from "@/shared/theme";

/**
 * BrandLists Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
    searchWrapper: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.sm,
        backgroundColor: semantic.text.white,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        ...theme.shadows.sm,
        zIndex: 10,
    },
    categoryMenuContainer: {
        paddingHorizontal: theme.spacing.xs,
        paddingBottom: theme.spacing.xl,
        paddingTop: theme.spacing.sm,
    },
    categoryCard: {
        flex: 1,
        alignItems: 'center',
        margin: theme.spacing.xs / 2,
        backgroundColor: semantic.text.white,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xs,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        ...theme.shadows.sm,
        minWidth: 100,
    },
    imageWrapper: {
        width: 64,
        height: 64,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryImage: {
        width: '75%',
        height: '75%',
        resizeMode: 'contain',
    },
    categoryText: {
        fontSize: theme.typography.xs,
        textAlign: 'center',
        color: semantic.text.black,
        fontFamily: FONT.BOLD,
        letterSpacing: 0.3,
    },
});
