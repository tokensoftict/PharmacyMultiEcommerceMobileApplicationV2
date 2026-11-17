import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Dimensions, Animated } from 'react-native';
import { normalize } from '@/shared/helpers';
import { FONT } from '@/shared/constants/fonts.ts';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';
import Carousel from 'react-native-reanimated-carousel';
import dayjs from 'dayjs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = normalize(195);
const CARD_HEIGHT = normalize(180);

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
    const { isDarkMode } = useDarkMode();
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

        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
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

    const pct = Math.round(progress * 100);

    return (
        <TouchableOpacity activeOpacity={0.92} onPress={handlePress} style={styles.cardContainer}>
            <View style={[styles.card, isDarkMode && styles.cardDark]}>
                {/* Top Content Row */}
                <View style={styles.topRow}>
                    <View style={styles.textSection}>
                        {/* Flash Promo Badge Row */}
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>⚡ FLASH PROMO</Text>
                            </View>
                            <View style={[styles.endsChip, isDarkMode && styles.endsChipDark]}>
                                <View style={styles.liveDot} />
                                <Text style={[styles.endsText, isDarkMode && styles.endsTextDark]}>Ends Soon</Text>
                            </View>
                        </View>

                        {/* Promotion Title */}
                        <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[styles.promoTitle, isDarkMode && styles.promoTitleDark]}
                        >
                            {item.title}
                        </Text>

                        {/* Countdown Timer */}
                        <View style={styles.timerContainer}>
                            <View style={styles.timerBox}>
                                <Text style={styles.timerValue}>{pad(timeLeft.days)}</Text>
                                <Text style={styles.timerLabel}>DAYS</Text>
                            </View>
                            <Text style={[styles.timerSep, isDarkMode && styles.timerSepDark]}>:</Text>
                            <View style={styles.timerBox}>
                                <Text style={styles.timerValue}>{pad(timeLeft.hours)}</Text>
                                <Text style={styles.timerLabel}>HRS</Text>
                            </View>
                            <Text style={[styles.timerSep, isDarkMode && styles.timerSepDark]}>:</Text>
                            <View style={styles.timerBox}>
                                <Text style={styles.timerValue}>{pad(timeLeft.mins)}</Text>
                                <Text style={styles.timerLabel}>MINS</Text>
                            </View>
                            <Text style={[styles.timerSep, isDarkMode && styles.timerSepDark]}>:</Text>
                            <View style={[styles.timerBox, styles.timerBoxAccent]}>
                                <Text style={styles.timerValue}>{pad(timeLeft.secs)}</Text>
                                <Text style={styles.timerLabelAccent}>SECS</Text>
                            </View>
                        </View>
                    </View>

                    {/* Right Product Image */}
                    <View style={styles.imageWrapper}>
                        <Animated.View
                            style={[
                                styles.imageCircle,
                                isDarkMode && styles.imageCircleDark,
                                { transform: [{ scale: pulseAnim }] },
                            ]}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </View>
                </View>

                {/* Bottom Offer Progress Section */}
                <View style={[styles.progressSection, isDarkMode && styles.progressSectionDark]}>
                    <View style={styles.progressInfo}>
                        <Text style={[styles.progressLabel, isDarkMode && styles.progressLabelDark]}>
                            🔥 OFFER PROGRESS
                        </Text>
                        <Text style={styles.progressPercent}>{pct}%</Text>
                    </View>
                    <View style={[styles.progressBarBg, isDarkMode && styles.progressBarBgDark]}>
                        <View style={[styles.progressBarFill, { width: `${Math.max(4, pct)}%` }]} />
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
                height={CAROUSEL_HEIGHT}
                autoPlay={data.length > 1}
                data={data}
                scrollAnimationDuration={900}
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
        height: CAROUSEL_HEIGHT,
        marginBottom: 0,
    },
    cardContainer: {
        width: SCREEN_WIDTH,
        height: CAROUSEL_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: SCREEN_WIDTH - normalize(16),
        height: CARD_HEIGHT,
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(16),
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(12),
        justifyContent: 'space-between',
        elevation: 5,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    cardDark: {
        backgroundColor: '#1E293B',
        borderColor: 'rgba(244, 63, 94, 0.3)',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textSection: {
        flex: 1,
        paddingRight: normalize(10),
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(5),
    },
    badge: {
        backgroundColor: '#E11D48',
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(3),
        borderRadius: normalize(6),
        marginRight: normalize(8),
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: normalize(9.5),
        fontFamily: FONT.BOLD,
        letterSpacing: 0.4,
    },
    endsChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF1F2',
        paddingHorizontal: normalize(7),
        paddingVertical: normalize(3),
        borderRadius: normalize(6),
    },
    endsChipDark: {
        backgroundColor: 'rgba(225, 29, 72, 0.2)',
    },
    liveDot: {
        width: normalize(5),
        height: normalize(5),
        borderRadius: normalize(3),
        backgroundColor: '#E11D48',
        marginRight: normalize(4),
    },
    endsText: {
        color: '#E11D48',
        fontSize: normalize(9.5),
        fontFamily: FONT.BOLD,
    },
    endsTextDark: {
        color: '#FDA4AF',
    },
    promoTitle: {
        color: '#0F172A',
        fontSize: normalize(14.5),
        fontFamily: FONT.BOLD,
        lineHeight: normalize(19),
        marginBottom: normalize(7),
    },
    promoTitleDark: {
        color: '#F8FAFC',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerBox: {
        backgroundColor: '#0F172A',
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(3),
        borderRadius: normalize(6),
        alignItems: 'center',
        minWidth: normalize(33),
    },
    timerBoxAccent: {
        backgroundColor: '#E11D48',
    },
    timerValue: {
        color: '#FFFFFF',
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        lineHeight: normalize(13),
    },
    timerLabel: {
        color: '#94A3B8',
        fontSize: normalize(6.5),
        fontFamily: FONT.MEDIUM,
        marginTop: 1,
    },
    timerLabelAccent: {
        color: '#FFE4E6',
        fontSize: normalize(6.5),
        fontFamily: FONT.MEDIUM,
        marginTop: 1,
    },
    timerSep: {
        color: '#0F172A',
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        marginHorizontal: normalize(2),
    },
    timerSepDark: {
        color: '#CBD5E1',
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCircle: {
        width: normalize(80),
        height: normalize(80),
        backgroundColor: '#FFF1F2',
        borderRadius: normalize(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FECDD3',
    },
    imageCircleDark: {
        backgroundColor: '#0F172A',
        borderColor: 'rgba(244, 63, 94, 0.35)',
    },
    productImage: {
        width: '75%',
        height: '75%',
    },
    progressSection: {
        marginTop: normalize(6),
        paddingTop: normalize(6),
        borderTopWidth: 1,
        borderTopColor: '#FFF1F2',
    },
    progressSectionDark: {
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(4),
    },
    progressLabel: {
        color: '#64748B',
        fontSize: normalize(9),
        fontFamily: FONT.BOLD,
        letterSpacing: 0.4,
    },
    progressLabelDark: {
        color: '#94A3B8',
    },
    progressPercent: {
        color: '#E11D48',
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
    },
    progressBarBg: {
        height: normalize(6),
        backgroundColor: '#FFE4E6',
        borderRadius: normalize(3),
        overflow: 'hidden',
    },
    progressBarBgDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#E11D48',
        borderRadius: normalize(3),
    },
});

export default PromoCarousel;
