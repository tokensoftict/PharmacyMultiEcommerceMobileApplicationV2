import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import normalize from 'react-native-normalize';
import { computeCountdown, CountdownParts } from '../seasonalConfig';
import { useSeasonalTheme } from '../SeasonalThemeProvider';

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/**
 * Accurate, server-clock-adjusted countdown to the configured target date/timezone.
 * Displays Days, Hours, Minutes and Seconds, pauses while the app is backgrounded,
 * and automatically stops when the countdown reaches zero.
 */
export const NewYearCountdown: React.FC = memo(() => {
    const { active, config, skewMs, appActive } = useSeasonalTheme();
    const target = config.countdown_target_date;
    const enabled = active && config.show_countdown && Boolean(target);

    const [parts, setParts] = useState<CountdownParts>(() =>
        computeCountdown(target, Date.now(), skewMs),
    );

    useEffect(() => {
        if (!enabled || !target) return;
        const update = () => {
            const next = computeCountdown(target, Date.now(), skewMs);
            setParts(next);
            return next.done;
        };
        if (update() || !appActive) return;

        const id = setInterval(() => {
            if (update()) {
                clearInterval(id);
            }
        }, 1000);
        return () => clearInterval(id);
    }, [enabled, target, skewMs, appActive]);

    if (!enabled) return null;

    // Once the target is reached, show the celebration greeting if configured, or hide cleanly.
    if (parts.done) {
        const doneMsg = config.celebration_message || config.greeting_message;
        if (!doneMsg) return null;
        return (
            <View style={styles.container}>
                <Text style={styles.doneText}>{doneMsg}</Text>
            </View>
        );
    }

    const prefix = config.countdown_message || 'Happy New Year in';
    const daySummary =
        parts.days > 0
            ? `${prefix} ${parts.days} ${parts.days === 1 ? 'Day' : 'Days'}!`
            : prefix;

    return (
        <View style={styles.container}>
            <Text style={styles.caption}>{daySummary}</Text>
            <View style={styles.boxesRow}>
                <TimeBox value={pad2(parts.days)} label="Days" />
                <Text style={styles.colon}>:</Text>
                <TimeBox value={pad2(parts.hours)} label="Hours" />
                <Text style={styles.colon}>:</Text>
                <TimeBox value={pad2(parts.minutes)} label="Mins" />
                <Text style={styles.colon}>:</Text>
                <TimeBox value={pad2(parts.seconds)} label="Secs" />
            </View>
        </View>
    );
});

const TimeBox = memo(({ value, label }: { value: string; label: string }) => (
    <View style={styles.box}>
        <Text style={styles.boxValue}>{value}</Text>
        <Text style={styles.boxLabel}>{label}</Text>
    </View>
));

const styles = StyleSheet.create({
    container: {
        marginHorizontal: normalize(15),
        marginVertical: normalize(5),
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(14),
        borderRadius: normalize(12),
        backgroundColor: '#171625',
        borderWidth: 1,
        borderColor: '#D4AF37',
        alignItems: 'center',
    },
    caption: {
        color: '#F5D76E',
        fontSize: normalize(12.5),
        fontWeight: '700',
        letterSpacing: 0.4,
        marginBottom: normalize(6),
    },
    boxesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        minWidth: normalize(48),
        paddingVertical: normalize(4),
        paddingHorizontal: normalize(8),
        borderRadius: normalize(8),
        backgroundColor: 'rgba(212, 175, 55, 0.14)',
        borderWidth: 0.8,
        borderColor: 'rgba(212, 175, 55, 0.5)',
        alignItems: 'center',
    },
    boxValue: {
        color: '#FFFFFF',
        fontSize: normalize(15),
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },
    boxLabel: {
        color: '#F5D76E',
        fontSize: normalize(9.5),
        marginTop: 1,
    },
    colon: {
        color: '#D4AF37',
        fontSize: normalize(15),
        fontWeight: '800',
        marginHorizontal: normalize(4),
    },
    doneText: {
        color: '#F5D76E',
        fontSize: normalize(15),
        fontWeight: '800',
        textAlign: 'center',
    },
});

export default NewYearCountdown;

