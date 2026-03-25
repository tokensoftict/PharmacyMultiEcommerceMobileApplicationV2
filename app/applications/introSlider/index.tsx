import React, { useRef, useState } from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { FadeInUp, FadeInDown, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';
import { styles } from "./style";
import LottieView from "lottie-react-native";
import LinearGradient from 'react-native-linear-gradient';

// Import animations
import animationWelcome from '@/assets/welcome.json';
import animationStores from '@/assets/stores.json';
import animationSearch from '@/assets/search.json';
import animationReminder from '@/assets/reminder.json';
import animationOrders from '@/assets/orders.json';
import bestPrice from '@/assets/bestprice.json';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Typography from '@/shared/component/typography';
import { palette } from '@/shared/constants/colors.ts';
import { normalize } from '@/shared/helpers';

const { width, height } = Dimensions.get('window');

// Slides definition
const slides = [
    {
        title: "Welcome to \n PS GDC PHARMACY & SUPERMARKET",
        desc: "Your one-stop shop for Wholesales Pharmacy, Supermarket, Groceries & More - all in one app",
        animation: animationWelcome,
    },
    {
        title: "Switch Between Stores",
        desc: "Access multiple stores for Bulk and Small Quantities - from a single account.",
        animation: animationStores,
    },
    {
        title: "Smart Search & Cart",
        desc: "Find products instantly with smart AI search, add to cart, and check out fast",
        animation: animationSearch,
    },
    {
        title: "Daily Dosage Reminder",
        desc: "Never miss your dose of medicine again. Custom Alarm system to remind you of daily dosage with templates",
        animation: animationReminder,
    },
    {
        title: "Track Orders & Stock",
        desc: "See your order history, track statuses, and stay updated with live inventory sync.",
        animation: animationOrders,
    },
    {
        title: "Best Price Nationwide",
        desc: "Live Available Stock 24/7  sync & be aware of Lowest Current Market Price",
        animation: bestPrice,
    },
];

const PaginationIndicator = ({ current, total }: { current: number, total: number }) => {
    return (
        <View style={styles.paginationContainer}>
            {Array.from({ length: total }).map((_, index) => {
                const isActive = index === current;
                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.paginationDot,
                            isActive && styles.paginationDotActive,
                        ]}
                    />
                );
            })}
        </View>
    );
};

export default function IntroSlider({ navigation }: any) {
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex === slides.length - 1) {
            new AuthSessionService().setIntroPageStatus("YES");
            navigation.replace('storeSelector');
        } else {
            // @ts-ignore
            carouselRef.current?.scrollTo({ index: currentIndex + 1, animated: true });
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSkip = () => {
        new AuthSessionService().setIntroPageStatus("YES");
        navigation.replace('storeSelector');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Background Elements */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />

            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Typography style={styles.skipText}>Skip</Typography>
            </TouchableOpacity>

            <View style={styles.carouselWrapper}>
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    width={width}
                    height={height * 0.75}
                    autoPlay={false}
                    scrollAnimationDuration={800}
                    data={slides}
                    onSnapToItem={index => setCurrentIndex(index)}
                    renderItem={({ item, index }) => (
                        <View style={styles.slide}>
                            <Animated.View entering={FadeInUp.duration(800).delay(100)} style={styles.lottieWrapper}>
                                <LottieView
                                    source={item.animation}
                                    autoPlay
                                    loop
                                    style={styles.lottie}
                                />
                            </Animated.View>
                            
                            <View style={styles.contentContainer}>
                                <Animated.Text
                                    key={`title-${currentIndex}-${index}`}
                                    entering={FadeInUp.delay(200).duration(500)}
                                    style={styles.title}
                                >
                                    {item.title}
                                </Animated.Text>
                                <Animated.Text
                                    key={`desc-${currentIndex}-${index}`}
                                    entering={FadeInUp.delay(300).duration(500)}
                                    style={styles.description}
                                >
                                    {item.desc}
                                </Animated.Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <View style={styles.footer}>
                <PaginationIndicator current={currentIndex} total={slides.length} />
                
                <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.buttonWrapper}>
                    <TouchableOpacity 
                        onPress={handleNext} 
                        style={styles.mainButton}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[palette.main.p500, palette.main.p400]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Typography style={styles.buttonText}>
                                {currentIndex === slides.length - 1 ? 'GET STARTED' : 'CONTINUE'}
                            </Typography>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}
