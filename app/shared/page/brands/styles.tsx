import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import {palette, semantic} from "../../../shared/constants/colors.ts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    holder : {
        flexDirection : "column",
        alignItems : "flex-start",
        flex: 1,
        paddingHorizontal:normalize(15),
        paddingVertical: normalize(2),
        backgroundColor : semantic.text.reallightgrey,
        alignContent :"center",
        justifyContent : "center"
    },
    searchWrapper: {
        paddingHorizontal: normalize(10),
        paddingTop: normalize(10),
        paddingBottom: normalize(10),
        backgroundColor: '#fff',
        marginTop: normalize(-15),
        marginBottom: normalize(10),
    },
    categoryHeader: {
        flexDirection : "row",
        justifyContent : 'space-between',
        paddingHorizontal: normalize(10),
        paddingVertical : normalize(10),
        borderStyle : 'solid',
        borderColor : semantic.text.borderColor,
        borderBottomWidth : normalize(2),
        height : normalize(43)
    },
    seeAll: {
        color : semantic.alert.danger.d500
    },
    categoryName: {
        color : semantic.text.black
    },
    categoryHolder: {
        width : '100%',
        backgroundColor : semantic.background.white.w500,
        borderRadius: normalize(5),
        shadowOpacity: 0.11,
        shadowRadius: 3,
        elevation: 0.5,
        shadowOffset: {
            width: normalize(0),
            height: normalize(0),
        },
        marginBottom: normalize(5),
    },
    categoryBody: {
        width : '100%',
        paddingHorizontal: normalize(12),
        paddingVertical : normalize(15),
        flexDirection : "row",
        flexWrap: "wrap",
        alignContent :"center",
        justifyContent : "center"
    },

});
