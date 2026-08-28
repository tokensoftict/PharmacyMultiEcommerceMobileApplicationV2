import { Dimensions, StyleSheet } from "react-native";
import { labels } from "@/shared/constants/colors";
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts";

const screenWidth = Dimensions.get('window').width;

/**
 * SalesRepresentativeHome Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: '#F7D9D9',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        borderBottomLeftRadius: theme.borderRadius.lg,
        borderBottomRightRadius: theme.borderRadius.lg,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.sm,
    },
    avatarCustomer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.sm,
    },
    headerText: {
        color: labels.type4.textColor,
        fontSize: theme.typography.lg,
        fontFamily: FONT.BOLD,
    },
    subHeaderText: {
        fontSize: theme.typography.xs,
        color: '#475569',
        marginTop: 2,
    },
    code: {
        fontSize: theme.typography.xs,
        fontFamily: FONT.BOLD,
        borderBottomWidth: 1,
        borderColor: '#d32f2f',
        color: '#d32f2f',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.xs,
    },
    card: {
        backgroundColor: '#d32f2f',
        flex: 1,
        marginHorizontal: theme.spacing.xs,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        ...theme.shadows.sm,
    },
    cardFull: {
        backgroundColor: '#c62828',
        flex: 1,
        marginHorizontal: theme.spacing.sm,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        ...theme.shadows.sm,
    },
    cardContent: {
        alignItems: 'center'
    },
    cardTitle: {
        color: '#fff',
        fontSize: theme.typography.sm,
        marginTop: 2,
        fontFamily: FONT.MEDIUM,
    },
    cardValue: {
        color: '#fff',
        fontSize: theme.typography.xl,
        fontFamily: FONT.BOLD,
        marginTop: 2,
    },
    tabContainer: {
        flex: 1,
        padding: theme.spacing.sm,
        backgroundColor: '#fff'
    },
    searchInput: {
        height: theme.MIN_TOUCH_TARGET,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.xs / 2,
        marginBottom: theme.spacing.sm,
    },
    gridItem: {
        marginBottom: theme.spacing.xs,
    },
    gridCard: {
        backgroundColor: '#fff3f3',
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.sm,
        borderColor: '#ffcdd2',
        borderWidth: 1,
        ...theme.shadows.sm,
    },
    header: {
        flex: 1,
    },
    gridContent: {
        justifyContent: 'center',
    },
    gridTitle: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
        color: '#b00020',
        marginBottom: 2,
    },
    gridSub: {
        fontSize: theme.typography.xs,
        color: '#555',
        marginTop: 1,
    },
    status: {
        fontSize: theme.typography.xs,
        color: labels.type4.textColor,
        fontFamily: FONT.MEDIUM,
        marginTop: 2,
    },
});
