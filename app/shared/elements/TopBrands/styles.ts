import { Dimensions, StyleSheet } from 'react-native';
import { normalize } from '@/shared/helpers';
import { FONT } from "@/shared/constants/fonts.ts";
import { semantic, palette } from '@/shared/constants/colors';

const imageSize = normalize(50);
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    },
    sectionHeaderText: {
        color: '#fff',
        fontSize: normalize(16),
    },
    sectionHeaderSubText: {
        color: '#fff',
        fontSize: normalize(10),
        alignSelf: 'center',
    },
    categoryMenuContainer: {
        paddingHorizontal: normalize(16),
        paddingBottom: normalize(10),
        paddingTop: normalize(10),
    },
    categoryCard: {
        backgroundColor: semantic.text.white,
        borderRadius: normalize(12),
        padding: normalize(8),
        marginRight: normalize(16),
        alignItems: 'center',
        width: normalize(85),
        borderWidth: 1,
        borderColor: '#f2f2f2',
        // Premium shadow
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    imageWrapper: {
        width: imageSize,
        height: imageSize,
        borderRadius: normalize(10),
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        marginBottom: normalize(6),
        justifyContent: 'center',
        alignItems: 'center',
        // Subtle glow effect
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    categoryText: {
        fontSize: normalize(10),
        textAlign: 'center',
        color: semantic.text.black,
        fontFamily: FONT.BOLD,
        letterSpacing: 0.3,
    },
    // New fancy elements
    tag: {
        position: 'absolute',
        top: -normalize(5),
        right: -normalize(5),
        backgroundColor: '#D50000',
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(2),
        borderRadius: normalize(10),
        zIndex: 1,
    },
    tagText: {
        color: '#fff',
        fontSize: normalize(8),
        fontFamily: FONT.BOLD,
    }
});
