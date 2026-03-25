import { Platform, StyleSheet, Dimensions } from "react-native";
import { FONT } from "@/shared/constants/fonts.ts";
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

const { width, height } = Dimensions.get('window');

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
        top: Platform.OS === 'ios' ? normalize(60) : normalize(40),
        right: normalize(20),
        zIndex: 10,
        padding: normalize(8),
    },
    skipText: {
        color: '#64748B',
        fontSize: normalize(15),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        textTransform: 'uppercase',
    },
    carouselWrapper: {
        flex: 1,
        marginTop: normalize(40),
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: normalize(24),
    },
    lottieWrapper: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        alignItems: 'center',
        marginTop: normalize(10),
    },
    title: {
        fontSize: normalize(24),
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: normalize(16),
        fontWeight: '900',
        lineHeight: normalize(32),
        textTransform: 'uppercase',
    },
    description: {
        fontSize: normalize(15),
        color: '#64748B',
        textAlign: 'center',
        lineHeight: normalize(22),
        paddingHorizontal: normalize(10),
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? normalize(50) : normalize(30),
        width: '100%',
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        marginBottom: normalize(40),
    },
    paginationDot: {
        width: normalize(8),
        height: normalize(8),
        borderRadius: normalize(4),
        backgroundColor: '#CBD5E1',
        marginHorizontal: normalize(4),
    },
    paginationDotActive: {
        width: normalize(24),
        backgroundColor: palette.main.p500,
    },
    buttonWrapper: {
        width: '100%',
        paddingHorizontal: normalize(32),
    },
    mainButton: {
        width: '100%',
        height: normalize(56),
        borderRadius: normalize(28),
        overflow: 'hidden',
        elevation: 8,
        shadowColor: palette.main.p500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: normalize(16),
        fontWeight: '800',
        letterSpacing: 1,
    }
});
