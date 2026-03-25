import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { _styles } from './styles'
import Header from "./components/header";
import useDarkMode from "@/shared/hooks/useDarkMode";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import { star, shoppingBag, white_shopping_cart, icon_wishlist, icon_wishlist_filled } from "@/assets/icons";
import Counter from "@/shared/component/counter";
import { currencyType } from "@/shared/constants/global.ts";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import ProductService from "@/service/product/show/ProductService";
import { ProductInformationInterface, Data } from "@/service/product/show/interface/ProductInformationInterface";
import Toasts from "@/shared/utils/Toast";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import CartService from "@/service/cart/CartService";
import Environment from "@/shared/utils/Environment";
import HeaderWithIcon from "@/shared/component/headerBack";
import { normalize } from "@/shared/helpers";
import { FONT } from '@/shared/constants/fonts';
import WishlistService from "@/service/wishlist/WishlistService";
import { semantic } from "@/shared/constants/colors";

export default function DetailProduct() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const { isDarkMode } = useDarkMode()
    const styles = _styles(isDarkMode)
    const [isLoading, setIsLoading] = useState(false);
    const productService = new ProductService();
    const [productInformation, setProductInformation] = useState<ProductInformationInterface>();
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [addToCartQuantity, setAddToCartQuantity] = useState(1);
    const [bottomNavHeight, setBottomNavHeight] = useState(0);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const cartService = new CartService();

    useEffectOnce(function () {
        // @ts-ignore
        const productId = route.params?.productId;
        // @ts-ignore
        const bottomNav = route.params?.bottomNav
        if (bottomNav) {
            setBottomNavHeight(60);
        }
        if (!productId) {
            Toasts('Unknown error occurred!');
            navigation.goBack();
        }
        setIsLoading(true)
        productService.getProduct(productId).then((response) => {
            setIsLoading(false);
            setProductInformation(response.data);
        }, (error) => {
            setIsLoading(false);
            Toasts('Unknown error occurred!')
            navigation.goBack();
        });
    }, []);

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('checkout')

    }

    function toggleWishlist() {
        if (!productInformation?.data.id) return;
        setWishlistLoading(true);
        const service = new WishlistService();
        const promise = productInformation.data.is_wishlisted
            ? service.remove(productInformation.data.id)
            : service.add(productInformation.data.id);

        promise.then((response) => {
            setWishlistLoading(false);
            if (response.data.status === true) {
                Toasts(productInformation.data.is_wishlisted ? 'Product removed from wishlist!' : 'Product added to wishlist!');
                // Update local state to reflect the change
                setProductInformation(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            is_wishlisted: !prev.data.is_wishlisted
                        }
                    };
                });
            } else {
                Toasts(response.data.message || 'Action failed');
            }
        }).catch(() => {
            setWishlistLoading(false);
            Toasts('An error occurred');
        });
    }

    function handleBuyNow(acceptDependent: boolean = false) {
        setBuyNowLoading(true);
        cartService.add(productInformation?.data?.id, buyNowQuantity, acceptDependent, selectedOptions).then((response: any) => {
            if (response.data.status === true) {
                navigateTo();
            }
            setBuyNowLoading(false);
        }).catch(() => {
            setBuyNowLoading(false);
            Toasts('Failed to process your request.');
        });
    }

    function buyNow() {
        if (!validateOptions()) return;
        const availableQty = productInformation?.data.max === 0 ? productInformation?.data.quantity : productInformation?.data.max;
        const available = parseInt(availableQty?.toString() || "0");
        if (available >= buyNowQuantity) {
            handleBuyNow(true); // Dependents are mandatory
        } else {
            Toasts("Insufficient quantity, Total available quantity is " + available);
        }
    }

    function handleAddToCart(acceptDependent: boolean = false) {
        setAddToCartLoading(true);
        cartService.add(productInformation?.data.id, addToCartQuantity, acceptDependent, selectedOptions).then((response) => {
            if (response.data.status === true) {
                Toasts('Item has been added to cart Successfully!');
            }
        }).catch(() => {
            Toasts('Failed to add item to cart.');
        }).finally(() => {
            setAddToCartLoading(false);
        });
    }

    function addToCart() {
        if (!validateOptions()) return;
        const availableQty = productInformation?.data.max === 0 ? productInformation?.data.quantity : productInformation?.data.max;
        const available = parseInt(availableQty?.toString() || "0");
        if (available >= addToCartQuantity) {
            handleAddToCart(true); // Dependents are mandatory
        } else {
            Toasts("Insufficient quantity, Total available quantity to order is " + available);
        }
    }

    const validateOptions = () => {
        if (!productInformation?.data.stock_option_values) return true;

        for (const group of productInformation.data.stock_option_values) {
            const hasSelection = group.options.some((opt: any) => selectedOptions.includes(opt.id));
            if (!hasSelection) {
                Toasts(`Please select an option for ${group.option_name}`);
                return false;
            }
        }
        return true;
    };

    function toggleOption(optionId: number, groupName: string) {
        setSelectedOptions((prev) => {
            const group = productInformation?.data.stock_option_values?.find(g => g.option_name === groupName);
            if (!group) return prev;

            const groupOptionIds = group.options.map((o: any) => o.id);
            const filtered = prev.filter(id => !groupOptionIds.includes(id));

            if (prev.includes(optionId)) {
                return filtered;
            } else {
                return [...filtered, optionId];
            }
        });
    }



    return (
        <WrapperNoScroll loading={isLoading}>
            <HeaderWithIcon title={productInformation?.data.name} />

            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.containerImage}>
                        {productInformation?.data.store.quantity !== undefined && productInformation?.data.store.quantity <= 0 && (
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
                                        styles.wishlistIconDetailed,
                                        { tintColor: productInformation?.data.is_wishlisted ? "#D50000" : '#9E9E9E' }
                                    ]}
                                    icon={productInformation?.data.is_wishlisted ? icon_wishlist_filled : icon_wishlist}
                                />
                            )}
                        </TouchableOpacity>

                        <Image
                            resizeMode="contain"
                            style={[styles.image, (productInformation?.data?.store?.quantity ?? 0) <= 0 && { opacity: 0.5 }]}
                            source={{ uri: productInformation?.data.image }}
                        />
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.headerRow}>
                            <View style={styles.containerName}>
                                <Typography style={styles.name}>{productInformation?.data.name}</Typography>
                            </View>
                        </View>

                        <View style={styles.priceSection}>
                            <Typography style={styles.total}>
                                {currencyType} {productInformation?.data.special || productInformation?.data.price}
                            </Typography>
                            {
                                productInformation?.data.special && (
                                    <Typography style={styles.special}>{currencyType} {productInformation?.data.price}</Typography>
                                )
                            }
                        </View>

                        {productInformation?.data.stock_option_values && productInformation.data.stock_option_values.length > 0 && (
                            <View style={styles.optionsContainer}>
                                {productInformation.data.stock_option_values.map((group, groupIdx) => (
                                    <View key={groupIdx} style={styles.optionGroup}>
                                        <Typography style={styles.optionGroupName}>{group.option_name}</Typography>
                                        <View style={styles.optionsList}>
                                            {group.options.map((option: any) => {
                                                const isSelected = selectedOptions.includes(option.id);
                                                return (
                                                    <TouchableOpacity
                                                        key={option.id}
                                                        style={[
                                                            styles.optionChip,
                                                            isSelected && styles.optionChipSelected,
                                                            {
                                                                backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC',
                                                                borderColor: isDarkMode ? (isSelected ? semantic.alert.danger.d500 : semantic.fill.f04) : (isSelected ? semantic.alert.danger.d500 : '#E2E8F0')
                                                            }
                                                        ]}
                                                        onPress={() => toggleOption(option.id, group.option_name)}
                                                    >
                                                        <Typography style={[styles.optionChipText, isSelected && styles.optionChipTextSelected]}>
                                                            {option.name}
                                                            {option.price > 0 && (
                                                                <Typography style={[
                                                                    styles.optionPriceAdjustment,
                                                                    { color: option.price_prefix === '+' ? '#2E7D32' : '#D50000' }
                                                                ]}>
                                                                    {` (${option.price_prefix}${currencyType}${option.price})`}
                                                                </Typography>
                                                            )}
                                                        </Typography>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.tagContainer}>
                            {
                                (productInformation?.data?.box && productInformation.data.box > 1 && Environment.isSuperMarketEnvironment()) && (
                                    <View style={[styles.badge, styles.sachetBadge]}>
                                        <Typography style={styles.sachetText}>Individual Sachets</Typography>
                                    </View>
                                )
                            }
                            <View style={[styles.badge, styles.quantityBadge]}>
                                <Typography style={styles.quantityText}>{(productInformation?.data.store?.quantity ?? 0)} In Stock</Typography>
                            </View>
                            {
                                productInformation?.data.classification && (
                                    <View style={[styles.badge, styles.classificationBadge]}>
                                        <Typography style={styles.classificationText}>{productInformation?.data.classification}</Typography>
                                    </View>
                                )
                            }
                            {
                                productInformation?.data.store.expiry_date && (
                                    <View style={[styles.badge, styles.expiryBadge]}>
                                        <Typography style={styles.expiryText}>Exp: {productInformation?.data.store.expiry_date}</Typography>
                                    </View>
                                )
                            }
                        </View>


                        {
                            (Environment.isWholeSalesEnvironment() && productInformation?.data.doorstep) && (
                                <View style={styles.doorStepContainer}>
                                    <Typography style={styles.doorStepText}>
                                        🚚 Door Delivery: {currencyType} {productInformation?.data.doorstep}
                                    </Typography>
                                </View>
                            )
                        }

                        {
                            ((Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && productInformation?.data?.custom_price && productInformation.data.custom_price.length > 0) && (
                                <View style={[styles.customPriceContainer, { gap: normalize(4) }]}>
                                    {productInformation.data.custom_price.map((item, index) => (
                                        <Typography key={index} style={styles.customPriceText}>
                                            🎉 Buy {item.min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {item.price_formatted} each.
                                        </Typography>
                                    ))}
                                </View>
                            )
                        }

                        {productInformation?.data.dependent_products && productInformation.data.dependent_products.length > 0 && (
                            <View style={styles.bundleInfo}>
                                <Typography style={styles.bundleTitle}>🎁 Bundle Special</Typography>
                                {productInformation.data.dependent_products.map((dep, idx) => (
                                    <Typography key={idx} style={styles.bundleItem}>
                                        Includes {dep.child}x {dep.name} for every {dep.parent}x units of this item.
                                        {"\n"}<Typography style={styles.bundleMeta}>* This item is mandatory and will be added automatically.</Typography>
                                    </Typography>
                                ))}
                            </View>
                        )}

                        <View style={styles.separator} />

                        {
                            productInformation?.data.description.length > 0 && (
                                <View style={styles.descriptionContainer}>
                                    <Typography style={styles.descriptionTitle}>Description</Typography>
                                    <Typography style={styles.description}>
                                        {productInformation?.data.description}
                                    </Typography>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    {(productInformation?.data.store.quantity ?? 0) > 0 ? (
                        <>
                            <View style={styles.quantityRow}>
                                <Typography style={styles.quantityLabel}>Quantity</Typography>
                                <Counter onChange={(qty) => {
                                    setBuyNowQuantity(qty);
                                    setAddToCartQuantity(qty);
                                }} />
                            </View>
                            <View style={styles.buttonRow}>
                                <View style={styles.buyNowButton}>
                                    <ButtonOutline
                                        loading={buyNowLoading}
                                        disabled={buyNowLoading}
                                        onPress={buyNow}
                                        leftIcon={<Icon customStyles={{ tintColor: 'red' }} icon={shoppingBag} />}
                                        title="Buy Now"
                                    />
                                </View>
                                <View style={styles.addToCartButton}>
                                    <Button
                                        loading={addToCartLoading}
                                        disabled={addToCartLoading}
                                        onPress={addToCart}
                                        leftIcon={<Icon customStyles={{ tintColor: 'white' }} icon={white_shopping_cart} />}
                                        title="Add To Cart"
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: normalize(10) }}>
                            <Typography style={{ color: '#D50000', fontFamily: FONT.BOLD, fontSize: normalize(16) }}>
                                This product is currently unavailable
                            </Typography>
                        </View>
                    )}
                </View>
            </View>
        </WrapperNoScroll>
    )
}
