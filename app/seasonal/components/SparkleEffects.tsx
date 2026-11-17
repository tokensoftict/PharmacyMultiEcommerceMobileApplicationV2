import React, { memo, useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useAnimationsAllowed, useSeasonalTheme } from '../SeasonalThemeProvider';

interface StarSpec {
    id: number;
    leftPct: number;
    topPct: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
}

const COLORS_XMAS = ['#FFF8E1', '#FFD54F', '#FFFFFF', '#FFE082'];
const COLORS_GOLD = ['#FFD700', '#FFF3B0', '#F5D76E', '#FFFFFF'];

const TwinkleStar = memo(({ spec, animate }: { spec: StarSpec; animate: boolean }) => {
    const progress = useSharedValue(animate ? 0 : 0.75);

    useEffect(() => {
        if (!animate) {
            cancelAnimation(progress);
            progress.value = 0.7;
            return;
        }
        progress.value = 0;
        progress.value = withDelay(
            spec.delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: spec.duration, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0.08, { duration: spec.duration, easing: Easing.inOut(Easing.quad) }),
                ),
                -1,
                false,
            ),
        );
        return () => cancelAnimation(progress);
    }, [animate, spec, progress]);

    const style = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [{ scale: 0.55 + progress.value * 0.6 }, { rotate: `${progress.value * 25}deg` }],
    }));

    return (
        <Animated.View
            style={[
                styles.star,
                {
                    left: `${spec.leftPct}%`,
                    top: `${spec.topPct}%`,
                    width: spec.size,
                    height: spec.size,
                },
                style,
            ]}
        >
            <Svg width={spec.size} height={spec.size} viewBox="0 0 24 24">
                <Path
                    d="M12 0 L14.8 9.2 L24 12 L14.8 14.8 L12 24 L9.2 14.8 L0 12 L9.2 9.2 Z"
                    fill={spec.color}
                />
            </Svg>
        </Animated.View>
    );
});

const COUNTS = { low: 7, medium: 12, high: 18 } as const;

/**
 * Tiny glowing 4-point stars that gently twinkle in and out around festive areas.
 */
export const SparkleEffects: React.FC<{ height?: number }> = memo(({ height }) => {
    const { active, config } = useSeasonalTheme();
    const allowed = useAnimationsAllowed();
    const { width } = useWindowDimensions();

    const visible = active && config.show_sparkles;
    const count = COUNTS[config.decoration_intensity];
    const isGold = config.theme === 'new_year' || config.show_gold_accents;

    const specs = useMemo<StarSpec[]>(() => {
        const palette = isGold ? COLORS_GOLD : COLORS_XMAS;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            leftPct: 4 + ((i * 89 + 13) % 92),
            topPct: 6 + ((i * 53 + 7) % (height ? 84 : 38)),
            size: 8 + (i % 4) * 3,
            delay: (i * 230) % 1800,
            duration: 900 + (i % 5) * 260,
            color: palette[i % palette.length],
        }));
    }, [count, isGold, height, Math.round(width / 80)]);

    if (!visible) return null;

    return (
        <View
            pointerEvents="none"
            // Always an absolute overlay (never in layout flow) so it can't add space to its parent.
            style={[StyleSheet.absoluteFill, { opacity: config.background_effect_opacity }]}
        >
            {specs.map((s) => (
                <TwinkleStar key={s.id} spec={s} animate={allowed} />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
    },
});

export default SparkleEffects;

