import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import { design, palette, semantic } from "../../../shared/constants/colors";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    titleButtonSheet: {
        marginVertical: normalize(24),
        textAlign: 'center',
        fontSize: normalize(18),

    },
    bodyButtonSheet: {
        padding: normalize(24)
    },
    containerProduct: {
        marginVertical: normalize(24),
    },
    footerButtonSheet: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: normalize(24)
    },
    container: {
        flexDirection: 'row',
        // flex: 1,
    },
    containerImage: {
        width: normalize(120),
        height: normalize(170),
        backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
        borderRadius: normalize(16)
    },
    image: {
        width: '100%',
        height: normalize(170)
    },
    name: {
        fontSize: normalize(18),

        color: isDarkMode ? semantic.text.white : semantic.text.black,
        maxHeight: normalize(50),
        height: normalize(50),
    },
    category: {
        color: isDarkMode ? semantic.text.white : design.text1.color,
        backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
        padding: normalize(2),
        paddingLeft: normalize(5),
        borderRadius: normalize(5),
        width: '50%',

        fontSize: normalize(10),
        marginVertical: normalize(8)
    },
    price: {
        fontSize: normalize(16),
        color: isDarkMode ? semantic.text.white : semantic.text.black,

        marginBottom: normalize(4),
    },
    special: {
        fontSize: normalize(12),
        color: semantic.alert.danger.d500,
        textDecorationLine: "line-through",
        marginTop: normalize(5),
    },
    specialHolder: {
        flexDirection: 'row'
    },
    doorStep: {
        fontSize: normalize(10),
        color: isDarkMode ? semantic.text.white : palette.main.p500,

    },
    totalPrice: {
        marginTop: normalize(10),
        color: palette.main.p500,
        fontSize: normalize(20),

    },
    containerInfo: {
        flex: 1,
        marginLeft: normalize(18)
    },
    actions: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    containerCant: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cant: {
        backgroundColor: palette.main.p500,
        width: normalize(24),
        height: normalize(24),
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cantText: {
        color: semantic.text.white,
        fontSize: normalize(16),

    }
})
