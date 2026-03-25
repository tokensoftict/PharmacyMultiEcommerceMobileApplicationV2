import { normalize } from "@/shared/helpers";
import { StyleSheet, Platform } from "react-native";
import { FONT } from "@/shared/constants/fonts";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    staticHeader: {

        paddingTop: Platform.OS === 'ios' ? normalize(44) : 0,
        paddingBottom: normalize(12),
        borderBottomLeftRadius: normalize(24),
        borderBottomRightRadius: normalize(24),
        zIndex: 100,

    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        paddingBottom: normalize(40),
    },
    premiumCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(24),
        padding: normalize(24),
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        elevation: 10,
    },
    userHeader: {
        alignItems: 'center',
        marginBottom: normalize(24),
        width: '100%',
    },
    avatar: {
        width: normalize(70),
        height: normalize(70),
        borderRadius: normalize(20),
        marginBottom: normalize(12),
        backgroundColor: '#F1F5F9',
    },
    userName: {
        fontSize: normalize(20),
        fontFamily: FONT.BOLD,
        color: '#1A1D1E',
        textAlign: 'center',
    },
    userRole: {
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
        color: '#D50000',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: normalize(4),
    },
    qrWrapper: {
        padding: normalize(16),
        backgroundColor: '#F8FAFC',
        borderRadius: normalize(20),
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    qrImage: {
    },
    scanNote: {
        marginTop: normalize(24),
        alignItems: 'center',
    },
    scanTitle: {
        fontSize: normalize(15),
        fontFamily: FONT.BOLD,
        color: '#1A1D1E',
    },
    scanSub: {
        fontSize: normalize(13),
        color: '#64748B',
        textAlign: 'center',
        marginTop: normalize(4),
        lineHeight: normalize(18),
    },
    officialBadge: {
        position: 'absolute',
        top: normalize(20),
        right: normalize(20),
    }
});
