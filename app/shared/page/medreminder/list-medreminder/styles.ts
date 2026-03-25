import { StyleSheet, Dimensions, Platform } from "react-native";
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(20),
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.5,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(40),
    },
    emptyIconWrapper: {
        width: normalize(120),
        height: normalize(120),
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(60),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    emptyText: {
        fontSize: normalize(22),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#1E293B',
        marginBottom: normalize(12),
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: normalize(15),
        color: '#64748B',
        textAlign: 'center',
        lineHeight: normalize(22),
        marginBottom: normalize(32),
    },
    addMedicationButton: {
        width: '100%',
        height: normalize(56),
        borderRadius: normalize(28),
        overflow: 'hidden',
        elevation: 6,
        shadowColor: palette.main.p500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMedicationButtonText: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        letterSpacing: 1,
    },
    medCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(16), // Reduced from 24
        padding: normalize(12), // Reduced from 20
        marginBottom: normalize(10), // Reduced from 16
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    medCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(10), // Reduced from 18
    },
    medBadge: {
        width: normalize(40), // Reduced from 52
        height: normalize(40), // Reduced from 52
        borderRadius: normalize(12), // Reduced from 18
        backgroundColor: `${palette.main.p500}10`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12), // Reduced from 16
    },
    medNameContainer: {
        flex: 1,
    },
    medName: {
        fontSize: normalize(15), // Reduced from 18
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#1E293B',
        marginBottom: normalize(2), // Reduced from 4
    },
    medTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateCreated: {
        fontSize: normalize(12),
        color: '#94A3B8',
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        marginLeft: normalize(4),
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: normalize(12), // Reduced from 16
        padding: normalize(8), // Reduced from 12
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
    },
    statLabel: {
        fontSize: normalize(10),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: normalize(4),
    },
    statValueWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    statValue: {
        fontSize: normalize(14), // Reduced from 16
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#334155',
        marginRight: normalize(4),
    },
    statUnit: {
        fontSize: normalize(11),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: '#64748B',
    },
    sheetContent: {
        padding: normalize(24),
    },
    sheetDrugName: {
        fontSize: normalize(20),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: normalize(8),
    },
    sheetDescription: {
        fontSize: normalize(14),
        color: '#64748B',
        textAlign: 'center',
        marginBottom: normalize(24),
    },
    buttonsHolder: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    sheetActionBtn: {
        alignItems: 'center',
        width: normalize(100),
    },
    actionIconWrapper: {
        width: normalize(56),
        height: normalize(56),
        borderRadius: normalize(28),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    actionBtnText: {
        fontSize: normalize(13),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#475569',
    },
});
