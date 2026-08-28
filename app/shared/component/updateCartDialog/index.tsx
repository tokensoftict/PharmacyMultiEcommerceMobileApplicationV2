import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    TouchableOpacity,
    View,
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Keyboard,
    ScrollView
} from "react-native";
import Typography from "@/shared/component/typography";
import { currencyType } from "@/shared/constants/global";
import Environment from "@/shared/utils/Environment";
import Counter from "@/shared/component/counter";
import { palette, semantic } from "@/shared/constants/colors";
import CartService from "@/service/cart/CartService";
import Toasts from "@/shared/utils/Toast";
import { useGlobal } from "@/shared/helpers/GlobalContext.tsx";
import { close as iconClose, trash, white_shopping_cart } from "@/assets/icons";
import Icon from "@/shared/component/icon";
import { FONT } from '@/shared/constants/fonts';
import useDarkMode from "@/shared/hooks/useDarkMode";
import { store } from "@/redux/store/store";
import * as action from "@/redux/actions";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductList {
    product: any,
    visible: boolean,
    onClose: any,
    onCartUpdated: any
}

export default function UpdateCartDialog({ product, onClose, visible, onCartUpdated }: ProductList) {
    const { isDarkMode } = useDarkMode();
    const insets = useSafeAreaInsets();
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [addToCartQuantity, setAddToCartQuantity] = useState(product?.cart_quantity);
    const [removeProductLoading, setRemoveProductLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<number[]>(product?.selected_options || []);
    const cartService = new CartService();

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

    function toggleOption(optionId: number, groupName: string) {
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
    }

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setAddToCartQuantity(product?.cart_quantity);
            setSelectedOptions(product?.selected_options || []);
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
    }, [visible, product?.cart_quantity]);

    const handleClose = useCallback(() => {
        Keyboard.dismiss();
        onClose(false);
    }, [onClose]);

    const { setCartCount, setCartTotal } = useGlobal();

    function removeProduct() {
        setRemoveProductLoading(true);
        cartService.remove(product.id).then((response) => {
            setRemoveProductLoading(false);
            if (response.data.status === true) {
                Toasts("Product removed successfully");
                setCartCount(response.data.data?.meta?.noItems || 0);
                setCartTotal(response.data.data?.meta?.totalItemsInCarts_formatted || "0.00");
                store.dispatch(action.notifyCartUpdated());
                handleClose();
                onCartUpdated();
            } else {
                Toasts("Error removing product, please try again.");
            }
        });
    }

    function updateCart() {
        if (!validateOptions()) return;
        const maxVal = parseInt(product?.max?.toString() || "0", 10);
        const qtyVal = parseInt(product?.quantity?.toString() || "0", 10);
        const available = maxVal > 0 ? Math.min(maxVal, qtyVal) : qtyVal;
        if (available >= addToCartQuantity) {
            setAddToCartLoading(true);
            cartService.add(product?.id, addToCartQuantity, true, selectedOptions).then((response) => {
                if (response.data.status === true) {
                    Toasts('Cart updated successfully!');
                    setCartCount(response.data.data?.meta?.noItems || 0);
                    setCartTotal(response.data.data?.meta?.totalItemsInCarts_formatted || "0.00");
                    store.dispatch(action.notifyCartUpdated());
                    handleClose();
                    onCartUpdated();
                }
                setAddToCartLoading(false);
            });
        } else {
            Toasts("Insufficient quantity. Available: " + available);
        }
    }

    if (!visible) return null;

    const topContainerOffset = Math.max(insets.top, theme.spacing.lg);

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
                                backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFF',
                                paddingBottom: Math.max(insets.bottom, theme.spacing.md),
                                marginTop: topContainerOffset,
                            }
                        ]}
                    >
                        <View style={styles.indicator} />
                        
                        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7} hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}>
                            <Icon icon={iconClose} customStyles={{ tintColor: isDarkMode ? '#FFF' : '#333', width: theme.spacing.xl, height: theme.spacing.xl }} />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
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
                                            {product?.quantity} Available
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
                            </View>

                            {product?.stock_option_values && product.stock_option_values.length > 0 && (
                                <View style={styles.optionsContainer}>
                                    {product.stock_option_values.map((group: any, groupIdx: number) => (
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
                                                                { backgroundColor: isDarkMode ? (isSelected ? semantic.alert.danger.d500 : semantic.fill.f02) : (isSelected ? semantic.alert.danger.d500 : '#F8FAFC'), borderColor: isSelected ? semantic.alert.danger.d500 : (isDarkMode ? semantic.fill.f04 : '#E2E8F0') }
                                                            ]}
                                                            onPress={() => toggleOption(option.id, group.option_name)}
                                                            disabled={product?.is_dependent}
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

                            <View style={[styles.quantityCard, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC', borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0' }]}>
                                <Typography style={[styles.quantityTitle, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>{product?.is_dependent ? "Linked Quantity" : "Update Quantity"}</Typography>
                                <Counter 
                                    cant={product?.cart_quantity} 
                                    disabled={product?.is_dependent}
                                    onChange={(qty) => {
                                        setAddToCartQuantity(qty);
                                    }} 
                                />
                            </View>

                            {product?.is_dependent && (
                                <View style={{ marginBottom: theme.spacing.sm, paddingHorizontal: 2 }}>
                                    <Typography style={{ color: semantic.alert.danger.d500, fontSize: theme.typography.xs, fontFamily: FONT.NORMAL }}>
                                        * This is a mandatory dependent item. To remove or change its quantity, please update its parent product.
                                    </Typography>
                                </View>
                            )}

                            <View style={styles.actions}>
                                <TouchableOpacity 
                                    disabled={removeProductLoading || product?.is_dependent} 
                                    style={[styles.btnOutline, { borderColor: product?.is_dependent ? '#CCC' : semantic.alert.danger.d500 }]} 
                                    onPress={removeProduct}
                                >
                                    {removeProductLoading ? (
                                        <ActivityIndicator color={semantic.alert.danger.d500} />
                                    ) : (
                                        <>
                                            <Icon icon={trash} customStyles={{ tintColor: product?.is_dependent ? '#CCC' : semantic.alert.danger.d500, width: theme.spacing.md, height: theme.spacing.md }} />
                                            <Typography style={[styles.btnOutlineText, product?.is_dependent && { color: '#CCC' }]}>Remove</Typography>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    disabled={addToCartLoading || product?.is_dependent} 
                                    style={[styles.btnPrimary, product?.is_dependent && { backgroundColor: '#CCC', shadowColor: '#CCC' }]} 
                                    onPress={updateCart}
                                >
                                    {addToCartLoading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Icon icon={white_shopping_cart} customStyles={{ tintColor: '#FFF', width: theme.spacing.md, height: theme.spacing.md }} />
                                            <Typography style={styles.btnPrimaryText}>Update Cart</Typography>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

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
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        width: '100%',
        maxHeight: SCREEN_HEIGHT - 80,
        elevation: 10,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: theme.borderRadius.xs / 2,
        alignSelf: 'center',
        marginTop: theme.spacing.sm,
    },
    closeBtn: {
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.lg,
        zIndex: 10,
        padding: theme.spacing.xs,
    },
    content: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
    imageWrapper: {
        width: '100%',
        height: 180,
        backgroundColor: '#F8FAFC',
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
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
        marginBottom: theme.spacing.md,
    },
    productName: {
        fontSize: theme.typography.xl,
        fontFamily: FONT.BOLD,
        marginBottom: theme.spacing.xs,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
    },
    totalPrice: {
        fontSize: theme.typography.xxl,
        fontFamily: FONT.BOLD,
        color: semantic.alert.danger.d500,
    },
    oldPrice: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.NORMAL,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    tagContainer: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    tag: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    tagText: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
    },
    quantityCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quantityTitle: {
        fontSize: theme.typography.md,
        fontFamily: FONT.BOLD,
    },
    actions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    btnOutline: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1.5,
        gap: theme.spacing.xs,
    },
    btnOutlineText: {
        color: semantic.alert.danger.d500,
        fontFamily: FONT.BOLD,
        fontSize: theme.typography.body,
    },
    btnPrimary: {
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: semantic.alert.danger.d500,
        gap: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    btnPrimaryText: {
        color: '#FFF',
        fontSize: theme.typography.body,
        fontFamily: FONT.BOLD,
    },
    optionsContainer: {
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
        paddingHorizontal: 2,
    },
    optionGroup: {
        gap: theme.spacing.xs,
    },
    optionGroupName: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
    },
    optionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    optionChip: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
    },
    optionChipSelected: {
        borderColor: semantic.alert.danger.d500,
        backgroundColor: semantic.alert.danger.d500,
    },
    optionChipText: {
        fontSize: theme.typography.xs,
        fontFamily: FONT.MEDIUM,
    },
    optionChipTextSelected: {
        color: '#FFF',
        fontFamily: FONT.BOLD,
    },
    optionPriceAdjustment: {
        fontSize: theme.typography.xs - 2,
        fontFamily: FONT.BOLD,
        marginLeft: 2,
    },
});
