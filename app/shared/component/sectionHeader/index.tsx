import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from '@/shared/component/typography';
import { normalize } from '@/shared/helpers';
import { palette, semantic } from '@/shared/constants/colors';
import { FONT } from '@/shared/constants/fonts';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
    showSeeAll?: boolean;
}

const SectionHeader = ({ title, onSeeAll, showSeeAll = true }: SectionHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <View style={styles.accent} />
                <Typography style={styles.title}>{title.toUpperCase()}</Typography>
            </View>
            {showSeeAll && (
                <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll} style={styles.seeAllButton}>
                    <Typography style={styles.seeAllText}>SEE ALL</Typography>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(12),
        backgroundColor: 'transparent',
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accent: {
        width: normalize(4),
        height: normalize(18),
        backgroundColor: '#D50000',
        borderRadius: normalize(2),
        marginRight: normalize(8),
    },
    title: {
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
        color: semantic.text.black,
        letterSpacing: 0.5,
    },
    seeAllButton: {
        backgroundColor: '#D50000',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(4),
        borderRadius: normalize(20),
    },
    seeAllText: {
        color: semantic.text.white,
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
    },
});

export default SectionHeader;
