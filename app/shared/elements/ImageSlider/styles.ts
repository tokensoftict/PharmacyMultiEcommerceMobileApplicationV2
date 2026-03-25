import { StyleSheet, Dimensions } from 'react-native';
import { normalize } from "@/shared/helpers";
import { FONT } from "@/shared/constants/fonts.ts";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: width,
        marginBottom: normalize(20),
    },
    carouselContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slideContainer: {
        width: width,
        height: normalize(200),
        overflow: 'hidden',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: normalize(20),
    },
    textContainer: {
        maxWidth: '80%',
    },
    title: {
        color: '#FFFFFF',
        fontSize: normalize(22),
        fontFamily: FONT.BOLD,
        marginBottom: normalize(4),
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontFamily: FONT.MEDIUM,
        opacity: 0.9,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(12),
    },
    paginationDot: {
        height: normalize(6),
        borderRadius: normalize(3),
        backgroundColor: '#D1D5DB',
        marginHorizontal: normalize(4),
    },
    activeDot: {
        backgroundColor: '#D50000',
    }
});
