import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import Typography from "@/shared/component/typography";

const CouponsBanner: React.FC = () => (
    <View style={styles.couponBanner}>
        <Typography style={styles.bannerText}>Get 20% Off with Code RED20</Typography>
    </View>
);

export default CouponsBanner;
