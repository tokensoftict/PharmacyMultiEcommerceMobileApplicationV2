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
    Easing,
    StyleSheet,
    Dimensions,
    Pressable,
    Keyboard,
    ScrollView,
    TextInput
} from 'react-native';
import { currencyType } from "@/shared/constants/global";
import { design, labels, palette, semantic } from "@/shared/constants/colors";
import CartService from "@/service/cart/CartService";
import Toasts from "@/shared/utils/Toast";
import { ProductListInterface } from "@/service/product/ProductListInterface";
import { Data } from "@/service/product/show/interface/ProductInformationInterface";
import { store } from "@/redux/store/store";
import * as action from "@/redux/actions";
import Typography from "@/shared/component/typography";

import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import Environment from "@/shared/utils/Environment";
import { close as iconClose, shoppingBag, white_shopping_cart, share_product } from "@/assets/icons";
import { shareProduct } from "@/shared/utils/ProductShareHelper";
import ProductService from "@/service/product/show/ProductService";
import Icon from "@/shared/component/icon";
import { FONT } from '@/shared/constants/fonts';
import useDarkMode from "@/shared/hooks/useDarkMode";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductList {
    visible: boolean;
    product: ProductListInterface | Data | undefined;
    onClose: (visible: boolean) => void;
}

