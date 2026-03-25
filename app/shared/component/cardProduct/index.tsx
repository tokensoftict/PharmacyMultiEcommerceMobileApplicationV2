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
import { icon_wishlist, icon_wishlist_filled, white_shopping_cart } from "@/assets/icons";
import { store } from "@/redux/store/store";
import * as action from "@/redux/actions";
import { semantic } from "@/shared/constants/colors.ts";
import Environment from "@/shared/utils/Environment.tsx";
import { Card } from "react-native-paper";
import WishlistService from "@/service/wishlist/WishlistService";
import Toasts from "@/shared/utils/Toast";


interface ProductList {
    product: ProductListInterface,
}

function CardProduct({ product }: ProductList) {
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
        <Card mode="elevated" elevation={1} style={{ borderRadius: normalize(2), shadowOffset: { width: 0, height: 0 }, paddingHorizontal: normalize(5), paddingVertical: normalize(10), width: normalize(170), backgroundColor: "#FFF", margin: normalize(10) }} onPress={navigateTo}>
            <View style={styles.containerImage}>
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

                <Image
                    style={[styles.image, product.quantity !== undefined && product.quantity <= 0 && { opacity: 0.4 }]}
                    resizeMode="contain"
                    source={{ uri: product.image }}
                />
            </View>
            <View style={{ marginTop: normalize(12), paddingLeft: normalize(10) }}>
                <Typography ellipsizeMode={'tail'} numberOfLines={2} style={styles.name}>{product.name}</Typography>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography style={styles.expiryStyle}>Exp. {product?.expiry_date ?? "N/A"}</Typography>
                    <Typography style={styles.quantityStyle}>{product?.quantity} Available</Typography>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: normalize(10) }}>
                    {
                        product.special !== false ?
                            <View>
                                <Typography style={styles.special}>{currencyType} {product.price}</Typography>
                                <Typography style={styles.price}>{currencyType} {product.special}</Typography>
                            </View>
                            :
                            <Typography style={styles.price}>{currencyType} {product.price}</Typography>
                    }
                    {
                        (Environment.isLogin() && (product.quantity ?? 0) > 0) ?
                            <TouchableOpacity style={styles.addToCart} onPress={() => {
                                store.dispatch(action.setProductDialogData(product))
                            }}>
                                <Icon width={15} height={15} tintColor={semantic.background.white.w500} icon={white_shopping_cart} />
                            </TouchableOpacity>
                            : <></>
                    }
                </View>
                {
                    (Environment.isWholeSalesEnvironment() && product?.doorstep) ?
                        <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                        :
                        <></>
                }

                {
                    ((Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && (product?.custom_price?.length ?? 0) > 0) ?
                        <Typography style={styles.doorStep}>Buy {product?.custom_price[0].min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {product?.custom_price[0].price_formatted} each</Typography>
                        :
                        <></>
                }

            </View>
        </Card>
    )
}

export default React.memo(CardProduct);
