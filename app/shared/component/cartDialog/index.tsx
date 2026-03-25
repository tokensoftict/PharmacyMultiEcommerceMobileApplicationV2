import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Animated,
    StyleSheet,
    Dimensions,
    Pressable,
    Alert
} from 'react-native';
import { normalize } from "@/shared/helpers";
import { currencyType } from "@/shared/constants/global";
import { design, labels, palette, semantic } from "@/shared/constants/colors";
import CartService from "@/service/cart/CartService";
import Toasts from "@/shared/utils/Toast";
import { ProductListInterface } from "@/service/product/ProductListInterface";
import { Data } from "@/service/product/show/interface/ProductInformationInterface";
import { store } from "@/redux/store/store";
import * as action from "@/redux/actions";
import Typography from "@/shared/component/typography";
import Counter from "@/shared/component/counter";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import Environment from "@/shared/utils/Environment";
import { close as iconClose, shoppingBag, white_shopping_cart } from "@/assets/icons";
import Icon from "@/shared/component/icon";
import { FONT } from '@/shared/constants/fonts';

import useDarkMode from "@/shared/hooks/useDarkMode";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductList {
    visible: boolean;
    product: ProductListInterface | Data | undefined,
}

const ProductDialog = ({ visible, product }: ProductList) => {
    const { isDarkMode } = useDarkMode();
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [addToCartQuantity, setAddToCartQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const navigation = useNavigation<NavigationProps>();
    const cartService = new CartService();

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setSelectedOptions([]);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 50,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const handleClose = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {
            store.dispatch(action.setProductDialogData(undefined));
        });
    }, [fadeAnim, slideAnim]);

    const navigateTo = () => {
        // @ts-ignore
        navigation.navigate('checkout');
    };

    const handleBuyNow = (acceptDependent: boolean = false) => {
        setBuyNowLoading(true);
        cartService.add(product?.id, buyNowQuantity, acceptDependent, selectedOptions).then((response) => {
            setBuyNowLoading(false);
            if (response.data.status === true) {
                handleClose();
                setTimeout(navigateTo, 300); // Navigate after animation
            }
        });
    };

    const buyNow = () => {
        if (!validateOptions()) return;
        // @ts-ignore
        const available = parseInt(product?.max === "0" ? product?.quantity : product?.max);
        if (available >= buyNowQuantity) {
            handleBuyNow(true); // Mandatory
        } else {
            Toasts("Insufficient quantity. Available: " + available);
        }
    };

    const handleAddToCart = (acceptDependent: boolean = false) => {
        if (!validateOptions()) return;
        setAddToCartLoading(true);
        cartService.add(product?.id, addToCartQuantity, acceptDependent, selectedOptions).then((response) => {
            console.log(response);
            if (response.data.status === true) {
                Toasts('Item added to cart!');
                handleClose();
            }
            setAddToCartLoading(false);
        });
    };

    const addToCart = () => {
        // @ts-ignore
        const available = parseInt(product?.quantity);
        if (available >= addToCartQuantity) {
            handleAddToCart(true); // Mandatory
        } else {
            Toasts("Insufficient quantity. Available: " + available);
        }
    };

    const validateOptions = () => {
        if (!product?.stock_option_values) return true;
        for (const group of product.stock_option_values) {
            const hasSelection = group.options.some((opt: any) => selectedOptions.includes(opt.id));
            if (!hasSelection) {
                Toasts(`Please select an option for ${group.option_name}`);
                return false;
            }
        }
        return true;
    };

    const toggleOption = (optionId: number, groupName: string) => {
        setSelectedOptions((prev) => {
            const group = product?.stock_option_values?.find((g: any) => g.option_name === groupName);
            if (!group) return prev;
            
            const groupOptionIds = group.options.map((o: any) => o.id);
            const otherGroupSelections = prev.filter(id => !groupOptionIds.includes(id));
            
            if (prev.includes(optionId)) {
                return otherGroupSelections;
            } else {
                return [...otherGroupSelections, optionId];
            }
        });
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                    <Pressable style={{ flex: 1 }} onPress={handleClose} />
                </Animated.View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.avoidingView}
                >
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                transform: [{ translateY: slideAnim }],
                                backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFF'
                            }
                        ]}
                    >
                        <View style={styles.indicator} />

                        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                            <Icon icon={iconClose} customStyles={{ tintColor: isDarkMode ? '#FFF' : '#333', width: normalize(20), height: normalize(20) }} />
                        </TouchableOpacity>

                        <View style={styles.content}>
                            <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC' }]}>
                                <Image source={{ uri: product?.image }} style={styles.productImage} />
                            </View>

                            <View style={styles.mainInfo}>
                                <Typography style={[styles.productName, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>
                                    {product?.name}
                                </Typography>

                                <View style={styles.priceRow}>
                                    {product?.special ? (
                                        <>
                                            <Typography style={styles.totalPrice}>
                                                {currencyType} {product.special}
                                            </Typography>
                                            <Typography style={styles.oldPrice}>
                                                {currencyType} {product.price}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography style={styles.totalPrice}>
                                            {currencyType} {product?.price}
                                        </Typography>
                                    )}
                                </View>

                                <View style={styles.tagContainer}>
                                    <View style={[styles.tag, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F0F9FF' }]}>
                                        <Typography style={[styles.tagText, { color: isDarkMode ? '#60A5FA' : '#0284C7' }]}>
                                            {product?.quantity} In Stock
                                        </Typography>
                                    </View>
                                    {product?.expiry_date && (
                                        <View style={[styles.tag, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC' }]}>
                                            <Typography style={[styles.tagText, { color: isDarkMode ? '#94A3B8' : '#475569' }]}>
                                                Exp: {product.expiry_date}
                                            </Typography>
                                        </View>
                                    )}
                                </View>
                                {product?.dependent_products && product.dependent_products.length > 0 && (
                                    <View style={styles.bundleInfo}>
                                        <Typography style={styles.bundleTitle}>🎁 Bundle Offer</Typography>
                                        {product.dependent_products.map((dep, idx) => (
                                            <Typography key={idx} style={styles.bundleItem}>
                                                Includes {dep.child}x {dep.name} for every {dep.parent}x of this product.
                                            </Typography>
                                        ))}
                                    </View>
                                )}

                                {/* Stock Options UI */}
                                {product?.stock_option_values && product.stock_option_values.length > 0 && (
                                    <View style={styles.optionsContainer}>
                                        {product.stock_option_values.map((group, groupIdx) => (
                                            <View key={groupIdx} style={styles.optionGroup}>
                                                <Typography style={[styles.optionGroupName, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>
                                                    {group.option_name}
                                                </Typography>
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
                                                                        backgroundColor: isSelected ? semantic.alert.danger.d500 : (isDarkMode ? semantic.fill.f02 : '#F8FAFC'),
                                                                        borderColor: isSelected ? semantic.alert.danger.d500 : (isDarkMode ? semantic.fill.f04 : '#E2E8F0')
                                                                    }
                                                                ]}
                                                                onPress={() => toggleOption(option.id, group.option_name)}
                                                            >
                                                                <Typography style={[
                                                                    styles.optionChipText,
                                                                    isSelected && styles.optionChipTextSelected,
                                                                    { color: isSelected ? '#FFF' : (isDarkMode ? '#94A3B8' : '#475569') }
                                                                ]}>
                                                                    {option.name}
                                                                    {option.price > 0 && (
                                                                        <Typography style={[
                                                                            styles.optionPriceAdjustment,
                                                                            { color: isSelected ? '#FFF' : (option.price_prefix === '+' ? '#2E7D32' : '#D50000') }
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
                            </View>

                            <View style={[styles.quantityCard, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC', borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0' }]}>
                                <Typography style={[styles.quantityTitle, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>Select Quantity</Typography>
                                <Counter onChange={(qty) => {
                                    setBuyNowQuantity(qty);
                                    setAddToCartQuantity(qty);
                                }} />
                            </View>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    disabled={buyNowLoading}
                                    style={[styles.btnOutline, { borderColor: semantic.alert.danger.d500 }]}
                                    onPress={buyNow}
                                >
                                    {buyNowLoading ? (
                                        <ActivityIndicator color={semantic.alert.danger.d500} />
                                    ) : (
                                        <>
                                            <Icon icon={shoppingBag} customStyles={{ tintColor: semantic.alert.danger.d500, width: normalize(18), height: normalize(18) }} />
                                            <Typography style={styles.btnOutlineText}>Buy Now</Typography>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={addToCartLoading}
                                    style={styles.btnPrimary}
                                    onPress={addToCart}
                                >
                                    {addToCartLoading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Icon icon={white_shopping_cart} customStyles={{ tintColor: '#FFF', width: normalize(18), height: normalize(18) }} />
                                            <Typography style={styles.btnPrimaryText}>Add to Cart</Typography>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    avoidingView: {
        width: '100%',
    },
    modalContainer: {
        borderTopLeftRadius: normalize(32),
        borderTopRightRadius: normalize(32),
        paddingBottom: Platform.OS === 'ios' ? normalize(40) : normalize(24),
        width: '100%',
        minHeight: normalize(450),
    },
    indicator: {
        width: normalize(40),
        height: normalize(4),
        backgroundColor: '#E2E8F0',
        borderRadius: normalize(2),
        alignSelf: 'center',
        marginTop: normalize(12),
    },
    closeBtn: {
        position: 'absolute',
        top: normalize(20),
        right: normalize(24),
        zIndex: 10,
        padding: normalize(4),
    },
    content: {
        paddingHorizontal: normalize(24),
        paddingTop: normalize(24),
    },
    imageWrapper: {
        width: '100%',
        height: normalize(180),
        backgroundColor: '#F8FAFC',
        borderRadius: normalize(24),
        marginBottom: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    productImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    mainInfo: {
        marginBottom: normalize(24),
    },
    productName: {
        fontSize: normalize(20),
        fontFamily: FONT.BOLD,
        marginBottom: normalize(8),
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: normalize(8),
        marginBottom: normalize(12),
    },
    totalPrice: {
        fontSize: normalize(22),
        fontFamily: FONT.BOLD,
        color: semantic.alert.danger.d500,
    },
    oldPrice: {
        fontSize: normalize(14),
        fontFamily: FONT.NORMAL,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    tagContainer: {
        flexDirection: 'row',
        gap: normalize(8),
    },
    tag: {
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(6),
        borderRadius: normalize(100),
    },
    tagText: {
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
    },
    quantityCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: normalize(16),
        borderRadius: normalize(20),
        marginBottom: normalize(24),
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quantityTitle: {
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
    },
    actions: {
        flexDirection: 'row',
        gap: normalize(12),
    },
    btnOutline: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(14),
        borderRadius: normalize(16),
        borderWidth: 1.5,
        gap: normalize(8),
    },
    btnOutlineText: {
        color: semantic.alert.danger.d500,
        fontFamily: FONT.BOLD,
        fontSize: normalize(16),
    },
    btnPrimary: {
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(14),
        borderRadius: normalize(16),
        backgroundColor: semantic.alert.danger.d500,
        gap: normalize(8),
        shadowColor: semantic.alert.danger.d500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    btnPrimaryText: {
        color: '#FFF',
        fontSize: normalize(16),
    },
    bundleInfo: {
        marginTop: normalize(16),
        padding: normalize(12),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    bundleTitle: {
        fontSize: normalize(14),
        fontFamily: FONT.BOLD,
        color: '#2563EB',
        marginBottom: normalize(4),
    },
    bundleItem: {
        fontSize: normalize(12),
        fontFamily: FONT.MEDIUM,
        color: '#1E40AF',
    },
    optionsContainer: {
        marginTop: normalize(10),
        marginBottom: normalize(20),
        gap: normalize(16),
        paddingHorizontal: normalize(4),
    },
    optionGroup: {
        gap: normalize(10),
    },
    optionGroupName: {
        fontSize: normalize(15),
        fontFamily: FONT.BOLD,
    },
    optionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: normalize(10),
    },
    optionChip: {
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(6),
        borderRadius: normalize(10),
        borderWidth: 1,
    },
    optionChipSelected: {
        borderColor: semantic.alert.danger.d500,
        backgroundColor: semantic.alert.danger.d500,
    },
    optionChipText: {
        fontSize: normalize(13),
        fontFamily: FONT.MEDIUM,
    },
    optionChipTextSelected: {
        color: '#FFF',
        fontFamily: FONT.BOLD,
    },
    optionPriceAdjustment: {
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
        marginLeft: normalize(4),
    },
});

export default ProductDialog;
