import React, { useRef } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolate, useAnimatedRef } from "react-native-reanimated";
import { normalize } from "@/shared/helpers";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import Typography from "@/shared/component/typography";
import { styles } from "./styles";
import LinearGradient from 'react-native-linear-gradient';

const width = Dimensions.get("window").width;
const DOT_WIDTH = normalize(8);
const ACTIVE_DOT_WIDTH = normalize(24);
const DOT_OPACITY = 0.4;
const ACTIVE_DOT_OPACITY = 1;

type ImageSlider = {
    name : string;
    id : number,
    banner : string;
    seeAll : string;
};

interface ImageSliderProps {
    sliders: ImageSlider[];
}

const PaginationDot = ({ index, progress }: { index: number; progress: any }) => {
    const animatedStyle = useAnimatedStyle(() => {
        const widthVal = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [DOT_WIDTH, ACTIVE_DOT_WIDTH, DOT_WIDTH],
            Extrapolate.CLAMP
        );
        const opacityVal = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [DOT_OPACITY, ACTIVE_DOT_OPACITY, DOT_OPACITY],
            Extrapolate.CLAMP
        );
        const isActive = Math.abs(progress.value - index) < 0.5;

        return {
            width: widthVal,
            opacity: opacityVal,
            backgroundColor: isActive ? '#D50000' : '#D1D5DB',
        };
    });

    return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
};

export default function ImageSlider({ sliders }: ImageSliderProps) {
    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const navigation = useNavigation<NavigationProps>();

    function navigateTo(endpoint : string, title : string, id : number) {
        // @ts-ignore
        navigation.navigate('productList', { endpoint, title, id });
    }

    return (
        <View style={styles.container}>
            <Carousel
                ref={ref}
                width={width}
                height={normalize(200)}
                data={sliders}
                autoPlayInterval={5000}
                autoPlay
                onProgressChange={progress}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.slideContainer}
                            onPress={() => navigateTo(item.seeAll, item.name, item.id)}
                        >
                            <View style={{ width: width, height: normalize(200), position: 'relative' }}>
                                <Image
                                    source={{ uri: item.banner }}
                                    style={[styles.image, { width: '100%', height: '100%' }]}
                                    resizeMode="cover"
                                />
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                                    style={[styles.overlay, { width: '100%', height: '100%' }]}
                                >
                                    <View style={styles.textContainer}>
                                        <Typography numberOfLines={2} style={styles.title}>
                                            {item.name}
                                        </Typography>
                                        <Typography style={styles.subtitle}>
                                            Explore our latest arrivals and exclusive deals
                                        </Typography>
                                    </View>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                onConfigurePanGesture={(gesture) => {
                    gesture
                        .activeOffsetX([-10, 10])
                        .failOffsetY([-10, 10]);
                }}
            />

            <View style={styles.paginationContainer}>
                {sliders.map((_, index) => (
                    <PaginationDot key={index} index={index} progress={progress} />
                ))}
            </View>
        </View>
    );
}
