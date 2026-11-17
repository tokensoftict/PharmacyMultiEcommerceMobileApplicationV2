import React, { memo } from 'react';
import { Platform, StyleSheet, Text, TextStyle, View } from 'react-native';
import normalize from 'react-native-normalize';
import { useSeasonalTheme } from '../SeasonalThemeProvider';
import SparkleEffects from './SparkleEffects';

/**
 * Responsive festive greeting card on the home screen (Christmas, New Year or custom).
 * Supports backend-configured message, subtitle, celebration message, alignment,
 * text style (normal, bold, italic, script) and background/text colours.
 * Renders nothing when disabled so normal layout is untouched.
 */
export const FestiveGreeting: React.FC = memo(() => {
    const { active, config } = useSeasonalTheme();

    const headline =
        config.greeting_message ||
        (config.theme === 'new_year' ? config.celebration_message : null);
    const subtitle =
        config.greeting_subtitle ||
        (config.greeting_message && config.celebration_message ? config.celebration_message : null);

    if (!active || !config.show_greeting || (!headline && !subtitle)) {
        return null;
    }

    const isNewYear = config.theme === 'new_year';
    const defaultBg = isNewYear ? '#1B1A2E' : config.primary_festive_color || '#B71C1C';
    const bgColor = config.greeting_background_color || defaultBg;
    const textColor = config.greeting_text_color || (isNewYear ? '#F8E3A1' : '#FFFFFF');
    const goldBorder = isNewYear || config.show_gold_accents;

    const textStyleVariant: TextStyle = {
        textAlign: config.greeting_alignment,
        color: textColor,
        fontWeight:
            config.greeting_text_style === 'bold' || config.greeting_text_style === 'script'
                ? '700'
                : '600',
        fontStyle:
            config.greeting_text_style === 'italic' || config.greeting_text_style === 'script'
                ? 'italic'
                : 'normal',
        fontFamily:
            config.greeting_text_style === 'script'
                ? Platform.select({ ios: 'Georgia', android: 'serif' })
                : undefined,
    };

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: bgColor },
                goldBorder && styles.goldBorder,
            ]}
        >
            <SparkleEffects height={56} />
            {headline ? (
                <Text style={[styles.headline, textStyleVariant]}>{headline}</Text>
            ) : null}
            {subtitle ? (
                <Text
                    style={[
                        styles.subtitle,
                        { textAlign: config.greeting_alignment, color: textColor },
                    ]}
                >
                    {subtitle}
                </Text>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    card: {
        marginHorizontal: normalize(15),
        marginTop: normalize(8),
        marginBottom: normalize(4),
        paddingVertical: normalize(11),
        paddingHorizontal: normalize(14),
        borderRadius: normalize(12),
        overflow: 'hidden',
        position: 'relative',
    },
    goldBorder: {
        borderWidth: 1,
        borderColor: '#D4AF37',
    },
    headline: {
        fontSize: normalize(16),
        letterSpacing: 0.3,
    },
    subtitle: {
        marginTop: normalize(3),
        fontSize: normalize(12.5),
        opacity: 0.92,
    },
});

export default FestiveGreeting;

