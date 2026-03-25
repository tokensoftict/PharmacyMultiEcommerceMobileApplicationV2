import React, { useRef, useState } from 'react';
import {
    View,
    Animated,
    StatusBar,
    RefreshControl,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { _styles } from './styles';
import { normalize } from '@/shared/helpers';
import AddToCartDialog from '@/shared/component/addToCartDialog';
import OverlayLoader from '@/shared/component/overlayLoader';
import useEffectOnce from '@/shared/hooks/useEffectOnce.tsx';
import { store } from '@/redux/store/store.tsx';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { homeNotifications, homeNotification, location, search, shoppingBag, store as storeIcon } from '@/assets/icons';
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';

import HorizontalProductList from "@/shared/component/HorizontalProductList";
import TopBrands from "shared/elements/TopBrands";
import FlashDeals from "@/shared/elements/FlashDeals";
import ImageSlider from "@/shared/elements/ImageSlider";
import HomeSkeleton from './HomeSkeleton';
import { useFocusEffect } from '@react-navigation/native';

interface WrapperProps {
    loading?: boolean;
    onRefresh?: () => void;
    overlayLoaderHeight?: number;
    data: any[];
    storeName: string;
}

const LOGO = require('@/assets/images/logo.png');

export default function HomeHeader({
    loading,
    onRefresh,
    overlayLoaderHeight,
    data,
    storeName
}: WrapperProps) {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const navigation = useNavigation<NavigationProps>();
    const [addToCartProduct, setAddToCartProduct] = useState();

    useEffectOnce(() => {
        store.subscribe(() => {
            const selectedProduct = store.getState().systemReducer.product;
            setAddToCartProduct(selectedProduct);
        });
    }, []);

    React.useLayoutEffect(() => {
        const parent = navigation.getParent();
        if (parent) {
            parent.setOptions({
                tabBarStyle: loading
                    ? { display: 'none', height: 0, borderTopWidth: 0, elevation: 0 }
                    : undefined,
            });
        }
    }, [loading, navigation]);

    useFocusEffect(
        React.useCallback(() => {
            const parent = navigation.getParent();
            if (loading && parent) {
                parent.setOptions({
                    tabBarStyle: { display: 'none', height: 0, borderTopWidth: 0, elevation: 0 },
                });
            }

            return () => {
                if (parent) {
                    parent.setOptions({
                        tabBarStyle: undefined,
                    });
                }
            };
        }, [loading, navigation])
    );

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
            <StatusBar
                backgroundColor={isDarkMode ? '#000' : '#FFF'}
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />

            {/* Fancy Static Header */}
            {!loading && (
                <View style={styles.topContainer}>
                    <View style={styles.actionBar}>
                        <View style={styles.logoSection}>
                            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                            <View>
                                <Typography style={styles.appName}>PS GDC</Typography>
                                <View style={styles.storeNameTag}>
                                    <Typography style={styles.storeNameText}>{storeName}</Typography>
                                </View>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => navigation.navigate('search')}
                            >
                                <Icon icon={search} height={normalize(20)} tintColor={isDarkMode ? '#FFF' : '#1A1D1E'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('notifications')}>
                                <Icon icon={homeNotification} height={normalize(20)} tintColor={isDarkMode ? '#FFF' : '#1A1D1E'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <AddToCartDialog product={addToCartProduct} />

            {loading ? (
                <HomeSkeleton />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderComponent}
                    refreshControl={
                        <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} tintColor="#D32F2F" />
                    }
                    contentContainerStyle={[styles.scrollContent, { paddingTop: normalize(20) }]}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
