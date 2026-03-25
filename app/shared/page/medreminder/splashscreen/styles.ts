import { StyleSheet, Dimensions, Platform } from "react-native";
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.6,
    },
    circle1: {
        width: width * 1.5,
        height: width * 1.5,
        top: -width * 0.8,
        right: -width * 0.5,
        backgroundColor: '#BFDBFE',
    },
    circle2: {
        width: width * 0.8,
        height: width * 0.8,
        bottom: -width * 0.2,
        left: -width * 0.3,
        backgroundColor: '#DDD6FE',
    },
    lottieWrapper: {
        width: normalize(320),
        height: normalize(320),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: normalize(24),
        alignItems: 'center',
        marginTop: normalize(20),
        zIndex: 1,
    },
    title: {
        fontSize: normalize(26),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#1E293B',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        lineHeight: normalize(34),
    },
    subtitle: {
        fontSize: normalize(16),
        color: '#64748B',
        marginTop: normalize(12),
        textAlign: 'center',
        fontWeight: Platform.OS === 'ios' ? '500' : undefined,
        lineHeight: normalize(24),
    },
    proceedButton: {
        backgroundColor: '#1E293B',
        paddingHorizontal: normalize(24),
        paddingVertical: normalize(12),
        borderRadius: normalize(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    proceedButtonText: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        textTransform: 'uppercase',
    },
});
