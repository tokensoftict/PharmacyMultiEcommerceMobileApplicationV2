import { normalize } from "@/shared/helpers";
import { StyleSheet, Platform, StatusBar } from "react-native";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
    },
    // Fixed Top Header (Fancy)
    topContainer: {
        backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
        paddingTop: Platform.OS === 'ios' ? normalize(5) : normalize(12),
        paddingBottom: normalize(4),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 100,
        // Flat Design: No shadow
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? semantic.fill.f04 : 'rgba(0,0,0,0.05)',
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        marginBottom: normalize(8),
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: normalize(10),
        marginRight: normalize(12),
    },
    appName: {
        fontSize: normalize(18),
        fontFamily: FONT.BOLD,
        color: isDarkMode ? '#FFFFFF' : '#1A1D1E',
    },
    storeNameTag: {
        backgroundColor: isDarkMode ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.08)',
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(2),
        borderRadius: normalize(6),
        marginTop: normalize(4),
        alignSelf: 'flex-start',
    },
    storeNameText: {
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        color: semantic.alert.danger.d500,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: normalize(44),
        height: normalize(44),
        borderRadius: normalize(12),
        backgroundColor: isDarkMode ? semantic.fill.f03 : '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: normalize(8),
    },
    scrollContent: {
        paddingBottom: normalize(100),
    },
});
