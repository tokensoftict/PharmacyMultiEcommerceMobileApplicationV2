import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    withSpring,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { normalize } from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import { useGlobal } from "@/shared/helpers/GlobalContext.tsx";
import { FONT } from "@/shared/constants/fonts";
import useDarkMode from "@/shared/hooks/useDarkMode";
import Icon from "@/shared/component/icon";
import { arrowForward } from "@/assets/icons";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");
const SWIPE_WIDTH = width * 0.85;
const BUTTON_WIDTH = normalize(140);
const SWIPE_THRESHOLD = SWIPE_WIDTH - BUTTON_WIDTH;

// @ts-ignore
const SwipeToComplete = ({ swipedAndCompleteOrder }) => {
    const translateX = useSharedValue(0);
    const shimmerX = useSharedValue(-SWIPE_WIDTH);
    const { isDarkMode } = useDarkMode();
    const { checkoutButton } = useGlobal();

    useEffect(() => {
        shimmerX.value = withRepeat(
            withTiming(SWIPE_WIDTH, { duration: 2500 }),
            -1,
            false
        );
    }, []);

    const completeOrder = () => {
        setTimeout(() => {
            swipedAndCompleteOrder(true);
        }, 300);
        setTimeout(() => {
            resetSwipe();
        }, 1000)
    }

    const resetSwipe = () => {
        translateX.value = withSpring(0);
    };

    const swipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.max(0, Math.min(event.translationX, SWIPE_THRESHOLD));
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_THRESHOLD * 0.8) {
                translateX.value = withSpring(SWIPE_THRESHOLD);
                runOnJS(completeOrder)();
            } else {
                translateX.value = withSpring(0);
            }
        });

    const activeTrackStyle = useAnimatedStyle(() => {
        return {
            width: translateX.value + BUTTON_WIDTH / 2,
            backgroundColor: semantic.alert.danger.d500,
        };
    });

    const labelStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD * 0.5], [1, 0]),
        };
    });

    const arrowStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD * 0.3], [1, 0]),
        };
    });

    const handleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            backgroundColor: isDarkMode ? '#FFF' : '#FFF',
            shadowOpacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0.2, 0.4]),
        };
    });

    const shimmerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shimmerX.value }],
        };
    });

    return (
        <View style={[styles.container, { opacity: checkoutButton ? 1 : 0 }]}>
            <Typography style={styles.description}>Almost done! Swipe to complete your order</Typography>
            <View style={styles.swipeContainer}>
                <View style={[styles.track, { backgroundColor: isDarkMode ? semantic.fill.f03 : '#F1F5F9' }]}>
                    <Animated.View style={[styles.activeTrack, activeTrackStyle]} />
                    
                    <Animated.View style={[styles.shimmerBox, shimmerStyle]}>
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.labelWrapper, labelStyle]}>
                        <Typography style={styles.label}>Swipe to Confirm Order</Typography>
                    </Animated.View>

                    <Animated.View style={[styles.arrowWrapper, arrowStyle]}>
                         <Icon icon={arrowForward} height={normalize(20)} tintColor={isDarkMode ? '#64748B' : '#94A3B8'} />
                    </Animated.View>

                    <GestureDetector gesture={swipeGesture}>
                        <Animated.View style={[styles.swipeButton, handleStyle]}>
                            <Icon icon={arrowForward} height={normalize(24)} tintColor={semantic.alert.danger.d500} />
                        </Animated.View>
                    </GestureDetector>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: normalize(100),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
    },
    description: {
        fontSize: normalize(14),
        fontFamily: FONT.MEDIUM,
        color: semantic.alert.danger.d500,
        marginBottom: normalize(16),
        textAlign: 'center',
    },
    swipeContainer: {
        width: SWIPE_WIDTH,
        height: normalize(64),
        alignItems: "center",
    },
    track: {
        width: "100%",
        height: "100%",
        borderRadius: normalize(32),
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    },
    shimmerBox: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: normalize(100),
    },
    activeTrack: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        borderRadius: normalize(32),
    },
    labelWrapper: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: normalize(40),
    },
    label: {
        fontSize: normalize(14),
        fontFamily: FONT.BOLD,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    arrowWrapper: {
        position: 'absolute',
        right: normalize(24),
    },
    swipeButton: {
        width: BUTTON_WIDTH,
        height: normalize(56),
        borderRadius: normalize(28),
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: normalize(4),
        top: normalize(4),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
    },
});

export default SwipeToComplete;