const ProductDialog = ({ visible, product, onClose }: ProductList) => {
    const { isDarkMode } = useDarkMode();
    const insets = useSafeAreaInsets();
    const [qtyText, setQtyText] = useState('1');
    const qty = parseInt(qtyText, 10) || 0;
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);

    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const navigation = useNavigation<NavigationProps>();
    const cartService = new CartService();

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // `rendered` keeps the Modal mounted while the exit animation plays.
    const [rendered, setRendered] = useState(false);

    // 1) Mount the modal (and reset form state) when asked to show.
    useEffect(() => {
        if (visible) {
            setSelectedOptions([]);
            setQtyText('1');
            setRendered(true);
        }
    }, [visible]);

    // 2) Animate only AFTER the modal is mounted so the first frame is never dropped.
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

    const handleClose = useCallback(() => {
        Keyboard.dismiss();
        onClose(false);
    }, [onClose]);

    const navigateTo = () => {
        // @ts-ignore
        navigation.navigate('checkout');
    };

    const handleBuyNow = (acceptDependent: boolean = false) => {
        setBuyNowLoading(true);
        cartService.add(product?.id, qty, acceptDependent, selectedOptions).then((response) => {
            setBuyNowLoading(false);
            if (response.data.status === true) {
                handleClose();
                setTimeout(navigateTo, 300);
            }
        });
    };

    const buyNow = () => {
        if (qty < 1) { Toasts("Please enter a quantity"); return; }
        if (!validateOptions()) return;
        const maxVal = parseInt(product?.max?.toString() || "0", 10);
        const qtyVal = parseInt(product?.quantity?.toString() || "0", 10);
        const available = maxVal > 0 ? Math.min(maxVal, qtyVal) : qtyVal;
        if (available >= qty) {
            handleBuyNow(true);
        } else {
            Toasts("Insufficient quantity. Available: " + available);
        }
    };

    const handleAddToCart = (acceptDependent: boolean = false) => {
        if (!validateOptions()) return;
        setAddToCartLoading(true);
        cartService.add(product?.id, qty, acceptDependent, selectedOptions).then((response) => {
            if (response.data.status === true) {
                Toasts('Item added to cart!');
                store.dispatch(action.notifyCartUpdated());
                handleClose();
            }
            setAddToCartLoading(false);
        });
    };

    const addToCart = () => {
        if (qty < 1) { Toasts("Please enter a quantity"); return; }
        if (!validateOptions()) return;
        const maxVal = parseInt(product?.max?.toString() || "0", 10);
        const qtyVal = parseInt(product?.quantity?.toString() || "0", 10);
        const available = maxVal > 0 ? Math.min(maxVal, qtyVal) : qtyVal;
        if (available >= qty) {
            handleAddToCart(true);
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

    const handleShare = async () => {
        if (!product || sharing) return;
        const department = Environment.isWholeSalesEnvironment() ? 'wholesales' : 'retail';
        let seo: string | undefined = (product as any)?.seo;
        try {
            setSharing(true);
            // List items don't carry the SEO share link, so fetch it once when missing.
            if (!seo && product.id !== undefined) {
                const res = await new ProductService().getProduct(product.id as number, department as any);
                seo = res?.data?.data?.seo;
            }
        } catch (e) {
            // fall through to id-based link
        } finally {
            setSharing(false);
        }
        shareProduct({
            name: String(product.name ?? ''),
            seo,
            slug: String(product.id ?? ''),
            department,
            price: (product.special || product.price) as any,
        });
    };

    if (!rendered) return null;

    // Cart Dialog styling updates: 
    // We wrap container in a safe area inset spacer at the top (topContainerOffset) to prevent overlapping statusbar when fully scrolled/stretched.
    const topContainerOffset = Math.max(insets.top, theme.spacing.lg);

    const maxVal = parseInt(product?.max?.toString() || "0", 10);
    const stockVal = parseInt(product?.quantity?.toString() || "0", 10);
    const availableQty = maxVal > 0 ? Math.min(maxVal, stockVal) : stockVal;
    const unitPrice = parseFloat(String(product?.special || product?.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const quickPicks = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const clampQty = (n: number) => {
        const lower = Math.max(1, n);
        return availableQty > 0 ? Math.min(availableQty, lower) : lower;
    };
    const setQty = (n: number) => setQtyText(String(clampQty(n)));
    const onTypeQty = (t: string) => {
        const digits = t.replace(/\D/g, '').replace(/^0+/, '');
        if (!digits) return setQtyText('');
        setQtyText(String(availableQty > 0 ? Math.min(availableQty, parseInt(digits, 10)) : parseInt(digits, 10)));
    };
    const stockPct = availableQty > 0 ? Math.min(1, availableQty / 5000) : 0;
    const lowStock = availableQty < 60;
    const stockColor = lowStock ? '#F59E0B' : '#16A34A';
    const showCarton = product?.carton !== undefined && product.carton > 1 && !Environment.isSuperMarketEnvironment();

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
                                marginTop: topContainerOffset, // Adds top offset to prevent overlapping status bar
                            }
                        ]}
                    >
                        <View style={styles.indicator} />

                        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                            <Icon icon={iconClose} customStyles={{ tintColor: isDarkMode ? '#FFF' : '#333', width: theme.spacing.xl, height: theme.spacing.xl }} />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                            <View style={{ flexDirection: 'row', alignItems: 'stretch', marginBottom: theme.spacing.md }}>
                            <View style={[styles.imageWrapper, { width: 136, height: undefined, minHeight: 160, marginBottom: 0, backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFF1F0' }]}>
                                <View style={styles.imageBlob} />
                                <Image source={{ uri: product?.image }} style={[styles.productImage, { width: '85%', height: 130 }]} />
                                <TouchableOpacity
                                    onPress={handleShare}
                                    disabled={sharing}
                                    activeOpacity={0.8}
                                    accessibilityLabel="Share Product"
                                    accessibilityRole="button"
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    style={styles.shareBtn}
                                >
                                    {sharing ? (
                                        <ActivityIndicator size="small" color={semantic.alert.danger.d500} />
                                    ) : (
                                        <Icon icon={share_product} tintColor={semantic.alert.danger.d500} customStyles={{ tintColor: semantic.alert.danger.d500, width: 16, height: 16 }} />
                                    )}
                                </TouchableOpacity>
                                {product?.expiry_date && (
                                    <View style={[styles.expiryPill, { left: 6, bottom: 6 }]}>
                                        <Typography style={styles.expiryPillText}>⏳ Exp. {product.expiry_date}</Typography>
                                    </View>
                                )}
                            </View>

                            <View style={{ flex: 1, marginLeft: theme.spacing.md, justifyContent: 'center', paddingRight: theme.spacing.lg }}>
                                <Typography numberOfLines={3} style={[styles.productName, { fontSize: theme.typography.md, color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>
                                    {product?.name}
                                </Typography>

                                <View style={styles.priceRow}>
                                    {product?.special ? (
                                        <>
                                            <Typography style={[styles.totalPrice, { fontSize: theme.typography.lg }]}>
                                                {currencyType} {product.special}
                                            </Typography>
                                            <Typography style={styles.oldPrice}>
                                                {currencyType} {product.price}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography style={[styles.totalPrice, { fontSize: theme.typography.lg }]}>
                                            {currencyType} {product?.price}
                                        </Typography>
                                    )}
                                </View>

                                {showCarton && (
                                    <View style={styles.cartonChip}>
                                        <View style={styles.cartonNumWrap}>
                                            <Typography style={styles.cartonNum}>{product?.carton}</Typography>
                                        </View>
                                        <View style={[styles.cartonLabelWrap, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFF7ED' }]}>
                                            <Typography style={[styles.cartonLabel, { color: isDarkMode ? '#FFF' : '#C2410C' }]}>📦 IN CARTON</Typography>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.stockWrap}>
                                    <View style={[styles.stockTrack, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#E2E8F0' }]}>
                                        <View style={[styles.stockFill, { width: `${Math.round(stockPct * 100)}%`, backgroundColor: stockColor }]} />
                                    </View>
                                    <Typography style={[styles.stockText, { color: stockColor }]}>
                                        {lowStock ? `Only ${product?.quantity} left` : `${product?.quantity} In Stock`}
                                    </Typography>
                                </View>
                            </View>
                            </View>

                            <View style={styles.mainInfo}>
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

                            <View style={styles.qtyRow}>
                                <Typography style={[styles.quantityTitle, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>Quantity</Typography>
                                <View style={[styles.stepper, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F1F5F9' }]}>
                                    <TouchableOpacity
                                        style={[styles.stepBtn, { backgroundColor: isDarkMode ? semantic.fill.f04 : '#FFF' }, qty <= 1 && { opacity: 0.35 }]}
                                        onPress={() => setQty(qty - 1)}
                                        activeOpacity={0.7}
                                    >
                                        <Typography style={[styles.stepBtnText, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>−</Typography>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[styles.stepInput, { color: isDarkMode ? '#FFF' : '#0F172A' }]}
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
                                        style={[styles.stepBtn, styles.stepBtnPlus, availableQty > 0 && qty >= availableQty && { opacity: 0.35 }]}
                                        onPress={() => setQty(qty + 1)}
                                        activeOpacity={0.7}
                                    >
                                        <Typography style={[styles.stepBtnText, { color: '#FFF' }]}>+</Typography>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.quickScroll}
                                contentContainerStyle={styles.quickRow}
                            >
                                {quickPicks.map((n) => {
                                    const disabled = availableQty > 0 && n > availableQty;
                                    return (
                                        <TouchableOpacity
                                            key={n}
                                            disabled={disabled}
                                            style={[
                                                styles.quickChip,
                                                { borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0' },
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

                            <View style={[styles.summary, { backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC', borderColor: isDarkMode ? semantic.fill.f04 : '#CBD5E1' }]}>
                                <View style={styles.summaryRow}>
                                    <Typography style={styles.summaryLabel}>Unit price</Typography>
                                    <Typography style={[styles.summaryVal, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{currencyType} {product?.special || product?.price}</Typography>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Typography style={styles.summaryLabel}>Subtotal</Typography>
                                    <Typography style={[styles.summaryTotal, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>
                                        {currencyType} {(unitPrice * qty).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                </View>
                            </View>

                            <TouchableOpacity
                                disabled={addToCartLoading || qty < 1}
                                activeOpacity={0.85}
                                style={[
                                    styles.btnPrimary,
                                    {
                                        width: '100%',
                                        flex: 0,
                                        borderRadius: 16,
                                        paddingVertical: 15,
                                        shadowColor: '#D50000',
                                        shadowOffset: { width: 0, height: 6 },
                                        shadowOpacity: 0.35,
                                        shadowRadius: 10,
                                        elevation: 6,
                                    },
                                    qty < 1 && { opacity: 0.5 },
                                ]}
                                onPress={addToCart}
                            >
                                {addToCartLoading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <>
                                        <Icon icon={white_shopping_cart} customStyles={{ tintColor: '#FFF', width: theme.spacing.md, height: theme.spacing.md }} />
                                        <Typography style={[styles.btnPrimaryText, { fontFamily: FONT.EXTRA_BOLD }]}>
                                            Add to Cart · {currencyType} {(unitPrice * qty).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Typography>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
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
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        width: '100%',
        maxHeight: SCREEN_HEIGHT - 80, // Prevent modal stretching to top edge
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
        height: 190,
        backgroundColor: '#FFF1F0',
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    shareBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.92)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    imageBlob: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(255,255,255,0.6)',
        bottom: -80,
        right: -50,
    },
    expiryPill: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(15,23,42,0.8)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    expiryPillText: {
        color: '#FDE68A',
        fontSize: 11,
        fontFamily: FONT.BOLD,
    },
    cartonChip: {
        flexDirection: 'row',
        alignItems: 'stretch',
        alignSelf: 'flex-start',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
        marginBottom: theme.spacing.sm,
    },
    cartonNumWrap: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartonNum: {
        color: '#FDE68A',
        fontSize: 14,
        fontFamily: FONT.EXTRA_BOLD,
    },
    cartonLabelWrap: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
    },
    cartonLabel: {
        fontSize: 11,
        fontFamily: FONT.BOLD,
        letterSpacing: 0.6,
    },
    stockWrap: {
        marginTop: 2,
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
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    btnOutline: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1.5,
        minHeight: theme.MIN_TOUCH_TARGET,
        gap: theme.spacing.xs,
    },
    btnOutlineText: {
        color: semantic.alert.danger.d500,
        fontFamily: FONT.BOLD,
        fontSize: theme.typography.body,
    },
    btnPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: semantic.alert.danger.d500,
        minHeight: theme.MIN_TOUCH_TARGET,
        gap: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    btnPrimaryText: {
        color: '#FFF',
        fontSize: theme.typography.body,
        fontFamily: FONT.BOLD,
    },
    bundleInfo: {
        marginTop: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    bundleTitle: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
        color: '#2563EB',
        marginBottom: 2,
    },
    bundleItem: {
        fontSize: theme.typography.xs,
        fontFamily: FONT.MEDIUM,
        color: '#1E40AF',
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

export default ProductDialog;
