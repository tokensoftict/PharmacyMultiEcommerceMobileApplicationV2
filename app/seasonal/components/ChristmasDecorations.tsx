import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon } from 'react-native-svg';
import { useSeasonalTheme } from '../SeasonalThemeProvider';

/**
 * Subtle SVG festive decorations (hanging ornaments/baubles, bells, candy canes,
 * Christmas stars, ribbons, snow-dusted pine & mini trees, or golden New Year stars/trim).
 * Rendered sparingly along the top header edge without obstructing interactive controls.
 */
export const ChristmasDecorations: React.FC = memo(() => {
    const { active, config } = useSeasonalTheme();
    const showAny =
        active && (config.show_decorations || config.show_ornaments || config.show_gold_accents);

    if (!showAny) return null;

    const primary = config.primary_festive_color || (config.theme === 'new_year' ? '#D4AF37' : '#C62828');
    const secondary = config.secondary_festive_color || (config.theme === 'new_year' ? '#FFD54F' : '#2E7D32');
    const rich = config.decoration_intensity !== 'low';

    if (config.theme === 'new_year' && !config.show_decorations && !config.show_ornaments) {
        // Subtle New Year golden hairline accent with corner stars
        return (
            <View pointerEvents="none" style={styles.nyBar}>
                <Svg width="100%" height={14} viewBox="0 0 360 14" preserveAspectRatio="none">
                    <Line x1="12" y1="7" x2="348" y2="7" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6" />
                    <Polygon points="18,2 19.5,5.5 23,7 19.5,8.5 18,12 16.5,8.5 13,7 16.5,5.5" fill="#D4AF37" />
                    <Polygon points="180,1 182,5.5 186.5,7 182,8.5 180,13 178,8.5 173.5,7 178,5.5" fill="#FFD54F" />
                    <Polygon points="342,2 343.5,5.5 347,7 343.5,8.5 342,12 340.5,8.5 337,7 340.5,5.5" fill="#D4AF37" />
                </Svg>
            </View>
        );
    }

    return (
        <View pointerEvents="none" style={styles.container}>
            {/* Left cluster: pine bough with snow cap, ribbon bow, bell & candy cane */}
            {config.show_decorations && (
                <Svg width={96} height={38} viewBox="0 0 96 38" style={styles.leftCluster}>
                    {/* Pine needles */}
                    <Path d="M0 4 Q26 14 54 4 Q32 20 4 18 Z" fill={secondary} opacity={0.9} />
                    {/* Snow cap on pine */}
                    <Path d="M0 3 Q22 9 46 3 Q24 6 0 6 Z" fill="#FFFFFF" opacity={0.9} />
                    {/* Festive ribbon bow */}
                    <Path d="M18 10 C12 5, 10 14, 18 13 C26 14, 24 5, 18 10 Z" fill={primary} />
                    <Circle cx="18" cy="11" r="2.2" fill="#FFD54F" />
                    {/* Golden bell */}
                    <Path d="M32 12 C29 12, 27 16, 26 21 L38 21 C37 16, 35 12, 32 12 Z" fill="#FFD54F" stroke="#C79100" strokeWidth="0.7" />
                    <Circle cx="32" cy="22" r="1.8" fill="#C79100" />
                    {/* Candy cane */}
                    {rich && (
                        <G transform="translate(46, 6) rotate(14)">
                            <Path
                                d="M4 18 L4 6 C4 2.5, 9.5 2.5, 9.5 6"
                                stroke="#FFFFFF"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <Path
                                d="M4 18 L4 6 C4 2.5, 9.5 2.5, 9.5 6"
                                stroke={primary}
                                strokeWidth="3.2"
                                strokeDasharray="2.5,2.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </G>
                    )}
                </Svg>
            )}

            {/* Right cluster: hanging Christmas ornaments (balls), star & mini tree */}
            {(config.show_ornaments || config.show_decorations) && (
                <Svg width={104} height={42} viewBox="0 0 104 42" style={styles.rightCluster}>
                    {config.show_ornaments && (
                        <G>
                            {/* Red bauble */}
                            <Line x1="78" y1="0" x2="78" y2="14" stroke="#B0BEC5" strokeWidth="1" />
                            <Circle cx="78" cy="20" r="6.5" fill={primary} />
                            <Circle cx="76" cy="18" r="1.8" fill="rgba(255,255,255,0.55)" />
                            {/* Gold bauble */}
                            <Line x1="60" y1="0" x2="60" y2="20" stroke="#B0BEC5" strokeWidth="1" />
                            <Circle cx="60" cy="25" r="5" fill="#D4AF37" />
                            <Circle cx="58.5" cy="23.5" r="1.4" fill="rgba(255,255,255,0.6)" />
                        </G>
                    )}
                    {config.show_decorations && rich && (
                        <G>
                            {/* Mini snow-tipped Christmas tree */}
                            <Polygon points="93,8 86,20 100,20" fill={secondary} />
                            <Polygon points="93,14 85,27 101,27" fill={secondary} />
                            {/* Star on top */}
                            <Polygon points="93,3 94.4,6.2 98,6.5 95.2,8.8 96,12 93,10.2 90,12 90.8,8.8 88,6.5 91.6,6.2" fill="#FFD54F" />
                        </G>
                    )}
                </Svg>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 42,
        zIndex: 4,
    },
    leftCluster: {
        position: 'absolute',
        top: 0,
        left: 6,
    },
    rightCluster: {
        position: 'absolute',
        top: 0,
        right: 6,
    },
    nyBar: {
        width: '100%',
        height: 14,
    },
});

export default ChristmasDecorations;

