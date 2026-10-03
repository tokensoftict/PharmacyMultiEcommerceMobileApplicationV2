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
    Easing,
    Dimensions,
    Pressable,
    StyleSheet,
    Keyboard,
    ScrollView,
    TextInput
} from "react-native";
import Typography from "@/shared/component/typography";
import { currencyType } from "@/shared/constants/global";
import Environment from "@/shared/utils/Environment";
import { semantic } from "@/shared/constants/colors";
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

const QUICK_PICKS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

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
    const [qtyText, setQtyText] = useState(String(product?.cart_quantity || 1));
    const qty = parseInt(qtyText, 10) || 0;
    const [removeProductLoading, setRemoveProductLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<number[]>(product?.selected_options || []);
    const cartService = new CartService();
    const locked = !!product?.is_dependent;

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [rendered, setRendered] = useState(false);

    // 1) Mount the modal + reset form state whenever we're asked to show.
    useEffect(() => {
        if (visible) {
            setQtyText(String(product?.cart_quantity || 1));
            setSelectedOptions(product?.selected_options || []);
            setRendered(true);
        }
    }, [visible]);

    // 2) Animate only once the modal is mounted (smooth first frame + real exit animation).
    useEffect(() => {
        if (!rendered) return;
        if (visible) {
            slideAnim.setValue(SCREEN_HEIGHT);
            fadeAnim.setValue(0);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 320,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 220,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 240,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished) setRendered(false);
            });
        }
    }, [rendered, visible]);

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

    // Available stock (respecting per-order max)
    const maxVal = parseInt(product?.max?.toString() || "0", 10);
    const stockVal = parseInt(product?.quantity?.toString() || "0", 10);
    const availableQty = maxVal > 0 ? Math.min(maxVal, stockVal) : stockVal;

    function updateCart() {
        if (!validateOptions()) return;
        if (qty < 1) {
            Toasts("Please enter a quantity");
            return;
        }
        if (availableQty >= qty) {
            setAddToCartLoading(true);
            cartService.add(product?.id, qty, true, selectedOptions).then((response) => {
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
            Toasts("Insufficient quantity. Available: " + availableQty);
        }
    }

    if (!rendered) return null;

    const topContainerOffset = Math.max(insets.top, theme.spacing.lg);

    const unitPrice = parseFloat(String(product?.special || product?.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const clampQty = (n: number) => {
        const lower = Math.max(1, n);
        return availableQty > 0 ? Math.min(availableQty, lower) : lower;
    };
    const setQty = (n: number) => setQtyText(String(clampQty(n)));
    const onTypeQty = (t: string) => {
        const digits = t.replace(/\D/g, '').replace(/^0+/, '');
        if (!digits) return setQtyText('');
        const n = parseInt(digits, 10);
        setQtyText(String(availableQty > 0 ? Math.min(availableQty, n) : n));
    };
    const stockPct = availableQty > 0 ? Math.min(1, availableQty / 5000) : 0;
    const lowStock = availableQty < 60;
    const stockColor = lowStock ? '#F59E0B' : '#16A34A';
    const showCarton = product?.carton !== undefined && product.carton > 1 && !Environment.isSuperMarketEnvironment();
    const inCartQty = parseInt(product?.cart_quantity?.toString() || '0', 10);
    const changed = qty !== inCartQty;

    const text = isDarkMode ? '#FFF' : '#0F172A';
    const border = isDarkMode ? semantic.fill.f04 : '#E2E8F0';
    const soft = isDarkMode ? semantic.fill.f02 : '#F1F5F9';

    return (
        <Modal
            transparent
            visible={rendered}
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

                        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                            <Icon icon={iconClose} customStyles={{ tintColor: isDarkMode ? '#FFF' : '#333', width: theme.spacing.xl, height: theme.spacing.xl }} />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
                            {/* Header: image + info side by side */}
                            <View style={styles.topRow}>
                                <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFF1F0' }]}>
                                    <View style={styles.imageBlob} />
                                    <Image source={{ uri: product?.image }} style={styles.productImage} />
                                    {product?.expiry_date && (
                                        <View style={styles.expiryPill}>
                                            <Typography style={styles.expiryPillText}>⏳ Exp. {product.expiry_date}</Typography>
                                        </View>
                                    )}
                                    <View style={styles.inCartBadge}>
                                        <Typography style={styles.inCartBadgeText}>IN CART · {inCartQty}</Typography>
                                    </View>
                                </View>

                                <View style={styles.infoCol}>
                                    <Typography numberOfLines={3} style={[styles.productName, { color: text }]}>
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

                                    {showCarton && (
                                        <View style={[styles.cartonChip, { borderColor: isDarkMode ? semantic.fill.f04 : '#CBD5E1' }]}>
                                            <View style={styles.cartonNumWrap}>
                                                <Typography style={styles.cartonNum}>{product?.carton}</Typography>
                                            </View>
                                            <View style={[styles.cartonLabelWrap, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFF7ED' }]}>
                                                <Typography style={[styles.cartonLabel, { color: isDarkMode ? '#FFF' : '#C2410C' }]}>📦 IN CARTON</Typography>
                                            </View>
                                        </View>
                                    )}

                                    <View>
                                        <View style={[styles.stockTrack, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#E2E8F0' }]}>
                                            <View style={[styles.stockFill, { width: `${Math.round(stockPct * 100)}%`, backgroundColor: stockColor }]} />
                                        </View>
                                        <Typography style={[styles.stockText, { color: stockColor }]}>
                                            {lowStock ? `Only ${product?.quantity} left` : `${product?.quantity} Available`}
                                        </Typography>
                                    </View>
                                </View>
                            </View>

                            {/* Stock options */}
                            {product?.stock_option_values && product.stock_option_values.length > 0 && (
                                <View style={styles.optionsContainer}>
                                    {product.stock_option_values.map((group: any, groupIdx: number) => (
                                        <View key={groupIdx} style={styles.optionGroup}>
                                            <Typography style={[styles.optionGroupName, { color: text }]}>
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
                                                                {
                                                                    backgroundColor: isSelected ? semantic.alert.danger.d500 : (isDarkMode ? semantic.fill.f02 : '#F8FAFC'),
                                                                    borderColor: isSelected ? semantic.alert.danger.d500 : border,
                                                                }
                                                            ]}
                                                            onPress={() => toggleOption(option.id, group.option_name)}
                                                            disabled={locked}
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

                            {/* Quantity stepper */}
                            <View style={[styles.qtyRow, locked && { opacity: 0.5 }]}>
                                <Typography style={[styles.quantityTitle, { color: text }]}>
                                    {locked ? "Linked Quantity" : "Quantity"}
                                </Typography>
                                <View style={[styles.stepper, { backgroundColor: soft }]}>
                                    <TouchableOpacity
                                        disabled={locked}
                                        style={[styles.stepBtn, { backgroundColor: isDarkMode ? semantic.fill.f04 : '#FFF' }, qty <= 1 && { opacity: 0.35 }]}
                                        onPress={() => setQty(qty - 1)}
                                        activeOpacity={0.7}
                                    >
                                        <Typography style={[styles.stepBtnText, { color: text }]}>−</Typography>
                                    </TouchableOpacity>
                                    <TextInput
                                        editable={!locked}
                                        style={[styles.stepInput, { color: text }]}
                                        value={qtyText}
                                        onChangeText={onTypeQty}
                                        onBlur={() => !qtyText && setQtyText('1')}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        selectTextOnFocus
                                        placeholder="0"
                                        placeholderTextColor="#94A3B8"
                                    />
                                    <TouchableOpacity
                                        disabled={locked}
                                        style={[styles.stepBtn, styles.stepBtnPlus, availableQty > 0 && qty >= availableQty && { opacity: 0.35 }]}
                                        onPress={() => setQty(qty + 1)}
                                        activeOpacity={0.7}
                                    >
                                        <Typography style={[styles.stepBtnText, { color: '#FFF' }]}>+</Typography>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {!locked && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                    style={styles.quickScroll}
                                    contentContainerStyle={styles.quickRow}
                                >
                                    {QUICK_PICKS.map((n) => {
                                        const disabled = availableQty > 0 && n > availableQty;
                                        return (
                                            <TouchableOpacity
                                                key={n}
                                                disabled={disabled}
                                                style={[
                                                    styles.quickChip,
                                                    { borderColor: border },
                                                    qty === n && styles.quickChipActive,
                                                    disabled && { opacity: 0.35 },
                                                ]}
                                                onPress={() => setQty(n)}
                                                activeOpacity={0.8}
                                            >
                                                <Typography style={[styles.quickChipText, { color: qty === n ? '#FFF' : (isDarkMode ? '#FFF' : '#334155') }]}>{n}</Typography>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            )}

                            {locked && (
                                <View style={{ marginTop: theme.spacing.sm, paddingHorizontal: 2 }}>
                                    <Typography style={{ color: semantic.alert.danger.d500, fontSize: theme.typography.xs, fontFamily: FONT.NORMAL }}>
                                        * This is a mandatory dependent item. To remove or change its quantity, please update its parent product.
                                    </Typography>
                                </View>
                            )}

                            {/* Summary */}
                            <View style={[styles.summary, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC', borderColor: isDarkMode ? semantic.fill.f04 : '#CBD5E1' }]}>
                                <View style={styles.summaryRow}>
                                    <Typography style={styles.summaryLabel}>Currently in cart</Typography>
                                    <Typography style={[styles.summaryVal, { color: text }]}>{inCartQty}</Typography>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Typography style={styles.summaryLabel}>Unit price</Typography>
                                    <Typography style={[styles.summaryVal, { color: text }]}>{currencyType} {product?.special || product?.price}</Typography>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Typography style={styles.summaryLabel}>New subtotal</Typography>
                                    <Typography style={[styles.summaryTotal, { color: text }]}>
                                        {currencyType} {(unitPrice * qty).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                </View>
                            </View>

                            {/* Actions: trash + full-width update */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    disabled={removeProductLoading || locked}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.btnRemove,
                                        { borderColor: locked ? '#CCC' : semantic.alert.danger.d500 },
                                    ]}
                                    onPress={removeProduct}
                                >
                                    {removeProductLoading ? (
                                        <ActivityIndicator color={semantic.alert.danger.d500} />
                                    ) : (
                                        <Icon icon={trash} customStyles={{ tintColor: locked ? '#CCC' : semantic.alert.danger.d500, width: theme.spacing.lg, height: theme.spacing.lg }} />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={addToCartLoading || locked || qty < 1}
                                    activeOpacity={0.85}
                                    style={[
                                        styles.btnPrimary,
                                        (locked || qty < 1) && { backgroundColor: '#CCC', shadowColor: '#CCC' },
                                    ]}
                                    onPress={updateCart}
                                >
                                    {addToCartLoading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Icon icon={white_shopping_cart} customStyles={{ tintColor: '#FFF', width: theme.spacing.md, height: theme.spacing.md }} />
                                            <Typography style={styles.btnPrimaryText}>
                                                {changed ? 'Update Cart' : 'Keep in Cart'} · {currencyType} {(unitPrice * qty).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </Typography>
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
        backgroundColor: 'rgba(15,23,42,0.55)',
    },
    avoidingView: {
        width: '100%',
    },
    modalContainer: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        width: '100%',
        maxHeight: SCREEN_HEIGHT - 80,
        elevation: 10,
    },
    indicator: {
        width: 44,
        height: 4,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
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
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginBottom: theme.spacing.md,
    },
    imageWrapper: {
        width: 136,
        minHeight: 168,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageBlob: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.6)',
        bottom: -60,
        right: -40,
    },
    productImage: {
        width: '85%',
        height: 120,
        resizeMode: 'contain',
    },
    expiryPill: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: 'rgba(15,23,42,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    expiryPillText: {
        color: '#FDE68A',
        fontSize: 10,
        fontFamily: FONT.BOLD,
    },
    inCartBadge: {
        position: 'absolute',
        top: 8,
        left: 0,
        backgroundColor: '#16A34A',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    inCartBadgeText: {
        color: '#FFF',
        fontSize: 9,
        letterSpacing: 0.6,
        fontFamily: FONT.BOLD,
    },
    infoCol: {
        flex: 1,
        marginLeft: theme.spacing.md,
        justifyContent: 'center',
        paddingRight: theme.spacing.lg,
        gap: theme.spacing.xs,
    },
    productName: {
        fontSize: theme.typography.md,
        fontFamily: FONT.BOLD,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: theme.spacing.xs,
        flexWrap: 'wrap',
    },
    totalPrice: {
        fontSize: theme.typography.lg,
        fontFamily: FONT.EXTRA_BOLD,
        color: semantic.alert.danger.d500,
    },
    oldPrice: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.NORMAL,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    cartonChip: {
        flexDirection: 'row',
        alignItems: 'stretch',
        alignSelf: 'flex-start',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    cartonNumWrap: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartonNum: {
        color: '#FDE68A',
        fontSize: 13,
        fontFamily: FONT.EXTRA_BOLD,
    },
    cartonLabelWrap: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: 'center',
    },
    cartonLabel: {
        fontSize: 10,
        fontFamily: FONT.BOLD,
        letterSpacing: 0.6,
    },
    stockTrack: {
        height: 5,
        borderRadius: 3,
        overflow: 'hidden',
    },
    stockFill: {
        height: '100%',
        borderRadius: 3,
    },
    stockText: {
        marginTop: 4,
        fontSize: 12,
        fontFamily: FONT.BOLD,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
    },
    quantityTitle: {
        fontSize: theme.typography.md,
        fontFamily: FONT.BOLD,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 4,
    },
    stepBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepBtnPlus: {
        backgroundColor: '#D50000',
    },
    stepBtnText: {
        fontSize: 20,
        fontFamily: FONT.BOLD,
    },
    stepInput: {
        minWidth: 110,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        fontFamily: FONT.EXTRA_BOLD,
        padding: 0,
    },
    quickScroll: {
        marginHorizontal: -theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    quickRow: {
        paddingHorizontal: theme.spacing.lg,
        gap: 8,
    },
    quickChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
    },
    quickChipActive: {
        backgroundColor: '#0F172A',
        borderColor: '#0F172A',
    },
    quickChipText: {
        fontSize: 12,
        fontFamily: FONT.BOLD,
    },
    summary: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3,
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: FONT.MEDIUM,
        color: '#64748B',
    },
    summaryVal: {
        fontSize: theme.typography.body,
        fontFamily: FONT.BOLD,
    },
    summaryTotal: {
        fontSize: theme.typography.lg,
        fontFamily: FONT.EXTRA_BOLD,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    btnRemove: {
        width: 54,
        height: 54,
        borderRadius: 16,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnPrimary: {
        flex: 1,
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#D50000',
        gap: theme.spacing.xs,
        shadowColor: '#D50000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    btnPrimaryText: {
        color: '#FFF',
        fontSize: theme.typography.body,
        fontFamily: FONT.EXTRA_BOLD,
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
