import React, { memo, useEffect, useMemo } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

export type ParticleKind = 'snow' | 'confetti' | 'gold';

interface Spec {
    key: number;
    kind: ParticleKind;
    shape: 'dot' | 'glyph' | 'rect';
    size: number;
    left: number; // px
    color: string;
    opacity: number;
    init: number; // 0..1 starting progress so the screen is never empty on mount
    duration: number; // ms for a full fall
    swayAmp: number; // px
    swayDuration: number; // ms
    rotate: number; // degrees of swing
    spin: number; // full turns per fall (confetti)
}

// Crisp icy/frost blues so snowflakes are clearly visible against white & light backgrounds as well as dark mode
const SNOW_COLORS = ['#38BDF8', '#0EA5E9', '#60A5FA', '#7DD3FC', '#22D3EE'];
const CONFETTI_COLORS = ['#D4AF37', '#F5D76E', '#C0C0C0', '#E53935', '#FFFFFF', '#FFB300'];
const GOLD_COLORS = ['#D4AF37', '#F5D76E', '#FFE082', '#FFB300'];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Old / low-memory Android devices get fewer particles. */
export const perfScale = (): number =>
    Platform.OS === 'android' && typeof Platform.Version === 'number' && Platform.Version < 28 ? 0.6 : 1;

function buildSpecs(kind: ParticleKind, count: number, width: number, speedFactor: number): Spec[] {
    return Array.from({ length: count }, (_, i) => {
        // Depth: small = far (slow, faint); large = near (fast, brighter).
        const depth = Math.random(); // 0 far .. 1 near
        let size: number;
        let duration: number;
        let shape: Spec['shape'];
        let colors: string[];

        if (kind === 'snow') {
            size = 3.5 + depth * 6.5;
            duration = (11000 - depth * 5500 + rand(-800, 800)) * speedFactor;
            shape = size > 6 && Math.random() < 0.65 ? 'glyph' : 'dot';
            colors = SNOW_COLORS;
        } else if (kind === 'confetti') {
            size = 5 + depth * 5;
            duration = (7500 - depth * 2500 + rand(-600, 600)) * speedFactor;
            shape = 'rect';
            colors = CONFETTI_COLORS;
        } else {
            size = 2 + depth * 3;
            duration = (13000 - depth * 4000 + rand(-1000, 1000)) * speedFactor;
            shape = 'dot';
            colors = GOLD_COLORS;
        }

        return {
            key: i,
            kind,
            shape,
            size,
            left: rand(0, Math.max(0, width - size)),
            color: pick(colors),
            opacity: 0.6 + depth * 0.4,
            init: Math.random(),
            duration: Math.max(1500, duration),
            swayAmp: kind === 'confetti' ? rand(8, 22) : rand(4, 18) * (0.5 + depth),
            swayDuration: rand(1800, 4200),
            rotate: kind === 'snow' ? rand(-25, 25) : rand(-60, 60),
            spin: kind === 'confetti' ? rand(1, 3) : 0,
        };
    });
}

const Particle = memo(({ spec, height }: { spec: Spec; height: number }) => {
    const fall = useSharedValue(spec.init);
    const sway = useSharedValue(-1);

    useEffect(() => {
        fall.value = spec.init;
        fall.value = withSequence(
            withTiming(1, { duration: Math.max(1, spec.duration * (1 - spec.init)), easing: Easing.linear }),
            withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(1, { duration: spec.duration, easing: Easing.linear }),
                ),
                -1,
                false,
            ),
        );
        sway.value = -1;
        sway.value = withRepeat(
            withTiming(1, { duration: spec.swayDuration, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
        return () => {
            cancelAnimation(fall);
            cancelAnimation(sway);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spec]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: fall.value * (height + spec.size * 3) - spec.size * 2 },
            { translateX: sway.value * spec.swayAmp },
            { rotate: `${sway.value * spec.rotate + fall.value * 360 * spec.spin}deg` },
        ],
    }));

    const base = { position: 'absolute' as const, top: 0, left: spec.left, opacity: spec.opacity };

    if (spec.shape === 'glyph') {
        return (
            <Animated.View style={[base, animatedStyle]}>
                <Text
                    style={{
                        color: spec.color,
                        fontSize: spec.size * 1.85,
                        includeFontPadding: false,
                        textShadowColor: 'rgba(2, 132, 199, 0.45)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                    }}
                >
                    {'\u2744\uFE0E'}
                </Text>
            </Animated.View>
        );
    }

    const shapeStyle =
        spec.shape === 'rect'
            ? { width: spec.size, height: spec.size * 0.55, borderRadius: 1, backgroundColor: spec.color }
            : {
                  width: spec.size,
                  height: spec.size,
                  borderRadius: spec.size / 2,
                  backgroundColor: spec.color,
                  ...(spec.kind === 'gold'
                      ? { shadowColor: spec.color, shadowOpacity: 0.9, shadowRadius: 3, shadowOffset: { width: 0, height: 0 } }
                      : {
                            borderWidth: 0.6,
                            borderColor: 'rgba(2, 132, 199, 0.35)',
                            shadowColor: '#0284C7',
                            shadowOpacity: 0.5,
                            shadowRadius: 2.5,
                            shadowOffset: { width: 0, height: 1 },
                        }),
              };

    return <Animated.View style={[base, shapeStyle, animatedStyle]} />;
});

interface Props {
    kind: ParticleKind;
    count: number;
    /** 0..1 */
    opacity?: number;
    /** Duration multiplier: <1 faster, >1 slower. */
    speedFactor?: number;
}

/**
 * Generic falling-particle field. One shared value pair per particle, driven on the UI thread,
 * so there are zero JS-thread re-renders while animating. Never intercepts touches.
 */
const ParticleField: React.FC<Props> = ({ kind, count, opacity = 1, speedFactor = 1 }) => {
    const { width, height } = useWindowDimensions();
    const scaled = Math.max(1, Math.round(count * perfScale()));
    const specs = useMemo(
        () => buildSpecs(kind, scaled, width, speedFactor),
        // Re-seed only when the visual contract changes (not on every parent render).
        [kind, scaled, Math.round(width / 40), speedFactor],
    );

    return (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]} renderToHardwareTextureAndroid>
            {specs.map((s) => (
                <Particle key={`${kind}-${s.key}`} spec={s} height={height} />
            ))}
        </View>
    );
};

export default memo(ParticleField);

