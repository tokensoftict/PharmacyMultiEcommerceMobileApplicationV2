
import { normalize } from '@/shared/helpers';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: normalize(15),
        elevation: 10,
    },
    title: {
        fontSize: 22,

        marginBottom: normalize(10),
        alignSelf: 'center',
        color: '#333',
    },
    map: {
        width: '100%',
        height: normalize(150),
        borderRadius: 10,
        marginBottom: normalize(10),
    },
    label: {
        fontSize: 14,
        marginVertical: normalize(2),
        color: '#555',
        textAlign: 'left',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: normalize(15),
    },
    actionButton: {
        padding: normalize(14),
        borderRadius: 50,
        elevation: 3,
    },
    icon: {
        width: normalize(24),
        height: normalize(24),
        resizeMode: 'contain',
    },
    closeButton: {
        backgroundColor: '#eee',
        borderRadius: 10,
        paddingVertical: normalize(10),
        alignItems: 'center',
    },
    closeText: {

        color: '#444',
    },
});
