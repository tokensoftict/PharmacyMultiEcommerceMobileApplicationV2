import React, { useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "@/shared/constants/global";
import { _styles } from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { useNavigation } from "@react-navigation/native";

import Counter from "../counter";
import { NavigationProps } from "@/shared/routes/stack";
import { ProductListInterface } from "@/service/product/ProductListInterface";
import { normalize } from "@/shared/helpers";
import Environment from "@/shared/utils/Environment.tsx";
import Icon from "@/shared/component/icon";
import { icon_wishlist, icon_wishlist_filled } from "@/assets/icons";
import WishlistService from "@/service/wishlist/WishlistService";
import { semantic } from "@/shared/constants/colors.ts";
import Toasts from "@/shared/utils/Toast";

interface ProductList {
    product: ProductListInterface | undefined,
}
function CardProductHorizontal({ product }: ProductList) {
    const { isDarkMode } = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(product?.is_wishlisted);

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', { productId: product?.id })

    }

    function toggleWishlist() {
        if (!product?.id) return;
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
            <View style={styles.containerImage}>
                {product !== undefined && product.quantity !== undefined && product.quantity <= 0 && (
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
                    style={[styles.image, product?.quantity !== undefined && product.quantity <= 0 && { opacity: 0.4 }]}
                    resizeMode="contain"
                    source={{ uri: product?.image }}
                />
            </View>

            <View style={styles.containerInfo}>
                <View style={styles.actions}>
                    <Typography numberOfLines={2} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                    {
                        product?.special !== false ?
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: normalize(5) }}>
                                <Typography style={styles.price}>{currencyType} {product?.special}</Typography>
                                <View style={{ width: normalize(10) }} />
                                <Typography style={styles.special}>{currencyType} {product?.price}</Typography>
                            </View>
                            :
                            <Typography style={styles.price}>{currencyType} {product?.price}</Typography>
                    }
                    {
                        (Environment.isWholeSalesEnvironment() && product?.doorstep) ?
                            <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                            : <></>
                    }

                    {
                        ((Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && product?.custom_price !== undefined && product?.custom_price.length > 0) ?
                            <Typography style={styles.doorStep}>Buy {product?.custom_price[0].min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {product?.custom_price[0].price_formatted} each</Typography>
                            :
                            <></>
                    }

                    <Typography style={styles.category}>{product?.quantity} Available</Typography>
                </View>
                <View style={styles.actions}>
                    <Counter onChange={(newCant) => setCant(newCant)} />
                    {
                        // @ts-ignore
                        product?.special_not_formatted ?
                            // @ts-ignore
                            <Typography style={styles.totalPrice}>{currencyType} {(product?.special_not_formatted * cant).toFixed(2)}</Typography>
                            :
                            // @ts-ignore
                            <Typography style={styles.totalPrice}>{currencyType} {(product?.price_not_formatted * cant).toFixed(2)}</Typography>
                    }
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default React.memo(CardProductHorizontal);
