import React, { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "../../constants/global.ts";
import { _styles } from './styles'
import useDarkMode from "../../hooks/useDarkMode.tsx";
import { normalize } from "../../helpers";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import { ProductListInterface } from "@/service/product/ProductListInterface";
import Environment from "@/shared/utils/Environment";
import { FONT } from "@/shared/constants/fonts";
import Icon from "@/shared/component/icon";
import { icon_wishlist, icon_wishlist_filled } from "@/assets/icons";
import WishlistService from "@/service/wishlist/WishlistService";
import { semantic } from "@/shared/constants/colors.ts";
import Toasts from "@/shared/utils/Toast";


interface ProductList {
    product: ProductListInterface,
}

function SmallCardProduct({ product }: ProductList) {
    const { isDarkMode } = useDarkMode()
    const styles = _styles(isDarkMode)
    const navigation = useNavigation<NavigationProps>();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', { productId: product.id })

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

    return (
        <TouchableOpacity onPress={navigateTo} style={styles.container}>
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
                onPress={toggleWishlist}
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

            <View style={styles.containerImage}>
                <Image
                    style={[styles.image, (product.quantity ?? 0) <= 0 && { opacity: 0.4 }]}
                    resizeMode="contain"
                    source={{ uri: product.image }}
                />
            </View>

            <View style={{ paddingHorizontal: normalize(4) }}>
                <Typography ellipsizeMode={'tail'} numberOfLines={2} style={styles.name}>{product.name}</Typography>

                <View style={styles.badgeContainer}>
                    <View style={styles.stockBadge}>
                        <Typography style={styles.stockText}>{product.quantity ?? 0} In Stock</Typography>
                    </View>
                    <View style={styles.expiryBadge}>
                        <Typography style={styles.expiryText}>Exp: {product.expiry_date ?? "N/A"}</Typography>
                    </View>
                </View>

                <View style={{ marginTop: normalize(6) }}>
                    {
                        product.special !== false ?
                            <View>
                                <Typography style={styles.special}>{currencyType} {product.price}</Typography>
                                <Typography style={styles.price}>{currencyType} {product.special}</Typography>
                            </View>
                            :
                            <Typography style={styles.price}>{currencyType} {product.price}</Typography>
                    }
                </View>
                {
                    (Environment.isWholeSalesEnvironment() && product?.doorstep) ?
                        <Typography style={styles.doorStep}>+ Door Delivery {currencyType} {product.doorstep}</Typography> :
                        <></>
                }

                {
                    ((Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && product?.custom_price !== undefined && product?.custom_price.length > 0) ?
                        <Typography style={{ fontSize: normalize(8), marginTop: 4, color: 'red', fontFamily: FONT.BOLD }}>Buy {product?.custom_price[0].min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {product?.custom_price[0].price_formatted} each.</Typography>
                        :
                        <></>
                }
            </View>
        </TouchableOpacity>
    )
}


export default React.memo(SmallCardProduct);
