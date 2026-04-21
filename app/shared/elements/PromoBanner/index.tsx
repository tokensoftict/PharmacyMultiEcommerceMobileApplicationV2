import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { normalize } from '@/shared/helpers';
import { FONT } from '@/shared/constants/fonts.ts';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';

interface PromoBannerProps {
    title: string;
    endDate: string;
    promotionId: number;
}

const PromoBanner = ({ title, endDate, promotionId }: PromoBannerProps) => {
    const navigation = useNavigation<NavigationProps>();
    const isMounted = useRef(true);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0,
    });

    useEffect(() => {
        isMounted.current = true;

        if (!endDate) return;

        const targetDate = new Date(endDate).getTime();
        if (isNaN(targetDate)) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                if (isMounted.current) {
                    setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                }
            } else {
                if (isMounted.current) {
                    setTimeLeft({
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                        secs: Math.floor((difference % (1000 * 60)) / 1000),
                    });
                }
            }
        }, 1000);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, [endDate]);

    const handlePress = () => {
        navigation.navigate('productList', {
            title: title,
            endpoint: `stock/${promotionId}/by_promotion`,
            id: promotionId,
        });
    };

    const pad = (num: number) => {
        const n = Math.floor(num || 0);
        return n < 10 ? `0${n}` : `${n}`;
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.container}>
            <LinearGradient
                colors={['#D50000', '#FF5252']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.textSection}>
                        <Text style={styles.promoLabel}>ONGOING PROMO</Text>
                        <Text numberOfLines={1} style={styles.promoTitle}>{title}</Text>
                    </View>
                    <View style={styles.timerSection}>
                        <View style={styles.timerBox}>
                            <Text style={styles.timerValue}>{pad(timeLeft.days)}</Text>
                            <Text style={styles.timerLabel}>Days</Text>
                        </View>
                        <Text style={styles.separator}>:</Text>
                        <View style={styles.timerBox}>
                            <Text style={styles.timerValue}>{pad(timeLeft.hours)}</Text>
                            <Text style={styles.timerLabel}>Hrs</Text>
                        </View>
                        <Text style={styles.separator}>:</Text>
                        <View style={styles.timerBox}>
                            <Text style={styles.timerValue}>{pad(timeLeft.mins)}</Text>
                            <Text style={styles.timerLabel}>Mins</Text>
                        </View>
                        <Text style={styles.separator}>:</Text>
                        <View style={styles.timerBox}>
                            <Text style={styles.timerValue}>{pad(timeLeft.secs)}</Text>
                            <Text style={styles.timerLabel}>Secs</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: normalize(15),
        borderRadius: normalize(15),
        backgroundColor: '#D50000',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(15),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: normalize(100)
    },
    textSection: {
        flex: 1,
        marginRight: normalize(10),
    },
    promoLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    promoTitle: {
        color: '#FFFFFF',
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
        marginTop: normalize(4),
        lineHeight: normalize(20),
    },
    timerSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerBox: {
        alignItems: 'center',
        minWidth: normalize(30),
    },
    timerValue: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontFamily: FONT.BOLD,
    },
    timerLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: normalize(8),
        fontFamily: FONT.NORMAL,
        marginTop: -normalize(2),
    },
    separator: {
        color: '#FFFFFF',
        fontSize: normalize(14),
        fontFamily: FONT.BOLD,
        marginHorizontal: normalize(2),
        lineHeight: normalize(18),
    },
});

export default PromoBanner;
