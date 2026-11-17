import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { FIREWORK_GAP_MS, FIREWORK_PARTICLES } from '../seasonalConfig';
import { useAnimationsAllowed, useSeasonalTheme } from '../SeasonalThemeProvider';
import { perfScale } from './ParticleField';

type Pattern = 'circle' | 'ring' | 'star' | 'willow';
const PATTERNS: Pattern[] = ['circle', 'ring', 'star', 'willow'];
const PALETTES = [
    ['#FFD54F', '#FFECB3'], // gold
    ['#E0E0E0', '#FFFFFF'], // silver
    ['#FF5252', '#FFAB91'], // red
    ['#4FC3F7', '#B3E5FC'], // blue
    ['#81C784', '#C8E6C9'], // green
];
const BURST_MS = 2400;
const LAUNCH_END = 0.3; // fraction of the timeline spent rising
const TRAIL_LAGS = [0, 0.07, 0.14]; // head + two fading trail dots

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface BurstSpec {
    id: number;
    cx: number;
    cy: number;
    radius: number;
    pattern: Pattern;
    palette: string[];
    count: number;
}

interface SparkProps {
    t: SharedValue<number>;
    cx: number;
    cy: number;
    angle: number;
    reach: number; // px
    gravity: number; // px added by the end
    lag: number;
    color: string;
    size: number;
}

const Spark = memo(({ t, cx, cy, angle, reach, gravity, lag, color, size }: SparkProps) => {
    const style = useAnimatedStyle(() => {
        const raw = (t.value - LAUNCH_END) / (1 - LAUNCH_END) - lag;
        const b = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        const e = 1 - (1 - b) * (1 - b) * (1 - b); // ease-out explosion
        const fade = raw <= 0 ? 0 : Math.pow(1 - b, 1.4);
        return {
            opacity: fade * (lag === 0 ? 1 : 0.45),
            transform: [
                { translateX: cx + Math.cos(angle) * reach * e - size / 2 },
                { translateY: cy + Math.sin(angle) * reach * e + gravity * b * b - size / 2 },
                { scale: 1 - b * 0.5 },
            ],
        };
    });
    return (
        <Animated.View
            style={[
                styles.spark,
                { width: size, height: size, borderRadius: size / 2, backgroundColor: color, shadowColor: color },
                style,
            ]}
        />
    );
});

const Rocket = memo(({ t, cx, cy, height, color }: { t: SharedValue<number>; cx: number; cy: number; height: number; color: string }) => {
    const style = useAnimatedStyle(() => {
        const u = Math.min(1, t.value / LAUNCH_END);
        const eased = 1 - (1 - u) * (1 - u);
        return {
            opacity: u >= 1 ? 0 : 1,
            transform: [{ translateX: cx - 1.5 }, { translateY: height - (height - cy) * eased }],
        };
    });
    return <Animated.View style={[styles.rocket, { backgroundColor: color, shadowColor: color }, style]} />;
});

const Burst = memo(({ spec, height, onDone }: { spec: BurstSpec; height: number; onDone: (id: number) => void }) => {
    const t = useSharedValue(0);

    useEffect(() => {
        t.value = withTiming(1, { duration: BURST_MS, easing: Easing.linear }, (finished) => {
            if (finished) runOnJS(onDone)(spec.id);
        });
        return () => cancelAnimation(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sparks = useMemo(() => {
        const out: Omit<SparkProps, 't' | 'cx' | 'cy'>[] = [];
        for (let i = 0; i < spec.count; i++) {
            const angle = (i / spec.count) * Math.PI * 2 + rand(-0.04, 0.04);
            let reach = spec.radius * rand(0.9, 1.05);
            let gravity = spec.radius * 0.35;
            if (spec.pattern === 'ring') reach *= i % 2 === 0 ? 1 : 0.55;
            if (spec.pattern === 'star') reach *= 0.45 + 0.55 * Math.abs(Math.cos(angle * 2.5));
            if (spec.pattern === 'willow') {
                reach *= 0.75;
                gravity = spec.radius * 0.9;
            }
            const color = spec.palette[i % spec.palette.length];
            TRAIL_LAGS.forEach((lag) => out.push({ angle, reach, gravity, lag, color, size: lag === 0 ? 4 : 3 }));
        }
        return out;
    }, [spec]);

    return (
        <>
            <Rocket t={t} cx={spec.cx} cy={spec.cy} height={height} color={spec.palette[0]} />
            {sparks.map((p, i) => (
                <Spark key={i} t={t} cx={spec.cx} cy={spec.cy} {...p} />
            ))}
        </>
    );
});

/**
 * Occasional fireworks. Bursts launch at random positions, with random sizes, patterns and
 * colours, separated by idle gaps (longer at low intensity) so the shop UI is never overwhelmed.
 * Only mounted while animations are allowed; timers are cleared on unmount / background.
 */
const FireworksAnimation: React.FC = () => {
    const { config } = useSeasonalTheme();
    const allowed = useAnimationsAllowed();
    const { width, height } = useWindowDimensions();
    const [bursts, setBursts] = useState<BurstSpec[]>([]);
    const idRef = useRef(0);
    const intensity = config.fireworks_intensity;
    const maxConcurrent = intensity === 'high' ? 2 : 1;
    const accent = config.primary_festive_color;

    const done = useCallback((id: number) => setBursts((b) => b.filter((x) => x.id !== id)), []);

    useEffect(() => {
        if (!allowed) {
            setBursts([]);
            return;
        }
        let timer: ReturnType<typeof setTimeout>;
        const [minGap, maxGap] = FIREWORK_GAP_MS[intensity];
        const baseCount = Math.max(8, Math.round(FIREWORK_PARTICLES[intensity] * perfScale()));

        const launch = () => {
            setBursts((current) => {
                if (current.length >= maxConcurrent) return current;
                const palette = Math.random() < 0.25 && accent ? [accent, '#FFFFFF'] : pick(PALETTES);
                const small = Math.random() < 0.35;
                return [
                    ...current,
                    {
                        id: ++idRef.current,
                        cx: rand(width * 0.15, width * 0.85),
                        cy: rand(height * 0.12, height * 0.42),
                        radius: (small ? 0.14 : 0.24) * Math.min(width, height) * rand(0.9, 1.15),
                        pattern: pick(PATTERNS),
                        palette,
                        count: small ? Math.max(8, Math.round(baseCount * 0.6)) : baseCount,
                    },
                ];
            });
            timer = setTimeout(launch, rand(minGap, maxGap));
        };

        timer = setTimeout(launch, 1500);
        return () => clearTimeout(timer);
    }, [allowed, intensity, maxConcurrent, width, height, accent]);

    if (!allowed || bursts.length === 0) return null;

    return (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: config.background_effect_opacity }]}>
            {bursts.map((b) => (
                <Burst key={b.id} spec={b} height={height} onDone={done} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    spark: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        shadowOpacity: 0.9,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    rocket: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 3,
        height: 10,
        borderRadius: 2,
        shadowOpacity: 0.9,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
});

export default FireworksAnimation;

