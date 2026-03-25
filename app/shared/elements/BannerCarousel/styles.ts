import { StyleSheet, Dimensions } from 'react-native';
import { normalize } from "@/shared/helpers";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    carousel: {
        marginBottom: normalize(20),
        height: normalize(150),
    },
    bannerSlide: {
        width: width - normalize(40),
        marginHorizontal: normalize(20),
        borderRadius: normalize(10),
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerText: {
        color: 'white',
        fontSize: normalize(18),

    },
});
