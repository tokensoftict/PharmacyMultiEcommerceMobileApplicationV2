import { StyleSheet } from "react-native";
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts";

const primaryColor = '#d32f2f';

/**
 * CustomerProfileModal Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fefefe',
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        paddingBottom: theme.spacing.md,
        maxHeight: '90%',
    },
    header: {
        backgroundColor: primaryColor,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.md,
        alignItems: 'center',
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
    },
    closeBtn: {
        position: 'absolute',
        right: theme.spacing.md,
        top: theme.spacing.md,
        zIndex: 10,
        padding: theme.spacing.xs,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.full,
        borderColor: '#fff',
        borderWidth: 2,
        marginBottom: theme.spacing.xs,
    },
    customerName: {
        fontSize: theme.typography.lg,
        fontFamily: FONT.BOLD,
        color: '#fff',
    },
    customerTag: {
        fontSize: theme.typography.sm,
        color: '#f1f1f1',
    },
    contentContainer: {
        padding: theme.spacing.md,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        ...theme.shadows.sm,
    },
    cardTitle: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
        marginBottom: theme.spacing.xs,
        color: primaryColor,
    },
    label: {
        color: '#666',
        marginTop: theme.spacing.xs,
        fontSize: theme.typography.xs,
    },
    value: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.MEDIUM,
        color: '#333',
    },
    fancyButtonWrapper: {
        marginTop: theme.spacing.xs,
    },
    fancyButtonText: {
        color: '#fff',
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
        textAlign: 'center',
    },
    fancyButtonShadowWrapper: {
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
    fancyButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 48,
    },
});
