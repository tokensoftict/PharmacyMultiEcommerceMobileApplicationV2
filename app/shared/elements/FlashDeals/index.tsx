import React, { useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { _styles } from './styles';
import { theme } from '@/shared/theme';
import Typography from '@/shared/component/typography';
import SectionHeader from '@/shared/component/sectionHeader';
import { currencyType } from "@/shared/constants/global.ts";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';

interface Deal {
    id: number;
    name: string;
    price: string;
    icon: string;
    seeAll: string;
    stockProgress?: number;
}

interface flashDealProps {
    title?: string;
    deals?: Deal[];
}

export default function FlashDeals({ title, deals }: flashDealProps) {
    const navigation = useNavigation<NavigationProps>();
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    function navigateTo(endpoint: string, title: string, id: number) {
        navigation.navigate('productList', {
            endpoint: endpoint,
            title: title,
            id: id
        });
    }

    const renderDeal = ({ item, index }: { item: Deal, index: number }) => {
        const progress = item.stockProgress ?? (0.3 + (index * 0.15) % 0.6);
        const stockLeft = Math.floor(progress * 20);

        return (
            <TouchableOpacity 
                style={styles.cardContainer} 
                activeOpacity={0.9} 
                onPress={() => navigateTo(item.seeAll, item.name, item.id)}
            >
                <View style={styles.cardInner}>
                    <View style={styles.cardContent}>
                        <View style={styles.badge}>
                            <Typography style={styles.badgeText}>Limited</Typography>
                        </View>
                        <Typography numberOfLines={1} style={styles.productName}>
                            {item.name}
                        </Typography>
                        <View style={styles.priceWrapper}>
                            <Typography style={styles.currency}>{currencyType}</Typography>
                            <Typography style={styles.productPrice}>{item.price}</Typography>
                        </View>
                    </View>
                    <Animated.View style={[
                        styles.fireIconWrapper,
                        { transform: [{ scale: pulseAnim }] }
                    ]}>
                        <Typography style={styles.fireIcon}>{item.icon || '🔥'}</Typography>
                    </Animated.View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SectionHeader
                title={title || 'Flash Deals'}
                onSeeAll={() => deals && deals[0] && navigateTo(deals[0].seeAll, title || 'All Deals', deals[0].id)}
            />

            <FlatList
                data={deals}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: theme.spacing.md }}
                renderItem={renderDeal}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
