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
import { SafeAreaView } from "react-native-safe-area-context";
import { _styles } from './styles';
import { theme } from '@/shared/theme';
import { design } from '@/shared/constants/colors.ts';
import AddToCartDialog from '@/shared/component/addToCartDialog';
import OverlayLoader from '@/shared/component/overlayLoader';
import AuthSessionService from "@/service/auth/AuthSessionService";
import useEffectOnce from '@/shared/hooks/useEffectOnce.tsx';
import { store } from '@/redux/store/store.tsx';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { homeNotifications, homeNotification, switch_icon, location, search, shoppingBag, store as storeIcon, dots } from '@/assets/icons';
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';
import { useDispatch, useSelector } from 'react-redux';

import HorizontalProductList from "@/shared/component/HorizontalProductList";
import TopBrands from "shared/elements/TopBrands";
import FlashDeals from "@/shared/elements/FlashDeals";
import ImageSlider from "@/shared/elements/ImageSlider";
import PromoCarousel from "@/shared/elements/PromoCarousel";
import HomeSkeleton from './HomeSkeleton';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { qrcode } from '@/assets/icons';
import Toasts from '@/shared/utils/Toast';
import * as action from "@/redux/actions";

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
    const isFocused = useIsFocused();
    const addToCartProduct = useSelector((state: any) => state.systemReducer.product);
    const [menuVisible, setMenuVisible] = useState(false);

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
        const itemId = item.promotionId ?? item.id ?? index;
        const key = `${item.component}-${itemId}`;
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
        } else if (item.component === 'PromoCarousel') {
            component = <PromoCarousel key={key} data={item.data} />;
        }

        return (
            <View key={key} style={{ marginBottom: theme.spacing.sm }}>
                {component}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {isFocused && (
                <StatusBar
                    backgroundColor="transparent"
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    translucent
                />
            )}

            {/* Fancy Static Header */}
            {!loading && (
                <View style={styles.topContainer}>
                    <View style={styles.actionBar}>
                        <View style={styles.logoSection}>
                            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                            <View>
                                <Typography style={styles.appName}>PS GDC</Typography>
                                <View style={styles.storeNameTag}>
                                    <Typography numberOfLines={1} ellipsizeMode="tail" style={styles.storeNameText}>{storeName}</Typography>
                                </View>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => navigation.navigate('search')}
                            >
                                <Icon icon={search} height={theme.spacing.lg} tintColor={isDarkMode ? '#FFF' : '#1A1D1E'} />
                            </TouchableOpacity>
                            <View style={{ position: 'relative' }}>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => setMenuVisible(!menuVisible)}
                                >
                                    <Icon icon={dots} height={theme.spacing.lg} tintColor={isDarkMode ? '#FFF' : '#1A1D1E'} />
                                </TouchableOpacity>

                                {menuVisible && (
                                    <View style={[styles.menuDropdown, isDarkMode && styles.menuDropdownDark]}>
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={() => {
                                                setMenuVisible(false);
                                                const auth = store.getState().systemReducer.auth;
                                                if (auth && auth.loginStatus) {
                                                    navigation.navigate('scanShop');
                                                } else {
                                                    Toasts('You must be logged in to use Scan & Shop');
                                                    navigation.navigate('login');
                                                }
                                            }}
                                        >
                                            <Icon icon={qrcode} height={theme.spacing.md} tintColor={isDarkMode ? '#D32F2F' : '#D32F2F'} />
                                            <Typography style={styles.menuText}>Scan & Shop</Typography>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={() => {
                                                setMenuVisible(false);
                                                navigation.navigate('notifications');
                                            }}
                                        >
                                            <Icon icon={homeNotification} height={theme.spacing.md} tintColor={isDarkMode ? '#FFF' : '#1A1D1E'} />
                                            <Typography style={styles.menuText}>Notifications</Typography>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={() => {
                                                setMenuVisible(false);
                                                new AuthSessionService().removeImpersonateCustomerData();
                                                new AuthSessionService().setEnvironment("")
                                                navigation.navigate('storeSelector');
                                            }}
                                        >
                                            <Icon icon={switch_icon} height={theme.spacing.md} tintColor={isDarkMode ? '#FFF' : '#1A1D1E'} />
                                            <Typography style={styles.menuText}>Switch Store</Typography>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <AddToCartDialog
                product={addToCartProduct}
                onClose={() => {
                    store.dispatch(action.setProductDialogData(undefined));
                }}
            />

            {loading ? (
                <HomeSkeleton />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${item.component}-${item.promotionId ?? item.id ?? index}`}
                    renderItem={renderComponent}
                    refreshControl={
                        <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} tintColor="#D32F2F" />
                    }
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
