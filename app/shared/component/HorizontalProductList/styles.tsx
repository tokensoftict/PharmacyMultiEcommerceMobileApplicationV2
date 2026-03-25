import { Dimensions, StyleSheet } from 'react-native';
import { normalize } from '@/shared/helpers';
import { semantic } from '@/shared/constants/colors';
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {

    },
    sectionHeaderContainer: {
        width: '100%',
        height: normalize(50),
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#D50000'
    },
    sectionHeaderImage: {
        resizeMode: 'cover',
        borderRadius: 0,
        alignSelf: 'center',
    },
    sectionHeaderText: {
        color: '#fff',
        fontSize: normalize(14),

        alignSelf: 'center',
    },
    sectionHeaderSubText: {
        color: '#fff',
        fontSize: normalize(10),

        alignSelf: 'center',
    },
    divider: {
        marginRight: normalize(10),
    },
    dividerDots: {
        marginHorizontal: normalize(5),
    },
    image: {
        height: normalize(132),
        width: normalize(272),
        borderRadius: normalize(12)
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalize(10),
    },
    titleSection: {
        fontSize: normalize(18),
        marginLeft: normalize(10),
    },
    containerBanner: {
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: semantic.background.red.d500,
        height: normalize(132),
        width: normalize(272),
        borderRadius: normalize(12),
        opacity: 0.5,
    },
    containerInfo: {
        position: 'absolute',
        left: normalize(6),
        top: normalize(20)
    },
    title: {
        color: semantic.text.white,

        fontSize: normalize(18)
    },
    description: {
        marginTop: normalize(7),
        color: semantic.text.white,

    },
    dot: {
        width: normalize(9),
        height: normalize(9),
        borderRadius: 150,
        backgroundColor: semantic.text.grey,
    },
    dotActive: {
        backgroundColor: semantic.background.red.d500,
    },
});

