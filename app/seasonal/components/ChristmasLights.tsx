import React, { memo, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LIGHTS_BLINK_MS } from '../seasonalConfig';
import { useAnimationsAllowed, useSeasonalTheme } from '../SeasonalThemeProvider';

const BULB_COLORS = ['#E53935', '#43A047', '#FDD835', '#1E88E5', '#D4AF37'];

interface BulbProps {
    color: string;
    even: boolean;
    phase: SharedValue<number>;
}

const Bulb = memo(({ color, even, phase }: BulbProps) => {
    const animStyle = useAnimatedStyle(() => {
        const v = even ? phase.value : 1 - phase.value;
        const opacity = 0.45 + 0.55 * v;
        const scale = 0.92 + 0.14 * v;
        return {
            opacity,
            transform: [{ scale }],
        };
    });

    return (
        <View style={styles.bulbSlot}>
            <View style={styles.socket} />
            <Animated.View
                style={[
                    styles.bulb,
                    {
                        backgroundColor: color,
                        shadowColor: color,
                    },
                    animStyle,
                ]}
            />
        </View>
    );
});

/**
 * Decorative string of coloured Christmas bulbs (red, green, yellow, blue, gold)
 * with gentle alternating blink and glow effects along headers or banners.
 */
export const ChristmasLights: React.FC<{ compact?: boolean }> = memo(({ compact = false }) => {
    const { active, config } = useSeasonalTheme();
    const allowed = useAnimationsAllowed();
    const { width } = useWindowDimensions();
    const phase = useSharedValue(1);

    const visible = active && config.show_christmas_lights;
    const period = LIGHTS_BLINK_MS[config.lights_intensity];

    useEffect(() => {
        if (!visible || !allowed) {
            cancelAnimation(phase);
            phase.value = 1;
            return;
        }
        phase.value = 0.2;
        phase.value = withRepeat(
            withTiming(1, { duration: period, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
        return () => cancelAnimation(phase);
    }, [visible, allowed, period, phase]);

    if (!visible) return null;

    const count = Math.max(8, Math.min(18, Math.floor(width / (compact ? 30 : 24))));
    const segmentWidth = width / count;
    const wireD = Array.from({ length: count }, (_, i) => {
        const x1 = i * segmentWidth;
        const x2 = (i + 1) * segmentWidth;
        const cx = (x1 + x2) / 2;
        return `${i === 0 ? `M 0 2` : ''} Q ${cx.toFixed(1)} 9 ${x2.toFixed(1)} 2`;
    }).join(' ');

    return (
        <View pointerEvents="none" style={[styles.container, compact && styles.compact]}>
            <Svg width={width} height={12} style={styles.wireSvg}>
                <Path d={wireD} stroke="#263238" strokeWidth={1.3} fill="none" />
            </Svg>
            <View style={styles.bulbsRow}>
                {Array.from({ length: count }, (_, i) => (
                    <Bulb
                        key={i}
                        color={BULB_COLORS[i % BULB_COLORS.length]}
                        even={i % 2 === 0}
                        phase={phase}
                    />
                ))}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 18,
        overflow: 'visible',
    },
    compact: {
        height: 14,
    },
    wireSvg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    bulbsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 3,
    },
    bulbSlot: {
        alignItems: 'center',
    },
    socket: {
        width: 4,
        height: 3,
        backgroundColor: '#37474F',
        borderRadius: 1,
    },
    bulb: {
        width: 7,
        height: 9,
        borderRadius: 4,
        marginTop: -1,
        shadowOpacity: 0.9,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        elevation: 3,
    },
});

export default ChristmasLights;

