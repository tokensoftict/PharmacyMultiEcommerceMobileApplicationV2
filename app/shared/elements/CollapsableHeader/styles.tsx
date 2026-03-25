import { normalize } from "@/shared/helpers";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { palette, semantic } from "@/shared/constants/colors.ts";


let HEADER_MAX_HEIGHT: number;
if (Dimensions.get("window").height > 667) {
    if (Platform.OS === "android") {
        HEADER_MAX_HEIGHT = normalize(212)
    } else {
        HEADER_MAX_HEIGHT = normalize(157)
    }
} else {
    HEADER_MAX_HEIGHT = normalize(190)
}


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    header: {
        position: 'absolute',
        top: normalize(0),
        width: '100%',
        zIndex: normalize(10),
        overflow: 'hidden',
    },
    headerBackground: {
        position: 'absolute',
        top: normalize(0),
        left: normalize(0),
        right: normalize(0),
        bottom: normalize(0),
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        paddingTop: normalize(60),
        paddingHorizontal: normalize(10),
        backgroundColor: 'rgba(0,0,0,0.2)', // or rgba if you want tint
        zIndex: 1,
        height: '100%',
    },
    headerText: {
        color: '#fff',
        fontSize: normalize(20),

        marginBottom: normalize(5),
    },
    headerSubtitle: {
        color: '#fff',
        fontSize: normalize(13),

    },
    scrollContent: {
        paddingTop: HEADER_MAX_HEIGHT,
        paddingBottom: normalize(100),
    },
    card: {
        backgroundColor: '#eee',
        padding: normalize(20),
        marginBottom: normalize(20),
        borderRadius: normalize(8),
    },
    cardText: {
        fontSize: normalize(16),
    },
    actionBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: normalize(120),
        backgroundColor: palette.main.p100,
        justifyContent: 'center',
        paddingHorizontal: normalize(16),
        zIndex: normalize(10),
        elevation: normalize(4),
        shadowColor: semantic.background.white.w400,
        shadowOffset: { width: normalize(0), height: normalize(2) },
        shadowOpacity: 0.9,
        shadowRadius: normalize(4),
    },

    actionBarContent: {
        paddingTop: normalize(40),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    actionBarTitle: {
        fontSize: normalize(18),

        color: semantic.text.white,
    },

});
