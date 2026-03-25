import { StyleSheet } from 'react-native';
import { normalize } from "@/shared/helpers";

export default StyleSheet.create({
    couponBanner: {
        marginBottom: normalize(20),
        backgroundColor: 'red',
        padding: normalize(15),
        marginVertical: normalize(10),
        borderRadius: normalize(8),
        alignItems: 'center',
    },
    bannerText: {
        color: 'white',
        fontSize: normalize(16),

    },
});
