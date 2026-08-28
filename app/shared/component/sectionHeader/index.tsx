import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from '@/shared/component/typography';
import { semantic } from '@/shared/constants/colors';
import { FONT } from '@/shared/constants/fonts';
import { theme } from '@/shared/theme';
import useDarkMode from '@/shared/hooks/useDarkMode';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
    showSeeAll?: boolean;
}

const SectionHeader = ({ title, onSeeAll, showSeeAll = true }: SectionHeaderProps) => {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);

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

const _styles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.sm, // Reduced right padding to push button closer to edge
        paddingVertical: theme.spacing.sm,
        backgroundColor: 'transparent',
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accent: {
        width: theme.spacing.xs,
        height: theme.spacing.md - 2, // Adjusted height for smaller title font size
        backgroundColor: '#D50000',
        borderRadius: theme.borderRadius.xs / 2,
        marginRight: theme.spacing.sm,
    },
    title: {
        fontSize: theme.typography.body, // Reduced from lg to md (14dp)
        fontFamily: FONT.BOLD,
        color: isDarkMode ? semantic.text.white : semantic.text.black,
        letterSpacing: 0.5,
    },
    seeAllButton: {
        backgroundColor: '#D50000',
        paddingHorizontal: theme.spacing.md - 4, // Slightly wider padding
        paddingVertical: theme.spacing.xs, // More vertical padding
        borderRadius: theme.borderRadius.sm, // More radius (rectangular rounded)
        minHeight: 32, // Increased height
        justifyContent: 'center',
        alignItems: 'center',
    },
    seeAllText: {
        color: semantic.text.white,
        fontSize: theme.typography.xs, // Restored font size slightly
        fontFamily: FONT.BOLD,
    },
});

export default SectionHeader;
