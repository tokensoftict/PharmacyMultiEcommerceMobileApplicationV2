import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Dimensions, Animated } from 'react-native';
import { normalize } from '@/shared/helpers';
import { FONT } from '@/shared/constants/fonts.ts';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';
import Carousel from 'react-native-reanimated-carousel';
import dayjs from 'dayjs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PromoData {
    promotionId: number;
    title: string;
    startDate: string;
    endDate: string;
    image: string;
}

interface PromoCarouselProps {
    data: PromoData[];
}

const PromoSlide = ({ item }: { item: PromoData }) => {
    const navigation = useNavigation<NavigationProps>();
    const isMounted = useRef(true);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0,
    });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        isMounted.current = true;

        // Pulsing animation for the image
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        const updateTimer = () => {
            if (!isMounted.current) return;

            const start = dayjs(item.startDate);
            const target = dayjs(item.endDate);
            const now = dayjs();

            const total = target.diff(start);
            const elapsed = now.diff(start);
            const remaining = target.diff(now);

            // Calculate progress (0 to 1)
            const currentProgress = total > 0 ? Math.min(1, Math.max(0, elapsed / total)) : 1;
            setProgress(currentProgress);

            if (remaining <= 0) {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                return false;
            } else {
                setTimeLeft({
                    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    mins: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
                    secs: Math.floor((remaining % (1000 * 60)) / 1000),
                });
                return true;
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
            pulse.stop();
        };
    }, [item.startDate, item.endDate]);

    const handlePress = () => {
        navigation.navigate('productList', {
            title: item.title,
            endpoint: `stock/${item.promotionId}/by_promotion`,
            id: item.promotionId,
        });
    };

    const pad = (num: number) => {
        const n = Math.floor(num || 0);
        return n < 10 ? `0${n}` : `${n}`;
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.cardContainer}>
            <View style={styles.card}>
                <View style={styles.topRow}>
                    <View style={styles.textSection}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>FLASH PROMO</Text>
                        </View>
                        <Text numberOfLines={2} style={styles.promoTitle}>{item.title}</Text>

                        <View style={styles.timerContainer}>
                            <View style={styles.timerRow}>
                                <View style={styles.timerUnit}>
                                    <Text style={styles.timerText}>{pad(timeLeft.days)}</Text>
                                    <Text style={styles.timerLabel}>Days</Text>
                                </View>
                                <Text style={styles.timerSep}>:</Text>
                                <View style={styles.timerUnit}>
                                    <Text style={styles.timerText}>{pad(timeLeft.hours)}</Text>
                                    <Text style={styles.timerLabel}>Hrs</Text>
                                </View>
                                <Text style={styles.timerSep}>:</Text>
                                <View style={styles.timerUnit}>
                                    <Text style={styles.timerText}>{pad(timeLeft.mins)}</Text>
                                    <Text style={styles.timerLabel}>Mins</Text>
                                </View>
                                <Text style={styles.timerSep}>:</Text>
                                <View style={styles.timerUnit}>
                                    <Text style={styles.timerText}>{pad(timeLeft.secs)}</Text>
                                    <Text style={styles.timerLabel}>Secs</Text>
                                </View>
                            </View>
                            <Text style={styles.endsText}>Ends Soon</Text>
                        </View>
                    </View>

                    <View style={styles.imageWrapper}>
                        <Animated.View style={[
                            styles.imageCircle,
                            { transform: [{ scale: pulseAnim }] }
                        ]}>
                            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                        </Animated.View>
                    </View>
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressLabel}>OFFER PROGRESS</Text>
                        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const PromoCarousel = ({ data }: PromoCarouselProps) => {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <Carousel
                loop
                width={SCREEN_WIDTH}
                height={normalize(175)}
                autoPlay={data.length > 1}
                data={data}
                scrollAnimationDuration={1000}
                autoPlayInterval={5000}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.94,
                    parallaxScrollingOffset: normalize(20),
                }}
                renderItem={({ item }) => <PromoSlide item={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: normalize(175),
        marginBottom: 0,
    },
    cardContainer: {
        width: SCREEN_WIDTH,
        height: normalize(175),
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: SCREEN_WIDTH - normalize(16),
        height: normalize(160),
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(16),
        padding: normalize(16),
        elevation: 6,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#FFEAEA',
    },
    topRow: {
        flexDirection: 'row',
        flex: 1,
    },
    textSection: {
        flex: 1.4,
    },
    badge: {
        backgroundColor: '#FFF1F1',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(6),
        alignSelf: 'flex-start',
        marginBottom: normalize(8),
    },
    badgeText: {
        color: '#D32F2F',
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
        letterSpacing: 0.5,
    },
    promoTitle: {
        color: '#1A1D1E',
        fontSize: normalize(18),
        fontFamily: FONT.BOLD,
        lineHeight: normalize(22),
        marginBottom: normalize(12),
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D32F2F',
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(4),
        borderRadius: normalize(8),
        marginRight: normalize(8),
    },
    timerUnit: {
        alignItems: 'center',
        minWidth: normalize(28),
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
        lineHeight: normalize(14),
    },
    timerLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: normalize(7),
        fontFamily: FONT.MEDIUM,
        textTransform: 'uppercase',
        marginTop: 1,
    },
    timerSep: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
        marginHorizontal: 1,
        marginTop: -normalize(6),
    },
    endsText: {
        color: '#64748B',
        fontSize: normalize(10),
        fontFamily: FONT.MEDIUM,
    },
    imageWrapper: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCircle: {
        width: normalize(90),
        height: normalize(90),
        backgroundColor: '#FFF1F1',
        borderRadius: normalize(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFEAEA',
    },
    productImage: {
        width: '75%',
        height: '75%',
    },
    progressSection: {
        marginTop: normalize(12),
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(6),
    },
    progressLabel: {
        color: '#64748B',
        fontSize: normalize(9),
        fontFamily: FONT.BOLD,
    },
    progressPercent: {
        color: '#D32F2F',
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
    },
    progressBarBg: {
        height: normalize(6),
        backgroundColor: '#F1F5F9',
        borderRadius: normalize(3),
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#D32F2F',
        borderRadius: normalize(3),
    },
});

export default PromoCarousel;
