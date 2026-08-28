import { Platform, StyleSheet, Dimensions } from "react-native";
import { palette } from "@/shared/constants/colors.ts";
import { theme } from "@/shared/theme";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: '#E2E8F0',
        opacity: 0.5,
    },
    circle1: {
        width: width * 1.2,
        height: width * 1.2,
        top: -width * 0.4,
        right: -width * 0.4,
        backgroundColor: '#BFDBFE',
    },
    circle2: {
        width: width * 0.8,
        height: width * 0.8,
        bottom: -width * 0.2,
        left: -width * 0.4,
        backgroundColor: '#DDD6FE',
    },
    skipButton: {
        position: 'absolute',
        right: theme.spacing.md,
        zIndex: 10,
        padding: theme.spacing.xs,
    },
    skipText: {
        color: '#64748B',
        fontSize: theme.typography.sm,
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        textTransform: 'uppercase',
    },
    carouselWrapper: {
        flex: 1,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    lottieWrapper: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xs,
    },
    title: {
        fontSize: theme.typography.xl,
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    description: {
        fontSize: theme.typography.sm,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: theme.spacing.xs,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 24,
        backgroundColor: palette.main.p500,
    },
    buttonWrapper: {
        width: '100%',
        paddingHorizontal: theme.spacing.xl,
    },
    mainButton: {
        width: '100%',
        height: 50,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        ...theme.shadows.md,
        shadowColor: palette.main.p500,
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: theme.typography.md,
        fontWeight: '800',
        letterSpacing: 1,
    }
});
