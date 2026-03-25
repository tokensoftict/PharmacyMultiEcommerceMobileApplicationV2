import { StyleSheet, Dimensions, Platform } from 'react-native';
import { normalize } from "@/shared/helpers";
import { design, semantic, palette } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: design.text1.background,
        paddingBottom: normalize(16),
        paddingHorizontal: normalize(16),
        // Flat Design: No radius or shadow
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    },
    searchBarWrapper: {
        width: '100%',
    },
    content: {
        flex: 1,
        padding: normalize(20),
    },
    sectionTitle: {
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
        color: '#1A1D1E',
        marginBottom: normalize(16),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    popularGrid: {
        justifyContent: 'space-between',
    },
    productCard: {
        width: (width - normalize(56)) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(16),
        padding: normalize(12),
        marginBottom: normalize(16),
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: normalize(100),
        marginBottom: normalize(12),
    },
    productName: {
        fontSize: normalize(13),
        fontFamily: FONT.MEDIUM,
        color: '#1A1D1E',
        marginBottom: normalize(4),
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: normalize(8),
    },
    currency: {
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
        color: design.text1.background,
    },
    price: {
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
        color: design.text1.background,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: normalize(8),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    badge: {
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(2),
        borderRadius: normalize(4),
    },
    badgeText: {
        fontSize: normalize(8),
        fontFamily: FONT.BOLD,
    },
    expiryBadge: {
        backgroundColor: '#FFF1F1',
    },
    expiryText: {
        color: '#D50000',
    },
    stockBadge: {
        backgroundColor: '#F0FDF4',
    },
    stockText: {
        color: '#16A34A',
    },
    outOfStockBadge: {
        backgroundColor: '#F1F5F9',
    },
    outOfStockText: {
        color: '#64748B',
    },
    outOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: normalize(16),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    outOfStockLabel: {
        backgroundColor: '#1A1D1E',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(4),
    },
    outOfStockLabelText: {
        color: '#FFFFFF',
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
        textTransform: 'uppercase',
    },
    suggestionsList: {
        flex: 1,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(14),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    suggestionText: {
        fontSize: normalize(14),
        fontFamily: FONT.NORMAL,
        color: '#334155',
        marginLeft: normalize(12),
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(12),
    },
    recentSearchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentSearchText: {
        fontSize: normalize(14),
        fontFamily: FONT.MEDIUM,
        color: '#64748B',
        marginLeft: normalize(12),
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: normalize(60),
    },
    emptyTitle: {
        fontSize: normalize(18),
        fontFamily: FONT.BOLD,
        color: '#1A1D1E',
        marginTop: normalize(16),
    },
    emptySub: {
        fontSize: normalize(14),
        color: '#64748B',
        textAlign: 'center',
        marginTop: normalize(8),
        paddingHorizontal: normalize(40),
    }
});
