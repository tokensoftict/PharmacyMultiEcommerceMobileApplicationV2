import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styles from './styles';
import Typography from "@/shared/component/typography";

const banners: string[] = ['Big Sale 🔥', '50% Off 🎉', 'New Arrivals 🌟'];

const BannerCarousel: React.FC = () => (
    <ScrollView horizontal pagingEnabled style={styles.carousel} showsHorizontalScrollIndicator={false}>
        {banners.map((text, index) => (
            <View key={index} style={styles.bannerSlide}>
                <Typography style={styles.bannerText}>{text}</Typography>
            </View>
        ))}
    </ScrollView>
);

export default BannerCarousel;
