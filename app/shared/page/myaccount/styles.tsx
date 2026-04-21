import { normalize } from '../../../shared/helpers';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { semantic, palette } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Profile Card
    profileCard: {
        marginHorizontal: Platform.OS === 'ios' ? normalize(2) : normalize(20),
        borderRadius: normalize(24),
        padding: normalize(16),
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        overflow: 'hidden',
    },
    profileMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    imageContainer: {
        position: 'relative',
    },
    avatar: {
        width: normalize(60),
        height: normalize(60),
        borderRadius: normalize(24),
        borderWidth: 2,
        borderColor: '#F0F0F0',
        backgroundColor: "#FFFFFF"
    },
    editBadge: {
        position: 'absolute',
        bottom: -normalize(4),
        right: -normalize(4),
        backgroundColor: '#D50000',
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(14),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    infoContent: {
        marginLeft: normalize(16),
        flex: 1,
    },
    userName: {
        fontSize: normalize(18),
        color: '#1A1D1E',
        fontFamily: FONT.BOLD,
    },
    userPhone: {
        fontSize: normalize(12),
        color: '#6A6A6A',
        fontFamily: FONT.NORMAL,
        marginTop: normalize(1),
    },
    groupBadge: {
        marginTop: normalize(8),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(8),
        alignSelf: 'flex-start',
    },
    groupText: {
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
    },

    // Loyalty Progress
    loyaltyContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: normalize(20),
        paddingBottom: Platform.OS === 'ios' ? normalize(25) : normalize(0),
    },
    loyaltyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(12),
        width: '100%',
    },
    loyaltyTitle: {
        fontSize: normalize(14),
        color: '#1A1D1E',
        fontFamily: FONT.BOLD,
        flex: 1,
    },
    pointsText: {
        fontSize: normalize(14),
        color: '#D50000',
        fontFamily: FONT.BOLD,
        textAlign: 'right',
        marginRight: Platform.OS === 'ios' ? normalize(22) : normalize(0),
    },
    progressBarBg: {
        height: normalize(8),
        backgroundColor: '#F5F5F5',
        borderRadius: normalize(4),
        overflow: 'hidden',
        marginRight: Platform.OS === 'ios' ? normalize(22) : normalize(0),
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#D50000',
        borderRadius: normalize(4),
    },
    loyaltyFooter: {
        marginTop: normalize(6),
        fontSize: normalize(10),
        color: '#9A9A9A',
        fontFamily: FONT.NORMAL,
        lineHeight: normalize(16),
    },

    // Quick Actions Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: normalize(12),
        marginTop: normalize(16),
    },
    gridItem: {
        width: (width - normalize(48)) / 2,
        backgroundColor: '#F8F9FB',
        margin: normalize(6),
        padding: normalize(16),
        borderRadius: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridIconWrapper: {
        width: normalize(32),
        height: normalize(32),
        borderRadius: normalize(12),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(8),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gridLabel: {
        fontSize: normalize(13),
        color: '#1A1D1E',
        fontFamily: FONT.MEDIUM,
    },
    gridSubLabel: {
        fontSize: normalize(10),
        color: '#9A9A9A',
        fontFamily: FONT.NORMAL,
        marginTop: normalize(2),
    },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#FDF2F2',
        marginHorizontal: normalize(20),
        marginTop: normalize(16),
        borderRadius: normalize(20),
        padding: normalize(16),
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: '#FFEBEE',
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        color: '#D50000',
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: normalize(10),
        fontFamily: FONT.NORMAL,
        marginTop: normalize(4),
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(213, 0, 0, 0.1)',
    },

    // Menu section
    sectionTitle: {
        fontSize: normalize(14),
        color: '#1A1D1E',
        fontFamily: FONT.BOLD,
        marginTop: normalize(25),
        marginBottom: normalize(0),
    },
    menuList: {
        paddingHorizontal: normalize(24),
        paddingBottom: normalize(120),
    }
});
