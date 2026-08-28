import { StyleSheet } from 'react-native';
import { semantic } from '@/shared/constants/colors';
import { theme } from "@/shared/theme";

/**
 * HorizontalProductList Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.sm,
    },
    sectionHeaderContainer: {
        width: '100%',
        height: 50,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#D50000'
    },
    sectionHeaderImage: {
        resizeMode: 'cover',
        borderRadius: 0,
        alignSelf: 'center',
    },
    sectionHeaderText: {
        color: '#fff',
        fontSize: theme.typography.sm,
        alignSelf: 'center',
    },
    sectionHeaderSubText: {
        color: '#fff',
        fontSize: theme.typography.xs,
        alignSelf: 'center',
    },
    divider: {
        marginRight: theme.spacing.xs,
    },
    dividerDots: {
        marginHorizontal: theme.spacing.xs / 2,
    },
    image: {
        height: 130,
        width: 270,
        borderRadius: theme.borderRadius.md,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.xs,
    },
    titleSection: {
        fontSize: theme.typography.xl,
        marginLeft: theme.spacing.xs,
    },
    containerBanner: {
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: semantic.background.red.d500,
        height: 130,
        width: 270,
        borderRadius: theme.borderRadius.md,
        opacity: 0.5,
    },
    containerInfo: {
        position: 'absolute',
        left: theme.spacing.xs,
        top: theme.spacing.md,
    },
    title: {
        color: semantic.text.white,
        fontSize: theme.typography.xl,
    },
    description: {
        marginTop: theme.spacing.xs,
        color: semantic.text.white,
        fontSize: theme.typography.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: theme.borderRadius.full,
        backgroundColor: semantic.text.grey,
    },
    dotActive: {
        backgroundColor: semantic.background.red.d500,
    },
});
