import React, { useRef, useState } from 'react';
import {
    View,
    Animated,
    StatusBar,
    SafeAreaView,
    RefreshControl,
    FlatList
} from 'react-native';
import { styles } from './styles';
import { normalize } from '@/shared/helpers';
import AddToCartDialog from '@/shared/component/addToCartDialog';
import OverlayLoader from '@/shared/component/overlayLoader';
import useEffectOnce from '@/shared/hooks/useEffectOnce.tsx';
import { store } from '@/redux/store/store.tsx';
import Typography from '@/shared/component/typography';
import Search from '@/shared/component/search';
import { design } from '@/shared/constants/colors.ts';

import HorizontalProductList from "@/shared/component/HorizontalProductList";
import TopBrands from "shared/elements/TopBrands";
import FlashDeals from "@/shared/elements/FlashDeals";
import ImageSlider from "@/shared/elements/ImageSlider";

const HEADER_MAX_HEIGHT = normalize(220);
const HEADER_MIN_HEIGHT = normalize(0);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HEADER_IMAGE = require('@/assets/images/wholesales_banner.jpeg');

interface WrapperProps {
    headerText: string;
    headerSubtitle: string;
    loading?: boolean;
    onRefresh?: () => void;
    overlayLoaderHeight?: number;
    data: any[]; // homePageData
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function CollapsableHeader({
                                              headerText,
                                              headerSubtitle,
                                              loading,
                                              onRefresh,
                                              overlayLoaderHeight,
                                              data
                                          }: WrapperProps) {
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1],
        extrapolate: 'clamp'
    });

    const imageTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0],
        extrapolate: 'clamp'
    });

    const actionBarVisible = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp'
    });

    const [addToCartProduct, setAddToCartProduct] = useState();

    useEffectOnce(() => {
        store.subscribe(() => {
            const selectedProduct = store.getState().systemReducer.product;
            setAddToCartProduct(selectedProduct);
        });
    }, []);

    const renderComponent = ({ item, index }: { item: any; index: number }) => {
        const key = `${item.type}-${index}`;
        let component = <View key={key} />;

        if (item.component === 'topBrands') {
            component = (
                <TopBrands key={key} categories={item.data.brands} title={item.data.label} />
            );
        } else if (item.component === 'Horizontal_List') {
            component = (
                <HorizontalProductList
                    key={key}
                    title={item.label ?? ''}
                    productList={item.data}
                    id={item.data.id}
                    moreRoute={item.seeAll ?? ''}
                />
            );
        } else if (item.component === 'FlashDeals') {
            component = <FlashDeals key={key} title={item.label} deals={item.data} />;
        /* } else if (item.component === 'ImageSlider') {
            component = <ImageSlider key={key} sliders={item.data} />; */
        }

        return (
            <View key={key} style={{ marginBottom: normalize(10) }}>
                {component}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={design.text1.background} barStyle="light-content" />

            {/* Floating Search Bar */}
            <Animated.View
                style={[
                    styles.actionBar,
                    {
                        opacity: actionBarVisible,
                        transform: [
                            {
                                translateY: actionBarVisible.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0],
                                    extrapolate: 'clamp'
                                })
                            }
                        ]
                    }
                ]}
            >
                <View style={styles.actionBarContent}>
                    <Search placeholder="Search Products..." onChange={() => {}} value={undefined} />
                </View>
            </Animated.View>

            <AddToCartDialog product={addToCartProduct} />
            <OverlayLoader loading={loading} title="" height={overlayLoaderHeight} />

            {/* Collapsable Header */}
            <Animated.View style={[styles.header, { height: headerHeight, opacity: loading ? 0 : 1 }]}>
                <Animated.Image
                    source={HEADER_IMAGE}
                    style={[
                        styles.headerBackground,
                        {
                            opacity: imageOpacity,
                            transform: [{ translateY: imageTranslate }]
                        }
                    ]}
                    resizeMode="cover"
                />
                <View style={styles.headerOverlay}>
                    <Typography style={styles.headerText}>{headerText}</Typography>
                    <Typography style={styles.headerSubtitle}>{headerSubtitle}</Typography>
                    <View style={{ flex: 1, marginTop: normalize(5) }}>
                        <Search placeholder="Search Products..." onChange={() => {}} value={undefined} />
                    </View>
                </View>
            </Animated.View>

            {/* Main List */}
            <AnimatedFlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderComponent}
                refreshControl={
                    <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
                }
                contentContainerStyle={[styles.scrollContent, { opacity: loading ? 0 : 1 }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            />
        </SafeAreaView>
    );
}
