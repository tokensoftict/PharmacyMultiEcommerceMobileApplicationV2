import { Dimensions, StyleSheet } from 'react-native';
import { normalize } from "@/shared/helpers";
import { semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";
const { width } = Dimensions.get('window');
const cardWidth = (width - normalize(40)) / 2;

export default StyleSheet.create({
    container: {
        marginBottom: normalize(24),
    },
    timerBadge: {
        backgroundColor: '#D50000',
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(4),
        borderRadius: normalize(4),
        marginLeft: normalize(8),
    },
    timerText: {
        color: '#fff',
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
    },
    cardContainer: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: normalize(16),
        marginBottom: normalize(16),
        padding: normalize(12),
        elevation: 4,
        shadowColor: '#D50000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#FFEAEA',
    },
    cardInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardContent: {
        flex: 1,
        marginRight: normalize(8),
    },
    badge: {
        backgroundColor: '#FFF1F1',
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(2),
        borderRadius: normalize(4),
        alignSelf: 'flex-start',
        marginBottom: normalize(8),
    },
    badgeText: {
        fontSize: normalize(9),
        color: '#D50000',
        fontFamily: FONT.BOLD,
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: normalize(14),
        fontFamily: FONT.MEDIUM,
        color: '#1A1D1E',
        marginBottom: normalize(4),
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currency: {
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
        color: '#D50000',
    },
    productPrice: {
        fontSize: normalize(18),
        fontFamily: FONT.BOLD,
        color: '#D50000',
    },
    fireIconWrapper: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFF1F1',
        borderRadius: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    fireIcon: {
        fontSize: normalize(20),
    },
    progressContainer: {
        marginTop: normalize(12),
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(4),
    },
    progressText: {
        fontSize: normalize(10),
        color: '#64748B',
        fontFamily: FONT.MEDIUM,
    },
    progressBarBg: {
        height: normalize(6),
        backgroundColor: '#F1F5F9',
        borderRadius: normalize(3),
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#D50000',
        borderRadius: normalize(3),
    },
});
