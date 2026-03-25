import { StyleSheet } from 'react-native';
import { normalize } from '@/shared/helpers';
import { semantic, palette } from '@/shared/constants/colors.ts';
import { FONT } from '@/shared/constants/fonts';

export const styles = StyleSheet.create({
    searchWrapper: {
        paddingHorizontal: normalize(16),
        paddingTop: normalize(12),
        paddingBottom: normalize(16),
        backgroundColor: semantic.text.white,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        zIndex: 10,
    },
    categoryMenuContainer: {
        paddingHorizontal: normalize(12),
        paddingBottom: normalize(40),
        paddingTop: normalize(16),
    },
    categoryCard: {
        flex: 1,
        alignItems: 'center',
        margin: normalize(3),
        backgroundColor: semantic.text.white,
        borderRadius: normalize(16),
        paddingVertical: normalize(16),
        paddingHorizontal: normalize(8),
        borderWidth: 1,
        borderColor: '#f2f2f2',
        // Premium shadow
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        minWidth: normalize(100),
    },
    imageWrapper: {
        width: normalize(64),
        height: normalize(64),
        borderRadius: normalize(14),
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(10),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryImage: {
        width: '75%',
        height: '75%',
        resizeMode: 'contain',
    },
    categoryText: {
        fontSize: normalize(11),
        textAlign: 'center',
        color: semantic.text.black,
        fontFamily: FONT.BOLD,
        letterSpacing: 0.3,
    },
});
