import {
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator, Alert
} from "react-native";
import { normalize } from "@/shared/helpers";
import { close, shoppingBag } from "@/assets/icons";
import React, { useCallback, useState } from "react";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";
import Typography from "@/shared/component/typography";
import { currencyType } from "@/shared/constants/global.ts";
import { useFocusEffect } from "@react-navigation/native";
import Toasts from "@/shared/utils/Toast.tsx";
import { CartInterface } from "@/service/cart/interface/CartInterface.tsx";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import OverlayLoader from "@/shared/component/overlayLoader";
import CheckBox from "@/shared/component/checkbox";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import Icon from "@/shared/component/icon";
import ErrorText from "@/shared/component/ErrorText";
import Environment from "@/shared/utils/Environment.tsx";
import SubHeader from "@/shared/component/subHeader";
import { useGlobal } from "@/shared/helpers/GlobalContext.tsx";
import CartService from "@/service/cart/CartService.tsx";
import CartItemHorizontalList from "@/shared/component/cartItemHorizontalList";
import UpdateCartDialog from "@/shared/component/updateCartDialog";

export default function ConfirmCheckout({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { isDarkMode } = useDarkMode();
    const checkOutService = new CheckoutService();
    const cartService = new CartService();

    // Coupon State
    const [couponDialog, setCouponDialog] = useState(false);
    const [couponValue, setCouponValue] = useState("");
    const [errorCouponValue, setErrorCouponValue] = useState("");
    const [applyCouponLoading, setApplyCouponLoading] = useState(false);
    const [removeCouponLoading, setRemoveCouponLoading] = useState(false);
    const [hasCoupon, setHasCoupon] = useState<any>(undefined);

    // Cart Review State
    const [cartReviewDialog, setCartReviewDialog] = useState(false);
    const [cartItemList, setCartItemList] = useState<CartInterface>();
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [openUpdateCartModal, setOpenUpdateCartModal] = useState(false);
    const [cartItemSelected, setCartItemSelected] = useState<any>();

    const { checkoutButton, setCheckoutButton } = useGlobal();
    const [confirmOrderDetails, setConfirmOrderDetails] = useState<any>({
        'totalToPay': 0,
        'totalToPayFormatted': 0.0,
        'paymentAnalysis': []
    });

    useFocusEffect(
        useCallback(() => {
            loadConfirmOrder();
        }, [])
    );

    function loadConfirmOrder() {
        setIsLoading(true);
        setCheckoutButton(false);
        checkOutService.getConfirmOrder().then((response: any) => {
            if (response.data.status) {
                setConfirmOrderDetails(response.data.data);
                setCheckoutButton(true);
                response.data.data.paymentAnalysis.forEach((item: any) => {
                    if (item?.hasCoupon === true) {
                        setHasCoupon(item);
                    }
                })
            }
            setIsLoading(false);
        });
    }

    function loadCartItems() {
        setIsCartLoading(true);
        cartService.get().then((response: any) => {
            setIsCartLoading(false);
            if (response.data.status === true) {
                setCartItemList(response.data);
            }
        }, (error) => {
            setIsCartLoading(false);
        });
    }

    const onEditItem = (item: any) => {
        setCartItemSelected(item);
        setCartReviewDialog(false);
        setTimeout(() => {
            setOpenUpdateCartModal(true);
        }, 400);
    };

    const onCartUpdated = () => {
        loadCartItems();
        loadConfirmOrder();
    };

    function toggleExtraTotal(analysis: any) {
        checkOutService.removeOrAddOrderTotal(analysis.id).then((response: any) => {
            loadConfirmOrder();
        })
    }

    function applyCoupon() {
        setErrorCouponValue("");
        if (couponValue === "") {
            setErrorCouponValue("Please enter your coupon code.")
        } else {
            setApplyCouponLoading(true);
            checkOutService.applyCouponCode(couponValue).then((response: any) => {
                setApplyCouponLoading(false);
                if (response.data.status === true) {
                    loadConfirmOrder();
                    setCouponDialog(false);
                    Toasts("Coupon / Voucher Code has been applied successfully.");
                } else {
                    setErrorCouponValue(response.data.error);
                }
            })
        }
    }

    function removeCoupon() {
        // @ts-ignore
        Alert.alert('PS GDC', 'Are you sure you to remove this ' + hasCoupon.discount_type + ' ?', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            {
                text: 'Yes', onPress: () => {
                    setRemoveCouponLoading(true);
                    checkOutService.removeCouponOrVoucher().then((response: any) => {
                        setRemoveCouponLoading(false);
                        setHasCoupon(undefined);
                        if (response.data.status === true) {
                            setCouponDialog(false);
                            loadConfirmOrder();
                        }
                    })
                }
            }
        ])
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
        },
        card: {
            backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
            borderRadius: normalize(20),
            padding: normalize(20),
            marginBottom: normalize(20),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDarkMode ? 0.3 : 0.05,
            shadowRadius: 10,
            elevation: 3,
        },
        sectionTitle: {
            fontSize: normalize(16),
            fontFamily: FONT.BOLD,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
            marginBottom: normalize(16),
        },
        analysisRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(12),
        },
        analysisLabelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        analysisLabel: {
            fontSize: normalize(14),
            fontFamily: FONT.MEDIUM,
            color: '#64748B',
            marginLeft: normalize(8),
        },
        analysisAmount: {
            fontSize: normalize(14),
            fontFamily: FONT.BOLD,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
        },
        totalCard: {
            backgroundColor: semantic.alert.danger.d500,
            borderRadius: normalize(20),
            padding: normalize(24),
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: semantic.alert.danger.d500,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
        totalLabel: {
            fontSize: normalize(14),
            fontFamily: FONT.BOLD,
            color: 'rgba(255, 255, 255, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: normalize(4),
        },
        totalValue: {
            fontSize: normalize(32),
            fontFamily: FONT.BOLD,
            color: '#FFFFFF',
        },
        couponLink: {
            alignSelf: 'center',
            marginTop: normalize(16),
        },
        couponLinkText: {
            fontSize: normalize(14),
            fontFamily: FONT.BOLD,
            color: semantic.alert.danger.d500,
            textDecorationLine: 'underline',
        },
        dialogContent: {
            padding: normalize(24),
            paddingTop: normalize(16),
        },
        dialogHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(24),
        },
        dialogTitle: {
            fontSize: normalize(18),
            fontFamily: FONT.BOLD,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
        },
        inputContainer: {
            flexDirection: 'row',
            backgroundColor: isDarkMode ? semantic.fill.f03 : '#F1F5F9',
            borderRadius: normalize(16),
            padding: normalize(4),
            alignItems: 'center',
        },
        input: {
            flex: 1,
            height: normalize(50),
            paddingHorizontal: normalize(16),
            fontSize: normalize(15),
            fontFamily: FONT.MEDIUM,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
        },
        applyBtn: {
            backgroundColor: semantic.alert.danger.d500,
            paddingHorizontal: normalize(20),
            height: normalize(44),
            borderRadius: normalize(12),
            justifyContent: 'center',
            alignItems: 'center',
        },
        applyBtnText: {
            color: '#FFF',
            fontSize: normalize(14),
            fontFamily: FONT.BOLD,
        },
        couponInfoCard: {
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4',
            borderRadius: normalize(16),
            padding: normalize(16),
            borderWidth: 1,
            borderColor: '#BBF7D0',
            marginBottom: normalize(24),
        },
        couponInfoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: normalize(8),
        },
        couponInfoLabel: {
            fontSize: normalize(14),
            fontFamily: FONT.MEDIUM,
            color: '#166534',
        },
        couponInfoValue: {
            fontSize: normalize(14),
            fontFamily: FONT.BOLD,
            color: '#166534',
        },
        removeBtn: {
            backgroundColor: '#FEE2E2',
            paddingVertical: normalize(14),
            borderRadius: normalize(16),
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FECACA',
        },
        removeBtnText: {
            color: '#DC2626',
            fontSize: normalize(15),
            fontFamily: FONT.BOLD,
        },
        reviewCard: {
            backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
            borderRadius: normalize(20),
            padding: normalize(16),
            marginBottom: normalize(20),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0',
        },
        reviewInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        reviewBtn: {
            backgroundColor: isDarkMode ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
            paddingHorizontal: normalize(16),
            paddingVertical: normalize(8),
            borderRadius: normalize(100),
        },
        reviewBtnText: {
            color: semantic.alert.danger.d500,
            fontSize: normalize(13),
            fontFamily: FONT.BOLD,
        },
        cartSheetContent: {
            flex: 1,
            paddingTop: normalize(16),
        },
        cartListScroll: {
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(40),
        }
    });

    return (
        <View style={{ flex: 1 }}>
            <SubHeader icon={shoppingBag} title="Order Summary" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: normalize(20), paddingBottom: normalize(120) }}>
                {/* Review Items Card */}
                {!isLoading && (
                    <TouchableOpacity
                        style={styles.reviewCard}
                        onPress={() => {
                            setCartReviewDialog(true);
                            loadCartItems();
                        }}
                    >
                        <View style={styles.reviewInfo}>
                            <Icon icon={shoppingBag} height={normalize(22)} tintColor={semantic.alert.danger.d500} />
                            <Typography style={[styles.sectionTitle, { marginBottom: 0, marginLeft: normalize(12) }]}>Review Order Items</Typography>
                        </View>
                        <View style={styles.reviewBtn}>
                            <Typography style={styles.reviewBtnText}>Edit</Typography>
                        </View>
                    </TouchableOpacity>
                )}

                <View style={styles.card}>
                    <Typography style={styles.sectionTitle}>Payment Details</Typography>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={semantic.alert.danger.d500} style={{ marginVertical: normalize(20) }} />
                    ) : (
                        confirmOrderDetails.paymentAnalysis.map((item: any) => (
                            <View key={item.name} style={styles.analysisRow}>
                                <View style={styles.analysisLabelContainer}>
                                    {item?.id && <CheckBox onChange={() => toggleExtraTotal(item)} value={item.autoCheck} />}
                                    <Typography style={[styles.analysisLabel, !item?.id && { marginLeft: 0 }]}>{item.name}</Typography>
                                </View>
                                <Typography style={styles.analysisAmount}>
                                    {currencyType} {item.amount_formatted}
                                </Typography>
                            </View>
                        ))
                    )}
                </View>

                {!isLoading && (
                    <>
                        <View style={styles.totalCard}>
                            <Typography style={styles.totalLabel}>Total to Pay</Typography>
                            <Typography style={styles.totalValue}>
                                {currencyType} {confirmOrderDetails.totalToPayFormatted}
                            </Typography>
                        </View>

                        <TouchableOpacity style={styles.couponLink} onPress={() => setCouponDialog(true)}>
                            <Typography style={styles.couponLinkText}>
                                {hasCoupon !== undefined ? `Remove ${hasCoupon.discount_type}` : "Have a Coupon or Voucher?"}
                            </Typography>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            <ButtonSheet dispatch={couponDialog} height={normalize(320)}>
                <View style={styles.dialogContent}>
                    <View style={styles.dialogHeader}>
                        <Typography style={styles.dialogTitle}>
                            {hasCoupon !== undefined ? `Active ${hasCoupon.discount_type}` : "Enter Coupon or Voucher"}
                        </Typography>
                        <TouchableOpacity onPress={() => setCouponDialog(false)}>
                            <Icon icon={close} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    {hasCoupon !== undefined ? (
                        <View>
                            <View style={styles.couponInfoCard}>
                                <View style={styles.couponInfoRow}>
                                    <Typography style={styles.couponInfoLabel}>Code</Typography>
                                    <Typography style={styles.couponInfoValue}>{hasCoupon.name}</Typography>
                                </View>
                                <View style={styles.couponInfoRow}>
                                    <Typography style={styles.couponInfoLabel}>Discount</Typography>
                                    <Typography style={styles.couponInfoValue}>{hasCoupon.amount_formatted}</Typography>
                                </View>
                                <View style={styles.couponInfoRow}>
                                    <Typography style={styles.couponInfoLabel}>Type</Typography>
                                    <Typography style={styles.couponInfoValue}>{hasCoupon.type}</Typography>
                                </View>
                            </View>
                            <TouchableOpacity disabled={removeCouponLoading} style={styles.removeBtn} onPress={removeCoupon}>
                                {removeCouponLoading ? (
                                    <ActivityIndicator color="#DC2626" />
                                ) : (
                                    <Typography style={styles.removeBtnText}>Remove {hasCoupon.discount_type}</Typography>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Code"
                                    placeholderTextColor="#94A3B8"
                                    value={couponValue}
                                    onChangeText={setCouponValue}
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity onPress={applyCoupon} disabled={applyCouponLoading} style={styles.applyBtn}>
                                    {applyCouponLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Typography style={styles.applyBtnText}>Apply</Typography>
                                    )}
                                </TouchableOpacity>
                            </View>
                            {errorCouponValue !== "" && (
                                <ErrorText style={{ marginTop: normalize(12) }}>{errorCouponValue}</ErrorText>
                            )}
                        </View>
                    )}
                </View>
            </ButtonSheet>
            <ButtonSheet dispatch={cartReviewDialog} height={normalize(500)}>
                <View style={styles.cartSheetContent}>
                    <View style={[styles.dialogHeader, { paddingHorizontal: normalize(24) }]}>
                        <Typography style={styles.dialogTitle}>Items in your Cart</Typography>
                        <TouchableOpacity onPress={() => setCartReviewDialog(false)}>
                            <Icon icon={close} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    {isCartLoading ? (
                        <ActivityIndicator size="large" color={semantic.alert.danger.d500} style={{ marginTop: normalize(40) }} />
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.cartListScroll}
                        >
                            {(cartItemList?.data.items ?? []).map((item, index) => (
                                <CartItemHorizontalList
                                    key={index}
                                    product={item}
                                    onPress={onEditItem}
                                />
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ButtonSheet>

            <UpdateCartDialog
                onCartUpdated={onCartUpdated}
                product={cartItemSelected}
                visible={openUpdateCartModal}
                onClose={(status: boolean) => setOpenUpdateCartModal(status)}
            />
        </View>
    );
}
