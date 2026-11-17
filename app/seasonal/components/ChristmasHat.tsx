import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { useSeasonalTheme } from '../SeasonalThemeProvider';

interface ChristmasHatProps {
    /** Width/height of the logo being decorated (defaults to 40). */
    logoSize?: number;
    style?: ViewStyle;
}

/**
 * Realistic, scalable vector Santa hat that perches naturally on the top-left corner of the app logo.
 * Includes red velvet gradient shading, fluffy white fur brim, and a soft white pom-pom.
 * Controlled independently via `config.show_santa_hat` or `config.logo_decoration === 'santa_hat'`.
 */
export const ChristmasHat: React.FC<ChristmasHatProps> = memo(({ logoSize = 40, style }) => {
    const { active, config } = useSeasonalTheme();
    const visible = active && (config.show_santa_hat || config.logo_decoration === 'santa_hat');

    if (!visible) return null;

    const hatWidth = Math.round(logoSize * 0.78);
    const hatHeight = Math.round(logoSize * 0.68);

    return (
        <View
            pointerEvents="none"
            style={[
                styles.hatContainer,
                {
                    width: hatWidth,
                    height: hatHeight,
                    top: -Math.round(logoSize * 0.34),
                    left: -Math.round(logoSize * 0.18),
                },
                style,
            ]}
        >
            <Svg width={hatWidth} height={hatHeight} viewBox="0 0 64 56">
                <Defs>
                    <LinearGradient id="santaRed" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#FF3B30" />
                        <Stop offset="55%" stopColor="#D32F2F" />
                        <Stop offset="100%" stopColor="#9A0007" />
                    </LinearGradient>
                    <LinearGradient id="furTrim" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#FFFFFF" />
                        <Stop offset="100%" stopColor="#E6ECF2" />
                    </LinearGradient>
                </Defs>

                {/* Drooping red cone */}
                <Path
                    d="M10 40 C12 18, 28 6, 46 10 C54 12, 57 20, 54 27 C49 21, 39 22, 34 30 L48 40 Z"
                    fill="url(#santaRed)"
                />
                {/* Subtle highlight along the crown */}
                <Path
                    d="M16 35 C18 20, 30 11, 43 13"
                    stroke="rgba(255,255,255,0.32)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Fluffy white fur trim along the base */}
                <Path
                    d="M6 40 C6 35, 13 34, 17 36 C21 33, 29 33, 33 36 C37 33, 45 34, 49 37 C53 39, 52 45, 47 46 L10 46 C6 46, 5 43, 6 40 Z"
                    fill="url(#furTrim)"
                    stroke="#DCE3EA"
                    strokeWidth="0.8"
                />
                {/* Soft shadow under trim */}
                <Ellipse cx="28" cy="46.5" rx="20" ry="1.6" fill="rgba(0,0,0,0.16)" />
                {/* White pom-pom at the tip */}
                <Circle cx="54" cy="27" r="6.5" fill="url(#furTrim)" stroke="#DCE3EA" strokeWidth="0.8" />
                <Circle cx="52" cy="25" r="2" fill="#FFFFFF" />
            </Svg>
        </View>
    );
});

interface SeasonalLogoProps {
    logoSize?: number;
    style?: ViewStyle;
    children: React.ReactNode;
}

/**
 * Non-intrusive wrapper around any existing logo `<Image>` that overlays the Santa hat
 * (and optional New Year golden glow border) without altering layout when disabled.
 */
export const SeasonalLogo: React.FC<SeasonalLogoProps> = memo(({ logoSize = 40, style, children }) => {
    const { active, config } = useSeasonalTheme();
    if (!active) {
        return <>{children}</>;
    }

    const goldRing = config.show_gold_accents || config.logo_decoration === 'gold_crown';

    return (
        <View style={[styles.logoWrapper, goldRing && styles.goldRing, style]}>
            {children}
            <ChristmasHat logoSize={logoSize} />
        </View>
    );
});

const styles = StyleSheet.create({
    logoWrapper: {
        position: 'relative',
        overflow: 'visible',
    },
    hatContainer: {
        position: 'absolute',
        zIndex: 10,
        transform: [{ rotate: '-14deg' }],
    },
    goldRing: {
        borderRadius: 10,
        shadowColor: '#D4AF37',
        shadowOpacity: 0.55,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
});

export default ChristmasHat;

