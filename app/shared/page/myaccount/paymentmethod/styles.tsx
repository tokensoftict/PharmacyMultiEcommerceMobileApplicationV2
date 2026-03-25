
import { StyleSheet } from "react-native";
import { semantic } from "../../../constants/colors";
import { normalize } from "@/shared/helpers";

export const _styles = (isDarkMode: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? semantic.background.red.d500 : 'white',
            paddingHorizontal: normalize(10)
        },
        topSpace: {
            height: normalize(32),
        },
        headerBack: {
            paddingHorizontal: normalize(15),
            marginBottom: normalize(10),
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        formContainer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            zIndex: 100,
            backgroundColor: semantic.fill.f03,
            borderTopEndRadius: normalize(20),
            borderTopStartRadius: normalize(20),
        },
        newButton: {
            marginRight: normalize(20),
            backgroundColor: semantic.alert.danger.d500,
            borderRadius: normalize(100),
            width: normalize(45),
            height: normalize(45),
            padding: normalize(10),
            shadowColor: '#171717',
            shadowOffset: { width: normalize(-2), height: normalize(2) },
            shadowOpacity: 0.5,
            shadowRadius: 3,
        },
        footerButtonSheet: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: normalize(24)
        },
        containerInfo: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        containerIcon: {
            backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
            borderRadius: normalize(16),
            width: normalize(64),
            height: normalize(64),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: normalize(12)
        },
        icon: {
            width: normalize(32),
            height: normalize(32),
            tintColor: isDarkMode ? semantic.background.white.w500 : semantic.text.grey
        },
        title: {
            fontSize: normalize(16),

        },
        address: {
            color: semantic.text.grey
        },
        containerAddressDialog: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: normalize(12),
            borderWidth: 2,
            borderRadius: normalize(16),
            marginVertical: normalize(12)
        }
    });
