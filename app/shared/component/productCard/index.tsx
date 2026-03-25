import React, { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "@/shared/constants/global.ts";
import { _styles } from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { normalize } from "@/shared/helpers";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import { ProductListInterface } from "@/service/product/ProductListInterface";
import Icon from "@/shared/component/icon";
import { white_shopping_cart, add, icon_wishlist, icon_wishlist_filled } from "@/assets/icons";
import { store } from "@/redux/store/store";
import * as action from "@/redux/actions";
import { semantic } from "@/shared/constants/colors.ts";
import Environment from "@/shared/utils/Environment.tsx";
import WishlistService from "@/service/wishlist/WishlistService";
import Toasts from "@/shared/utils/Toast";

interface ProductCardProps {
    product: ProductListInterface;
    style?: any;
}

const ProductCard = ({ product, style }: ProductCardProps) => {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const navigation = useNavigation<NavigationProps>();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', { productId: product.id });
    }

    function toggleWishlist() {
        setWishlistLoading(true);
        const service = new WishlistService();
        const promise = product.is_wishlisted
            ? service.remove(product.id as number)
            : service.add(product.id);

        promise.then((response) => {
            setWishlistLoading(false);
            if (response.data.status === true) {
                setIsWishlisted(!isWishlisted);
                Toasts(isWishlisted ? 'Product removed from wishlist!' : 'Product added to wishlist!');
            } else {
                Toasts(response.data.message || 'Action failed');
            }
        }).catch(() => {
            setWishlistLoading(false);
            Toasts('An error occurred');
        });
    }

    const showDoorstep = Environment.isWholeSalesEnvironment() && product?.doorstep;
    const showCustomPrice = (Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && (product?.custom_price?.length ?? 0) > 0;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.container, style]}
            onPress={navigateTo}
        >
            <View style={styles.imageContainer}>
                {product.quantity !== undefined && product.quantity <= 0 && (
                    <View style={styles.outOfStockContainer}>
                        <View style={styles.outOfStockBadge}>
                            <Typography style={styles.outOfStockText}>Out of Stock</Typography>
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.wishlistButton,

                    ]}
                    onPress={(e) => {
                        e.stopPropagation();
                        toggleWishlist();
                    }}
                    disabled={wishlistLoading}
                >
                    {wishlistLoading ? (
                        <ActivityIndicator size="small" color="#D50000" />
                    ) : (
                        <Icon
                            customStyles={[
                                styles.wishlistIcon,
                                { tintColor: isWishlisted ? "#D50000" : '#9E9E9E' }
                            ]}
                            icon={isWishlisted ? icon_wishlist_filled : icon_wishlist}
                        />
                    )}
                </TouchableOpacity>

                <Image
                    style={[styles.image, product.quantity !== undefined && product.quantity <= 0 && { opacity: 0.4 }]}
                    source={{ uri: product.image }}
                />

                <View style={styles.badgeContainer}>
                    {product?.expiry_date && (
                        <View style={[styles.badge, styles.expiryBadge]}>
                            <Typography style={[styles.badgeText, styles.expiryText]}>
                                Exp. {product.expiry_date}
                            </Typography>
                        </View>
                    )}
                    {product?.quantity !== undefined && (
                        <View style={[styles.badge, styles.quantityBadge]}>
                            <Typography style={styles.badgeText}>
                                {product.quantity} Available
                            </Typography>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.info}>
                <Typography
                    ellipsizeMode={'tail'}
                    numberOfLines={2}
                    style={styles.name}
                >
                    {product.name}
                </Typography>

                <View style={styles.priceRow}>
                    <Typography style={styles.price}>
                        {currencyType} {product.special !== false ? product.special : product.price}
                    </Typography>
                    {product.special !== false && (
                        <Typography style={styles.oldPrice}>
                            {currencyType} {product.price}
                        </Typography>
                    )}
                </View>

                {showDoorstep && (
                    <Typography style={styles.doorStep}>
                        + Door Delivery : {currencyType} {product?.doorstep}
                    </Typography>
                )}

                {showCustomPrice && (
                    <Typography style={styles.doorStep}>
                        Buy {product?.custom_price[0].min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {product?.custom_price[0].price_formatted} each
                    </Typography>
                )}
            </View>

            {Environment.isLogin() && (product.quantity ?? 0) > 0 && (
                <TouchableOpacity
                    style={styles.addToCart}
                    onPress={(e) => {
                        e.stopPropagation();
                        store.dispatch(action.setProductDialogData(product));
                    }}
                >
                    <Icon
                        width={14}
                        height={14}
                        tintColor={semantic.text.white}
                        icon={add}
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default React.memo(ProductCard);
