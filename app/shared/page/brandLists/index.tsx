import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import { styles } from './styles';
import Typography from '@/shared/component/typography';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';
import BrandService from '@/service/brands/BrandService.tsx';
import HeaderWithIcon from '@/shared/component/headerBack';
import { arrowBack, search } from '@/assets/icons';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { semantic } from "@/shared/constants/colors.ts";
import { normalize } from '@/shared/helpers';

interface Category {
    id: string;
    name: string;
    image: string;
}

const BrandListItem = ({ item, onPress }: { item: Category; onPress: (item: Category) => void }) => {
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
            style={{ flex: 1 }}
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => onPress(item)}
        >
            <Animated.View style={[styles.categoryCard, { transform: [{ scale }] }]}>
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

export default function BrandLists() {
    const navigation = useNavigation<NavigationProps>();

    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBrands = async () => {
        setIsLoading(true);
        new BrandService().getBrandList().then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                setCategories(response.data.data);
            }
        });
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredCategories(
            categories.filter((item) => item.name.toLowerCase().includes(query))
        );
    }, [searchQuery, categories]);

    const navigateToProductList = (item: Category) => {
        navigation.navigate('productList', {
            endpoint: `stock/${item.id}/by_manufacturer`,
            title: item.name,
            id: parseInt(item.id)
        });
    };

    return (
        <WrapperNoScroll loading={isLoading}>
            <HeaderWithIcon icon={arrowBack} onPress={() => navigation.goBack()} title="TOP BRANDS" />

            <View style={styles.searchWrapper}>
                <Input
                    placeholder="Search brands..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    rightIcon={<Icon icon={search} tintColor={semantic.text.grey} />}
                    style={{ backgroundColor: '#f9f9f9', borderRadius: normalize(12) }}
                />
            </View>

            <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BrandListItem item={item} onPress={navigateToProductList} />
                )}
                numColumns={3}
                contentContainerStyle={styles.categoryMenuContainer}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: 'center' }}
            />
        </WrapperNoScroll>
    );
}
