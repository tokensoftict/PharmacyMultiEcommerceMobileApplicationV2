import React, { useRef } from 'react';
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { styles } from './styles';
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import SectionHeader from "@/shared/component/sectionHeader";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";

type Brand = {
    id: string;
    name: string;
    image: string;
    isFeatured?: boolean;
};

interface TopBrandsMenuProps {
    categories: Brand[];
    title: string;
}

const BrandCard = ({ item, onPress }: { item: Brand; onPress: (brand: Brand) => void }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => onPress(item)}
        >
            <Animated.View style={[styles.categoryCard, { transform: [{ scale }] }]}>
                {item.isFeatured && (
                    <View style={styles.tag}>
                        <Typography style={styles.tagText}>TOP</Typography>
                    </View>
                )}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.image }} style={styles.categoryImage} />
                </View>
                <Typography numberOfLines={1} ellipsizeMode="tail" style={styles.categoryText}>
                    {item.name.toUpperCase()}
                </Typography>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function TopBrands({ categories, title }: TopBrandsMenuProps) {
    const navigation = useNavigation<NavigationProps>();

    function navigateTo() {
        navigation.navigate('brandList');
    }

    function listProduct(brandName: string, brandId: string) {
        navigation.navigate('productList', {
            endpoint: `stock/${brandId}/by_manufacturer`,
            title: brandName,
            id: parseInt(brandId),
        });
    }

    return (
        <View style={{ marginTop: normalize(10) }}>
            <SectionHeader 
                title={title} 
                onSeeAll={navigateTo} 
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryMenuContainer}
                decelerationRate="fast"
                snapToInterval={normalize(116)} // card width + margin
            >
                {categories.map((item) => (
                    <BrandCard 
                        key={item.id} 
                        item={item} 
                        onPress={(brand) => listProduct(brand.name, brand.id)} 
                    />
                ))}
            </ScrollView>
        </View>
    );
}
