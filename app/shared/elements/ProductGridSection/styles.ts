import { normalize } from '@/shared/helpers';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    sectionTitle: {
        fontSize: normalize(18),

        margin: normalize(10),
        color: 'red',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    productCard: {
        width: '45%',
        padding: normalize(10),
        marginVertical: normalize(8),
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#eee',
        borderWidth: 1,
    },
    price: {
        color: 'red',

        marginTop: normalize(5),
    },
});
