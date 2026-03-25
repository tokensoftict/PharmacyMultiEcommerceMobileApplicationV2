import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import {palette, semantic} from "../../../shared/constants/colors.ts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    holder : {
        flexDirection : "column",
        alignItems : "flex-start",
        flex: 1,
        paddingHorizontal:normalize(16),
        paddingVertical: normalize(8),
        backgroundColor : '#F8F9FA',
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
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAccent: {
        width: normalize(4),
        height: normalize(16),
        backgroundColor: '#D50000',
        borderRadius: normalize(2),
        marginRight: normalize(8),
    },
    seeAll: {
        color : semantic.alert.danger.d500,
    },
    categoryName: {
        color : semantic.text.black,
    },
    categoryHolder: {
        width : '100%',
        backgroundColor : '#fff',
        borderRadius: normalize(12),
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        marginBottom: normalize(16),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
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
