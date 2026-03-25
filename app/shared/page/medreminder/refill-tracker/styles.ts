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
    cardHolder: {
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
    medCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(12), // Reduced from 20
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
    medInfo: {
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
    supplyContainer: {
        marginBottom: normalize(12), // Reduced from 20
    },
    supplyInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(8), // Reduced from 12
    },
    supplyLabel: {
        fontSize: normalize(12), // Reduced from 14
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: '#64748B',
    },
    inventoryRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    supplyValue: {
        fontSize: normalize(16), // Reduced from 18
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#1E293B',
    },
    supplyValueTotal: {
        fontSize: normalize(13),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        color: '#94A3B8',
    },
    progressBarWrapper: {
        backgroundColor: '#F8FAFC',
        padding: normalize(8), // Reduced from 12
        borderRadius: normalize(12), // Reduced from 16
    },
    progressBarBackground: {
        height: normalize(8),
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: normalize(8),
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: normalize(11),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#64748B',
        textAlign: 'right',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    refillButtonWrapper: {
        marginTop: normalize(8),
    },
    buttonContainer: {
        width: '100%',
        height: normalize(50),
        borderRadius: normalize(25),
        overflow: 'hidden',
        shadowColor: '#FF416C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refillButtonText: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        letterSpacing: 0.5,
    },
});
