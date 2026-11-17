import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimationsAllowed, useSeasonalTheme } from '../SeasonalThemeProvider';
import ChristmasDecorations from './ChristmasDecorations';
import ChristmasLights from './ChristmasLights';
import ConfettiAnimation from './ConfettiAnimation';
import FestiveGreeting from './FestiveGreeting';
import FireworksAnimation from './FireworksAnimation';
import GoldParticlesAnimation from './GoldParticlesAnimation';
import NewYearCountdown from './NewYearCountdown';
import SeasonalBanner from './SeasonalBanner';
import SnowfallAnimation from './SnowfallAnimation';
import SparkleEffects from './SparkleEffects';

/**
 * Global non-interactive seasonal overlay mounted once at the application root.
 * Respects safe areas, never intercepts touch events (`pointerEvents="none"`),
 * pauses automatically when backgrounded or when reduced-motion is enabled,
 * and renders `null` when no seasonal campaign is active.
 */
export const SeasonalEffects: React.FC = memo(() => {
    const { active, config } = useSeasonalTheme();
    const animate = useAnimationsAllowed();
    const insets = useSafeAreaInsets();

    if (!active) return null;

    const hasAnyOverlay =
        config.show_snowfall ||
        config.show_confetti ||
        config.show_gold_particles ||
        config.show_fireworks ||
        config.show_sparkles;

    if (!hasAnyOverlay) return null;

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {animate && config.show_snowfall && <SnowfallAnimation />}
            {animate && config.show_gold_particles && <GoldParticlesAnimation />}
            {animate && config.show_confetti && <ConfettiAnimation />}
            {animate && config.show_fireworks && <FireworksAnimation />}
            {config.show_sparkles && (
                <View pointerEvents="none" style={[StyleSheet.absoluteFill, { top: insets.top }]}>
                    <SparkleEffects />
                </View>
            )}
        </View>
    );
});

/**
 * Header-level seasonal strip (subtle decorations + optional Christmas lights).
 * Renders nothing when all header decorations are disabled.
 */
export const SeasonalHeaderAccents: React.FC = memo(() => {
    const { active, config } = useSeasonalTheme();
    if (!active) return null;

    const showAny =
        config.show_decorations ||
        config.show_ornaments ||
        config.show_gold_accents ||
        config.show_christmas_lights;

    if (!showAny) return null;

    return (
        <View pointerEvents="none">
            <ChristmasDecorations />
            <ChristmasLights />
        </View>
    );
});

/**
 * Home screen seasonal slots (countdown, festive greeting, and seasonal promotional banner).
 * Renders nothing when disabled so the normal home screen has zero extra whitespace.
 */
export const SeasonalHomeSections: React.FC = memo(() => {
    const { active, config } = useSeasonalTheme();
    if (!active) return null;

    const showAny =
        config.show_greeting ||
        config.show_countdown ||
        config.show_seasonal_banner;

    if (!showAny) return null;

    return (
        <View>
            <FestiveGreeting />
            <NewYearCountdown />
            <SeasonalBanner />
        </View>
    );
});

export default SeasonalEffects;

