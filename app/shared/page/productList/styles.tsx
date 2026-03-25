import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import {palette, semantic} from "../../../shared/constants/colors.ts";


export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        paddingHorizontal: normalize(24),
    },
    containerHeader: {
        paddingHorizontal: normalize(24),
        elevation: 14,
        alignSelf: 'stretch',
        shadowOffset: {
            width: normalize(0),
            height: normalize(4),
        },
    },

});
