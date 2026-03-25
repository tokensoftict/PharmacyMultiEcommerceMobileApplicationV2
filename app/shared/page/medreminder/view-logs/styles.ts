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
    doseCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: normalize(20),
        padding: normalize(16),
        marginBottom: normalize(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    doseBadge: {
        width: normalize(52),
        height: normalize(52),
        borderRadius: normalize(18),
        justifyContent: "center",
        alignItems: "center",
        marginRight: normalize(16),
    },
    doseInfo: {
        flex: 1,
    },
    medicineName: {
        fontSize: normalize(16),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#1E293B',
        marginBottom: normalize(4),
    },
    doseTime: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        fontSize: normalize(12),
        color: '#94A3B8',
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        marginLeft: normalize(4),
    },
    takeDoseButton: {
        width: normalize(60),
        height: normalize(32),
        borderRadius: normalize(16),
        overflow: 'hidden',
    },
    takeDoseGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    takeDoseText: {
        color: '#FFFFFF',
        fontSize: normalize(12),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
    },
    takenBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ECFDF5",
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(12),
    },
    takenText: {
        color: "#10B981",
        fontSize: normalize(12),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        marginLeft: normalize(4),
    },
    sheetContent: {
        padding: normalize(24),
    },
    sheetTitle: {
        fontSize: normalize(20),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: normalize(12),
    },
    sheetBody: {
        fontSize: normalize(15),
        color: '#64748B',
        textAlign: 'center',
        lineHeight: normalize(22),
        marginBottom: normalize(30),
    },
    buttonsHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rejectButton: {
        flex: 0.45,
        height: normalize(50),
        borderRadius: normalize(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F1F5F9',
    },
    rejectButtonText: {
        color: '#64748B',
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        letterSpacing: 0.5,
    },
    approveButton: {
        flex: 0.5,
        height: normalize(50),
        borderRadius: normalize(25),
        overflow: 'hidden',
    },
    approveGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    approveButtonText: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        letterSpacing: 0.5,
    },
});
